import * as React from "react"
import { Box, useColorModeValue } from "@chakra-ui/react"
import { RouterProvider } from "react-router-dom"
import { routerConfig } from "./components/router/Router"

const App = () => {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} width="100%">
      <RouterProvider router={routerConfig} />
    </Box>
  )
}

export default App
