/**
 * workers/api.js
 * ---------------------------------------------------------------------------
 * A Cloudflare Worker stub for future backend features. The site itself is
 * fully static right now (see index.html + js/movies.js) and needs no
 * backend to run — this file exists so the next features on the roadmap
 * have a clear, obvious place to land:
 *
 *   - User accounts / login / multiple profiles
 *   - Favorites and watch history (currently would live in the browser
 *     via localStorage; a Worker + storage backend lets it sync across
 *     devices instead)
 *   - "Continue watching" progress, persisted server-side
 *   - Serving/streaming video from Cloudflare R2 instead of a local
 *     /videos folder, with signed URLs so files aren't public
 *
 * None of this is wired up to the frontend yet. Deploy it separately with
 * `npm run deploy:worker` (see package.json / README) once you're ready
 * to build one of the features above, then have js/app.js call it via
 * `fetch("https://<your-worker>.workers.dev/api/...")`.
 * ---------------------------------------------------------------------------
 */

/**
 * Shared CORS headers for every response. Loosen/tighten the
 * Access-Control-Allow-Origin value once this Worker is actually in use —
 * "*" is fine for local development, but you'll likely want to lock it to
 * your Cloudflare Pages domain in production.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  /**
   * @param {Request} request
   * @param {object} env - bindings configured in wrangler.toml
   *   (e.g. env.MOVIES_BUCKET for R2, env.USERS_KV for a KV namespace)
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Preflight requests for any future POST/PUT endpoints.
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/api/health") {
      return json({ status: "ok", service: "queen-tanyas-movie-night-api" });
    }

    // ---- Future endpoint stubs -------------------------------------------
    // Uncomment and implement as each feature is built. Left as comments
    // (rather than deleted) so the intended shape of the API is obvious.

    // if (url.pathname === "/api/favorites" && request.method === "GET") {
    //   // return the signed-in user's favorited movie ids from KV/D1
    // }

    // if (url.pathname === "/api/favorites" && request.method === "POST") {
    //   // toggle a favorite for the signed-in user
    // }

    // if (url.pathname === "/api/watch-history" && request.method === "POST") {
    //   // record { movieId, positionSeconds } for "continue watching"
    // }

    // if (url.pathname.startsWith("/api/stream/")) {
    //   // generate a short-lived signed URL for a video stored in R2
    //   // (env.MOVIES_BUCKET.get(...) + a signed URL helper)
    // }

    return json({ error: "Not found" }, 404);
  },
};

/**
 * Small helper to return a JSON response with the shared CORS headers.
 * @param {unknown} data
 * @param {number} [status=200]
 * @returns {Response}
 */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}
