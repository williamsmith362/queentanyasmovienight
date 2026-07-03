/**
 * watchProgress.js
 * ---------------------------------------------------------------------------
 * Local continue-watching storage. The shape is intentionally small and easy
 * to replace with a future backend or profile-aware watch history service.
 * ---------------------------------------------------------------------------
 */

const STORAGE_KEY = "qtmn.watchProgress.v1";

export function getProgressMap() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (err) {
    return {};
  }
}

export function getMovieProgress(movieId) {
  return getProgressMap()[movieId] || null;
}

export function saveMovieProgress(movieId, currentTime, duration) {
  if (!movieId || !Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return;

  const percent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
  const progressMap = getProgressMap();

  if (percent >= 94 || currentTime < 8) {
    delete progressMap[movieId];
  } else {
    progressMap[movieId] = {
      currentTime,
      duration,
      percent,
      updatedAt: Date.now(),
    };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
  window.dispatchEvent(new CustomEvent("qtmn:progress-updated"));
}

export function getContinueWatchingMovies(movies, limit = 12) {
  const progressMap = getProgressMap();
  return movies
    .filter((movie) => progressMap[movie.id])
    .sort((a, b) => progressMap[b.id].updatedAt - progressMap[a.id].updatedAt)
    .slice(0, limit)
    .map((movie) => ({ movie, progress: progressMap[movie.id] }));
}
