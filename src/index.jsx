import React from "react";
import ReactDOM from "react-dom";

import Viewer from "./views/Viewer";
import { Config } from "./views/config";
import AuthWrapper from "./shared/auth-wrapper";

const params = new URLSearchParams(window.location.search)

if (params.get('mode') === "config") {
    ReactDOM.render(<AuthWrapper><Config /></AuthWrapper>, document.getElementById("root"));
} else {
    ReactDOM.render(<AuthWrapper><Viewer /></AuthWrapper>, document.getElementById("root"));
}
