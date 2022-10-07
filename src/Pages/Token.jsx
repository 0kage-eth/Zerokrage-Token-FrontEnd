import {
  Box,
  SimpleGrid,
  Stack,
  Flex,
  Button,
  Heading,
  Container,
} from "@chakra-ui/react"
import { Stat } from "../components/dashboard/Stat"
import { PageHeader } from "../components/headers/PageHeader"
import { Approve } from "../components/functional/Approve"
import { Transfer } from "../components/functional/Transfer"
import { Purchase } from "../components/functional/Purchase"
import { Contract, utils } from "ethers"

import localZeroKageAbi from "../contracts/localhost_ZeroKage.json"
import goerliZeroKageAbi from "../contracts/goerli_ZeroKage.json"
import addressList from "../contracts/addresses.json"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { roundDecimals } from "../utils/web3-formats.js"
import { IncreaseApproval } from "../components/functional/IncreaseApproval"
import { DecreaseApproval } from "../components/functional/DecreaseApproval"

export const Token = () => {
  const networkName = "" //library.network.name
  const { chainId, account } = useMoralis()
  const chainIdString = parseInt(chainId).toString()
  const [balance, setBalance] = useState(0)

  const zeroKageAbi =
    networkName === "goerli" ? goerliZeroKageAbi : localZeroKageAbi
  const zeroKageAddress = chainId && addressList[chainIdString]["ZeroKage"][0]

  const { runContractFunction: getBalance, isFetching } = useWeb3Contract({
    abi: zeroKageAbi,
    contractAddress: zeroKageAddress,
    functionName: "balanceOf",
    params: { account: account },
  })

  const successHandler = (value) => {
    setBalance(roundDecimals(utils.formatEther(value)))
  }

  useEffect(() => {
    balanceUpdate()
  }, [account, chainId])

  const balanceUpdate = async () => {
    /**
     * This method calls api's which fetches latest
     * balance and count for approval and transfers
     */
    getBalance({
      onError: (e) => console.log(e),
      onSuccess: successHandler,
    })
  }

  return (
    <Box as="section" height="100vh" overflowY="auto" mx="auto">
      {(!chainId || !account) && (
        <Heading as="h2" fontSize="2xl" my="auto" textAlign="center" mt="10">
          Please connect your wallet
        </Heading>
      )}
      {chainId && account && (
        <Container>
          <PageHeader title="0KAGE Token" subtitle="Token usage metrics" />
          {/* <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={{ base: "5", md: "6" }}
            py={{ base: "50", md: "50" }}>
            <Stat label="0KAGE Balance" value={balance} />
            <Stat label="Transfers" value={6} />
            <Stat label="Approvals" value={3} />
          </SimpleGrid> */}
          <Stat
            label="0KAGE Balance"
            value={balance}
            mt={4}
            textAlign="center"
          />
          <Stack direction="column" spacing="4" w="full" mt={6}>
            <Transfer
              abi={zeroKageAbi}
              address={zeroKageAddress}
              updateBalance={balanceUpdate}
            />
            <Approve
              abi={zeroKageAbi}
              address={zeroKageAddress}
              updateBalance={balanceUpdate}
            />

            <IncreaseApproval abi={zeroKageAbi} address={zeroKageAddress} />
            <DecreaseApproval abi={zeroKageAbi} address={zeroKageAddress} />

            {/* <Purchase abi={zeroKageAbi} address={zeroKageAddress} /> */}
          </Stack>
        </Container>
      )}
    </Box>
  )
}
