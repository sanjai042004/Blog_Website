import { createBrowserRouter } from "react-router-dom";
import { About, Home, Settings } from "../pages";
import { PostDetail } from "../pages/PostDetails";
import { AuthorPage } from "../pages/AuthorPage";
import { NotFound } from "../pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { RedirectAuth } from "./RedirectAuth";
import { Write } from "../pages/WritePage/Write";
import { LandingPage, ResetPassword } from "../LandingPage";
import { Profile } from "../pages/Profile";
import { HomePageLayout, MainLayout, WriteLayout } from "../components/ui";

export const Router = createBrowserRouter([
  {
    element: <RedirectAuth />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [{ index: true, element: <LandingPage /> }],
      },
    ],
  },


  {
    path: "/home",
    element: <HomePageLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "post/:id", element: <PostDetail /> },
      { path: "author/:authorId", element: <AuthorPage /> }, 
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/profile",
        element: <HomePageLayout />,
        children: [{ index: true, element: <Profile /> }],
      },
      {
        path: "/write",
        element: <WriteLayout />,
        children: [{ index: true, element: <Write /> }],
      },
      {
        path: "/settings",
        element: <HomePageLayout />,
        children: [{ index: true, element: <Settings /> }],
      },
    ],
  },

  { path: "/reset-password", element: <ResetPassword /> },

  { path: "*", element: <NotFound /> },
]);
