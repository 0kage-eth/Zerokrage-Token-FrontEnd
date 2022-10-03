import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { DAppProvider, Goerli, Localhost } from "@usedapp/core"
import { getDefaultProvider } from "ethers"

const root = ReactDOM.createRoot(document.getElementById("root"))

const config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: getDefaultProvider("goerli"),
  },
}
const localHostconfig = {
  readOnlyChainId: Localhost.chainId,
  readOnlyUrls: {
    [Localhost.chainId]: "http://127.0.0.1:8545",
  },
}

root.render(
  <ChakraProvider>
    <DAppProvider config={localHostconfig}>
      <App />
    </DAppProvider>
  </ChakraProvider>
)
