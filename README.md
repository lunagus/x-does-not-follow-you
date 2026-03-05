# X — Does Not Follow You

A lightweight userscript that highlights users who **don't follow you back** on your X (Twitter) following list.

---

It gets annoying having to scan through your following list to find people who do not follow you back so this helps by highlighting them.

When you visit `x.com/[anyone]/following`, the script scans each user card and checks for the **"Follows you"** badge. If it's missing, a red **✕ Does not follow you** pill is injected inline next to the username — no page reloads, no API calls, no extra permissions needed.

It fully handles X's virtualized list, so badges are applied correctly as you scroll down.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) for your browser.
2. Click **[here](./x-does-not-follow-you.user.js)** to open the script file, then click **Raw**.
3. Your userscript manager will prompt you to install it — confirm.

---

## Usage

Navigate to any following page:

```
https://x.com/YOUR_USERNAME/following
```

Scroll through the list as normal. Users without the "Follows you" badge will be automatically tagged. No configuration required.

---

## Compatibility

| Browser | Extension |
|---|---|
| Chrome / Edge / Brave | Tampermonkey, Violentmonkey |
| Firefox | Tampermonkey, Violentmonkey |
| Safari | Tampermonkey |

Matches both `x.com/*/following` and `twitter.com/*/following`.

---

## Notes

- The script reads **only what's visible on the page** — it makes no requests to any API and stores no data.
- X occasionally changes internal `data-testid` attribute names. If badges stop appearing after an X update, open an [issue](https://github.com/lunagus/x-does-not-follow-you/issues) and I'll push a fix.

---
