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
  Spinner,
  Badge,
  useToast,
  FormErrorMessage,
  Tooltip,
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
import stakeGoerliAbi from "../contracts/goerli_StakingRewards.json"

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
  const networkName = getNetworkName(chainId)

  //******************* ABIs and Addresses ********************/
  const zKageAbi =
    networkName && networkName === "goerli"
      ? zeroKageGoerliAbi
      : zeroKageLocalAbi

  const stakingAbi =
    networkName && networkName === "goerli" ? stakeGoerliAbi : stakeLocalAbi

  const chainIdString = chainId && parseInt(chainId)

  const zKageAddress = chainIdString
    ? addressList[chainIdString]["ZeroKage"][0]
    : null
  const stakeAddress = chainIdString
    ? addressList[chainIdString]["StakingRewards"][0]
    : null

  //--------------------------------------------------/

  //************ STATE VARIABLES & HOOKS ********************/
  const [stakedTokens, setStakedTokens] = useState(0)
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

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()
  const apiParams = { abi: stakingAbi, contractAddress: stakeAddress }

  //-------------------------------------------------------------//

  //******************* USE EFFECT **************/

  /**
   * @dev as soon as page is loaded, we need to recalculate staked tokens
   * @dev this also should be updated when user adds or removes staking
   * @dev isUpdateStakingBalance will be updated everytime Stake or Unstake API calls are triggered
   */
  useEffect(() => {
    if (isUpdateTokenBalances && chainId && account) {
      const stakingParams = {
        ...apiParams,
        functionName: "getStakingBalance",
        params: { staker: account },
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
    if (isUpdateTokenBalances && chainId && account) {
      const tokenParams = {
        abi: zKageAbi,
        contractAddress: zKageAddress,
        functionName: "balanceOf",
        params: { account: account },
      }

      runContractFunction({
        params: tokenParams,
        onSuccess: (values) => {
          setTokenBalance(roundDecimals(ethers.utils.formatEther(values), 6))
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
    setValue2("unstakeValue", stakedTokens)
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
    const tokenAmount = ethers.utils.parseEther(values.stakeValue.toString())
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

  /**
   * @notice stakes a user specified amount of 0Kage
   * @param {any} values captures stake value input by user
   */
  const stake = (values) => {
    const stakeValue = values.stakeValue
    if (!allowanceApproved) {
      // seek approval first & exit
      seekApproval(values)
    } else {
      // if approved -> then go ahead and add liquidity
      if (stakeValue && stakeValue.toString() !== "0") {
        const stakeOptions = {
          ...apiParams,
          functionName: "stake",
          params: {
            stakeAmount: ethers.utils.parseEther(stakeValue.toString()),
          },
        }
        console.log("add stake options", stakeOptions)

        runContractFunction({
          params: stakeOptions,
          onSuccess: successAddStakeHandler,
          onError: errorHandler,
        })
      }
    }
  }

  /**
   * @notice function calls the remove Staking function
   * @param {any} values values captured by remove liquidity form
   */
  const unstake = (values) => {
    const unstakeValue = values.unstakeValue
    console.log("unstake value", unstakeValue)
    if (unstakeValue <= 0) {
      toast({
        title: `Error`,
        status: "error",
        description: "Invalid amount to unstake",
        isClosable: true,
        duration: 9000,
      })
      return
    }
    const unstakeOptions = {
      ...apiParams,
      functionName: "unstake",
      params: {
        unStakeAmount: ethers.utils.parseEther(unstakeValue.toString()),
      },
    }
    console.log("unstaking params", unstakeOptions)

    runContractFunction({
      params: unstakeOptions,
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
              <Tooltip label="Stake any amount upto your token balance">
                <Text fontSize="md" fontWeight="bold">
                  Stake 0Kage
                </Text>
              </Tooltip>

              <HStack spacing="4" justify="end">
                <Badge variant="subtle" colorScheme="blue">
                  {`Balance: ${tokenBalance} 0KAGE`}
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

            <form onSubmit={handleSubmit(stake)}>
              <FormControl mt="10" isInvalid={Object.entries(errors).length}>
                <HStack spacing="4">
                  <FormLabel>Amount to Stake</FormLabel>
                  <VStack>
                    <Input
                      placeholder="Enter amt in Eth terms"
                      type="number"
                      {...register("stakeValue", {
                        required: {
                          value: true,
                          message: "Specify amount to stake",
                        },
                        min: {
                          value: 0.000000001,
                          message: "Invalid stake amount",
                        },
                        max: {
                          value: tokenBalance,
                          message: "Staked tokens exceed current token balance",
                        },
                      })}
                    />
                    {console.log("error msg", errors?.stakeValue?.message)}
                    <FormErrorMessage>
                      {errors?.stakeValue?.message}
                    </FormErrorMessage>
                  </VStack>
                  {/* <ErrorTemplate errors={errors} /> */}
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
                  width="inherit"
                  isDisabled={isLoading || isFetching || isConfirming}>
                  {isFetching ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                    />
                  ) : (
                    "Stake 0Kage"
                  )}
                </Button>
              </VStack>
            </form>
          </Card>

          <Card mt="10" width="400">
            <HStack spacing="4">
              <Tooltip label="You can only unstake if there is an existing stake balance.">
                <Text fontSize="md" fontWeight="bold">
                  Unstake 0Kage
                </Text>
              </Tooltip>
              <Badge variant="subtle" colorScheme="green">
                {`Staked: ${stakedTokens} 0KAGE`}
              </Badge>
            </HStack>
            <Box mt="10">
              <form onSubmit={handleSubmit2(unstake)}>
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
                    placeholder="Enter amount to unstake"
                    {...register2("unstakeValue", {
                      required: { value: true, message: "Enter LP tokens" },
                      min: { value: 0, message: "Invalid value" },
                      max: {
                        value: stakedTokens,
                        message: "Staked tokens exceed current balance",
                      },
                      validate: {
                        limit: (v) =>
                          parseFloat(v) <= parseFloat(stakedTokens) ||
                          "Entered value exceeds current staking balance",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors2?.unstakeValue?.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  type="submit"
                  mt="10"
                  isDisabled={isLoading || isFetching || isConfirming}>
                  {isFetching ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                    />
                  ) : (
                    "Unstake 0Kage"
                  )}
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
