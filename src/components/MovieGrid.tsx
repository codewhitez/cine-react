import { use } from "react";
import GenreFilter from "./GenreFilter";
import MovieCard from "./MovieCard";
import { Genre, Movie } from "../types";
import { useState, useMemo } from "react";
import useStateRef from "../utils/useStateRef";
import {
    fetchPopularMovies,
    fetchPopularMoviesWithCache,
    loadGenres,
} from "../utils/movieLoader";
import styles from "../App.module.scss";

export default function MovieGrid() {
    const [page, setPage, pageRef] = useStateRef(1);
    const initialMovies: Movie[] = use(fetchPopularMoviesWithCache(page));
    const genres: Genre[] = use(loadGenres());

    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [isLoading, setIsLoading] = useState(false);

    const filteredMovies = useMemo(() => {
        return selectedGenre
            ? movies.filter((m) => m.genre_ids.includes(selectedGenre))
            : movies;
    }, [selectedGenre, movies]);

    const loadMore = async () => {
        setIsLoading(true);
        const nextPage = pageRef.current + 1;
        const newMovies = await fetchPopularMovies(nextPage);

        setMovies((prev) => [...prev, ...newMovies]);
        setPage(nextPage);
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <GenreFilter
                    genres={genres}
                    selected={selectedGenre}
                    onSelect={setSelectedGenre}
                />
            </aside>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {filteredMovies?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
                <div className={styles.loadMoreContainer}>
                    <button
                        className={styles.loadMore}
                        onClick={loadMore}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Load More"}
                    </button>
                </div>
            </main>
        </div>
    );
}
