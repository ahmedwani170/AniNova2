"use strict";

/*==========================================================
    AniNova Search
==========================================================*/

let searchResults = [];
let currentPage = 1;
const PER_PAGE = 20;

document.addEventListener("DOMContentLoaded", initSearch);

function initSearch() {

    const input = document.getElementById("searchPageInput");

    if (!input) return;

    input.addEventListener(
        "input",
        debounce(() => {

            const query = input.value.trim();

            if (query.length < 2) {

                document.getElementById("searchResults").innerHTML = "";

                return;

            }

            currentPage = 1;

            searchAnimePage(query);

        }, 500)
    );

    // Read search from homepage URL
    const params = new URLSearchParams(window.location.search);

    const query = params.get("q");

    if (query) {

        input.value = query;

        searchAnimePage(query);

    }

}

async function searchAnimePage(query) {

    showLoader();

    const result = await searchAnime(query, currentPage);

    hideLoader();

    if (!result) {

        showToast("Server is busy. Please try again in a few seconds.");

        return;

    }

    searchResults = result.data;

    renderAnimeGrid(
        "searchResults",
        searchResults
    );

    renderPagination(result.pagination);

}

function renderPagination(pagination) {

    const container = document.getElementById("pagination");

    if (!container) return;

    if (!pagination) {

        container.innerHTML = "";

        return;

    }

    container.innerHTML = "";

    if (pagination.has_previous_page) {

        container.innerHTML += `
            <button onclick="changePage(${currentPage - 1})">
                ◀ Previous
            </button>
        `;

    }

    container.innerHTML += `
        <span style="margin:0 15px;">
            Page ${currentPage}
        </span>
    `;

    if (pagination.has_next_page) {

        container.innerHTML += `
            <button onclick="changePage(${currentPage + 1})">
                Next ▶
            </button>
        `;

    }

}

async function changePage(page) {

    currentPage = page;

    const query = document
        .getElementById("searchPageInput")
        .value
        .trim();

    if (query.length < 2) return;

    await searchAnimePage(query);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
