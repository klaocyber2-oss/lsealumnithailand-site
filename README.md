# LSE Alumni Thailand website

Live at **lsealumnithailand.org**. Cloudflare Pages publishes this repository automatically about a minute after any change.

| Page | File |
|---|---|
| Home page | `index.html` |
| Khao Yai trip handbook (`/khaoyai`) | `khaoyai/index.html` |
| Handbook photos | `khaoyai/img/` |

## Change some text

1. Open `khaoyai/index.html` and click the pencil icon (Edit).
2. Press **Ctrl+F** (Cmd+F on Mac) and search for the words you want to change.
3. Change only the words, not the code around them (anything inside `< >`).
4. Click **Commit changes**. The site updates in about a minute.

## Replace a photo (easiest)

Every photo has a plain name, such as `hotel-muthi-maya-1.jpg` or `night-safari-2.jpg`.

1. Rename your new photo to **exactly** the same name as the one you're replacing (`.jpg`, lowercase).
2. Open the `khaoyai/img` folder, click **Add file → Upload files**, drop the photo in, and commit.

GitHub replaces the old photo and the page shows the new one. Keep photos under about 500 KB (around 1200 px wide) so the page stays fast.

## Survey button (Thursday)

In `khaoyai/index.html`, search for `SURVEY LINK`. The line below it has `href="#survey"`.

1. Replace `#survey` with the Google Form link.
2. Change the button text `Survey opens Thursday 5 Nov` to `Complete the trip survey`.
3. Delete ` is-soon` from the class (this makes the button solid white).

## Ask Claude for

New sections, layout changes, map routes, or anything you're unsure about.

## Never put here

Survey answers, flight details, phone lists, or any other personal information.
