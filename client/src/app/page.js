"use client";

import layoutStyles from "./layoutIndex.module.css";
import LiveMap from "./components/Map";
import "./index.css";

const Home = () => {
    return (
        <div className={layoutStyles.bodyCont}>
            <LiveMap />
        </div>
    );
};

export default Home;
