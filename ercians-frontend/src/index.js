import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Configure provider that provides the redux-store(global state) all around our application
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
