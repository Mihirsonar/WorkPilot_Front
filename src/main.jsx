import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Providers from "./app/Provider";
import Router from "./app/Router";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Providers>
    <Router />
     <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff"
        }
      }}
    />
  </Providers>
);