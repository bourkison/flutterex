import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import "./App.css";

function App() {
    return (
        <div className="App">
            <h1>Flutterex</h1>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
