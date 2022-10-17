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
  SimpleGrid,
} from "@chakra-ui/react"
import { UserLotteryTable } from "../../components/graph/UserLotteryTable"

export const LotteryAccount = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  const [rewards, setRewards] = useState(0)
  const [participated, setParticipated] = useState(0)
  const [won, setWon] = useState(0)
  const [proceeds, setProceeds] = useState(0)
  const [feePaid, setFeePaid] = useState(0)

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
            <Card width="100%">
              <HStack mx="auto" spacing="40" justify="center">
                <span>
                  <Text fontWeight="bold">Unclaimed Wins</Text>
                  <Text fontSize="2xl">{`${rewards} 0Kage`}</Text>
                </span>
                <Button variant="solid" colorScheme="blue">
                  Withdraw
                </Button>
              </HStack>
            </Card>

            <SimpleGrid
              columns={{ base: 1, md: 4 }}
              gap="6"
              justify="space-evenly"
              width="100%">
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Participated</Text>
                  <Text fontSize="2xl">{participated}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span textAlign="center">
                  <Text fontWeight="bold">Won</Text>
                  <Text fontSize="2xl">{won}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Pot</Text>
                  <Text fontSize="2xl">{proceeds}</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Fees Paid</Text>
                  <Text fontSize="2xl">{feePaid}</Text>
                </span>
              </Card>
            </SimpleGrid>

            <Card width="100%">
              <UserLotteryTable />
            </Card>
          </VStack>
        </Box>
      )}
    </Box>
  )
}
