/*==========================================================
    AniNova v2.1
    API Layer
==========================================================*/

const API = {

    BASE: "https://api.jikan.moe/v4",

    CACHE_TIME: 1000 * 60 * 15, // 15 minutes

    cache: new Map()

};


/*==========================================================
    FETCH WITH CACHE
==========================================================*/

async function apiRequest(endpoint, retries = 3) {

    const url = API.BASE + endpoint;

    const cached = API.cache.get(url);

    if (cached) {

        const expired =
            Date.now() - cached.time > API.CACHE_TIME;

        if (!expired) {

            return cached.data;

        }

    }

    try {

        const response = await fetch(url);

        if (response.status === 429 && retries > 0) {

            await new Promise(resolve =>

                setTimeout(resolve, 1000)

            );

            return apiRequest(

                endpoint,

                retries - 1

            );

        }

        if (!response.ok) {

            throw new Error(

                `HTTP ${response.status}`

            );

        }

        const json = await response.json();

        API.cache.set(url, {

            data: json,

            time: Date.now()

        });

        return json;

    }

    catch (error) {

        console.error(

            "API Error:",

            error

        );

        return null;

    }

}


/*==========================================================
    HOME PAGE
==========================================================*/

async function getTrendingAnime(){

    return await apiRequest(

        "/top/anime?filter=bypopularity&limit=20"

    );

}


async function getTopRatedAnime(){

    return await apiRequest(

        "/top/anime?limit=20"

    );

}


async function getAiringAnime(){

    return await apiRequest(

        "/seasons/now?limit=20"

    );

}


async function getUpcomingAnime(){

    return await apiRequest(

        "/seasons/upcoming?limit=20"

    );

}


async function getFeaturedAnime(){

    return await apiRequest(

        "/top/anime?filter=favorite&limit=10"

    );

}
/*==========================================================
    SEARCH
==========================================================*/

async function searchAnime(query, page = 1) {

    return apiRequest(

        `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`

    );

}


/*==========================================================
    DETAILS
==========================================================*/

async function getAnimeDetails(id) {

    return await apiRequest(

        `/anime/${id}/full`

    );

}


async function getAnimeCharacters(id) {

    return await apiRequest(

        `/anime/${id}/characters`

    );

}


async function getAnimePictures(id) {

    return await apiRequest(

        `/anime/${id}/pictures`

    );

}


async function getAnimeRecommendations(id) {

    return await apiRequest(

        `/anime/${id}/recommendations`

    );

}


/*==========================================================
    GENRES
==========================================================*/

async function getGenres() {

    return await apiRequest(

        "/genres/anime"

    );

}


async function getAnimeByGenre(genreId, page = 1) {

    return await apiRequest(

        `/anime?genres=${genreId}&page=${page}&limit=24`

    );

}


/*==========================================================
    RANDOM
==========================================================*/

async function getRandomAnime() {

    return await apiRequest(

        "/random/anime"

    );

}


/*==========================================================
    SEASONS
==========================================================*/

async function getCurrentSeason() {

    return await apiRequest(

        "/seasons/now"

    );

}


async function getUpcomingSeason() {

    return await apiRequest(

        "/seasons/upcoming"

    );

}


/*==========================================================
    TOP
==========================================================*/

async function getTopMovies() {

    return await apiRequest(

        "/top/anime?type=movie&limit=20"

    );

}


async function getTopOVA() {

    return await apiRequest(

        "/top/anime?type=ova&limit=20"

    );

}


async function getTopONA() {

    return await apiRequest(

        "/top/anime?type=ona&limit=20"

    );

}
