"use strict";

let watchlist = [];
let filteredWatchlist = [];

document.addEventListener("DOMContentLoaded", initWatchlist);

function initWatchlist() {

    showLoader();

    watchlist = getWatchlist();

    filteredWatchlist = [...watchlist];

    renderWatchlist();

    setupWatchlistSearch();

    setupWatchlistSort();

    hideLoader();

}

function renderWatchlist() {

    const container =
        document.getElementById("watchlistContainer");

    if (!container) return;

    if (filteredWatchlist.length === 0) {

        container.innerHTML = `

        <div class="empty-state">

            <h2>📺 Your Watchlist is Empty</h2>

            <p>

                Save anime to watch later.

            </p>

            <a href="index.html"

               class="primary-btn">

               Browse Anime

            </a>

        </div>

        `;

        return;

    }

    renderAnimeGrid(

        "watchlistContainer",

        filteredWatchlist

    );

}

function setupWatchlistSearch() {

    const input =

        document.getElementById(

            "watchlistSearch"

        );

    if (!input) return;

    input.addEventListener(

        "input",

        debounce(() => {

            const value =

                input.value

                .toLowerCase()

                .trim();

            filteredWatchlist =

                watchlist.filter(

                    anime =>

                    anime.title

                    .toLowerCase()

                    .includes(value)

                );

            renderWatchlist();

        },300)

    );

}

function setupWatchlistSort() {

    const select =

        document.getElementById(

            "watchlistSort"

        );

    if (!select) return;

    select.addEventListener(

        "change",

        ()=>{

            switch(select.value){

                case "title":

                    filteredWatchlist.sort(

                        (a,b)=>

                        a.title.localeCompare(

                            b.title

                        )

                    );

                    break;

                case "score":

                    filteredWatchlist.sort(

                        (a,b)=>

                        (b.score||0)-

                        (a.score||0)

                    );

                    break;

                default:

                    filteredWatchlist=[

                        ...watchlist

                    ];

            }

            renderWatchlist();

        }

    );

}