import { Card } from "../../components/cards/Card"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { useState, useEffect } from "react"
import { VestingScheduleTable } from "../../components/graph/VestingScheduleTable"
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

export const VestingDashboard = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  const [vested, setVested] = useState(0)
  const [released, setReleased] = useState(0)
  const [unvested, setUnvested] = useState(0)

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
              Vesting details
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="6"
              justify="space-evenly"
              mx="auto"
              width="100%">
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Vested till date</Text>
                  <Text fontSize="2xl">{vested}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span textAlign="center">
                  <Text fontWeight="bold">Released</Text>
                  <Text fontSize="2xl">{released}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">To-be-vested</Text>
                  <Text fontSize="2xl">{unvested}</Text>
                </span>
              </Card>
            </SimpleGrid>
          </VStack>

          <VStack mt="10" spacing="4">
            <Heading as="h4" fontSize="xl">
              Breakdown
            </Heading>
            <Card>
              <VestingScheduleTable />
            </Card>
          </VStack>
        </Box>
      )}
    </Box>
  )
}
