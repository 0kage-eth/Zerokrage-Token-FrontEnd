import { Card } from "../../components/cards/Card"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { useState, useEffect } from "react"
import {
  Box,
  Center,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Container,
  SimpleGrid,
} from "@chakra-ui/react"

import { ProtocolLotteryStats } from "../../components/graph/ProtocolLotteryStatsTable"

export const LotteryDashboard = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  const [epoch, setEpoch] = useState(0)
  const [potSize, setPotSize] = useState(0)
  const [tickets, setTickets] = useState(0)

  return (
    <Box as="section" height="100vh" width="100%" overflowY="auto" mx="auto">
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

      {chainId && account && (
        <Box width="80%" mx="auto">
          <VStack mt="10" spacing="4">
            <Heading as="h4" fontSize="xl">
              Current Epoch details
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="6"
              justify="space-evenly"
              mx="auto"
              width="100%">
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Epoch No.</Text>
                  <Text fontSize="2xl">{epoch}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span textAlign="center">
                  <Text fontWeight="bold">Pot size</Text>
                  <Text fontSize="2xl">{potSize}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Pot</Text>
                  <Text fontSize="2xl">{tickets}</Text>
                </span>
              </Card>
            </SimpleGrid>
          </VStack>

          <VStack mt="10" spacing="4">
            <Heading as="h4" fontSize="xl">
              Protocol Summary
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="6"
              justify="space-evenly"
              width="100%">
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Total Epochs</Text>
                  <Text fontSize="2xl">{epoch}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span textAlign="center">
                  <Text fontWeight="bold">Total Rewards</Text>
                  <Text fontSize="2xl">{potSize}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Platform Fees</Text>
                  <Text fontSize="2xl">{tickets}</Text>
                </span>
              </Card>
            </SimpleGrid>
          </VStack>

          <Card mt="10">
            <ProtocolLotteryStats />
          </Card>
        </Box>
      )}
    </Box>
  )
}
