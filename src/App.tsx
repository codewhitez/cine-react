//import "./App.css";
import { Suspense, lazy } from "react";

// Works also with SSR as expected
// const Card = lazy(() => import("./components/Card"));
const MovieGrid = lazy(() => import("./components/MovieGrid"));

function App() {
    return (
        <Suspense
            fallback={<p style={{ padding: "2rem" }}>Loading CineView...</p>}
        >
            <MovieGrid />
        </Suspense>
    );
}

export default App;
