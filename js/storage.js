/*==========================================================
    AniNova v2.1
    Storage Manager
==========================================================*/

const STORAGE = {

    FAVORITES: "aninova_favorites",

    WATCHLIST: "aninova_watchlist",

    RECENT: "aninova_recent",

    CONTINUE: "aninova_continue",

    THEME: "aninova_theme"

};


/*==========================================================
    BASIC STORAGE
==========================================================*/

function saveData(key, data){

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}


function loadData(key){

    const data = localStorage.getItem(key);

    if(!data){

        return [];

    }

    try{

        return JSON.parse(data);

    }

    catch{

        return [];

    }

}


/*==========================================================
    FAVORITES
==========================================================*/

function getFavorites(){

    return loadData(STORAGE.FAVORITES);

}


function saveFavorites(list){

    saveData(

        STORAGE.FAVORITES,

        list

    );

}


function isFavorite(id){

    return getFavorites().some(

        anime => anime.mal_id == id

    );

}


function addFavorite(anime){

    const favorites = getFavorites();

    if(isFavorite(anime.mal_id)){

        return false;

    }

    favorites.push(anime);

    saveFavorites(favorites);

    return true;

}


function removeFavorite(id){

    const favorites = getFavorites().filter(

        anime => anime.mal_id != id

    );

    saveFavorites(favorites);

}
/*==========================================================
    WATCHLIST
==========================================================*/

function getWatchlist() {

    return loadData(STORAGE.WATCHLIST);

}

function saveWatchlist(list) {

    saveData(STORAGE.WATCHLIST, list);

}

function isInWatchlist(id) {

    return getWatchlist().some(

        anime => anime.mal_id == id

    );

}

function addToWatchlist(anime) {

    const list = getWatchlist();

    if (isInWatchlist(anime.mal_id)) {

        return false;

    }

    list.push(anime);

    saveWatchlist(list);

    return true;

}

function removeFromWatchlist(id) {

    const list = getWatchlist().filter(

        anime => anime.mal_id != id

    );

    saveWatchlist(list);

}


/*==========================================================
    RECENTLY VIEWED
==========================================================*/

function getRecentlyViewed() {

    return loadData(STORAGE.RECENT);

}

function addRecentlyViewed(anime) {

    let recent = getRecentlyViewed();

    recent = recent.filter(

        item => item.mal_id != anime.mal_id

    );

    recent.unshift(anime);

    if (recent.length > 20) {

        recent = recent.slice(0, 20);

    }

    saveData(STORAGE.RECENT, recent);

}


/*==========================================================
    CONTINUE WATCHING
==========================================================*/

function getContinueWatching() {

    return loadData(STORAGE.CONTINUE);

}

function saveContinueWatching(list) {

    saveData(STORAGE.CONTINUE, list);

}

function updateContinueWatching(anime, episode = 1) {

    let list = getContinueWatching();

    list = list.filter(

        item => item.mal_id != anime.mal_id

    );

    list.unshift({

        ...anime,

        episode

    });

    if (list.length > 20) {

        list = list.slice(0, 20);

    }

    saveContinueWatching(list);

}


/*==========================================================
    THEME
==========================================================*/

function saveTheme(theme) {

    localStorage.setItem(STORAGE.THEME, theme);

}

function getTheme() {

    return localStorage.getItem(STORAGE.THEME) || "dark";

}


/*==========================================================
    STORAGE HELPERS
==========================================================*/

function clearFavorites() {

    localStorage.removeItem(STORAGE.FAVORITES);

}

function clearWatchlist() {

    localStorage.removeItem(STORAGE.WATCHLIST);

}

function clearRecentlyViewed() {

    localStorage.removeItem(STORAGE.RECENT);

}

function clearContinueWatching() {

    localStorage.removeItem(STORAGE.CONTINUE);

}

function clearAllAniNovaData() {

    Object.values(STORAGE).forEach(key => {

        localStorage.removeItem(key);

    });

}