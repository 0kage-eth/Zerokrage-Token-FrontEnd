import * as React from "react"
import { Box, useColorModeValue } from "@chakra-ui/react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
// import { routerConfig } from "./components/router/Router"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
])

const App = () => {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} width="100%">
      <p>Hi Sup</p>
      {/* <RouterProvider router={routerConfig} /> */}
      <RouterProvider router={router} />
    </Box>
  )
}

export default App
