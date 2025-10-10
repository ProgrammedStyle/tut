"use client";

import layoutStyles from "./layoutIndex.module.css";
import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("./components/Map"), { ssr: false });

const Home = () => {
    return (
        <div className={layoutStyles.bodyCont}>
            <LiveMap />
        </div>
    );
};

export default Home;
