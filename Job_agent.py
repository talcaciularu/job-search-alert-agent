#!/usr/bin/env python3
"""
Job Search Agent
=================
Scans a list of job-board / careers-page URLs, filters relevant listings by
keyword, and sends a Telegram alert only for jobs that haven't been sent
before.

Run:
    python job_agent.py

Meant to run twice a day via cron / Task Scheduler (see README.md).
"""

import json
import hashlib
import re
import time
import sys
from pathlib import Path
from datetime import datetime

import yaml
import requests
from bs4 import BeautifulSoup

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "config.yaml"
SEEN_JOBS_PATH = BASE_DIR / "seen_jobs.json"
LOG_PATH = BASE_DIR / "agent.log"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}
REQUEST_TIMEOUT = 15
DELAY_BETWEEN_SITES_SEC = 2


def log(msg: str):
    line = f"[{datetime.now().isoformat(timespec='seconds')}] {msg}"
    print(line)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        log("ERROR: config.yaml not found. Copy config.example.yaml to config.yaml and fill it in.")
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_seen_jobs() -> dict:
    if SEEN_JOBS_PATH.exists():
        with open(SEEN_JOBS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_seen_jobs(seen: dict):
    with open(SEEN_JOBS_PATH, "w", encoding="utf-8") as f:
        json.dump(seen, f, ensure_ascii=False, indent=2)


def job_id(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


EXPERIENCE_PATTERNS = [
    # "5+ years of experience", "3-5 years experience", "5 yrs exp"
    re.compile(r'(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2})?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp\.?)\b', re.IGNORECASE),
    # "experience of 5+ years", "experience: 5 years"
    re.compile(r'(?:experience|exp\.?)\s*(?:of\s+)?[:\-]?\s*(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2})?\s*(?:years?|yrs?)', re.IGNORECASE),
    # "5 שנות ניסיון", "5 שנים ניסיון"
    re.compile(r'(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2})?\s*שנ(?:ה|ות|ים)?\s*(?:נסיון|ניסיון)?'),
    # "ניסיון של 5 שנים", "נדרש ניסיון 5+"
    re.compile(r'(?:נסיון|ניסיון)\s*(?:של)?\s*[:\-]?\s*(\d{1,2})\s*\+?'),
]


def detect_experience_years(text: str):
    """
    Heuristically scans `text` for phrases like "5+ years of experience" or
    "ניסיון של 5 שנים" and returns the smallest such number found, or None
    if nothing matched. This is pattern-based, not perfect - phrasing that
    doesn't match one of the known patterns will be missed.
    """
    years_found = []
    for pattern in EXPERIENCE_PATTERNS:
        for m in pattern.finditer(text):
            try:
                years_found.append(int(m.group(1)))
            except (IndexError, ValueError):
                continue
    if not years_found:
        return None
    return min(years_found)


def matches_keywords(text: str, keywords: list, exclude_keywords: list) -> bool:
    text_low = text.lower()
    if any(ex.lower() in text_low for ex in exclude_keywords if ex):
        return False
    return any(kw.lower() in text_low for kw in keywords)


def detect_location(context_text: str, location_cfg: dict) -> tuple:
    """
    Looks for location hints inside `context_text` (usually the text of the
    HTML area surrounding a job link/card).

    Returns (category, label):
      - ("israel", "Tel Aviv")   -> a known Israeli-location keyword matched
      - ("foreign", "Cyprus")    -> a known non-Israel keyword matched
      - ("unknown", None)        -> no location keyword found either way
    """
    text_low = context_text.lower()

    for kw in location_cfg.get("exclude_keywords", []):
        if kw.lower() in text_low:
            return ("foreign", kw)

    for kw in location_cfg.get("israel_keywords", []):
        if kw.lower() in text_low:
            return ("israel", kw)

    return ("unknown", None)


def get_context_text(tag, max_levels: int = 3, max_chars: int = 300) -> str:
    """
    Walks up a few parent levels from `tag` and returns their combined text.
    Used to find location text that sits near a job link/title but isn't
    part of the link text itself (e.g. a sibling <span>Tel Aviv</span>).
    """
    node = tag
    for _ in range(max_levels):
        if node.parent is None:
            break
        node = node.parent
    text = node.get_text(separator=" ", strip=True)
    return text[:max_chars]


def fetch(url: str) -> str | None:
    try:
        # Separate (connect_timeout, read_timeout) so a hang mid-download
        # (not just at connection time) also gets cut off in reasonable time.
        resp = requests.get(
            url, headers=HEADERS, timeout=(10, REQUEST_TIMEOUT)
        )
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        # Intentionally broad: catches requests.RequestException as well as
        # low-level socket/ssl errors (like TimeoutError) that aren't always
        # wrapped properly.
        log(f"  Error fetching {url}: {e}")
        return None


def get_experience_for_job(url: str, exp_cfg: dict):
    """
    Fetches the individual job page and looks for an experience-years
    requirement. Experience requirements are almost always written inside
    the full job description, not in a search-results snippet, so this
    does a dedicated fetch per candidate job (only called for jobs that
    already passed the keyword/location filters, to keep request volume low).
    """
    if not exp_cfg.get("fetch_full_page", True):
        return None
    html = fetch(url)
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    return detect_experience_years(text)


def scrape_generic(site: dict, keywords: list, exclude_keywords: list, location_cfg: dict, exp_cfg: dict) -> list:
    """
    Generic scraper: pulls every <a> link on the page and checks whether
    the link text matches one of the keywords.
    Good for single-company careers pages.
    """
    html = fetch(site["url"])
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    results = []
    seen_urls_this_page = set()

    for a in soup.find_all("a", href=True):
        text = a.get_text(separator=" ", strip=True)
        if not text or len(text) < 3:
            continue
        if not matches_keywords(text, keywords, exclude_keywords):
            continue

        href = a["href"]
        if href.startswith("/"):
            # Build a full URL from a relative href
            from urllib.parse import urljoin
            href = urljoin(site["url"], href)
        if not href.startswith("http"):
            continue
        if href in seen_urls_this_page:
            continue
        seen_urls_this_page.add(href)

        if location_cfg.get("enabled", False):
            context = get_context_text(a)
            category, label = detect_location(context, location_cfg)
            if category == "foreign":
                continue  # skip non-Israel jobs entirely
            if category == "unknown" and not location_cfg.get("include_unknown", True):
                continue
            location = label if category == "israel" else "לא צוין"
        else:
            location = None

        experience_years = None
        experience_warning = False
        if exp_cfg.get("enabled", False):
            experience_years = get_experience_for_job(href, exp_cfg)
            if experience_years is not None:
                experience_warning = experience_years > exp_cfg.get("warn_above_years", 4)

        results.append({
            "title": text[:200],
            "url": href,
            "source": site["name"],
            "contact": site.get("contact"),
            "location": location,
            "experience_years": experience_years,
            "experience_warning": experience_warning,
        })

    return results


def scrape_css(site: dict, keywords: list, exclude_keywords: list, location_cfg: dict, exp_cfg: dict) -> list:
    """
    Selector-based scraper - for large job boards with a fixed HTML
    structure (AllJobs, Drushim, etc.).
    """
    html = fetch(site["url"])
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    sel = site.get("selectors", {})
    containers = soup.select(sel.get("job_container", ""))

    results = []
    for c in containers:
        title_el = c.select_one(sel.get("title", ""))
        link_el = c.select_one(sel.get("link", "a"))
        if not title_el or not link_el:
            continue

        title = title_el.get_text(strip=True)
        href = link_el.get(sel.get("link_attr", "href"), "")
        if not href:
            continue
        if href.startswith("/"):
            href = sel.get("base_url", "").rstrip("/") + href

        if not matches_keywords(title, keywords, exclude_keywords):
            continue

        if location_cfg.get("enabled", False):
            # If the config named a specific location selector, prefer it;
            # otherwise fall back to the whole card's text.
            loc_el = c.select_one(sel.get("location", "")) if sel.get("location") else None
            context = loc_el.get_text(strip=True) if loc_el else c.get_text(separator=" ", strip=True)
            category, label = detect_location(context, location_cfg)
            if category == "foreign":
                continue
            if category == "unknown" and not location_cfg.get("include_unknown", True):
                continue
            location = label if category == "israel" else "לא צוין"
        else:
            location = None

        experience_years = None
        experience_warning = False
        if exp_cfg.get("enabled", False):
            experience_years = get_experience_for_job(href, exp_cfg)
            if experience_years is not None:
                experience_warning = experience_years > exp_cfg.get("warn_above_years", 4)

        results.append({
            "title": title,
            "url": href,
            "source": site["name"],
            "contact": site.get("contact"),
            "location": location,
            "experience_years": experience_years,
            "experience_warning": experience_warning,
        })

    return results


def send_telegram_message(bot_token: str, chat_id: str, text: str) -> bool:
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
    }
    try:
        resp = requests.post(url, data=payload, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return True
    except requests.RequestException as e:
        log(f"Error sending Telegram message: {e}")
        return False


def format_job_message(job: dict) -> str:
    lines = []

    # Experience warning goes first - it's what she wants to see immediately.
    exp = job.get("experience_years")
    if exp is not None:
        if job.get("experience_warning"):
            lines.append(f"⚠️ דורש {exp}+ שנות ניסיון (מעל למה שהגדרת)")
        else:
            lines.append(f"🧑‍💻 ניסיון נדרש: {exp}+ שנים")

    lines.append(f"💼 <b>{job['title']}</b>")
    lines.append(f"📍 מקור: {job['source']}")
    if job.get("contact"):
        lines.append(f"👤 איש קשר: {job['contact']}")
    if job.get("location"):
        lines.append(f"🏙️ מיקום: {job['location']}")
    lines.append(f"🔗 {job['url']}")
    return "\n".join(lines)


def main():
    config = load_config()
    tg = config["telegram"]
    keywords = config.get("keywords", [])
    exclude_keywords = config.get("exclude_keywords", [])
    sites = config.get("sites", [])
    location_cfg = config.get("location_filter", {"enabled": False})
    exp_cfg = config.get("experience_filter", {"enabled": False})

    if not keywords:
        log("WARNING: no keywords defined in config.yaml")

    seen = load_seen_jobs()
    all_new_jobs = []

    log(f"Starting scan of {len(sites)} sites...")

    for site in sites:
        log(f"Scanning: {site['name']}")
        site_type = site.get("type", "generic")

        try:
            if site_type == "generic":
                jobs = scrape_generic(site, keywords, exclude_keywords, location_cfg, exp_cfg)
            elif site_type == "css":
                jobs = scrape_css(site, keywords, exclude_keywords, location_cfg, exp_cfg)
            else:
                log(f"  Unknown type: {site_type}, skipping")
                jobs = []
        except Exception as e:
            # One problematic site shouldn't stop scanning the rest,
            # and definitely shouldn't block sending what was already found.
            log(f"  Unexpected error on site {site['name']}: {e}, skipping to next site")
            jobs = []

        new_on_this_site = 0
        for job in jobs:
            jid = job_id(job["url"])
            existing = seen.get(jid)

            if existing is None:
                # Brand new job - record it, not yet sent.
                seen[jid] = {
                    "title": job["title"],
                    "url": job["url"],
                    "source": job["source"],
                    "contact": job.get("contact"),
                    "location": job.get("location"),
                    "experience_years": job.get("experience_years"),
                    "first_seen": datetime.now().isoformat(timespec="seconds"),
                    "sent": False,
                }
                all_new_jobs.append(job)
                new_on_this_site += 1
            elif not existing.get("sent", False):
                # We saw this job before but a previous Telegram send failed
                # (e.g. bad token/chat_id at the time) - retry it now.
                all_new_jobs.append(job)

        log(f"  Found {len(jobs)} relevant jobs, {new_on_this_site} of them new")
        time.sleep(DELAY_BETWEEN_SITES_SEC)

    if not all_new_jobs:
        save_seen_jobs(seen)
        log("No new jobs this time.")
        return

    log(f"Sending {len(all_new_jobs)} new jobs to Telegram...")

    # Opening message
    send_telegram_message(
        tg["bot_token"], tg["chat_id"],
        f"🔎 נמצאו {len(all_new_jobs)} משרות חדשות רלוונטיות:"
    )
    for job in all_new_jobs:
        jid = job_id(job["url"])
        success = send_telegram_message(tg["bot_token"], tg["chat_id"], format_job_message(job))
        # Only mark as sent if Telegram actually accepted it - otherwise it
        # will be retried on the next run instead of silently getting lost.
        seen[jid]["sent"] = success
        time.sleep(1)  # avoid flooding the Telegram API

    save_seen_jobs(seen)
    log("Done.")


if __name__ == "__main__":
    main()