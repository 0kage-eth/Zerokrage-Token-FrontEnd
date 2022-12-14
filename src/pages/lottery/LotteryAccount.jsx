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
  useToast,
} from "@chakra-ui/react"
import { UserLotteryTable } from "../../components/graph/UserLotteryTable"
import lotteryContractAbi from "../../contracts/localhost_SmartLottery0Kage.json"
import zeroKageLocalAbi from "../../contracts/localhost_ZeroKageMock.json"
import zeroKageGoerliAbi from "../../contracts/localhost_ZeroKageMock.json"
import addressList from "../../contracts/addresses.json"

import { ethers } from "ethers"
import { roundDecimals } from "../../utils/web3-formats"

export const LotteryAccount = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  const lotteryAbi =
    networkName && networkName === "goerli"
      ? lotteryContractAbi
      : lotteryContractAbi

  const zKageAbi =
    networkName && networkName === "goerli"
      ? zeroKageGoerliAbi
      : zeroKageLocalAbi

  const [rewards, setRewards] = useState(0)
  const [participated, setParticipated] = useState(0)
  const [won, setWon] = useState(0)
  const [proceeds, setProceeds] = useState(0)
  const [feePaid, setFeePaid] = useState(0)
  const [isConfirming, setIsConfirming] = useState(false)

  const { runContractFunction, isLoading } = useWeb3Contract()
  const toast = useToast()
  //********************** USE EFFECT FUNCTIONS *****************//
  useEffect(() => {
    if (!chainId || !account) return

    getReward(account)
  }, [account, chainId])

  //------------------------------------------------------------//

  //********************** API FUNCTIONS *************************//

  const getReward = async (address) => {
    const lotteryAddress = getLotteryAddress()
    const apiParams = { abi: lotteryAbi, contractAddress: lotteryAddress }
    const rewardParams = {
      ...apiParams,
      functionName: "getWinnerBalance",
      params: { winner: account },
    }

    runContractFunction({
      params: rewardParams,
      onSuccess: (value) => {
        setRewards(roundDecimals(ethers.utils.formatEther(value), 6))
      },
      onError: errorHandler,
    })
  }

  const withdrawReward = async () => {
    console.log("withdraw reward")
    const lotteryAddress = getLotteryAddress()
    const apiParams = { abi: lotteryAbi, contractAddress: lotteryAddress }

    const withdrawParams = {
      ...apiParams,
      functionName: "withdrawWinnerProceeds",
      params: {},
    }
    console.log("withdrawm params", withdrawParams)
    runContractFunction({
      params: withdrawParams,
      onSuccess: withdrawSuccessHandler,
      onError: errorHandler,
    })
  }

  //-----------------------------------------------------------//

  /*********************** CALLBACK HANDLERS ********************/

  const withdrawSuccessHandler = async (response) => {
    setIsConfirming(true)

    const txnReceipt = await response.wait(1)

    // refresh the reward
    await getReward()

    setIsConfirming(false)
    // insert success notification here
    toast({
      title: `Success`,
      status: "success",
      description: `Balance withdrawal successful. Txn hash ${txnReceipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
  }

  /**
   * @notice handles errors generated by any API function
   * @param {any} e error description
   */
  const errorHandler = (e) => {
    // insert error notification here
    const errorMsg = e.message

    toast({
      title: `Error`,
      status: "error",
      description: errorMsg,
      isClosable: true,
      duration: 9000,
    })
    setIsConfirming(false)
    // insert error notification here
  }
  //-----------------------------------------------------------//

  //********************** HELPER FUNCTIONS ************************* */
  const getLotteryAddress = () => {
    if (!chainId) return null
    const chainIdString = parseInt(chainId)
    return addressList[chainIdString]["SmartLottery0Kage"][0]
  }

  const getTokenAddress = () => {
    if (!chainId) return null
    const chainIdString = parseInt(chainId)
    console.log(
      "zero kage address",
      addressList[chainIdString]["ZeroKageMock"][0]
    )
    return addressList[chainIdString]["ZeroKageMock"][0]
  }

  //--------------------------------------------------------------//

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
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={withdrawReward}>
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
                  <Text fontSize="2xl">TBD</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span textAlign="center">
                  <Text fontWeight="bold">Won</Text>
                  <Text fontSize="2xl">TBD</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Pot</Text>
                  <Text fontSize="2xl">TBD</Text>
                </span>
              </Card>
              <Card mt="10" width="100%">
                <span>
                  <Text fontWeight="bold">Fees Paid</Text>
                  <Text fontSize="2xl">TBD</Text>
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
