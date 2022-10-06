import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { MoralisProvider } from "react-moralis"
import { SUBGRAPH_URI } from "./constants"

const root = ReactDOM.createRoot(document.getElementById("root"))

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${SUBGRAPH_URI}`,
})

root.render(
  <ChakraProvider>
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </MoralisProvider>
  </ChakraProvider>
)
