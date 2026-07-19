import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fontsource/petrona/500.css";
import "@fontsource/petrona/600.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/global.css";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TripDetail from "./pages/TripDetail.jsx";
import TripForm from "./pages/TripForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "trips/new", element: <TripForm /> },
      { path: "trips/:tripId", element: <TripDetail /> },
      { path: "trips/:tripId/edit", element: <TripForm edit /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
