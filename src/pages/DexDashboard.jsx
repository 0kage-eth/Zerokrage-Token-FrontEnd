import {
  Box,
  Heading,
  Container,
  Text,
  SimpleGrid,
  Tabs,
  TabPanel,
  TabList,
  TabPanels,
  Tab,
} from "@chakra-ui/react"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"

import { Card } from "../components/cards/Card"
import { Stat } from "../components/dashboard/Stat"

export const DexDashboard = () => {
  const { account, chainId } = useMoralis()
  const [liquidity, setLiquidity] = useState("0")
  const [share, setShare] = useState("0")
  const [totalEth, setTotalEth] = useState("0")
  const [totalTokens, setTotalTokens] = useState("0")

  const numChainId = parseInt(chainId)
  useEffect(() => {
    // calculate account liquidity
    // calculate % share of total
    // calculate total eth
    // calculate total 0Kage
    // get last 25 swap txns of user with Dex
    // get last 25 liquidity add/remove txns with Dex
  }, [account, chainId])

  return (
    <Box as="section" height="100vh" width={1200} overflowY="auto" mx="auto">
      {(!account || !chainId) && (
        <Heading as="h2" fontSize="2xl" my="auto" textAlign="10" mt="10">
          Please connect your wallet
        </Heading>
      )}

      {numChainId !== 5 && numChainId !== 31337 && (
        <Heading as="h2" fontSize="2xl" my="auto" textAlign="10" mt="10">
          Invalid chain. Please switch to Goerli
        </Heading>
      )}

      {(numChainId === 5 || numChainId === 31337) && account && (
        <Container>
          <Card mt="10" width="400">
            <Text fontSize="md" fontWeight="bold">
              Your Stats
            </Text>
            <SimpleGrid columns="2" spacing="10">
              <Stat label="LP Tokens" value={liquidity} />
              <Stat label="% share" value={share} />
              {/* <Stat label="USDC Earned" value={usdc} /> */}
            </SimpleGrid>
          </Card>

          <Card mt="10" width="400">
            <Text fontSize="md" fontWeight="bold">
              Pool Stats
            </Text>
            <SimpleGrid columns="3" spacing="10">
              <Stat label="LP Tokens" value={liquidity} />
              {/* <Stat label="% share" value={share} /> */}
              <Stat label="Total ETH" value={totalEth} />
              <Stat label="Total 0Kage" value={totalTokens} />
            </SimpleGrid>
          </Card>

          <Card mt="10" overflowY="auto">
            <Heading as="h3" fontSize="md">
              History
            </Heading>
            <Tabs mt="4">
              <TabList>
                <Tab>Swaps</Tab>
                <Tab>Liquidity</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>Import swap txns from Subgraph - TBD</p>
                </TabPanel>
                <TabPanel>
                  <p>Import add/remove liquidity txns from Subgraph - TBD</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </Container>
      )}
    </Box>
  )
}
