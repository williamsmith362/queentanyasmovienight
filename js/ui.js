/**
 * ui.js
 * ---------------------------------------------------------------------------
 * Small, reusable presentation helpers that don't belong to any single
 * feature module — mainly inline icon markup shared between the movie
 * cards (library.js) and the player page (player.js).
 *
 * Anything here should be stateless: given the same input, always return
 * the same markup.
 * ---------------------------------------------------------------------------
 */

/**
 * A filled "play" triangle icon, used on movie card hover and as the
 * small icon inside the card's "Play" affordance.
 * @param {number} [size=20]
 * @returns {string} inline SVG markup
 */
export function playIconSvg(size = 20) {
  return (
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor"/></svg>'
  );
}

/**
 * A left-pointing chevron, used by the "Back to Library" link.
 * @param {number} [size=15]
 * @returns {string} inline SVG markup
 */
export function backArrowSvg(size = 15) {
  return (
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );
}

/**
 * A magnifying-glass search icon.
 * @returns {string} inline SVG markup
 */
export function searchIconSvg() {
  return (
    '<svg class="search-box__icon" width="17" height="17" viewBox="0 0 24 24" fill="none" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  );
}

/**
 * A picture-in-picture rectangle icon, used on the PiP button.
 * @returns {string} inline SVG markup
 */
export function pipIconSvg() {
  return (
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor"/></svg>'
  );
}

/**
 * Shows or hides an element by toggling its inline `display` style.
 * Small helper to avoid repeating the same ternary everywhere.
 * @param {HTMLElement} el
 * @param {boolean} visible
 * @param {string} [displayValue=""] - display value to use when visible
 */
export function setVisible(el, visible, displayValue = "") {
  el.style.display = visible ? displayValue : "none";
}
