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
          borderRadius: "14px",
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          fontSize: "13px",
          fontWeight: "500",
        }
      }}
    />
  </Providers>
);