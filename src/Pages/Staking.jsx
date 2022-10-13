import {
  Box,
  Text,
  Heading,
  Container,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Button,
  Input,
  Tag,
  SimpleGrid,
  Badge,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card } from "../components/cards/Card"
import { Link as RouterLink } from "react-router-dom"

import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState } from "react"

import zeroKageLocalAbi from "../contracts/localhost_ZeroKage.json"
import zeroKageGoerliAbi from "../contracts/localhost_ZeroKage.json"
import stakeLocalAbi from "../contracts/localhost_StakingRewards.json"
//import stakeGoerliAbi from "../contracts/goerli_DEX.json"
import rKageLocalAbi from "../contracts/localhost_r0Kage.json"
import { getNetworkName } from "../utils/misc"
import addressList from "../contracts/addresses.json"
import { ethers } from "ethers"
import { roundDecimals } from "../utils/web3-formats"
import { WaitingModal } from "../components/modals/WaitingModal"
import { ErrorTemplate } from "../components/errors/ErrorTemplate"

const DEXLINK = "/dex/swap"

export const Staking = () => {
  const { account, chainId } = useMoralis()
  const toast = useToast()
  const numChainId = parseInt(chainId)

  console.log("chain Id", chainId)
  const networkName = getNetworkName(chainId)

  const zKageAbi =
    networkName && networkName === "goerli"
      ? zeroKageGoerliAbi
      : zeroKageLocalAbi

  // TO DO - NEED TO ADD GOERLI ADDRESSES
  const stakingAbi =
    networkName && networkName === "goerli" ? stakeLocalAbi : stakeLocalAbi

  // TO DO - NEED TO ADD GOERLI ADDRESSES
  const rKageAbi =
    networkName && networkName === "goerli" ? rKageLocalAbi : rKageLocalAbi

  const chainIdString = chainId && parseInt(chainId)

  const zKageAddress = chainIdString
    ? addressList[chainIdString]["ZeroKage"][0]
    : null
  const stakeAddress = chainIdString
    ? addressList[chainIdString]["StakingRewards"][0]
    : null
  const rKageAddress = chainIdString
    ? addressList[chainIdString]["r0Kage"][0]
    : null

  const [rewardTokens, setRewardTokens] = useState(5)
  const [stakedTokens, setStakedTokens] = useState(5)
  const [tokenBalance, setTokenBalance] = useState(0)

  const [allowanceApproved, setAllowanceApproved] = useState(false)
  const [isUpdateTokenBalances, setIsUpdateTokenBalances] = useState(true)
  const [isUpdateStakingBalance, setIsUpdateStakingBalance] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const {
    register: register2,
    formState: { errors: errors2 },
    setValue: setValue2,
    handleSubmit: handleSubmit2,
  } = useForm()

  const { runContractFunction, isLoading } = useWeb3Contract()
  const apiParams = { abi: stakingAbi, contractAddress: stakeAddress }

  //******************* USE EFFECT **************/

  /**
   * @dev as soon as page is loaded, we need to recalculate staked tokens
   * @dev this also should be updated when user adds or removes staking
   * @dev isUpdateStakingBalance will be updated everytime Stake or Unstake API calls are triggered
   */
  useEffect(() => {
    if (isUpdateTokenBalances) {
      const stakingParams = {
        ...apiParams,
        functionName: "getStakingBalance",
        params: { user: account },
      }

      runContractFunction({
        params: stakingParams,
        onSuccess: (values) => {
          setStakedTokens(roundDecimals(ethers.utils.formatEther(values), 6))
          setIsUpdateStakingBalance(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [isUpdateStakingBalance, account, chainId])

  /**
   * @dev as soon as page is loaded, we need to recalculate token balance
   * @dev this also should be updated when user adds or removes staking
   * @dev isUpdateTokenBalances will be updated everytime Stake or Unstake API calls are triggered
   */
  useEffect(() => {
    if (isUpdateTokenBalances) {
      const tokenParams = {
        abi: zKageAbi,
        contractAddress: zKageAddress,
        functionName: "balanceOf",
        params: { account: account },
      }

      runContractFunction({
        params: tokenParams,
        onSuccess: (values) => {
          setStakedTokens(roundDecimals(ethers.utils.formatEther(values), 6))
          setIsUpdateTokenBalances(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [isUpdateTokenBalances, account, chainId])

  //****************** EVENT HANDLER FUNCTIONS *****************/

  /**
   * @notice populates LP tokens into the LP token input field in Remove Liquidity Card
   */
  const updateStakeTokens = () => {
    setValue2("stakeTokens", stakedTokens)
  }
  //----------------------------------------------------//

  //**************** CALLBACK FUNCTIONS ******************** */

  /**
   * @notice send success notification to user once txn receipt is generated
   * @param {any} values returns transaction response
   */
  const successAddStakeHandler = async (response) => {
    setIsConfirming(true)
    // wait for 1 block confirmation
    const txnReceipt = await response.wait(1)
    setIsConfirming(false)

    // insert success notification here
    toast({
      title: `Success`,
      status: "success",
      description: `Staking successful. Txn hash ${txnReceipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    // LP tokens need to be recalculated
    // setting to true for UI to update LP token value
    setIsUpdateTokenBalances(true)
    setIsUpdateStakingBalance(true)
    setAllowanceApproved(false)
    setValue("stakeValue", null)
  }

  const successUnstakeHandler = async (response) => {
    setIsConfirming(true)
    const removeTx = await response.wait(1)
    setIsConfirming(false)

    toast({
      title: `Success`,
      status: "success",
      description: `Unstake successful. Txn hash ${removeTx.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    setIsUpdateTokenBalances(true)
    setIsUpdateStakingBalance(true)
    setValue("unstakeValue", null)
  }

  /**
   * @dev handles callback
   * @param {any} response
   */
  const successApproveHandler = async (response) => {
    setIsConfirming(true)

    await response.wait(1)
    setIsConfirming(false)
    toast({
      title: `Token Approved`,
      status: "success",
      description: `Token approved for staking. Click on 'Stake' button to complete process`,
      isClosable: true,
      duration: 9000,
    })
    setAllowanceApproved(true)
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

  //********************** API FUNCTIONS ********************/

  const seekApproval = (values) => {
    const tokenAmount = ethers.utils.parseEther(values.tokenValue.toString())
    console.log("confirming at Seek Approval Stage", isConfirming)
    console.log("is loading", isLoading)
    const approvalOptions = {
      abi: zKageAbi,
      contractAddress: zKageAddress,
      params: { spender: stakeAddress, amount: tokenAmount },
      functionName: "approve",
    }

    runContractFunction({
      params: approvalOptions,
      onSuccess: successApproveHandler,
      onError: errorHandler,
      onComplete: () => console.log("completed ....."),
    })
  }

  const onAddLiquidity = (values) => {
    const ethValue = values.ethValue
    const tokenValue = values.tokenValue
    if (!allowanceApproved) {
      // seek approval first & exit
      seekApproval(values)
    } else {
      // if approved -> then go ahead and add liquidity
      if (
        ethValue &&
        tokenValue &&
        ethValue.toString() !== "0" &&
        tokenValue.toString() !== "0"
      ) {
        const addLiqOptions = {
          ...apiParams,
          functionName: "deposit",
          params: {},
          msgValue: ethers.utils.parseEther(values.ethValue.toString()),
        }
        console.log("add liquidity options", addLiqOptions)

        runContractFunction({
          params: addLiqOptions,
          onSuccess: successAddStakeHandler,
          onError: errorHandler,
        })
      }
    }
  }

  /**
   * @notice function calls the removeLiquidity function in DEX contract
   * @param {any[]} values values captured by remove liquidity form
   */
  const onRemoveLiquidity = (values) => {
    console.log("errors", errors2)
    const removeLiqOptions = {
      ...apiParams,
      functionName: "withdraw",
      params: {
        numLPTokens: ethers.utils.parseEther(values.lpTokens.toString()),
      },
    }

    runContractFunction({
      params: removeLiqOptions,
      onSuccess: successUnstakeHandler,
      onError: errorHandler,
    })
  }

  //------------------------------------------------------//

  //****************** HELPER FUNCTIONS ******************//

  //-----------------------------------------------------//

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

      {chainId && account && (
        <Container>
          <Card mt="10" width="400">
            <HStack justify="space-between">
              <Text fontSize="md" fontWeight="bold">
                Stake 0Kage
              </Text>
              <HStack spacing="4" justify="end">
                <Badge variant="subtle" colorScheme="blue">
                  {`Current Balance: ${rewardTokens} 0KAGE`}
                </Badge>
                <Button
                  to={DEXLINK}
                  as={RouterLink}
                  size="sm"
                  variant="outline">
                  Get 0KAGE
                </Button>
              </HStack>
            </HStack>

            <form onSubmit={handleSubmit(onAddLiquidity)}>
              <FormControl mt="10" isInvalid={Object.entries(errors).length}>
                <HStack spacing="4">
                  <FormLabel>Amount to Stake</FormLabel>
                  <VStack>
                    <Input
                      placeholder="Enter amt in Eth terms"
                      {...register("stakeValue", {
                        required: {
                          value: true,
                          message: "Specify amount to stake",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.stakeValue?.message}
                    </FormErrorMessage>
                  </VStack>
                  <ErrorTemplate errors={errors} />
                </HStack>
              </FormControl>
              <VStack spacing="2" mt="10" width="100%">
                {!allowanceApproved && (
                  <Button type="submit" variant="outline" width="inherit">
                    Approve
                  </Button>
                )}
                <Button
                  type="submit"
                  colorScheme="blue"
                  variant="solid"
                  width="inherit">
                  Stake 0Kage
                </Button>
              </VStack>
            </form>
          </Card>

          <Card mt="10" width="400">
            <HStack spacing="4">
              <Text fontSize="md" fontWeight="bold">
                Unstake 0Kage
              </Text>
              <Badge variant="subtle" colorScheme="green">
                {`Current Rewards: ${rewardTokens} r0KAGE`}
              </Badge>
            </HStack>
            <Box mt="10">
              <form onSubmit={handleSubmit2(onRemoveLiquidity)}>
                <FormControl isInvalid={Object.entries(errors2).length}>
                  <HStack spacing="4" mb="4">
                    <FormLabel>Choose Amount</FormLabel>
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size="sm"
                      onClick={updateStakeTokens}>
                      Max
                    </Button>
                  </HStack>
                  <Input
                    {...register2("unstakeValue", {
                      required: { value: true, message: "Enter LP tokens" },
                      min: { value: 0, message: "Invalid value" },
                      max: {
                        value: { lpTokens: rewardTokens },
                        message: "LP tokens exceed max balance",
                      },
                      validate: {
                        limit: (v) =>
                          parseFloat(v) < rewardTokens ||
                          "Entered value exceeds available LP tokens",
                      },
                    })}
                  />
                  <ErrorTemplate errors={errors2} />
                </FormControl>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  type="submit"
                  mt="10">
                  Unstake 0Kage
                </Button>
              </form>
            </Box>
          </Card>
          <WaitingModal
            isOpen={isConfirming}
            network={getNetworkName(chainId)}
          />
        </Container>
      )}
    </Box>
  )
}
