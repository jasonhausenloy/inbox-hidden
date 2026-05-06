# Privacy Policy — Inbox Hidden

**Last updated:** 2026-05-05

Inbox Hidden does not collect, transmit, store, or sell any user data.

## What the extension does

Inbox Hidden modifies the styling of `mail.google.com` in your browser to hide
the inbox list view by default. It runs entirely on your machine.

## What it does not do

- It does **not** read, scrape, or transmit the contents of your email.
- It does **not** request or use Gmail API access.
- It does **not** modify outgoing messages, including signatures.
- It does **not** make network requests of any kind.
- It does **not** include analytics, telemetry, or third-party scripts.
- It does **not** use cookies or persistent identifiers.

## Permissions

The extension requests one permission, declared in `manifest.json`:

- **Host permission for `https://mail.google.com/*`** — required to inject the
  small CSS and JavaScript that hides the inbox list and renders the
  "Show Inbox" button. No data leaves your browser.

## Source code

The full source is published under the MIT license at
<https://github.com/jasonhausenloy/inbox-hidden>. Anyone can audit, modify, or
fork it.

## Contact

For questions or concerns: open an issue on the GitHub repository.
