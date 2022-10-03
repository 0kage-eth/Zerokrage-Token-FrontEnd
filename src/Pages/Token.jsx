import { Box, SimpleGrid, Stack } from "@chakra-ui/react"
import { Stat } from "../components/dashboard/Stat"
import { PageHeader } from "../components/headers/PageHeader"
import { Approve } from "../components/functional/Approve"
import { Transfer } from "../components/functional/Transfer"
import { Purchase } from "../components/functional/Purchase"
import { useContractFunction, useEthers } from "@usedapp/core"
import { Contract, utils } from "ethers"

import localZeroKageAbi from "../contracts/localhost_ZeroKage.json"
import goerliZeroKageAbi from "../contracts/goerli_ZeroKage.json"
import addressList from "../contracts/addresses.json"
import { useState, useEffect } from "react"

export const Token = () => {
  const { library, chainId, account } = useEthers()
  const networkName = library.network.name
  const chainIdString = parseInt(chainId).toString()
  const [balance, setBalance] = useState(0)

  console.log("chain Id", chainId)

  const zeroKageAbi =
    networkName === "goerli" ? goerliZeroKageAbi : localZeroKageAbi
  // const zeroKageAddress = addressList[chainIdString]["ZeroKage"]
  const zeroKageContract = null
  // const zeroKageInterface = new utils.Interface(zeroKageAbi)
  // const zeroKageContract = new Contract(zeroKageAddress, zeroKageInterface)

  // const { state, send, events, resetState } = useContractFunction(
  //   zeroKageContract,
  //   "balanceOf",
  //   {}
  // )

  // const getBalance = async () => {
  //   const receipt = await send()

  //   if (state === "Success") {
  //     setBalance()
  //   }
  // }

  // useEffect(() => getBalance(), [account])

  // console.log()

  return (
    <Box as="section" height="100vh" overflowY="auto" mx="auto">
      <PageHeader title="0KAGE Token" subtitle="Token usage metrics" />
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: "5", md: "6" }}
        py={{ base: "50", md: "50" }}>
        <Stat label="Balance" value={`- 0KAGE`} />
        {/* <Stat label="Balance" value={`${utils.parseEther(balance)} 0KAGE`} /> */}
        <Stat label="Transfers" value={6} />
        <Stat label="Approvals" value={3} />
      </SimpleGrid>
      <Stack direction="column" spacing="4" w="full">
        <Transfer contract={zeroKageContract} />
        <Approve contract={zeroKageContract} />
        <Purchase contract={zeroKageContract} />
      </Stack>
    </Box>
  )
}
