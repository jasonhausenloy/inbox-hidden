# Chrome Web Store Submission Checklist

## One-time setup

1. Register a developer account: <https://chrome.google.com/webstore/devconsole/>
   - **$5 USD one-time fee** (paid to Google)
   - Use the Google account you want to publish from

## Per-submission

### Required assets (already prepared)

| Asset | Status | Location |
|---|---|---|
| Manifest v3 | ✓ | `manifest.json` |
| 128×128 icon | ✓ | `icons/icon-128.png` |
| Privacy policy URL | ✓ | `https://github.com/jasonhausenloy/inbox-hidden/blob/main/PRIVACY.md` |
| Source code (open) | ✓ | `https://github.com/jasonhausenloy/inbox-hidden` |
| Packaged zip | ✓ | `dist/inbox-hidden-v1.0.0.zip` |

### You will need to capture (3–5 minutes)

- **At least 1 screenshot** at 1280×800 or 640×400 (PNG/JPG)
  - Easiest: screenshot Gmail showing the "Show Inbox" overlay
  - macOS: `⌘⇧4`, drag region, save
- **Optional but helpful**:
  - Small promo tile 440×280
  - Marquee promo tile 1400×560

### Form fields to fill in the dev console

- **Name**: Inbox Hidden
- **Summary** (132 char max):
  > Hide your Gmail inbox by default. Free, open-source alternative to Inbox When Ready, with no signature injection.
- **Description** (full, 16K char max): paste the README "Features" + "How it works" sections, or use:

  ```
  Hide your Gmail inbox by default. Reveal it only when you've decided to process email — and not before.

  This is a free, open-source alternative to Inbox When Ready, designed to do the same thing without injecting "Sent with…" into your email signature.

  Features
  • Hides the inbox list view behind a single "Show Inbox" button
  • Search, labels, drafts, sent, threads, and Compose all work normally
  • Keyboard toggle: ⌘⇧I (Mac) or Ctrl+Shift+I
  • Follows your Gmail theme automatically (light, dark, or custom)
  • Pure client-side restyling — never reads your email or modifies Compose

  Privacy
  Zero data collection. No Gmail API access. No telemetry. No remote calls.
  Source code: github.com/jasonhausenloy/inbox-hidden
  ```

- **Category**: Workflow & Planning
- **Language**: English
- **Privacy policy**: `https://github.com/jasonhausenloy/inbox-hidden/blob/main/PRIVACY.md`
- **Single purpose**: "Hides the Gmail inbox view by default to support batched processing."
- **Permission justifications**:
  - `host_permissions: https://mail.google.com/*` — required to inject the CSS/JS that hides the inbox list and renders the Show Inbox button. No data is collected or transmitted.
- **Data usage disclosures**:
  - Personally identifiable information: **No**
  - Health information: **No**
  - Financial info: **No**
  - Authentication info: **No**
  - Personal communications: **No**
  - Location: **No**
  - Web history: **No**
  - User activity: **No**
  - Website content: **No** (we modify display via CSS but never read content)
  - Certifications: confirm all three (no sale, only-for-stated-purpose, not-for-creditworthiness)

## Upload

1. In the dev console, click **New item**
2. Upload `dist/inbox-hidden-v1.0.0.zip`
3. Fill in the fields above
4. Submit for review

Review typically takes **1–3 business days**. They may ask for clarifications;
respond in the dev console.

## After approval

- Update README.md "From the Chrome Web Store" section with the install link.
- Tag the GitHub release: `git tag v1.0.0 && git push --tags`.

## Bumping versions

1. Edit `manifest.json` `"version"` field
2. Run `./scripts/package.sh`
3. Upload the new zip in the dev console (same item)
4. Submit for review
