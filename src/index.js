import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import Viewer from "./views/Viewer";
import Config from "./views/Config";

if (window.entryPoint === "VIEWER") {
    ReactDOM.render(<Viewer />, document.getElementById("root"));
} else if (window.entryPoint === "CONFIG") {
    ReactDOM.render(<Config />, document.getElementById("root"));
} else if (window.entryPoint === "LIVE_VIEWER") {
    // ReactDOM.render(<Viewer />, document.getElementById("root"));
}

