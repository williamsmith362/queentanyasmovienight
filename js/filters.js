/**
 * filters.js
 * ---------------------------------------------------------------------------
 * Renders the "All / Vampire Diaries / Love Island / Coraline" category
 * chips above the movie grid, and tracks which one is currently active.
 *
 * This module owns UI state (which chip is selected) but not the actual
 * filtering logic — it just reports the active category back to app.js,
 * which asks library.js to re-apply visibility.
 * ---------------------------------------------------------------------------
 */

import { byId } from "./utils.js";

let activeCategory = "All";
let activeCollection = "All";

/**
 * Builds one chip per unique category found in the movie list (plus an
 * "All" chip), and wires up click handling.
 * @param {object[]} movies - the full MOVIES array
 * @param {(category: string) => void} onChange - called whenever the
 *   active category changes
 */
export function initFilters(movies, onChange) {
  const filtersEl = byId("filters");
  const collectionFiltersEl = byId("collectionFilters");
  const categories = ["All", ...new Set(movies.map((m) => m.category))];
  const collections = ["All", "TV Shows", "Movies"];

  collections.forEach((collection) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "filter-chip" + (collection === "All" ? " is-active" : "");
    chip.textContent = collection;

    chip.addEventListener("click", () => {
      activeCollection = collection;
      collectionFiltersEl.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      onChange(activeCategory);
    });

    collectionFiltersEl.appendChild(chip);
  });

  categories.forEach((category) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "filter-chip" + (category === "All" ? " is-active" : "");
    chip.textContent = category;

    chip.addEventListener("click", () => {
      activeCategory = category;
      filtersEl.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      onChange(activeCategory);
    });

    filtersEl.appendChild(chip);
  });
}

/**
 * @returns {string} the currently selected category ("All" by default)
 */
export function getActiveCategory() {
  return activeCategory;
}

/**
 * @returns {string} the currently selected collection ("All" by default)
 */
export function getActiveCollection() {
  return activeCollection;
}
