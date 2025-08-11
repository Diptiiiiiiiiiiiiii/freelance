import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store"; // ✅ make sure this matches your store export
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import "./index.css";import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
