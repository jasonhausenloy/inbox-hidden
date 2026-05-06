# Inbox Hidden

A free, open-source Chrome extension that hides the Gmail inbox by default and
reveals it only when you click **Show Inbox**. No signature injection, no
Gmail API access, no telemetry.

Inspired by [Inbox When Ready](https://inboxwhenready.org/), without the
"Sent with..." signature that the free version inserts into your email.

## Features

- Hides the inbox list view on `#inbox` behind a single **Show Inbox** button.
- Search, labels, drafts, sent, threads, and Compose all work normally.
- Opening an email and coming back to inbox keeps your reveal state.
- Navigating to a label / search and back to inbox = re-hidden.
- Keyboard toggle: `⌘⇧I` (mac) or `Ctrl+Shift+I`.
- Follows your Gmail theme (light, dark, custom) automatically.
- Pure client-side restyling — never touches your email content or Compose.

## Install

### From source (developer mode)

1. Clone or download this repo.
2. Open `chrome://extensions` (works in Chrome, Arc, Brave, Edge).
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** → select this folder.

### From the Chrome Web Store

Coming soon — pending submission review.

## Privacy

Zero data collection. See [PRIVACY.md](./PRIVACY.md).

## How it works

A content script watches `mail.google.com`. When the URL hash matches the
inbox list view (`#inbox`, `#inbox/p2`, etc.), the script:

1. Adds a class to `<html>` that hides children of `[role="main"]`.
2. Probes Gmail's themed container for current background/foreground colors.
3. Renders an absolute-positioned overlay containing one button.

When you click **Show Inbox** (or hit `⌘⇧I`), the class is removed and the
inbox renders normally. A small **Hide Inbox** chip floats in the top-right so
you can re-hide without the keyboard.

## Build & package

No build step. To produce a Chrome Web Store zip:

```bash
./scripts/package.sh
```

Output: `dist/inbox-hidden-v<version>.zip`.

## License

MIT — see [LICENSE](./LICENSE).
