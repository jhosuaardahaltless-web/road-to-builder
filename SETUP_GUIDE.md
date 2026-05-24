# Road to Builder — Setup Guide

Your gamified journey from Salesforce developer to building owner in San Carlos City.
This app runs in the cloud (Supabase + Vercel) so you can open it on your phone AND computer, fully synced.

Follow these steps in order. No coding required — just copy, paste, and click.

---

## ✅ What you already have
- GitHub repo: https://github.com/jhosuaardahaltless-web/road-to-builder
- Supabase account (fresh)
- Vercel account (connected to GitHub, env vars added)

---

## STEP 1 — Set up your Supabase database (3 minutes)

1. Go to **supabase.com** and open your `road-to-builder` project.
2. In the left sidebar, click **SQL Editor**.
3. Click **+ New query**.
4. Open the file **`supabase_setup.sql`** (included here), copy ALL of it, and paste it into the editor.
5. Click **Run** (or press Ctrl/Cmd + Enter).
6. You should see "Success. No rows returned." ✅ That's correct.

This creates the table that stores your progress and locks it so only you can see it.

---

## STEP 2 — Check your Email Auth setting (1 minute)

1. In Supabase, go to **Authentication** → **Providers** → **Email**.
2. Make sure **Email** is enabled.
3. (Optional but easier) Turn OFF **"Confirm email"** so you can log in instantly without clicking a confirmation link. You can leave it on if you prefer — just check your inbox after signing up.

---

## STEP 3 — Put the code in your GitHub repo (5 minutes)

The easiest way (no git commands):

1. Go to your repo: https://github.com/jhosuaardahaltless-web/road-to-builder
2. Click **Add file** → **Upload files**.
3. Drag in these files and the `src` folder from the `road-to-builder-clean` folder:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `.gitignore`
   - `src/` (the whole folder — contains `main.jsx`, `App.jsx`, `supabaseClient.js`)
4. Scroll down, click **Commit changes**.

> Tip: When uploading, you can drag the entire `src` folder in and GitHub keeps the structure.
> Do NOT upload `node_modules` or `supabase_setup.sql` — they aren't needed in the repo.

---

## STEP 4 — Confirm your Vercel environment variables (2 minutes)

In Vercel → your project → **Settings** → **Environment Variables**, make sure you have BOTH:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | your Supabase Project URL (https://xxxxx.supabase.co) |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon public key (starts with eyJ...) |

If they're there — great. If not, add them now.

---

## STEP 5 — Deploy (2 minutes)

1. In Vercel, go to your project → **Deployments** tab.
2. Click the **•••** menu on the latest deployment → **Redeploy** (so it picks up the new code + env vars).
   - Or just push the code in Step 3 — Vercel auto-deploys on every push.
3. Wait 1–2 minutes for "Ready".
4. Click the URL (e.g. `https://road-to-builder.vercel.app`).

---

## STEP 6 — Create your account & play

1. Open your Vercel URL.
2. Click **Sign Up**, enter your email + a password (6+ chars).
3. If you turned off email confirmation, switch to **Log In** and enter the same details.
4. You're in. Your progress now syncs to the cloud.
5. Open the SAME URL on your computer, log in with the SAME email/password → same data.

---

## Daily use
- Open the URL each morning.
- Do at least the **Outreach** daily quest to keep your streak.
- Watch your Building Fund grow toward PHP 6,000,000.

The cloud icon in the top-right turns gold while saving, green when synced.

---

## Troubleshooting
- **Blank page / "Missing Supabase env vars" in console** → env vars not set in Vercel, or you didn't redeploy after adding them. Fix env vars, then Redeploy.
- **"Invalid login credentials"** → wrong password, or email confirmation is ON and you haven't confirmed. Check inbox or turn confirmation off in Supabase.
- **Progress not syncing across devices** → make sure you logged in with the exact same email on both.

That's it. Welcome to the road, Jhosua. 🔨
