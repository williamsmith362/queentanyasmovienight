/**
 * episodeFinder.js
 * ---------------------------------------------------------------------------
 * Simple TV show -> season -> episode picker for larger collections.
 * ---------------------------------------------------------------------------
 */

import { byId } from "./utils.js";

let movies = [];
let onSelectMovie = () => {};

export function initEpisodeFinder(movieList, onSelect) {
  movies = movieList.filter((movie) => movie.collection === "TV Shows" && movie.series);
  onSelectMovie = onSelect;

  byId("showSelect").addEventListener("change", renderSeasons);
  byId("seasonSelect").addEventListener("change", renderEpisodes);
  byId("episodeGoButton").addEventListener("click", goToSelectedEpisode);

  renderShows();
}

function renderShows() {
  const showSelect = byId("showSelect");
  const shows = [...new Set(movies.map((movie) => movie.series))].sort();
  showSelect.innerHTML = shows.map((show) => '<option value="' + show + '">' + show + "</option>").join("");
  renderSeasons();
}

function renderSeasons() {
  const show = byId("showSelect").value;
  const seasonSelect = byId("seasonSelect");
  const seasons = [...new Set(movies.filter((movie) => movie.series === show).map((movie) => movie.season))].sort((a, b) => a - b);
  seasonSelect.innerHTML = seasons.map((season) => '<option value="' + season + '">Season ' + season + "</option>").join("");
  renderEpisodes();
}

function renderEpisodes() {
  const show = byId("showSelect").value;
  const season = Number(byId("seasonSelect").value);
  const episodeSelect = byId("episodeSelect");
  const episodes = movies
    .filter((movie) => movie.series === show && movie.season === season)
    .sort((a, b) => a.episode - b.episode);

  episodeSelect.innerHTML = episodes
    .map((movie) => '<option value="' + movie.id + '">Episode ' + movie.episode + " — " + movie.title.replace(/^.*—\s*/, "") + "</option>")
    .join("");
}

function goToSelectedEpisode() {
  const movieId = byId("episodeSelect").value;
  if (movieId) onSelectMovie(movieId);
}
