/**
 * thumbnails.js
 * ---------------------------------------------------------------------------
 * Generates small, clean gradient thumbnail images entirely on the client
 * (as inline SVG data URIs) — no external image requests, so nothing
 * breaks if you're offline and no third-party network calls are made.
 *
 * FUTURE-PROOFING NOTE
 * Any movie object can set a real `thumbnail` field (e.g. a path into
 * assets/posters/ or a Cloudflare R2 URL) to bypass generation entirely —
 * see library.js, which always checks `movie.thumbnail` first. This
 * module is only ever a fallback.
 * ---------------------------------------------------------------------------
 */

import { escapeXml, shadeColor } from "./utils.js";

/**
 * Builds a data: URI containing a simple two-stop gradient SVG with the
 * episode/movie's short label centered on it.
 * @param {object} movie - a MOVIES entry
 * @returns {string} a data:image/svg+xml URI usable as an <img src>
 */
export function thumbnailFor(movie) {
  const label = getShortLabel(movie);
  const base = movie.accent || "#8a6672";

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="' + base + '"/>' +
    '<stop offset="100%" stop-color="' + shadeColor(base, -18) + '"/>' +
    "</linearGradient></defs>" +
    '<rect width="400" height="600" fill="url(#g)"/>' +
    '<text x="200" y="290" font-family="Poppins, sans-serif" font-size="34" ' +
    'font-weight="600" fill="rgba(255,255,255,0.92)" text-anchor="middle">' +
    escapeXml(label) +
    "</text>" +
    "</svg>";

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/**
 * For episodic shows, the full title includes "S1E1 — ", which is too
 * long to render nicely on a thumbnail — this trims it down to just the
 * episode name/number. Standalone movies use their title as-is.
 * @param {object} movie
 * @returns {string}
 */
function getShortLabel(movie) {
  const isEpisodic = movie.category === "Vampire Diaries" || movie.category === "Love Island";
  if (!isEpisodic) return movie.title;
  return movie.title.split(" — ")[1] || movie.title;
}
