# Payback Helper Script

A userscript for [Tampermonkey](https://www.tampermonkey.net/) that activates all of your not-yet-activated eCoupons in the [PAYBACK](https://www.payback.de/) coupon center with a single click.

Instead of clicking "Jetzt aktivieren" on dozens of coupons one by one, you get a floating button that works through all of them for you.

## Features

- **One-click activation**: a floating button in the bottom-right corner activates every open coupon on the page.
- **Live counter**: the button shows how many coupons are still waiting to be activated and updates as the page re-renders.
- **Progress display**: shows `n/total` while it runs.
- **Stop anytime**: click the button again to stop after the current coupon.
- **Gentle on the site**: activates coupons one at a time and waits for each response, with a short pause in between.
- **No permissions**: runs with `@grant none` and only on `https://www.payback.de/coupons*`.

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Safari, Opera)
   - [Violentmonkey](https://violentmonkey.github.io/) also works
2. Click the link below. Your userscript manager will open an install dialog:

   **[Install payback-helper.user.js](https://raw.githubusercontent.com/hannesgao/Payback-Helper-Script/main/payback-helper.user.js)**

3. Confirm the installation.

The script includes `@updateURL` and `@downloadURL`, so your userscript manager picks up new versions from this repository automatically.

> **Chrome / Edge users:** recent versions require you to enable **Developer mode** on `chrome://extensions` (or **Allow User Scripts** in the Tampermonkey extension details) before userscripts can run.

## Usage

1. Log in to your PAYBACK account and open the [coupon center](https://www.payback.de/coupons).
2. A blue button labeled **"Alle N Coupons aktivieren"** appears in the bottom-right corner.
3. Click it. The script scrolls to and activates each open coupon in turn, showing its progress on the button.
4. Click the button again at any time to stop.

When it finishes, the button shows how many coupons were activated and returns to its normal state after a few seconds.

## How it works

PAYBACK renders each coupon with a button whose `data-testid` follows the pattern `coupon-button-<id>-not_activated` until it is activated. The script:

1. Finds the next such button it has not tried yet.
2. Clicks it and waits until the button disappears, changes state, or leaves its loading state (up to 6 seconds).
3. Repeats until no open coupons remain or you stop it.

A `MutationObserver` keeps the counter in sync because the coupon list is rendered dynamically by React.

You can adjust the timing constants at the top of the script:

| Constant       | Default | Meaning                                         |
| -------------- | ------- | ----------------------------------------------- |
| `MIN_DELAY_MS` | `250`   | Minimum pause between two activations (ms)      |
| `TIMEOUT_MS`   | `6000`  | Maximum wait for a single activation (ms)       |

## Limitations

- Only supports the German PAYBACK site (`www.payback.de`).
- Relies on PAYBACK's current page markup. If PAYBACK changes its coupon center, the script may stop finding coupons until it is updated. Please [open an issue](https://github.com/hannesgao/Payback-Helper-Script/issues) if that happens.

## Disclaimer

This project is not affiliated with, endorsed by, or connected to PAYBACK GmbH. It only automates clicks you could make yourself in your own logged-in browser session. Use it at your own risk.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the branch, commit and pull request conventions.

## License

[MIT](LICENSE) © Hannes Gao
