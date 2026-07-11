/*==========================================================
    AniNova v3.0
    Main Application
==========================================================*/

"use strict";

/*==========================================================
    APP STATE
==========================================================*/

const App = {

    featured: [],
    trending: [],
    airing: [],
    top: [],
    seasonal: [],

    heroIndex: 0,

    heroTimer: null,

    initialized: false

};

window.allAnime = [];


/*==========================================================
    DOM
==========================================================*/

const DOM = {

    loader: document.getElementById("loader"),

    hero: document.getElementById("hero"),

    heroTitle: document.getElementById("heroTitle"),

    heroDescription: document.getElementById("heroDescription"),

    trending: document.getElementById("trendingContainer"),

    airing: document.getElementById("airingContainer"),

    top: document.getElementById("topContainer"),

    seasonal: document.getElementById("seasonContainer"),

    continueWatching: document.getElementById("continueContainer"),

    recent: document.getElementById("recentContainer"),

    totalAnime: document.getElementById("totalAnime"),

    favoriteCount: document.getElementById("favoriteCount")

};


/*==========================================================
    START
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    startAniNova

);


async function startAniNova(){

    if(App.initialized) return;

    App.initialized = true;

    try{

        showLoader();

        showSkeletons();

        await loadEverything();

        updateStatistics();

        hideLoader();

    }

    catch(error){

        console.error(error);

        hideLoader();

        showToast("Failed to load AniNova.");

    }


initializeSearch();
}


/*==========================================================
    SKELETONS
==========================================================*/

function showSkeletons(){

    renderSkeleton("trendingContainer",8);

    renderSkeleton("airingContainer",8);

    renderSkeleton("topContainer",8);

    renderSkeleton("seasonContainer",8);

}


/*==========================================================
    LOAD API
==========================================================*/

async function loadEverything() {

    App.featured = (await getFeaturedAnime())?.data || [];

    await new Promise(resolve => setTimeout(resolve, 500));

    App.trending = (await getTrendingAnime())?.data || [];

    await new Promise(resolve => setTimeout(resolve, 500));

    App.airing = (await getAiringAnime())?.data || [];

    await new Promise(resolve => setTimeout(resolve, 500));

    App.top = (await getTopRatedAnime())?.data || [];

    await new Promise(resolve => setTimeout(resolve, 500));

    App.seasonal = (await getUpcomingAnime())?.data || [];

    window.allAnime = [
        ...App.featured,
        ...App.trending,
        ...App.airing,
        ...App.top,
        ...App.seasonal
    ];

    buildHomepage();

}
/*==========================================================
    BUILD HOME PAGE
==========================================================*/

function buildHomepage() {

    if (App.featured.length > 0) {

        App.heroIndex = 0;

      updateHero();

initializeHeroControls();

initializeHeroSwipe();

startHeroSlider();
    }

    renderAnimeRow(
        "trendingContainer",
        App.trending
    );

    renderAnimeRow(
        "airingContainer",
        App.airing
    );

    renderAnimeRow(
        "topContainer",
        App.top
    );

    renderAnimeRow(
        "seasonContainer",
        App.seasonal
    );

    loadContinueSection();

    loadRecentSection();
    initializeRowScroll();

}


/*==========================================================
    HERO
==========================================================*/

function updateHero() {

    if (App.featured.length === 0) return;

    renderHero(

        App.featured[App.heroIndex]

    );
    renderHeroDots();
}
    /*==========================================================
    HERO SWIPE
==========================================================*/

let heroTouchStartX = 0;
let heroTouchEndX = 0;

function initializeHeroSwipe() {

    const hero = document.getElementById("hero");

    if (!hero) return;

    hero.addEventListener("touchstart", (event) => {

        heroTouchStartX = event.changedTouches[0].clientX;

    }, { passive: true });

    hero.addEventListener("touchend", (event) => {

        heroTouchEndX = event.changedTouches[0].clientX;

        handleHeroSwipe();

    }, { passive: true });

}

function handleHeroSwipe() {

    const distance = heroTouchEndX - heroTouchStartX;

    if (Math.abs(distance) < 50) {

        return;

    }

    if (distance > 0) {

        previousHero();

    }

    else {

        nextHero();

    }

    restartHeroSlider();

}




function nextHero() {

    App.heroIndex++;

    if (App.heroIndex >= App.featured.length) {

        App.heroIndex = 0;

    }

    updateHero();

}


function previousHero() {

    App.heroIndex--;

    if (App.heroIndex < 0) {

        App.heroIndex =

            App.featured.length - 1;

    }

    updateHero();

}


function startHeroSlider() {

    if (App.heroTimer) {

        clearInterval(App.heroTimer);

    }

    App.heroTimer = setInterval(

        nextHero,

        6000

    );

}
/*==========================================================
    HERO CONTROLS
==========================================================*/

function initializeHeroControls() {

    const prev = document.getElementById("heroPrev");
    const next = document.getElementById("heroNext");

    if (prev) {

        prev.addEventListener("click", () => {

            previousHero();

            restartHeroSlider();

        });

    }

    if (next) {

        next.addEventListener("click", () => {

            nextHero();

            restartHeroSlider();

        });

    }

    document.addEventListener("keydown", (event) => {

        if (event.key === "ArrowLeft") {

            previousHero();

            restartHeroSlider();

        }

        if (event.key === "ArrowRight") {

            nextHero();

            restartHeroSlider();

        }

    });

}

function restartHeroSlider() {

    if (App.heroTimer) {

        clearInterval(App.heroTimer);

    }

    startHeroSlider();

}
/*==========================================================
    HERO DOTS
==========================================================*/

function renderHeroDots() {

    const container = document.getElementById("heroDots");

    if (!container) return;

    container.innerHTML = "";

    App.featured.forEach((anime, index) => {

        const dot = document.createElement("button");

        dot.className = "hero-dot";

        if (index === App.heroIndex) {

            dot.classList.add("active");

        }

        dot.addEventListener("click", () => {

            App.heroIndex = index;

            updateHero();

            restartHeroSlider();

        });

        container.appendChild(dot);

    });

}


/*==========================================================
    CONTINUE WATCHING
==========================================================*/

function loadContinueSection() {

    const list =

        getContinueWatching();

    if (!DOM.continueWatching) return;

    renderAnimeRow(

        "continueContainer",

        list

    );

}


/*==========================================================
    RECENTLY VIEWED
==========================================================*/

function loadRecentSection() {

    const list =

        getRecentlyViewed();

    if (!DOM.recent) return;

    renderAnimeRow(

        "recentContainer",

        list

    );

}


/*==========================================================
    STATISTICS
==========================================================*/

function updateStatistics() {

    if (DOM.totalAnime) {

        DOM.totalAnime.textContent =

            window.allAnime.length;

    }

    if (DOM.favoriteCount) {

        DOM.favoriteCount.textContent =

            getFavorites().length;

    }

}


/*==========================================================
    REFRESH
==========================================================*/

function refreshHomepage() {

    renderAnimeRow(

        "trendingContainer",

        App.trending

    );

    renderAnimeRow(

        "airingContainer",

        App.airing

    );

    renderAnimeRow(

        "topContainer",

        App.top

    );

    renderAnimeRow(

        "seasonContainer",

        App.seasonal

    );

}
console.log("AniNova NEW app.js loaded");
/*==========================================================
    HOMEPAGE ROW SCROLL
==========================================================*/

function initializeRowScroll() {

    document.querySelectorAll(".row-wrapper").forEach(wrapper => {

        const row = wrapper.querySelector(".anime-row");

        const left = wrapper.querySelector(".row-arrow.left");

        const right = wrapper.querySelector(".row-arrow.right");

        if (!row) return;

        const scrollAmount = 700;

        if (left) {

            left.addEventListener("click", () => {

                row.scrollBy({

                    left: -scrollAmount,

                    behavior: "smooth"

                });

            });

        }

        if (right) {

            right.addEventListener("click", () => {

                row.scrollBy({

                    left: scrollAmount,

                    behavior: "smooth"

                });

            });

        }

        // Mouse wheel scroll
        row.addEventListener("wheel", (event) => {

            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {

                event.preventDefault();

                row.scrollLeft += event.deltaY;

            }

        }, { passive: false });

    });

}
/*==========================================================
    SEARCH
==========================================================*/

function initializeSearch() {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (!searchInput || !searchBtn) return;

    function performSearch() {

        const query = searchInput.value.trim();

        if (!query) return;

        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;
    }

    searchBtn.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            performSearch();

        }

    });

}
const mobileSearchBtn = document.getElementById("mobileSearchBtn");
const mobileSearchBar = document.getElementById("mobileSearchBar");
const mobileSearchInput = document.getElementById("mobileSearchInput");

mobileSearchBtn?.addEventListener("click", () => {

    mobileSearchBar.classList.toggle("active");

    if (mobileSearchBar.classList.contains("active")) {
        mobileSearchInput.focus();
    }

});
mobileSearchInput?.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        const q = mobileSearchInput.value.trim();

        if (q) {

            location.href = `search.html?q=${encodeURIComponent(q)}`;

        }

    }

});