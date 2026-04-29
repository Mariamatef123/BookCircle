import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import FindYourNextRead from "./features/home/FindYourNextRead";
import BookDetails from "./features/BookDetails/BookDetails";
import Login from "./features/pages/Login";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Profile from "./features/profile/Profile";
import ReadingList from "./features/readingList/pages/ReadingList"
import Notification from "./features/notifications/Notification";
import Payment from "./features/payment/Payment";
import Requests from "./features/requests/RequestsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <FindYourNextRead />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/reading-list",
        element: <ReadingList />,
      },
           {
        path: "/requests",
        element: <Requests />,
      },
           {
        path: "/notifications",
        element: <Notification />,
      },
      {
        path: "/book/:bookId",
        element: <BookDetails />,
      },
            {
        path: "/payment",
        element: <Payment />,
      },
   {
    path:"/profile/:userId",
    element :<Profile />
   }
    ],
  },

  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      }
    ],
  },
]);
