import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserPage from "./pages/user.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import AboutPage from "./pages/about.jsx";
import Posts from "./pages/posts.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import LecturerPage from "./pages/lecturer.jsx";
import CoursePage from "./pages/course.jsx";
import PostAdmin from "./pages/postAdmin.jsx";
import Admin from "./pages/admin.jsx";
import Notifications from "./pages/notifications.jsx";
import NotificationDetail from "./pages/notificationDetail.jsx";
import CourseDetail from "./pages/courseDetail.jsx";
import SubmenuPage from "./pages/SubmenuPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "course",
        element: <CoursePage />,
      },
      {
        path: "course/:id",
        element: <CourseDetail />,
      },
      {
        path: "postAdmin",
        element: <PostAdmin />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "notification/:id",
        element: <NotificationDetail />,
      },
      {
        path: "post",
        element: <Posts />,
      },
      {
        path: "post/:id",
        element: <PostDetail />,
      },
      {
        path: "article/:slug",
        element: <ArticlePage />,
      },
      {
        path: ":menuSlug",
        element: <MenuPage />,
      },

      {
        path: ":menuSlug/:subMenuSlug",
        element: <SubmenuPage />,
      },

      {
        path: ":menuSlug/:subMenuSlug/:id",
        element: <ArticlePage />,
      },
      {
        path: ":menuSlug/:id",
        element: <ArticlePage />,
      },
    ],
  },

  {
    path: "login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
