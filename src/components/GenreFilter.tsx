import type { Genre } from "../types";
import styles from "./GenreFilter.module.scss";

interface Props {
    genres: Genre[];
    selected: number | null;
    onSelect: (id: number | null) => void;
}

export default function GenreFilter({ genres, selected, onSelect }: Props) {
    return (
        <div className={styles.sidebar}>
            <h4 className={styles.heading}>Genres</h4>
            <ul className={styles.list}>
                <li
                    className={!selected ? styles.active : ""}
                    onClick={() => onSelect(null)}
                >
                    All
                </li>
                {genres?.map((genre) => (
                    <li
                        key={genre.id}
                        className={selected === genre.id ? styles.active : ""}
                        onClick={() => onSelect(genre.id)}
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
