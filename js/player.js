/**
 * player.js
 * ---------------------------------------------------------------------------
 * Owns everything about the video player page: loading a movie's source
 * into the <video> element, updating the title/runtime/description, the
 * "video file not found yet" notice, and the two controls that native
 * HTML5 <video controls> doesn't reliably expose across browsers —
 * playback speed and picture-in-picture.
 *
 * Native <video controls> already provides play/pause, the seek bar,
 * volume, and fullscreen, and resizes automatically with the responsive
 * .player-frame — see css/style.css.
 *
 * FUTURE-PROOFING NOTES
 * - Subtitles: a <track> element could be added inside #video in
 *   index.html, sourced from a future `movie.subtitles` field.
 * - Continue watching: `video.currentTime` could be periodically saved
 *   (e.g. to localStorage, or POSTed to workers/api.js) and restored
 *   here on load.
 * ---------------------------------------------------------------------------
 */

import { escapeHtml, byId } from "./utils.js";
import { thumbnailFor } from "./thumbnails.js";
import { playIconSvg } from "./ui.js";
import { goToMovie } from "./router.js";
import { getMovieProgress, saveMovieProgress } from "./watchProgress.js";

let movies = []; // set on init, used to look up a movie by id
let activeMovieId = "";
let shouldRestoreProgress = false;

// Cached DOM references, populated in initPlayer()
let video, playerTitle, playerRuntime, playerCategory, playerDesc, missingNotice, speedSelect, pipButton, playerFrame, controlsExtra, relatedRail;

/**
 * Wires up the player page. Call once on startup.
 * @param {object[]} movieList - the full MOVIES array, for id lookups
 */
export function initPlayer(movieList) {
  movies = movieList;

  video = byId("video");
  playerTitle = byId("playerTitle");
  playerRuntime = byId("playerRuntime");
  playerCategory = byId("playerCategory");
  playerDesc = byId("playerDesc");
  missingNotice = byId("missingNotice");
  speedSelect = byId("speedSelect");
  pipButton = byId("pipButton");
  playerFrame = byId("playerFrame");
  controlsExtra = document.querySelector(".player-controls-extra");
  relatedRail = byId("relatedRail");

  initSpeedControl();
  initPictureInPicture();
  initProgressTracking();
}

/**
 * Playback speed isn't exposed consistently across browsers inside the
 * native control bar, so a plain <select> drives `video.playbackRate`.
 */
function initSpeedControl() {
  speedSelect.addEventListener("change", () => {
    video.playbackRate = parseFloat(speedSelect.value);
  });
}

/**
 * Wires the picture-in-picture button, disabling it gracefully on
 * browsers that don't support the API at all.
 */
function initPictureInPicture() {
  if (!document.pictureInPictureEnabled) {
    pipButton.disabled = true;
    pipButton.title = "Picture-in-picture isn't supported in this browser";
    return;
  }

  pipButton.addEventListener("click", async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      // Picture-in-picture can fail if the video has no data loaded yet,
      // or the browser blocks it for other reasons — not worth
      // surfacing as an error to the person watching.
      console.warn("Picture-in-picture unavailable:", err);
    }
  });
}

/**
 * Loads the given movie's video/title/description into the player.
 * Called by router.js whenever the route becomes #/movie/<id>.
 * @param {string} movieId
 */
export function loadMovie(movieId) {
  const movie = movies.find((m) => m.id === movieId);

  missingNotice.classList.remove("is-visible");
  speedSelect.value = "1";
  activeMovieId = movieId;
  shouldRestoreProgress = true;

  if (!movie) {
    showNotFoundState();
    return;
  }

  playerFrame.style.display = "";
  controlsExtra.style.display = "";
  playerRuntime.style.display = "";
  playerCategory.style.display = "";

  document.title = movie.title + " — Queen Tanya's Movie Night";
  playerTitle.textContent = movie.title;
  playerRuntime.textContent = movie.runtime;
  playerCategory.textContent = movie.category;
  playerDesc.textContent = movie.description || "";
  renderRelatedTitles(movie);

  video.pause();
  video.playbackRate = 1;
  video.src = movie.video;
  video.setAttribute("aria-label", movie.title);
  video.load();

  // If the placeholder video path doesn't actually exist yet, show a
  // friendly notice instead of a cryptic browser error.
  video.onerror = () => {
    missingNotice.classList.add("is-visible");
  };
}

function initProgressTracking() {
  video.addEventListener("loadedmetadata", () => {
    if (!shouldRestoreProgress) return;

    const progress = getMovieProgress(activeMovieId);
    if (progress && progress.currentTime > 8 && progress.currentTime < video.duration - 8) {
      video.currentTime = progress.currentTime;
    }

    shouldRestoreProgress = false;
  });

  video.addEventListener("timeupdate", () => {
    saveMovieProgress(activeMovieId, video.currentTime, video.duration);
  });

  video.addEventListener("pause", () => {
    saveMovieProgress(activeMovieId, video.currentTime, video.duration);
  });

  video.addEventListener("ended", () => {
    saveMovieProgress(activeMovieId, video.duration, video.duration);
  });
}

function renderRelatedTitles(movie) {
  let related = movies
    .filter((candidate) => candidate.id !== movie.id && candidate.category === movie.category)
    .slice(0, 12);

  if (related.length < 6) {
    related = [
      ...related,
      ...movies.filter((candidate) => candidate.id !== movie.id && candidate.category !== movie.category).slice(0, 12 - related.length),
    ];
  }

  relatedRail.innerHTML = "";
  related.forEach((relatedMovie) => relatedRail.appendChild(createRelatedCard(relatedMovie)));
}

function createRelatedCard(movie) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "rail-card";
  card.setAttribute("aria-label", "Play " + movie.title);
  card.innerHTML =
    '<div class="rail-card__poster">' +
    '<img src="' + (movie.thumbnail || thumbnailFor(movie)) + '" alt="" loading="lazy" decoding="async" />' +
    '<span class="rail-card__play">' + playIconSvg(18) + "</span>" +
    "</div>" +
    '<div class="rail-card__body">' +
    '<h3>' + escapeHtml(movie.title) + "</h3>" +
    '<p><span>' + escapeHtml(movie.category) + "</span><span>" + escapeHtml(movie.runtime) + "</span></p>" +
    "</div>";

  card.addEventListener("click", () => goToMovie(movie.id));
  return card;
}

/**
 * Renders a graceful "movie not found" state instead of a broken page,
 * used when a hash links to an id that doesn't exist in MOVIES.
 */
function showNotFoundState() {
  playerTitle.textContent = "Movie not found";
  playerDesc.textContent = "That title isn't in the library. Head back and pick another one.";
  playerRuntime.style.display = "none";
  playerCategory.style.display = "none";
  playerFrame.style.display = "none";
  controlsExtra.style.display = "none";
  relatedRail.innerHTML = "";
  video.removeAttribute("src");
}
