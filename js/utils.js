/*==========================================================
    AniNova v2.1
    Utility Functions
==========================================================*/

/*==========================================================
    SELECTORS
==========================================================*/

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/*==========================================================
    LOADER
==========================================================*/

function showLoader() {

    const loader = $("#loader");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoader() {

    const loader = $("#loader");

    if (!loader) return;

    loader.style.opacity = "0";

    setTimeout(() => {

        loader.style.display = "none";

    }, 400);

}


/*==========================================================
    TOAST
==========================================================*/

function showToast(message) {

    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/*==========================================================
    FORMATTERS
==========================================================*/

function formatScore(score) {

    if (score == null) return "N/A";

    return Number(score).toFixed(1);

}

function formatEpisodes(ep) {

    return ep || "?";

}

function truncate(text, length = 160) {

    if (!text) return "";

    if (text.length <= length) return text;

    return text.substring(0, length) + "...";

}


/*==========================================================
    IMAGE
==========================================================*/

function animeImage(anime) {

    return anime?.images?.jpg?.large_image_url ||

           anime?.images?.jpg?.image_url ||

           "https://placehold.co/300x450?text=No+Image";

}


/*==========================================================
    DEBOUNCE
==========================================================*/

function debounce(callback, delay = 400) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}


/*==========================================================
    URL
==========================================================*/

function getAnimeId() {

    return new URLSearchParams(

        window.location.search

    ).get("id");

}


/*==========================================================
    RANDOM
==========================================================*/

function randomItem(array) {

    return array[

        Math.floor(

            Math.random() * array.length

        )

    ];

}


/*==========================================================
    SCROLL
==========================================================*/

function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/*==========================================================
    BACK TO TOP
==========================================================*/

window.addEventListener("scroll", () => {

    const button = $("#backToTop");

    if (!button) return;

    if (window.scrollY > 500) {

        button.classList.add("show");

    } else {

        button.classList.remove("show");

    }

});

document.addEventListener("click", (e) => {

    if (e.target.closest("#backToTop")) {

        scrollTopSmooth();

    }

});