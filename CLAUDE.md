# Mount Spokane Stake website

Public website at https://www.mtspokanestake.org. Owner: Carson McComas. Day-to-day
editor: Jeff Wiberg, stake executive secretary.

Jeff is not a developer. He will ask in plain words ("add the December speaking
assignments", "here's the stake conference program", a pasted spreadsheet or a photo).
Your job is to turn that into edits to the data files, check them, and get them live.
Talk to him in plain language: no file paths, YAML or git jargon unless he asks.

## Everything is public

The site AND this GitHub repository are public. Anything committed stays in the
history even if it is later deleted. Before committing, check that the change contains
none of the following, and if Jeff's request includes any of it, leave it out and tell
him why:

- phone numbers, home addresses or personal email addresses of members
- callings, releases or assignments that have not been announced or sustained yet
- anything about a member's personal circumstances (health, finances, worthiness, discipline)
- information about children or youth beyond a first name and last initial
- login details, passwords or access codes of any kind

Names with "Brother"/"Sister" or "President" and the assignment itself are fine.

## Where the content lives

All content is in `src/data/`. Each file starts with a commented example of its format.
Only edit these files unless Jeff asks for something the files can't do.

| What Jeff calls it | File | Page |
| --- | --- | --- |
| Stake name, announcement banner, stake center, contact email | `src/data/site.yaml` | every page / home |
| Wards and meeting times | `src/data/wards.yaml` | home |
| Calendar, events, activities | `src/data/events.yaml` | /calendar, home |
| High council speaking assignments | `src/data/speaking.yaml` | /speaking, home |
| Stake conference program and assignments | `src/data/stake-conference.yaml` | /stake-conference, home |
| High council wards and stewardships | `src/data/high-council.yaml` | /high-council |
| Any other spreadsheet-style list | `src/data/tables/<name>.yaml` | /resources/<name> |

For a new kind of list (cleaning schedule, youth leaders, temple trip sign-ups...), make a
new file in `src/data/tables/` (see `src/data/tables/README.md`). That needs no code. Only
build a new page type if a table really can't show it, and check with Jeff first.

## Rules for the data

- Dates are always `YYYY-MM-DD`. Times are quoted text: `time: "7:00 PM"`.
- Order in the file doesn't matter; pages sort by date. Past items move to a "Past"
  section on their own, so don't delete old entries just because they passed. Do remove
  entries more than a year old if a file gets long.
- When Jeff's names or ward names are inconsistent with what's already in the files, ask
  rather than guess.
- When something Jeff gives you is ambiguous (which Sunday, which ward), ask before
  writing it.

## Making a change

1. First time in a session: `npm install`.
2. Edit the data file(s).
3. Run `npm run build`. It checks every data file and stops with a plain message (file,
   entry number, problem) if something is wrong. Fix it and run it again. Never push a
   change that fails this build.
4. Commit with a short plain message, e.g. `Add December speaking assignments`.
5. Get it onto `main`. Pushing to `main` publishes the site automatically through Vercel in
   about a minute.
   - If you can push to `main`, do that.
   - If you work on a branch (cloud sessions do), open a pull request, and give Jeff the
     link and tell him to click the green **Merge pull request** button. Vercel posts a
     preview link on the pull request he can look at first.
6. Tell Jeff in one or two sentences what changed and which page to look at, e.g.
   "December's speakers are up at mtspokanestake.org/speaking."

## The code (only if needed)

Astro static site, no database, no server. `src/lib/data.ts` loads and validates the YAML
(the schemas there are the source of truth for what each file allows).
`src/layouts/Base.astro` holds the header, footer, styles, and the small script that moves
past dated items into "Past". Pages are in `src/pages/`. Run `npm run dev` to preview at
http://localhost:4321.

Don't add the Church's logo or imply this is an official Church site. The footer
disclaimer stays.
