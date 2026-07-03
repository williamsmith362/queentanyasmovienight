/**
 * router.js
 * ---------------------------------------------------------------------------
 * A tiny hash-based router for this single-page app. Two "routes":
 *
 *   #/             -> library view
 *   #/movie/<id>   -> player view, loading the given movie
 *
 * Using the URL hash (rather than a second HTML page) means the browser's
 * back/forward buttons work correctly and a specific movie can be linked
 * to directly, while still only ever loading one HTML file.
 * ---------------------------------------------------------------------------
 */

import { byId, qsa } from "./utils.js";

const HASH_MOVIE_PATTERN = /^#\/movie\/(.+)$/;

let onNavigateToPlayer = null; // (movieId: string) => void, set by app.js

/**
 * Wires up hashchange listening and every nav/back button on the page.
 * @param {(movieId: string) => void} handlePlayerRoute - called with the
 *   requested movie id whenever the route becomes #/movie/<id>
 */
export function initRouter(handlePlayerRoute) {
  onNavigateToPlayer = handlePlayerRoute;

  window.addEventListener("hashchange", route);

  // Any element marked data-nav="home" (brand logo, "Home" link, the
  // player page's "Back to Library" button) returns to the library.
  qsa("[data-nav='home']").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.hash = "#/";
    });
  });

  // The "Movie Library" nav link also scrolls down to the grid, in case
  // the person is already on the homepage.
  const libraryNavBtns = qsa("[data-nav='library']");
  libraryNavBtns.forEach((libraryNavBtn) => {
    libraryNavBtn.addEventListener("click", () => {
      window.location.hash = "#/";
      window.setTimeout(() => {
        byId("library").scrollIntoView({ behavior: "smooth" });
      }, 80);
    });
  });

  // Handle whatever route is in the URL at load time (e.g. a bookmarked
  // or shared link straight to a specific movie).
  route();
}

/**
 * Reads the current URL hash and shows the matching view.
 */
function route() {
  const match = window.location.hash.match(HASH_MOVIE_PATTERN);
  if (match) {
    showPlayerView(decodeURIComponent(match[1]));
  } else {
    showLibraryView();
  }
}

/**
 * Navigates programmatically to a movie's player page. Used by
 * library.js when a card is clicked.
 * @param {string} movieId
 */
export function goToMovie(movieId) {
  window.location.hash = "#/movie/" + encodeURIComponent(movieId);
}

function showLibraryView() {
  byId("libraryView").classList.add("is-active");
  byId("playerView").classList.remove("is-active");
  byId("navHome").classList.add("is-active");
  document.title = "Queen Tanya's Movie Night";
  window.scrollTo(0, 0);
}

function showPlayerView(movieId) {
  byId("libraryView").classList.remove("is-active");
  byId("playerView").classList.add("is-active");
  byId("navHome").classList.remove("is-active");
  if (onNavigateToPlayer) onNavigateToPlayer(movieId);
  window.scrollTo(0, 0);
}
