import { createBrowserRouter } from "react-router-dom";
import { About, Home, ExplorePage } from "../pages";
import { Login,  Profile,  Register } from "../pages/user";
import { HomePageLayout, MainLayout, WriteLayout } from "../layout";
import { MainPage } from "../pages/MainPage";
import { Write } from "../pages/write/Write";
import { PostDetail } from "../pages/PostDetails";


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    path: "/home",
    element: <HomePageLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "about", element: <About /> },
      { path: "post/:id", element: <PostDetail /> },
    ],
  },
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
]);
