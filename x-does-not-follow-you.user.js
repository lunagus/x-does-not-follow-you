// ==UserScript==
// @name         X — Does Not Follow You
// @namespace    https://github.com/lunagus
// @version      1.0.4
// @description  Highlights users who do NOT follow you back on your X following list.
// @author       lunagus
// @match        https://x.com/*/following
// @match        https://twitter.com/*/following
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

const CELL_SELECTOR = '[data-testid="UserCell"]';
const FOLLOWS_YOU_SELECTOR = '[data-testid="userFollowIndicator"]';
const BADGE_CLASS = 'dnfy-no-follow-badge';
const PROCESSED_ATTR = 'data-dnfy-processed';

  GM_addStyle(`
    .${BADGE_CLASS} {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 6px;
      padding: 2px 8px;
      border-radius: 9999px;
      background-color: #ff3b30;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1.4;
      vertical-align: middle;
      pointer-events: none;
      user-select: none;
      box-shadow: 0 1px 4px rgba(255, 59, 48, 0.4);
      animation: dnfy-fadein 0.25s ease;
    }
    .${BADGE_CLASS}::before {
      content: "✕";
      font-size: 9px;
      font-weight: 900;
      opacity: 0.85;
    }
    @keyframes dnfy-fadein {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
  `);

function processCell(cell) {
    if (!cell.querySelector('button[data-testid$="-unfollow"]')) return;
    if (cell.hasAttribute(PROCESSED_ATTR)) return;
    cell.setAttribute(PROCESSED_ATTR, 'true');

    if (cell.querySelector(FOLLOWS_YOU_SELECTOR)) return;

    const spans = Array.from(cell.querySelectorAll('span'));
    const handleSpan = spans.find(span => span.textContent.trim().startsWith('@'));
    if (!handleSpan) return;

    const badge = document.createElement('span');
    badge.className = BADGE_CLASS;
    badge.textContent = 'Does not follow you';
    badge.title = 'This user does not follow you back';

    handleSpan.parentElement.appendChild(badge);
  }

  function scanCells() {
    document.querySelectorAll(CELL_SELECTOR).forEach(processCell);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (!mutation.addedNodes.length) continue;
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(CELL_SELECTOR)) {
          processCell(node);
        } else {
          node.querySelectorAll(CELL_SELECTOR).forEach(processCell);
        }
      }
    }
  });

  const _pushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    _pushState(...args);
    setTimeout(scanCells, 500);
    setTimeout(scanCells, 1500);
  };
  window.addEventListener('popstate', () => {
    setTimeout(scanCells, 500);
    setTimeout(scanCells, 1500);
  });

  function init() {
    scanCells();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
