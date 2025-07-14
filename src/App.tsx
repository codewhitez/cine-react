//import "./App.css";
//import { Suspense, lazy } from "react";
import MovieGrid from "./components/MovieGrid";

// Works also with SSR as expected
// const Card = lazy(() => import("./components/Card"));
//const MovieGrid = lazy(() => import("./components/MovieGrid"));

function App() {
    return <MovieGrid />;
}

export default App;
