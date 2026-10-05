// ==UserScript==
// @name         Payback Helper
// @namespace    https://belvast.de/
// @version      0.2.2
// @description  Aktiviert alle noch nicht aktivierten eCoupons im PAYBACK Coupon-Center mit einem Klick
// @description:en Activates all not-yet-activated eCoupons in the PAYBACK coupon center with one click
// @author       Hannes Gao
// @license      MIT
// @homepageURL  https://github.com/hannesgao/Payback-Helper-Script
// @supportURL   https://github.com/hannesgao/Payback-Helper-Script/issues
// @updateURL    https://raw.githubusercontent.com/hannesgao/Payback-Helper-Script/main/payback-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/hannesgao/Payback-Helper-Script/main/payback-helper.user.js
// @match        https://www.payback.de/coupons*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=payback.de
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Jeder nicht aktivierte Coupon hat genau einen Button
  // data-testid="coupon-button-<id>-not_activated"
  // ("Jetzt aktivieren", vereinzelt "JETZT TEILNEHMEN" – gleicher Aktivierungs-Flow).
  const SELECTOR = 'button[data-testid^="coupon-button-"][data-testid$="-not_activated"]';
  const MIN_DELAY_MS = 250;    // Mindestpause zwischen zwei Aktivierungen
  const TIMEOUT_MS = 6000;     // max. Wartezeit auf die Antwort einer Aktivierung

  const attempted = new Set();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const couponId = (b) => b.dataset.testid.replace(/^coupon-button-|-not_activated$/g, '');

  const nextButton = () =>
    [...document.querySelectorAll(SELECTOR)].find(
      (b) => !attempted.has(couponId(b)) && !b.disabled && !b.classList.contains('Mui-disabled')
    );

  const pendingCount = () =>
    [...document.querySelectorAll(SELECTOR)].filter((b) => !attempted.has(couponId(b))).length;

  // Nach dem Klick zeigt MUI einen Ladezustand; danach verschwindet der Button
  // bzw. wird durch "Vor Ort / Online einlösen" ersetzt.
  async function waitForActivation(btn) {
    const start = Date.now();
    await sleep(MIN_DELAY_MS);
    while (Date.now() - start < TIMEOUT_MS) {
      const done =
        !btn.isConnected ||
        !btn.matches(SELECTOR) ||
        (!btn.classList.contains('MuiButton-loading') && !btn.disabled && Date.now() - start > 800);
      if (done) return;
      await sleep(150);
    }
  }

  let running = false;

  async function activateAll(ui) {
    if (running) {
      running = false; // zweiter Klick = abbrechen
      return;
    }
    running = true;
    const total = pendingCount();
    let done = 0;

    let btn;
    while (running && (btn = nextButton())) {
      attempted.add(couponId(btn));
      btn.scrollIntoView({ block: 'center', behavior: 'instant' });
      btn.click();
      await waitForActivation(btn);
      done++;
      ui.textContent = `Aktiviere… ${done}/${total}  (Klick = Stopp)`;
    }

    const stopped = !running;
    running = false;
    ui.textContent = stopped ? `Gestoppt nach ${done}` : done ? `✓ ${done} Coupons aktiviert` : 'Keine offenen Coupons';
    setTimeout(updateLabel, 5000);
  }

  let ui;
  function updateLabel() {
    if (!ui || running) return;
    const n = document.querySelectorAll(SELECTOR).length;
    ui.textContent = n ? `Alle ${n} Coupons aktivieren` : 'Alle Coupons aktivieren';
  }

  function addButton() {
    if (document.getElementById('pb-activate-all')) return;
    ui = document.createElement('button');
    ui.id = 'pb-activate-all';
    Object.assign(ui.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: 2147483647,
      padding: '12px 18px',
      background: '#0046aa',
      color: '#fff',
      border: 'none',
      borderRadius: '24px',
      font: '600 15px/1.2 system-ui, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,.25)',
      cursor: 'pointer',
    });
    ui.addEventListener('click', () => activateAll(ui));
    document.body.appendChild(ui);
    updateLabel();
    // Liste wird per React nachgerendert – Zähler aktuell halten
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => { scheduled = false; updateLabel(); }, 500);
    }).observe(document.body, { childList: true, subtree: true });
  }

  addButton();
})();