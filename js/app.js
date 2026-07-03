/**
 * app.js
 * ---------------------------------------------------------------------------
 * Application entry point. Loaded as a module from index.html.
 *
 * This file doesn't contain any feature logic itself — it just imports
 * every module, initializes them in the right order, and wires their
 * callbacks together. If you're trying to understand how a click on a
 * movie card ends up loading a video, this is the file that connects
 * those dots:
 *
 *   library card click
 *     -> router.goToMovie(id)
 *       -> URL hash changes
 *         -> router's hashchange listener fires
 *           -> player.loadMovie(id)
 *
 * and
 *
 *   search input / filter chip changes
 *     -> library.applyLibraryFilters(category, query)
 *       -> search.renderSearchMeta(visible, total)
 * ---------------------------------------------------------------------------
 */

import { MOVIES } from "./movies.js";
import { initRouter, goToMovie } from "./router.js";
import { initPlayer, loadMovie } from "./player.js";
import { initLibrary, applyLibraryFilters } from "./library.js";
import { initFilters, getActiveCategory, getActiveCollection } from "./filters.js";
import { initSearch, getQuery, renderSearchMeta } from "./search.js";
import { initHome } from "./home.js";
import { initEpisodeFinder } from "./episodeFinder.js";

function main() {
  // Personalized streaming rows and cinematic hero.
  initHome(MOVIES, goToMovie);

  // Render the grid and wire card clicks to navigation.
  initLibrary(MOVIES, goToMovie);

  // Category chips and the search box both report changes here; either
  // one changing re-applies the combined filter over the same card set.
  initFilters(MOVIES, () => refreshVisibleMovies());
  initSearch(() => refreshVisibleMovies());
  initEpisodeFinder(MOVIES, goToMovie);
  refreshVisibleMovies();

  // Player page setup (speed control, picture-in-picture, etc).
  initPlayer(MOVIES);

  // Router last: it immediately evaluates the current URL hash, so
  // everything it might trigger (like loadMovie) needs to already exist.
  initRouter((movieId) => loadMovie(movieId));
}

/**
 * Re-applies the current category + search filter to the movie grid and
 * updates the result-count line. Called any time either input changes.
 */
function refreshVisibleMovies() {
  const { visible, total } = applyLibraryFilters(getActiveCategory(), getQuery(), getActiveCollection());
  renderSearchMeta(visible, total);
}

document.addEventListener("DOMContentLoaded", main);
