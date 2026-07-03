/**
 * search.js
 * ---------------------------------------------------------------------------
 * Wires up the search input for instant, as-you-type filtering, and
 * renders the small "Showing X of Y titles" meta line beneath it.
 *
 * Like filters.js, this module only tracks its own UI state (the current
 * query) and reports changes upward — the actual show/hide logic lives
 * in library.js.
 * ---------------------------------------------------------------------------
 */

import { byId } from "./utils.js";

let currentQuery = "";

/**
 * @param {(query: string) => void} onChange - called on every keystroke
 *   with the current (unprocessed) search input value
 */
export function initSearch(onChange) {
  const input = byId("searchInput");

  input.addEventListener("input", () => {
    currentQuery = input.value;
    onChange(currentQuery);
  });
}

/**
 * @returns {string} the current raw search input value
 */
export function getQuery() {
  return currentQuery;
}

/**
 * Updates the "Showing X of Y titles" line under the search box.
 * @param {number} visible
 * @param {number} total
 */
export function renderSearchMeta(visible, total) {
  const meta = byId("searchMeta");
  meta.textContent =
    visible === total
      ? total + " title" + (total === 1 ? "" : "s") + " in the library"
      : "Showing " + visible + " of " + total + " titles";
}
