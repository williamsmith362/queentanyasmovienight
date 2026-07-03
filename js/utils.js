/**
 * utils.js
 * ---------------------------------------------------------------------------
 * Small, pure, dependency-free helper functions shared across modules.
 * Nothing in this file touches the DOM or the movie data — if a function
 * needs either of those, it belongs in a more specific module instead.
 * ---------------------------------------------------------------------------
 */

/**
 * Zero-pads a number to at least 2 digits. Used for season/episode
 * numbers so file paths sort and match predictably (s01e01, s01e02, ...).
 * @param {number} n
 * @returns {string}
 */
export function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

/**
 * Escapes a string for safe insertion as HTML text content.
 * Used any time movie data (titles, descriptions) is inserted via
 * innerHTML, so a title can never accidentally break the page markup.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Escapes a string for safe insertion inside generated SVG markup
 * (used by thumbnails.js). SVG text nodes only need the same handful
 * of characters escaped as HTML.
 * @param {string} str
 * @returns {string}
 */
export function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Lightens or darkens a hex color by a percentage. Negative values
 * darken, positive values lighten. Used to build the second stop of a
 * thumbnail's gradient from its single "accent" color.
 * @param {string} hex - e.g. "#ec6fa0"
 * @param {number} percent - e.g. -18 to darken by 18%
 * @returns {string} hex color
 */
export function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

/**
 * Shorthand for document.getElementById, purely to cut down on
 * repetition across modules.
 * @param {string} id
 * @returns {HTMLElement | null}
 */
export function byId(id) {
  return document.getElementById(id);
}

/**
 * Shorthand for document.querySelector.
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {Element | null}
 */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll, returned as a real array
 * so callers can use .map/.filter directly.
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {Element[]}
 */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}
