// import { createBrowserRouter } from "react-router-dom";

// import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";

// import FindYourNextRead from "./features/home/FindYourNextRead";
// import BookDetails from "./features/BookDetails/BookDetails";

// import Dashboard from "./features/dashboard/pages/Dashboard";
// import Profile from "./features/profile/Profile";
// import ReadingList from "./features/readingList/pages/ReadingList"
// import Notification from "./features/notifications/Notification";
// import Payment from "./features/payment/Payment";
// import Requests from "./features/requests/RequestsPage";
// import BookCircleAuth from "./features/BookCircleAuth/BookCircleAuth";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/",
//         element: <FindYourNextRead />,
//       },
//       {
//         path: "/dashboard",
        
//         element: <Dashboard />,
//       },
//       {
//         path: "/reading-list",
//         element: <ReadingList />,
//       },
//            {
//         path: "/requests",
//         element: <Requests />,
//       },
//            {
//         path: "/notifications",
//         element: <Notification />,
//       },
//       {
//         path: "/book/:bookId",
//         element: <BookDetails />,
//       },
//             {
//         path: "/payment",
//         element: <Payment />,
//       },
//    {
//     path:"/profile/:userId",
//     element :<Profile />
//    }
//     ],
//   },

//   {
//     path: "/",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "/login",
//         element: <BookCircleAuth />,
//       },{
//         path:"/signup",
//         element:<BookCircleAuth/>
//       }
//     ],
//   },
// ]);
import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import FindYourNextRead from "./features/home/FindYourNextRead";
import BookDetails from "./features/BookDetails/BookDetails";

import Dashboard from "./features/dashboard/pages/Dashboard";
import Profile from "./features/profile/Profile";
import ReadingList from "./features/readingList/pages/ReadingList";
import Notification from "./features/notifications/Notification";
import Payment from "./features/payment/Payment";
import Requests from "./features/requests/RequestsPage";
import BookCircleAuth from "./features/BookCircleAuth/BookCircleAuth";

import GuestGuard from "./gaurds/GuestGuard";
import AuthGuard from "./gaurds/AuthGuard";

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <FindYourNextRead />,
      },
      {
        path: "book/:bookId",
        element: <BookDetails />,
      },
    ],
  },

{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      element: <AuthGuard allowedRoles={["ADMIN", "BOOK_OWNER"]} />,
      children: [{ path: "dashboard", element: <Dashboard /> }],
    },
    {
      element: <AuthGuard allowedRoles={["READER"]} />,
      children: [{ path: "reading-list", element: <ReadingList /> },{ path: "requests", element: <Requests /> },{ path: "payment", element: <Payment /> }],
    },

    {
      element: <AuthGuard allowedRoles={["ADMIN", "BOOK_OWNER", "READER"]} />,
      children: [{ path: "notifications", element: <Notification /> },{ path: "profile/:userId", element: <Profile /> }],
    },

  ],
},

  // GUEST ROUTES
  {
    path: "/",
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <BookCircleAuth />,
          },
          {
            path: "signup",
            element: <BookCircleAuth />,
          },
        ],
      },
    ],
  },
]);