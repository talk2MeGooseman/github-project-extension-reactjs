import React from "react";
import ReactDOM from "react-dom";

import Viewer from "./views/Viewer";
import { Config } from "./views/config";

const params = new URLSearchParams(window.location.search)

if (params.get('mode') === "config") {
    ReactDOM.render(<Config />, document.getElementById("root"));
} else {
    ReactDOM.render(<Viewer />, document.getElementById("root"));
}
