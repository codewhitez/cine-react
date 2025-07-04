import { Movie } from "../types";
import styles from "./MovieCard.module.scss";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <div className={styles.card}>
            <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                className={styles.poster}
                loading="lazy"
            />
            <h3 className={styles.title}>{movie.title}</h3>
        </div>
    );
}
