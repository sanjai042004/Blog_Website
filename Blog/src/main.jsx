import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./routes/Router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext";


createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="271249898117-e4m6a77e213henqngveubhkfu84r705m.apps.googleusercontent.com">
    <AuthProvider>
      <SearchProvider>
        <RouterProvider router={Router} />
      </SearchProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
