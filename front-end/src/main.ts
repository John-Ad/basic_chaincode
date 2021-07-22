// react imports
import React from "react";
import ReactDOM from "react-dom";

// css imports
import "normalize.css";
import "./css/main.css";
import "./css/navbar.css";
import "./css/addPartSection.css";
import "./css/viewPartSection.css";
import "./css/addTransaction.css";

// component imports
import Base from "./components/base";

// render base
ReactDOM.render(React.createElement(Base), document.getElementById("root"));
