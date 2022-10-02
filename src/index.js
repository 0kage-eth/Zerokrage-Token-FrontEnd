import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { MoralisProvider } from "react-moralis"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <MoralisProvider initializeOnMount={false}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </MoralisProvider>
)
