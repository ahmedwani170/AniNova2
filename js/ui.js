/*==========================================================
    AniNova v2.1
    UI Components
==========================================================*/

/*==========================================================
    HERO
==========================================================*/

function renderHero(anime) {

    if (!anime) return;

    const hero = document.getElementById("hero");
    const title = document.getElementById("heroTitle");
    const description = document.getElementById("heroDescription");
    const watchBtn = document.getElementById("watchNowBtn");
    const detailsBtn = document.getElementById("detailsBtn");

    hero.style.backgroundImage =
        `url(${animeImage(anime)})`;

    title.textContent = anime.title;

    description.textContent =
        truncate(anime.synopsis, 220);

    watchBtn.onclick = () => {

        window.open(
            anime.url,
            "_blank"
        );

    };

    detailsBtn.onclick = () => {

        location.href =
            `details.html?id=${anime.mal_id}`;

    };

}


/*==========================================================
    CARD
==========================================================*/

function animeCard(anime){

    return `
    <div class="anime-card fade-up">

        <div class="card-image">

            <img
                loading="lazy"
                src="${animeImage(anime)}"
                alt="${anime.title}">

            <span class="badge">

                ${anime.type || "TV"}

            </span>

            <span class="rating-badge">

                ⭐ ${formatScore(anime.score)}

            </span>

        </div>

        <div class="card-content">

            <h3 class="card-title">

                ${anime.title}

            </h3>

            <div class="card-info">

                <span>

                    ${formatEpisodes(anime.episodes)} Ep

                </span>

                <span>

                    ${anime.status || ""}

                </span>

            </div>

            <div class="card-actions">

                <button
                    class="watch-btn"
                    onclick="location.href='details.html?id=${anime.mal_id}'">

                    Details

                </button>

                <button
                    class="favorite-btn"
                    onclick="toggleFavorite(${anime.mal_id})">

                    ❤

                </button>

            </div>

        </div>

    </div>

    `;

}


/*==========================================================
    ROW
==========================================================*/

function renderAnimeRow(containerId, list){

    const container =
        document.getElementById(containerId);

    if(!container) return;

    if(!list || list.length===0){

        container.innerHTML=`

        <div class="empty-state">

            <i class="fas fa-face-frown"></i>

            <h3>No Anime Found</h3>

        </div>

        `;

        return;

    }

    container.innerHTML =

        list.map(animeCard).join("");

}


/*==========================================================
    SKELETON
==========================================================*/

function renderSkeleton(containerId,count=8){

    const container=document.getElementById(containerId);

    if(!container) return;

    let html="";

    for(let i=0;i<count;i++){

        html+=`<div class="skeleton-card"></div>`;

    }

    container.innerHTML=html;

}
/*==========================================================
    FAVORITES
==========================================================*/

function toggleFavorite(id) {

    const favorites = getFavorites();

    const exists = favorites.find(a => a.mal_id == id);

    if (exists) {

        removeFavorite(id);

        showToast("Removed from Favorites ❤️");

    } else {

        const anime = window.allAnime.find(a => a.mal_id == id);

        if (!anime) return;

        addFavorite(anime);

        showToast("Added to Favorites ❤️");

    }

}


/*==========================================================
    WATCHLIST
==========================================================*/

function toggleWatchlist(id) {

    const list = getWatchlist();

    const exists = list.find(a => a.mal_id == id);

    if (exists) {

        removeFromWatchlist(id);

        showToast("Removed from Watchlist");

    } else {

        const anime = window.allAnime.find(a => a.mal_id == id);

        if (!anime) return;

        addToWatchlist(anime);

        showToast("Added to Watchlist");

    }

}


/*==========================================================
    THEME
==========================================================*/

function initializeTheme() {

    const theme = getTheme();

    if (theme === "light") {

        document.body.classList.add("light");

    }

}

function toggleTheme() {

    document.body.classList.toggle("light");

    const theme = document.body.classList.contains("light")

        ? "light"

        : "dark";

    saveTheme(theme);

}

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", toggleTheme);

}

initializeTheme();


/*==========================================================
    MOBILE MENU
==========================================================*/

const menuBtn = document.getElementById("menuBtn");

const closeMenu = document.getElementById("closeMenu");

const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {

    menuBtn.onclick = () =>

        mobileMenu.classList.add("active");

}

if (closeMenu && mobileMenu) {

    closeMenu.onclick = () =>

        mobileMenu.classList.remove("active");

}


/*==========================================================
    RANDOM BUTTON
==========================================================*/

const randomBtn = document.getElementById("randomBtn");

if (randomBtn) {

    randomBtn.onclick = async () => {

        const result = await getRandomAnime();

        if (!result) {

            showToast("Unable to load random anime");

            return;

        }

        location.href =

            `details.html?id=${result.data.mal_id}`;

    };

}


/*==========================================================
    SEARCH SUGGESTIONS
==========================================================*/

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(

        "input",

        debounce(async function () {

            const query = this.value.trim();

            const box = document.getElementById(

                "searchSuggestions"

            );

            if (!box) return;

            if (query.length < 2) {

                box.style.display = "none";

                box.innerHTML = "";

                return;

            }

            const result = await searchAnime(query);

            if (!result) return;

            const anime = result.data.slice(0, 6);

            box.innerHTML = anime.map(item => `

                <div class="search-item"

                    onclick="location.href='details.html?id=${item.mal_id}'">

                    <img src="${animeImage(item)}">

                    <span>${item.title}</span>

                </div>

            `).join("");

            box.style.display = "block";

        }, 350)

    );

}


/*==========================================================
    CLOSE SEARCH
==========================================================*/

document.addEventListener("click", e => {

    const box = document.getElementById(

        "searchSuggestions"

    );

    if (!box) return;

    if (!e.target.closest(".search-container")) {

        box.style.display = "none";

    }

});
/*==========================================================
    GRID RENDERER
==========================================================*/

function renderAnimeGrid(containerId, animeList) {
    const container = document.getElementById(containerId);

    if (!container) return;

    if (!animeList || animeList.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>No Anime Found</h2>

                <p>Try another search.</p>

            </div>

        `;

        return;

    }

    container.innerHTML = animeList.map(anime => `

        <div class="anime-card fade-up">

            <div class="card-image">

                <img
                    src="${animeImage(anime)}"
                    loading="lazy"
                    alt="${anime.title}">

                <span class="rating-badge">

                    ⭐ ${formatScore(anime.score)}

                </span>

            </div>

            <div class="card-content">

                <h3 class="card-title">

                    ${anime.title}

                </h3>

                <div class="card-info">

                    <span>${anime.type || "TV"}</span>

                    <span>${anime.year || "-"}</span>

                </div>

                <div class="card-actions">

                    <button
                        class="watch-btn"
                        onclick="location.href='details.html?id=${anime.mal_id}'">

                        Details

                    </button>

                    <button
                        class="favorite-btn"
                        onclick="toggleFavorite(${anime.mal_id})">

                        ❤

                    </button>

                </div>

            </div>

        </div>

    `).join("");

}