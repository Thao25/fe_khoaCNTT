import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserPage from "./pages/user.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";

import Posts from "./pages/posts.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";

import CoursePage from "./pages/course.jsx";
import PostAdmin from "./pages/postAdmin.jsx";
import Admin from "./pages/admin.jsx";
import Notifications from "./pages/notifications.jsx";
import NotificationDetail from "./pages/notificationDetail.jsx";
import CourseDetail from "./pages/courseDetail.jsx";
import SubmenuPage from "./pages/SubmenuPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import AdminHeaderPage from "./pages/AdminHeaderPage.jsx";
import ChangePasswordForm from "./components/layout/ChangePassword.jsx";
import ProfilePage from "./components/layout/ProfilePage.jsx";
import AppWrapper from "./components/context/AppProvider.jsx";
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
        path: "course",
        element: <CoursePage />,
      },
      {
        path: "course/submenu/:subMenuSlug",
        element: <SubmenuPage />,
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
        path: "headerAdmin",
        element: <AdminHeaderPage />,
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
        path: "post/submenu/:subMenuSlug",
        element: <SubmenuPage />,
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
        path: ":menuSlug/submenu/:subMenuSlug",
        element: <SubmenuPage />,
      },
      {
        path: ":menuSlug/:id",
        element: <ArticlePage />,
      },
      {
        path: ":menuSlug/:subMenuSlug/:id",
        element: <ArticlePage />,
      },
      {
        path: "about/submenu/danh-sach-giang-vien/:id",
        element: <ArticlePage />,
      },

      {
        path: "password",
        element: <ChangePasswordForm />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
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
      <AppWrapper>
        <RouterProvider router={router} />
      </AppWrapper>
    </AuthWrapper>
  </React.StrictMode>
);
