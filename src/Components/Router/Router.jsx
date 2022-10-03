import { createBrowserRouter } from "react-router-dom"
import { Home } from "../../pages/Home"
import { Events } from "../../pages/Events"
import { Dashboard } from "../../pages/Dashboard"
import { Main } from "../../pages/Main"
import { Token } from "../../pages/Token"

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "main",
    element: <Main />,
    children: [
      {
        path: "token",
        element: <Token />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
])
