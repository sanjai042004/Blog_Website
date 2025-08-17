import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./routes/Router";
import { App } from "./App";
import { SearchProvider } from "./context/SearchContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SearchProvider>
    <RouterProvider router={Router}>
     
        <App />
     
    </RouterProvider>
    </SearchProvider>
  </StrictMode>
);
