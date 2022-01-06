import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "../views/Home";
import ContractsNew from "../views/Contracts/ContractsNew";
import NotFound from "../views/NotFound";

const allRoutes = [
    {
        path: "/",
        element: <Home />,
        title: "Home",
        key: "home"
    },
    {
        path: "/contracts/new",
        element: <ContractsNew />,
        title: "New Contract",
        key: "contractsnew"
    },
    {
        path: "*",
        element: <NotFound />,
        title: "404",
        key: "404"
    }
]

function AppRouter() {
    const currentLocation = useLocation();
    let currentTitle: string;
    try {
        currentTitle = allRoutes.find(route => { return route.path === currentLocation.pathname }).title;
    }
    catch (err) {
        currentTitle = "404";
    }

    useEffect(() => {
        document.title = "FlutterEx · " + currentTitle;
    })

    return (
        <Routes>
            { allRoutes.map((route, index) => {
                return <Route key={index} path={route.path} element={route.element} />
            }) }
        </Routes>
    );

}

export default AppRouter;