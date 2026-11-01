# mtspokanestake.org

Website for the Mount Spokane Stake: calendar, high council speaking assignments, stake
conference assignments, high council stewardships, and any other list the stake needs.

All the content is in plain files in `src/data/`. You don't need to know code to update it.
Ask Claude to do it.

## For Jeff: updating the site with Claude

**One-time setup**

1. Accept the GitHub invitation Carson sent (check your email, or go to
   https://github.com/cmccomas/mtspokanestake.org/invitations).
2. You need a Claude Pro (or higher) plan. Sign in at https://claude.ai.
3. Go to https://claude.ai/code. The first time, it asks you to connect GitHub. Allow it.
4. Pick the `cmccomas/mtspokanestake.org` repository.

**Each time you have an update**

1. Go to https://claude.ai/code, choose `cmccomas/mtspokanestake.org`, and say what you
   want in plain words, for example:
   - "Add the December high council speaking assignments: Dec 6 Greenbluff Ward Brother
     Smith, …"
   - "Here's the stake conference program" (paste it or attach a photo)
   - "Make a new page for the building cleaning schedule" (paste the spreadsheet)
2. Claude edits the files, checks them, and gives you a link to a **pull request**.
3. Open the link. There's a preview link from Vercel on the page if you want to see it
   first. Click the green **Merge pull request** button, then **Confirm merge**.
4. The live site updates in about a minute.

If the check fails, the live site doesn't change. Nothing you merge can break it. Just tell
Claude what you see.

Everything on the site and in this repository is public. Claude will leave out phone
numbers, addresses and anything not yet announced, but please don't paste those in anyway.

## For developers

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # validates src/data and builds to dist/
```

Hosted on Vercel (static Astro, no database). Pushes to `main` deploy to production;
other branches get preview deployments. See `CLAUDE.md` for how content is organized.
