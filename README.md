# Job Search Alert Agent

A lightweight Python bot that scans career pages and job boards, filters
listings by keyword (and optional location / years-of-experience rules),
and pushes a Telegram notification the moment a new matching job appears.
Built to run unattended on a schedule (cron / Windows Task Scheduler) so
you find out about relevant openings without manually refreshing job
boards.

## How it works

1. `config.yaml` lists the sites to scan — either a company's generic
   careers page, or a job board with known CSS selectors (AllJobs,
   Drushim, etc.).
2. Each run fetches every configured page, extracts job links, and keeps
   only the ones matching your keyword list (with an exclude list for
   terms like "Senior" when you're looking for junior roles).
3. Optional filters can:
   - Skip jobs outside a set of allowed locations.
   - Fetch the full job description and flag postings that ask for more
     years of experience than you want.
4. Jobs that haven't been seen before are recorded in `seen_jobs.json`
   and sent to a Telegram chat via a bot. Already-seen jobs are never
   re-sent, so you only get pinged once per listing.
5. A failed Telegram send is retried automatically on the next run
   instead of being silently dropped.

## Setup

```bash
pip install -r requirements.txt
cp config.example.yaml config.yaml
```

Edit `config.yaml`:

- **Telegram bot**: message [@BotFather](https://t.me/BotFather) on
  Telegram to create a bot and get a token, then message your new bot
  once and use `https://api.telegram.org/bot<token>/getUpdates` to find
  your `chat_id`.
- **Keywords**: the job titles / phrases you're looking for (case
  insensitive, supports mixed languages).
- **Sites**: add each careers page you want scanned, either as `type:
  "generic"` (scans all links on the page) or `type: "css"` (for job
  boards with a fixed results layout — you supply the CSS selectors for
  the job container, title, and link).

Run it:

```bash
python Job_agent.py
```

Then schedule it to run automatically, e.g. twice a day via Windows Task
Scheduler or a cron job.

## Configuration reference

| Key | Description |
|---|---|
| `telegram.bot_token` / `telegram.chat_id` | Where alerts get sent. |
| `keywords` / `exclude_keywords` | Include/exclude filters on job title text. |
| `sites` | List of pages to scan, each with a `type` of `generic` or `css`. |
| `location_filter` | Optional: restrict results to certain locations. |
| `experience_filter` | Optional: flag postings requiring more experience than desired. |

See the comments in `config.example.yaml` for the full format.

## Privacy note

`config.yaml` (real bot token + personal site list) and the runtime files
`seen_jobs.json` / `agent.log` are git-ignored and never published — only
the sanitized `config.example.yaml` template is included in this repo.

## License

MIT — see [LICENSE](LICENSE).
