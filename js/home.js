/**
 * home.js
 * ---------------------------------------------------------------------------
 * Personalized streaming homepage rows and rotating hero.
 * ---------------------------------------------------------------------------
 */

import { escapeHtml, byId } from "./utils.js";
import { thumbnailFor } from "./thumbnails.js";
import { playIconSvg } from "./ui.js";
import { getContinueWatchingMovies, getMovieProgress } from "./watchProgress.js";

const HERO_IDS = ["coraline", "tvd-s01e01", "li-s07e01", "tvd-s03e14"];
let heroMovies = [];
let heroIndex = 0;
let selectMovie = () => {};
let allMovies = [];

export function initHome(movies, onSelect) {
  allMovies = movies;
  selectMovie = onSelect;
  heroMovies = HERO_IDS.map((id) => movies.find((movie) => movie.id === id)).filter(Boolean);

  renderGreeting();
  renderHero();
  renderRows();
  initLoadingScreen();

  byId("heroWatchButton").addEventListener("click", () => {
    const movie = heroMovies[heroIndex];
    if (movie) selectMovie(movie.id);
  });

  if (heroMovies.length > 1) {
    window.setInterval(() => {
      heroIndex = (heroIndex + 1) % heroMovies.length;
      renderHero();
    }, 7000);
  }

  window.addEventListener("qtmn:progress-updated", renderContinueWatching);
}

function renderGreeting() {
  const hour = new Date().getHours();
  const greeting = hour >= 17 || hour < 5 ? "Good Evening Tanya 🌙" : "Good Day Tanya 💖";
  byId("heroGreeting").textContent = greeting;
}

function renderHero() {
  const movie = heroMovies[heroIndex];
  if (!movie) return;

  const art = byId("heroArt");
  art.style.backgroundImage = "url('" + (movie.thumbnail || thumbnailFor(movie)) + "')";
  byId("heroTitle").textContent = movie.title;
  byId("heroSubtitle").textContent = movie.description || "Ready for another movie night?";
}

function renderRows() {
  renderContinueWatching();
  renderRail("featuredRail", pickByIds(["coraline", "tvd-s01e01", "tvd-s02e07", "li-s07e01", "tvd-s04e23", "li-s06e01"]));
  renderRail("becauseRail", pickByIds(["coraline", "corpse-bride", "paranorman", "nightmare-before-christmas", "beautiful-creatures", "tvd-s01e07", "tvd-s03e05"]));
  renderRail("recentRail", allMovies.slice(-16).reverse());
  renderRail("loveIslandRail", allMovies.filter((movie) => movie.category === "Love Island" || movie.category === "Love Island UK" || movie.category === "Perfect Match").slice(-18).reverse());
  renderRail("vampireRail", allMovies.filter((movie) => movie.category === "Vampire Diaries" || movie.category === "The Originals" || movie.category === "Legacies").slice(0, 18));
  renderRail("moviesRail", allMovies.filter((movie) => movie.collection === "Movies"));
}

function renderContinueWatching() {
  const section = byId("continueWatchingSection");
  const rail = byId("continueWatchingRail");
  const entries = getContinueWatchingMovies(allMovies);

  rail.innerHTML = "";
  section.hidden = entries.length === 0;
  entries.forEach(({ movie, progress }) => rail.appendChild(createRailCard(movie, progress)));
}

function renderRail(id, movies) {
  const rail = byId(id);
  rail.innerHTML = "";
  movies.forEach((movie) => rail.appendChild(createRailCard(movie, getMovieProgress(movie.id))));
}

function createRailCard(movie, progress) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "rail-card";
  card.setAttribute("aria-label", "Play " + movie.title);

  const progressMarkup = progress
    ? '<div class="rail-card__progress" aria-hidden="true"><span style="width: ' + Math.round(progress.percent) + '%"></span></div>'
    : "";

  card.innerHTML =
    '<div class="rail-card__poster">' +
    '<img src="' + (movie.thumbnail || thumbnailFor(movie)) + '" alt="" loading="lazy" decoding="async" />' +
    '<span class="rail-card__play">' + playIconSvg(18) + "</span>" +
    progressMarkup +
    "</div>" +
    '<div class="rail-card__body">' +
    '<h3>' + escapeHtml(movie.title) + "</h3>" +
    '<p><span>' + escapeHtml(movie.category) + "</span><span>" + escapeHtml(movie.runtime) + "</span></p>" +
    "</div>";

  card.addEventListener("click", () => selectMovie(movie.id));
  return card;
}

function pickByIds(ids) {
  return ids.map((id) => allMovies.find((movie) => movie.id === id)).filter(Boolean);
}

function initLoadingScreen() {
  window.setTimeout(() => {
    byId("loadingScreen").classList.add("is-hidden");
  }, 650);
}
