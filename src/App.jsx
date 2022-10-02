import * as React from "react"
import { Box, useColorModeValue } from "@chakra-ui/react"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { RouterProvider } from "react-router-dom"
import { routerConfig } from "./Components/Router/Router"

const App = () => {
  const { isWeb3Enabled } = useMoralis()
  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} width="100%">
      <RouterProvider router={routerConfig} />
    </Box>
  )
}

export default App
