/*==========================================================
    AniNova v3.0
    Details Page
==========================================================*/

"use strict";

let animeId = null;
let currentAnime = null;

document.addEventListener("DOMContentLoaded", initDetails);

async function initDetails() {

    animeId = getAnimeId();

    if (!animeId) {

        showToast("Invalid Anime");

        return;

    }

    showLoader();

    try {

        await loadAnime();

        await loadCharacters();

        await loadRecommendations();

        hideLoader();

    }

    catch (error) {

        console.error(error);

        hideLoader();

        showToast("Failed to load anime.");

    }

}


/*==========================================================
    LOAD MAIN ANIME
==========================================================*/

async function loadAnime() {

    const result = await getAnimeDetails(animeId);

    if (!result) return;

    currentAnime = result.data;

    renderDetails(currentAnime);

    addRecentlyViewed(currentAnime);

}


/*==========================================================
    RENDER DETAILS
==========================================================*/

function renderDetails(anime) {

    document.title = anime.title + " | AniNova";

    document.getElementById("animePoster").src =
        animeImage(anime);

    document.getElementById("animeTitle").textContent =
        anime.title;

    document.getElementById("animeSynopsis").textContent =
        anime.synopsis || "No synopsis available.";

    const hero = document.getElementById("detailsHero");

    hero.style.backgroundImage =
        `url(${animeImage(anime)})`;

    document.getElementById("animeMeta").innerHTML = `

⭐ ${formatScore(anime.score)}

&nbsp;&nbsp;|&nbsp;&nbsp;

🏆 #${anime.rank || "-"}

&nbsp;&nbsp;|&nbsp;&nbsp;

🔥 #${anime.popularity || "-"}

&nbsp;&nbsp;|&nbsp;&nbsp;

📺 ${anime.episodes || "?"} Episodes

&nbsp;&nbsp;|&nbsp;&nbsp;

📅 ${anime.year || "-"}

&nbsp;&nbsp;|&nbsp;&nbsp;

${anime.status}

`;

    const info = document.getElementById("animeInfo");

    info.innerHTML = `

    <div><strong>Type</strong><br>${anime.type || "-"}</div>

    <div><strong>Source</strong><br>${anime.source || "-"}</div>

    <div><strong>Rating</strong><br>${anime.rating || "-"}</div>

    <div><strong>Rank</strong><br>#${anime.rank || "-"}</div>

    <div><strong>Popularity</strong><br>#${anime.popularity || "-"}</div>

    <div><strong>Members</strong><br>${anime.members?.toLocaleString() || "-"}</div>

    <div><strong>Studios</strong><br>

        ${anime.studios.map(s=>s.name).join(", ") || "-"}

    </div>

    <div><strong>Genres</strong><br>

        ${anime.genres.map(g=>g.name).join(", ") || "-"}

    </div>

    `;

}
/*==========================================================
    CHARACTERS
==========================================================*/

async function loadCharacters() {

    const result = await getAnimeCharacters(animeId);

    if (!result) return;

    const container = document.getElementById("characterContainer");

    if (!container) return;

    const characters = result.data.slice(0, 12);

    container.innerHTML = characters.map(item => `

        <div class="character-card">

            <img
                src="${item.character.images.jpg.image_url}"
                alt="${item.character.name}"
                loading="lazy">

            <h4>${item.character.name}</h4>

            <p>${item.role}</p>

        </div>

    `).join("");

}


/*==========================================================
    RECOMMENDATIONS
==========================================================*/

async function loadRecommendations() {

    const result = await getAnimeRecommendations(animeId);

    if (!result) return;

    const container = document.getElementById("recommendationContainer");

    if (!container) return;

    const recommendations = result.data.slice(0, 12);

    container.innerHTML = recommendations.map(item => `

        <div class="anime-card">

            <div class="card-image">

                <img

                    src="${item.entry.images.jpg.image_url}"

                    alt="${item.entry.title}"

                    loading="lazy">

            </div>

            <div class="card-content">

                <h3>

                    ${item.entry.title}

                </h3>

                <button

                    class="watch-btn"

                    onclick="location.href='details.html?id=${item.entry.mal_id}'">

                    View Details

                </button>

            </div>

        </div>

    `).join("");

}


/*==========================================================
    FAVORITES
==========================================================*/

const favoriteBtn = document.getElementById("favoriteBtn");

if (favoriteBtn) {

    favoriteBtn.addEventListener("click", () => {

        if (!currentAnime) return;

        toggleFavorite(currentAnime.mal_id);

    });

}


/*==========================================================
    WATCHLIST
==========================================================*/

const watchlistBtn = document.getElementById("watchlistBtn");

if (watchlistBtn) {

    watchlistBtn.addEventListener("click", () => {

        if (!currentAnime) return;

        toggleWatchlist(currentAnime.mal_id);

    });

}


/*==========================================================
    TRAILER
==========================================================*/

const trailerBtn = document.getElementById("trailerBtn");

if (trailerBtn) {

    trailerBtn.addEventListener("click", () => {

        if (!currentAnime) return;

        if (!currentAnime.trailer?.url) {

            showToast("Trailer not available.");

            return;

        }

        window.open(
    currentAnime.trailer.embed_url ||
    currentAnime.trailer.url,
    "_blank"
);

    });

}


/*==========================================================
    CONTINUE WATCHING
==========================================================*/

window.addEventListener("beforeunload", () => {

    if (currentAnime) {

        addContinueWatching(currentAnime);

    }

});