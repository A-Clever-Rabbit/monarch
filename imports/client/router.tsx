// See https://reactrouter.com/en/main/routers/create-browser-router
import React from 'react';

import {createBrowserRouter} from "react-router-dom";
import type { RouteObject } from "react-router-dom";

const HomePage = React.lazy(() => import('@/pages/home/home'));

// Auth Pages
const LoginPage = React.lazy(() => import("/imports/client/ui/pages/auth/login"));
const ForgotPasswordPage = React.lazy(() => import("/imports/client/ui/pages/auth/forgot-password"));
const ResetPasswordPage = React.lazy(() => import("/imports/client/ui/pages/auth/reset-password-page"));
const NewsPage = React.lazy(() => import("/imports/client/ui/pages/news/index"));

// Admin Pages
const AdminIndex = React.lazy(() => import("/imports/client/ui/pages/admin"));
const AdminDashboard = React.lazy(() => import("/imports/client/ui/pages/admin/dashboard"));

const UserView = React.lazy(() => import("/imports/client/ui/pages/admin/users/users"));
const UserEvents = React.lazy(() => import("/imports/client/ui/pages/admin/users/user-events"));

const AdminSettingsGeneralIndexPage = React.lazy(() => import("/imports/client/ui/pages/admin/settings/general"));

const AdminRoles$typeCreatePage = React.lazy(() => import("/imports/client/ui/pages/admin/roles/$type/create"));
const AdminRoles$typeEditPage = React.lazy(() => import("/imports/client/ui/pages/admin/roles/$type/$roleId.edit"));
const AdminRoles$typeRolesPage = React.lazy(() => import("/imports/client/ui/pages/admin/roles/$type/roles"));

// Util Routes
const RootError = React.lazy(() => import('@/pages/_errors/root'));

import Logout from '@/pages/auth/logout'

const routes: RouteObject[] = [
  { path: '/logout', element: <Logout /> },
  {
    path: "/login",
    element: <LoginPage />,
    children: [
      { path: "admin", element: <LoginPage /> }
    ]
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />
  },
  {
    path: "/",
    errorElement: <RootError />,
    element: <HomePage />,
    children: [
      {
        element: <HomePage />,
        children: [
          {
            path: "news",
            children: [
              { index: true, element: <NewsPage /> },
            ]
          }
        ]
      },
      /**
       * Admin routes
       */
      {
        path: "admin",
        element: <AdminIndex />,
        children: [
          {
            index: true,
            element: <AdminDashboard />
          },

          // {
          //   path: "tables",
          //   children: [
          //     { path: "list", element: <AdminTablesListPage /> },
          //     { path: "floor-plans", element: <AdminFloorPlansPage /> },
          //   ]
          // },

          {
            path: "roles",
            children: [
              { path: ":type", element: <AdminRoles$typeRolesPage /> },
              { path: ":type/create", element: <AdminRoles$typeCreatePage /> },
              { path: ":type/:roleId/edit", element: <AdminRoles$typeEditPage /> },
            ]
          },

          {
            path: "users",
            children: [
              {
                path: "list",
                element: <UserView />,
              },
              {
                path: "events",
                element: <UserEvents />
              }
            ]
          },

          {
            path: "settings",
            children: [
              {
                path: "general",
                element: <AdminSettingsGeneralIndexPage />
              },
            ]
          },
        ]
      },

      {
        path: "api",
        children: [
            {
            path: "entity/:entityId/some-additional-classifier",
          },
        ]
      }
    ]
  }
];

export default createBrowserRouter(routes);
