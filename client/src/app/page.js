"use client";

import layoutStyles from "./layoutIndex.module.css";
import LiveTrackingMap from "./components/Map";
import "./index.css";

const Home = () => {
    return (
        <div className={layoutStyles.bodyCont}>
            <LiveTrackingMap />
        </div>
    );
};

export default Home;
