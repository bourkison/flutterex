import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/Home";

const allRoutes = [
    {
        path: "/",
        element: <Home />,
        title: "Home",
        key: "home"
    }
]

function AppRouter() {
    const currentLocation = useLocation();
    const currentTitle = allRoutes.find(route => { return route.path === currentLocation.pathname }).title;
    useEffect(() => {
        document.title = "FlutterEx | " + currentTitle;
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