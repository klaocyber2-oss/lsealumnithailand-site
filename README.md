# LSE Alumni Association of Thailand website

Live at **lsealumnithailand.org**. Cloudflare Pages publishes this repository automatically about a minute after any change.

| Page | File |
|---|---|
| Home | `index.html` |
| About, committee, governance, contact | `about.html` |
| Committee (advisors and board) | `committee.html` |
| Events | `events.html` |
| Membership | `membership.html` |
| Privacy notice | `privacy.html` |
| Page not found | `404.html` |
| Colours, fonts, layout (all pages) | `assets/css/site.css` |
| Menu, London–Bangkok drawing, event tabs | `assets/js/site.js` |
| Khao Yai trip handbook (`/khaoyai`, hidden from search engines) | `khaoyai/index.html` |

## Change some text

1. Open the page file (for example `about.html`) and click the pencil icon (Edit).
2. Press **Ctrl+F** (Cmd+F on Mac) and search for the words you want to change.
3. Change only the words, not the code around them (anything inside `< >`).
4. Click **Commit changes**. The site updates in about a minute.

The header and footer appear on every page, so a change there (for example a new footer link) must be made in each page file.

## Add an event

1. Open `events.html` and search for `TO ADD AN EVENT`.
2. Copy one whole block from `<li class="event rv">` down to its `</li>`, and paste it directly underneath.
3. Change the date (`<b>12</b><span>Dec 2026</span>`), title, place, type and description.
4. When the event is over, cut the block and paste it into the **Past** list further down the page, and change the small label to `Past event`.
5. The home page shows the six latest past events as photo cards in **Recent activities** (`index.html`, search for `class="act rv"`). Copy, change or remove those blocks the same way.

## Add or change a committee member

1. Open `committee.html` and search for `TO ADD A PERSON`. The note there explains each step.
2. Advisors are in the first group, the committee board in the second.
3. For photos: upload a square photo (about 600 × 600 px) to `assets/img/committee/`, then follow the note.

## Event photos

Event photos are in `assets/img/activities/`. To add a new past event with a photo, upload the photo there, copy an existing past-event block in `events.html` and change the photo name, words and Instagram link.

## Membership form

Every **Join us** and **Become a member** button leads to the "Ready to join?" box at the bottom of `membership.html`. When the Google Form is ready, open `membership.html`, search for `JOIN FORM LINK` and follow the note there: replace the Instagram link with the form's address and change the button text to **Apply to join**.

## Ask Claude for

New pages or sections, layout changes, photo galleries, or anything you're unsure about.

## Never put here

Application answers, phone lists, ID or passport details, or any other personal information.
