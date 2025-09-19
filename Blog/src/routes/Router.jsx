import { createBrowserRouter } from "react-router-dom";
import { About, Home, ExplorePage } from "../pages";
import { Profile } from "../pages/user";
import { HomePageLayout, MainLayout, WriteLayout } from "../layout";
import { MainPage } from "../pages/MainPage";
import { Write } from "../pages/write/Write";
import { PostDetail } from "../pages/PostDetails";
import { AuthorPage } from "../pages/AuthorPage";


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> },
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
      {path:"author/:authorId", element:<AuthorPage/>}
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
