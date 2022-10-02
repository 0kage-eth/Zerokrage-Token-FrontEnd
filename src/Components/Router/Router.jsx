import { createBrowserRouter } from "react-router-dom"
import { Home } from "../../Pages/Home"
import { Events } from "../../Pages/Events"
import { Dashboard } from "../../Pages/Dashboard"
import { Main } from "../../Pages/Main"
import { Token } from "../../Pages/Token"

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
