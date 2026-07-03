/**
 * library.js
 * ---------------------------------------------------------------------------
 * Builds the movie grid on the homepage: renders one card per movie,
 * wires up click-to-play navigation, and applies the combined
 * category + search-query visibility filter.
 *
 * Cards are built once, up front, then shown/hidden on filter changes
 * rather than re-rendered on every keystroke — this keeps typing in the
 * search box perfectly smooth even with hundreds of titles.
 * ---------------------------------------------------------------------------
 */

import { escapeHtml, byId } from "./utils.js";
import { thumbnailFor } from "./thumbnails.js";
import { playIconSvg } from "./ui.js";

let cardEntries = []; // [{ movie, el }] — populated by initLibrary()

/**
 * Renders every movie as a card into #movieGrid and wires up navigation.
 * Call once on startup.
 * @param {object[]} movies - the full MOVIES array
 * @param {(movieId: string) => void} onSelect - called with a movie's id
 *   when its card is clicked (router.js wires this to navigation)
 */
export function initLibrary(movies, onSelect) {
  const grid = byId("movieGrid");

  cardEntries = movies.map((movie) => {
    const card = createMovieCard(movie, onSelect);
    grid.appendChild(card);
    return { movie, el: card };
  });
}

/**
 * Builds a single movie card <button> element.
 * @param {object} movie
 * @param {(movieId: string) => void} onSelect
 * @returns {HTMLButtonElement}
 */
function createMovieCard(movie, onSelect) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "movie-card";
  card.setAttribute("aria-label", "Play " + movie.title + " (" + movie.runtime + ")");

  card.innerHTML =
    '<div class="movie-card__thumb-wrap">' +
    '<img src="' + (movie.thumbnail || thumbnailFor(movie)) + '" alt="" loading="lazy" decoding="async" />' +
    '<span class="movie-card__category">' + escapeHtml(movie.category) + "</span>" +
    '<span class="movie-card__runtime">' + movie.runtime + "</span>" +
    '<div class="movie-card__play-badge" aria-hidden="true">' +
    '<span class="movie-card__play-icon">' + playIconSvg() + "</span>" +
    "</div>" +
    "</div>" +
    '<div class="movie-card__body">' +
    '<h3 class="movie-card__title">' + escapeHtml(movie.title) + "</h3>" +
    (movie.description ? '<p class="movie-card__desc">' + escapeHtml(movie.description) + "</p>" : "") +
    "</div>";

  card.addEventListener("click", () => onSelect(movie.id));

  return card;
}

/**
 * Applies a category + search-query filter to the rendered cards, and
 * updates the empty-state message and result count. Called by app.js
 * whenever either filters.js or search.js reports a change.
 * @param {string} category - "All" or an exact category name
 * @param {string} query - free-text search query (already trimmed)
 * @param {string} collection - "All", "TV Shows", or "Movies"
 * @returns {{ visible: number, total: number }}
 */
export function applyLibraryFilters(category, query, collection = "All") {
  const emptyState = byId("emptyState");
  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;

  cardEntries.forEach(({ movie, el }) => {
    const matchesCategory = category === "All" || movie.category === category;
    const matchesCollection = collection === "All" || movie.collection === collection;
    const seasonLabel = movie.season ? " season " + movie.season + " s" + movie.season : "";
    const episodeLabel = movie.episode ? " episode " + movie.episode + " e" + movie.episode : "";
    const haystack = (movie.title + " " + movie.description + " " + movie.category + " " + (movie.collection || "") + " " + (movie.series || "") + seasonLabel + episodeLabel).toLowerCase();
    const matchesQuery = normalizedQuery === "" || haystack.includes(normalizedQuery);
    const visible = matchesCollection && matchesCategory && matchesQuery;
    el.style.display = visible ? "" : "none";
    if (visible) visibleCount++;
  });

  emptyState.style.display = visibleCount === 0 ? "block" : "none";

  return { visible: visibleCount, total: cardEntries.length };
}

/**
 * @returns {number} total number of movies currently rendered
 */
export function getLibrarySize() {
  return cardEntries.length;
}
