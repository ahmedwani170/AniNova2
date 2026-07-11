/*==========================================================
    AniNova v3.0
    Favorites Page
==========================================================*/

"use strict";

let favorites = [];
let filteredFavorites = [];

document.addEventListener("DOMContentLoaded", initFavorites);

/*==========================================================
    START
==========================================================*/

function initFavorites() {

    showLoader();

    favorites = getFavorites();

    filteredFavorites = [...favorites];

    renderFavorites();

    setupSearch();

    setupSort();

    hideLoader();

}


/*==========================================================
    RENDER
==========================================================*/

function renderFavorites() {

    const container =
        document.getElementById("favoritesContainer");

    if (!container) return;

    if (filteredFavorites.length === 0) {

        container.innerHTML = `

        <div class="empty-state">

            <h2>❤️ No Favorites Yet</h2>

            <p>

                Start adding your favourite anime.

            </p>

            <br>

            <a href="index.html"
               class="primary-btn">

                Browse Anime

            </a>

        </div>

        `;

        return;

    }

    renderAnimeRow(

        "favoritesContainer",

        filteredFavorites

    );

}


/*==========================================================
    SEARCH
==========================================================*/

function setupSearch() {

    const input =
        document.getElementById("favoriteSearch");

    if (!input) return;

    input.addEventListener(

        "input",

        debounce(() => {

            const query =

                input.value
                .trim()
                .toLowerCase();

            filteredFavorites =

                favorites.filter(anime =>

                    anime.title
                    .toLowerCase()
                    .includes(query)

                );

            renderFavorites();

        }, 300)

    );

}


/*==========================================================
    SORT
==========================================================*/

function setupSort() {

    const select =
        document.getElementById("favoriteSort");

    if (!select) return;

    select.addEventListener("change", () => {

        switch (select.value) {

            case "title":

                filteredFavorites.sort(

                    (a, b) =>

                        a.title.localeCompare(b.title)

                );

                break;

            case "score":

                filteredFavorites.sort(

                    (a, b) =>

                        (b.score || 0) -

                        (a.score || 0)

                );

                break;

            default:

                filteredFavorites = [...favorites];

        }

        renderFavorites();

    });

}


/*==========================================================
    AUTO REFRESH
==========================================================*/

window.addEventListener("storage", () => {

    favorites = getFavorites();

    filteredFavorites = [...favorites];

    renderFavorites();

});