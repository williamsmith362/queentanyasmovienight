/**
 * movies.js
 * ---------------------------------------------------------------------------
 * The entire movie & TV library lives in this one module. It exports a
 * single flat array, MOVIES, that every other module reads from.
 *
 * Three collections are pre-built below:
 *   1. Vampire Diaries — all 8 seasons, all 171 real episode titles
 *   2. Love Island (US) — seasons 1-7 (234 episodes). The real show
 *      doesn't give individual episodes unique titles (they're
 *      officially just "Episode 1", "Episode 2", etc.), so that's what's
 *      used here too — it'll match what you find when sourcing files.
 *   3. Coraline — a single movie entry
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD A MOVIE
 * ---------------------------------------------------------------------------
 * Push a plain object onto MOVIES with this shape:
 *
 *   {
 *     id: "unique-id",              // lowercase, no spaces — used in the URL
 *     title: "Display Title",
 *     category: "Some Category",    // groups it under a filter chip
 *     description: "One or two sentences.",
 *     video: "videos/your-file.mp4",// path to the video file
 *     runtime: "1:32:00",           // shown on the card + player page
 *     accent: "#ec6fa0",            // hex color used for its thumbnail
 *   }
 *
 * See the bottom of this file for the Coraline entry as a working example.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD A TV SHOW (with seasons/episodes)
 * ---------------------------------------------------------------------------
 * Follow the Vampire Diaries / Love Island pattern below: store your show's
 * episode titles (or just episode counts, if it doesn't have unique
 * titles) in a small data structure, then loop over it to build MOVIES
 * entries with consistent ids and video paths. This keeps hundreds of
 * episodes maintainable without hand-writing each object.
 *
 * ---------------------------------------------------------------------------
 * FUTURE-PROOFING NOTES
 * ---------------------------------------------------------------------------
 * This flat, plain-object shape is intentionally simple so it can later be
 * swapped for data fetched from a backend (see workers/api.js) without
 * changing any other module — library.js, filters.js, search.js, and
 * player.js only ever consume the MOVIES array, never this file's
 * internals. When that day comes, planned additions to each movie object
 * might include: `posterUrl` (real artwork, see assets/posters/),
 * `favorite: boolean`, `watchProgress: number` (continue watching),
 * `subtitles: [{ lang, url }]`, and `addedAt` (for sorting/recently added).
 * ---------------------------------------------------------------------------
 */

import { pad2 } from "./utils.js";

// ---- Vampire Diaries: real episode titles, season by season ----
const TVD_SEASONS = [
  ["Pilot", "The Night of the Comet", "Friday Night Bites", "Family Ties", "You're Undead to Me", "Lost Girls", "Haunted", "162 Candles", "History Repeating", "The Turning Point", "Bloodlines", "Unpleasantville", "Children of the Damned", "Fool Me Once", "A Few Good Men", "There Goes the Neighborhood", "Let the Right One In", "Under Control", "Miss Mystic Falls", "Blood Brothers", "Isobel", "Founder's Day"],
  ["The Return", "Brave New World", "Bad Moon Rising", "Memory Lane", "Kill or Be Killed", "Plan B", "Masquerade", "Rose", "Katerina", "The Sacrifice", "By the Light of the Moon", "The Descent", "Daddy Issues", "Crying Wolf", "The Dinner Party", "The House Guest", "Know Thy Enemy", "The Last Dance", "Klaus", "The Last Day", "The Sun Also Rises", "As I Lay Dying"],
  ["The Birthday", "The Hybrid", "The End of the Affair", "Disturbing Behavior", "The Reckoning", "Smells Like Teen Spirit", "Ghost World", "Ordinary People", "Homecoming", "The New Deal", "Our Town", "The Ties That Bind", "Bringing Out the Dead", "Dangerous Liaisons", "All My Children", "1912", "Break On Through", "The Murder of One", "Heart of Darkness", "Do Not Go Gentle", "Before Sunset", "The Departed"],
  ["Growing Pains", "Memorial", "The Rager", "The Five", "The Killer", "We All Go a Little Mad Sometimes", "My Brother's Keeper", "We'll Always Have Bourbon Street", "O Come, All Ye Faithful", "After School Special", "Catch Me If You Can", "A View to a Kill", "Into the Wild", "Down the Rabbit Hole", "Stand by Me", "Bring It On", "Because the Night", "American Gothic", "Pictures of You", "The Originals", "She's Come Undone", "The Walking Dead", "Graduation"],
  ["I Know What You Did Last Summer", "True Lies", "Original Sin", "For Whom the Bell Tolls", "Monster's Ball", "Handle with Care", "Death and the Maiden", "Dead Man on Campus", "The Cell", "Fifty Shades of Grayson", "500 Years of Solitude", "The Devil Inside", "Total Eclipse of the Heart", "No Exit", "Gone Girl", "While You Were Sleeping", "Rescue Me", "Resident Evil", "Man on Fire", "What Lies Beneath", "Promised Land", "Home"],
  ["I'll Remember", "Yellow Ledbetter", "Welcome to Paradise", "Black Hole Sun", "The World Has Turned and Left Me Here", "The More You Ignore Me, the Closer I Get", "Do You Remember the First Time?", "Fade Into You", "I Alone", "Christmas Through Your Eyes", "Woke Up with a Monster", "Prayer for the Dying", "The Day I Tried to Live", "Stay", "Let Her Go", "The Downward Spiral", "A Bird in a Gilded Cage", "I Never Could Love Like That", "Because", "I'd Leave My Happy Home for You", "I'll Wed You in the Golden Summertime", "I'm Thinking of You All the While"],
  ["Day One of Twenty-Two Thousand, Give or Take", "Never Let Me Go", "Age of Innocence", "I Carry Your Heart with Me", "Live Through This", "Best Served Cold", "Mommie Dearest", "Hold Me, Thrill Me, Kiss Me, Kill Me", "Cold as Ice", "Hell Is Other People", "Things We Lost in the Fire", "Postcards from the Edge", "This Woman's Work", "Moonlight on the Bayou", "I Would for You", "Days of Future Past", "I Went to the Woods", "One Way or Another", "Somebody That I Used to Know", "Kill 'Em All", "Requiem for a Dream", "Gods and Monsters"],
  ["Hello, Brother", "Today Will Be Different", "You Decided That I Was Worth Saving", "An Eternity of Misery", "Coming Home Was a Mistake", "Detoured on Some Random Backwoods Path to Hell", "The Next Time I Hurt Somebody, It Could Be You", "We Have History Together", "The Simple Intimacy of the Near Touch", "Nostalgia's a Bitch", "You Made a Choice to Be Good", "What Are You?", "The Lies Will Catch Up to You", "It's Been a Hell of a Ride", "We're Planning a June Wedding", "I Was Feeling Epic"],
];

// ---- Love Island (US): official episode counts per season, seasons 1-7 ----
// The real show doesn't title individual episodes, so "Episode N" matches
// what you'll actually find when naming your files.
const LOVE_ISLAND_SEASON_EPISODE_COUNTS = [22, 34, 29, 38, 37, 37, 37];

const RELATED_SHOWS = [
  {
    slug: "the-originals",
    title: "The Originals",
    category: "The Originals",
    collection: "TV Shows",
    season: 1,
    episodes: ["Always and Forever", "House of the Rising Son", "Tangled Up in Blue", "Girl in New Orleans", "Sinners and Saints", "Fruit of the Poisoned Tree"],
    runtime: "42:00",
    accent: "#463052",
    description: "A moody supernatural drama for nights when Mystic Falls needs a little New Orleans magic.",
  },
  {
    slug: "legacies",
    title: "Legacies",
    category: "Legacies",
    collection: "TV Shows",
    season: 1,
    episodes: ["This Is the Part Where You Run", "Some People Just Want to Watch the World Burn", "We're Being Punked, Pedro", "Hope Is Not the Goal", "Malivore", "Mombie Dearest"],
    runtime: "42:00",
    accent: "#59426b",
    description: "A supernatural school story with witches, vampires, family secrets, and plenty of drama.",
  },
  {
    slug: "love-island-uk",
    title: "Love Island UK",
    category: "Love Island UK",
    collection: "TV Shows",
    season: 1,
    episodes: ["Episode 1", "Episode 2", "Episode 3", "Episode 4", "Episode 5", "Episode 6"],
    runtime: "45:00",
    accent: "#dd8a66",
    description: "More villa flirting, recouplings, and sunshine drama for the Love Island shelf.",
  },
  {
    slug: "perfect-match",
    title: "Perfect Match",
    category: "Perfect Match",
    collection: "TV Shows",
    season: 1,
    episodes: ["Love Is the End Game", "It's About the Chase", "Strike a Match", "Unfinished Business", "Blind-Sided", "Love Is Savage"],
    runtime: "48:00",
    accent: "#c96f91",
    description: "A glossy reality dating pick with competition energy and messy romantic choices.",
  },
];

const RELATED_MOVIES = [
  {
    id: "corpse-bride",
    title: "Corpse Bride",
    category: "Movies",
    collection: "Movies",
    description: "A gothic stop-motion romance with eerie sweetness and fairytale melancholy.",
    video: "videos/corpse-bride.mp4",
    runtime: "1:17:00",
    accent: "#3d4e68",
  },
  {
    id: "paranorman",
    title: "ParaNorman",
    category: "Movies",
    collection: "Movies",
    description: "A spooky, heartfelt animated adventure about ghosts, courage, and being different.",
    video: "videos/paranorman.mp4",
    runtime: "1:32:00",
    accent: "#516a55",
  },
  {
    id: "nightmare-before-christmas",
    title: "The Nightmare Before Christmas",
    category: "Movies",
    collection: "Movies",
    description: "A cozy-dark musical fantasy with a handcrafted world and a little haunted charm.",
    video: "videos/nightmare-before-christmas.mp4",
    runtime: "1:16:00",
    accent: "#2c3447",
  },
  {
    id: "beautiful-creatures",
    title: "Beautiful Creatures",
    category: "Movies",
    collection: "Movies",
    description: "Southern gothic romance, family curses, and supernatural secrets.",
    video: "videos/beautiful-creatures.mp4",
    runtime: "2:04:00",
    accent: "#68465b",
  },
];

/** The fully assembled library. Every other module imports from here. */
export const MOVIES = [];

// Build Vampire Diaries entries
TVD_SEASONS.forEach((episodes, seasonIdx) => {
  const season = seasonIdx + 1;
  episodes.forEach((title, epIdx) => {
    const episode = epIdx + 1;
    MOVIES.push({
      id: "tvd-s" + pad2(season) + "e" + pad2(episode),
      title: "S" + season + "E" + episode + " — " + title,
      category: "Vampire Diaries",
      collection: "TV Shows",
      series: "Vampire Diaries",
      season,
      episode,
      description: "Vampire Diaries, Season " + season + ", Episode " + episode + ".",
      video: "videos/vampire-diaries/s" + pad2(season) + "e" + pad2(episode) + ".mp4",
      runtime: "42:00",
      accent: "#3a2350",
    });
  });
});

// Build Love Island (US) entries
LOVE_ISLAND_SEASON_EPISODE_COUNTS.forEach((count, seasonIdx) => {
  const season = seasonIdx + 1;
  for (let episode = 1; episode <= count; episode++) {
    MOVIES.push({
      id: "li-s" + pad2(season) + "e" + pad2(episode),
      title: "Love Island US — S" + season + "E" + episode,
      category: "Love Island",
      collection: "TV Shows",
      series: "Love Island",
      season,
      episode,
      description: "Love Island USA, Season " + season + ", Episode " + episode + ".",
      video: "videos/love-island/s" + pad2(season) + "e" + pad2(episode) + ".mp4",
      runtime: "45:00",
      accent: "#d97a4a",
    });
  }
});

RELATED_SHOWS.forEach((show) => {
  show.episodes.forEach((episodeTitle, epIdx) => {
    const episode = epIdx + 1;
    MOVIES.push({
      id: show.slug + "-s" + pad2(show.season) + "e" + pad2(episode),
      title: show.title + " — S" + show.season + "E" + episode + " — " + episodeTitle,
      category: show.category,
      collection: show.collection,
      series: show.category,
      season: show.season,
      episode,
      description: show.description + " " + episodeTitle + ".",
      video: "videos/" + show.slug + "/s" + pad2(show.season) + "e" + pad2(episode) + ".mp4",
      runtime: show.runtime,
      accent: show.accent,
    });
  });
});

// Coraline: single movie — the simplest possible entry, useful as a
// template when adding a standalone film.
MOVIES.push({
  id: "coraline",
  title: "Coraline",
  category: "Movies",
  collection: "Movies",
  description: "A girl discovers an alternate version of her life through a secret door — and it isn't as perfect as it seems.",
  video: "videos/coraline.mp4",
  runtime: "1:40:00",
  accent: "#2e4a4f",
});

RELATED_MOVIES.forEach((movie) => MOVIES.push(movie));
