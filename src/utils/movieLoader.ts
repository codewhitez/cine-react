let movieCache: Promise<any> | null = null;
let genreCache: Promise<any> | null = null;

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const headers = {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
};

export function fetchPopularMoviesWithCache(page: number = 1) {
    if (!movieCache) {
        movieCache = fetchPopularMovies(page);
    }
    return movieCache;
}

export function fetchPopularMovies(page: number = 1) {
    return fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, {
        method: "GET",
        headers,
    })
        .then((res) => res.json())
        .then((data) => data.results);
}

export function loadGenres() {
    if (!genreCache) {
        genreCache = fetch(`${BASE_URL}/genre/movie/list?language=en`, {
            method: "GET",
            headers,
        })
            .then((res) => res.json())
            .then((data) => data.genres);
    }
    return genreCache;
}
