// ==UserScript==
// @name         X — Does Not Follow You
// @namespace    https://github.com/lunagus
// @version      1.0.1
// @description  Highlights users who do NOT follow you back on your X following list.
// @author       lunagus
// @match        https://x.com/*/following
// @match        https://twitter.com/*/following
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────────

  const CELL_SELECTOR           = '[data-testid="UserCell"]';
  const FOLLOWS_YOU_SELECTOR    = '[data-testid="userFollowIndicator"]';
  const BADGE_CLASS             = 'dnfy-no-follow-badge';
  const PROCESSED_ATTR          = 'data-dnfy-processed';

  // ─── Styles ───────────────────────────────────────────────────────────────────

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

  // ─── URL guard ────────────────────────────────────────────────────────────────

  function isFollowingPage() {
    return /\/[^/]+\/following(\/|$)/.test(window.location.pathname);
  }

  // ─── Core logic ───────────────────────────────────────────────────────────────

  /**
   * Injects the "DOES NOT FOLLOW YOU" badge into the username row
   * of a UserCell that has no "Follows you" indicator.
   *
   * @param {Element} cell - The [data-testid="UserCell"] element
   */
  function processCell(cell) {
    // Skip if already handled
    if (cell.hasAttribute(PROCESSED_ATTR)) return;
    cell.setAttribute(PROCESSED_ATTR, 'true');

    const followsYou = cell.querySelector(FOLLOWS_YOU_SELECTOR);
    if (followsYou) return; // They follow you — nothing to do

    // Find the username (@handle) element to anchor the badge next to it
    const handleEl = cell.querySelector('a[href] div[dir="ltr"] span');
    if (!handleEl) return;

    // Walk up to find the flex row that holds the handle
    // so we can append the badge inline after it
    const handleRow = handleEl.closest('div.css-175oi2r');
    if (!handleRow) return;

    const badge = document.createElement('span');
    badge.className = BADGE_CLASS;
    badge.textContent = 'Does not follow you';
    badge.title = 'This user does not follow you back';

    // Insert the badge into the handle row
    handleRow.appendChild(badge);
  }

  /**
   * Scans the page for unprocessed UserCells and processes them.
   */
  function scanCells() {
    document.querySelectorAll(CELL_SELECTOR).forEach(processCell);
  }

  // ─── MutationObserver (handles virtualized list) ───────────────────────────

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (!mutation.addedNodes.length) continue;

      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        // The added node might BE a UserCell, or CONTAIN UserCells
        if (node.matches(CELL_SELECTOR)) {
          processCell(node);
        } else {
          node.querySelectorAll(CELL_SELECTOR).forEach(processCell);
        }
      }
    }
  });

  // ─── Init ─────────────────────────────────────────────────────────────────────

  function init() {
    // Process any cells already in the DOM
    scanCells();

    // Watch for new cells as the user scrolls
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Wait for the page to be sufficiently loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
