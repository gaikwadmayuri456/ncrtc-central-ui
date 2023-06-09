import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import combinedReducer from "./Redux/Reducers/CombinedReducer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { message } from "antd";

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

const store = configureStore({
    reducer: combinedReducer,
});
if (process.env.REACT_APP_PRODUCTION !== "development") console.log = () => { };
const base_ip = window.location.href.replace("http://", "").split(":")[0];
if (process.env.REACT_APP_ENV === "production") {
    axios.defaults.baseURL = "http://" + base_ip + ":5001" || "http://localhost:5001";//This url for backend
    axios.defaults.baseURL1 = "http://" + base_ip + ":3000" //this url for grafana
}
else {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL_TEST
    axios.defaults.baseURL1 = process.env.REACT_APP_GRAFANAURL_TEST //this url for grafana
}

// Shoukd end without '/'
// process.env.REACT_APP_API_URL || "http://localhost:5001" 
axios.defaults.headers.common["Authorization"] = localStorage.getItem("ID_TOKEN");

// errorComposer will compose a handleGlobally function
const errorComposer = (error, prefixMessage) => {
    const statusCode = error.response ? error.response.status : null;
    const m = error.response ? error.response.data.detail : null;
    const errorMessage = m ? m : error.message;

    if (!statusCode) {
        message.error(prefixMessage + " : Network Error");
        return;
    } else if (errorMessage) {
        message.error(prefixMessage + " : " + errorMessage);
    } else if (statusCode === 404) {
        message.error(prefixMessage + " : Not Found");
    }

    if (statusCode === 401) {
        message.error(prefixMessage + " : Unauthorized");
        localStorage.removeItem("ID_TOKEN");
        window.location.href = "/login";
    }
};

// apiName comes as a when handling error globally
axios.interceptors.response.use(undefined, error => {
    console.log(error);
    error.handleGlobally = prefixMessage => {
        errorComposer(error, prefixMessage);
    };

    return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
