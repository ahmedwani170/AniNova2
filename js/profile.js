"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    const recent =
        JSON.parse(localStorage.getItem("recent")) || [];

    const watching =
        JSON.parse(localStorage.getItem("continueWatching")) || [];

    document.getElementById("profileFavorites").textContent =
        favorites.length;

    document.getElementById("profileWatchlist").textContent =
        watchlist.length;

    document.getElementById("profileRecent").textContent =
        recent.length;

    document.getElementById("profileContinue").textContent =
        watching.length;

    const themeBtn = document.getElementById("themeToggle");

    if(themeBtn){

        themeBtn.onclick = () => {

            document.body.classList.toggle("light");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("light")
                ? "light"
                : "dark"
            );

        };

    }

    if(localStorage.getItem("theme")==="light"){

        document.body.classList.add("light");

    }

});