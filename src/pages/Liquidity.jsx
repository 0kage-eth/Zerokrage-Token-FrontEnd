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
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState } from "react"

import zeroKageLocalAbi from "../contracts/localhost_ZeroKage.json"
import zeroKageGoerliAbi from "../contracts/localhost_ZeroKage.json"
import dexLocalAbi from "../contracts/localhost_DEX.json"
import dexGoerliAbi from "../contracts/goerli_DEX.json"
import { getNetworkName } from "../utils/misc"
import addressList from "../contracts/addresses.json"
import { ethers } from "ethers"
import { roundDecimals } from "../utils/web3-formats"
import { WaitingModal } from "../components/modals/WaitingModal"
import { ErrorTemplate } from "../components/errors/ErrorTemplate"

export const Liquidity = () => {
  const { account, chainId } = useMoralis()
  const toast = useToast()

  console.log("chain Id", chainId)
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  const zKageAbi =
    networkName && networkName === "goerli"
      ? zeroKageGoerliAbi
      : zeroKageLocalAbi

  const dexAbi =
    networkName && networkName === "goerli" ? dexGoerliAbi : dexLocalAbi

  const chainIdString = chainId && parseInt(chainId)
  const zKageAddress = chainIdString
    ? addressList[chainIdString]["ZeroKage"][0]
    : null
  const dexAddress = chainIdString ? addressList[chainIdString]["DEX"][0] : null

  const [lpTokens, setLpTokens] = useState(5)
  const [allowanceApproved, setAllowanceApproved] = useState(false)
  const [isUpdateLPTokens, setIsUpdateLPTokens] = useState(true)
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

  console.log("---->", errors2)
  const { runContractFunction, isLoading } = useWeb3Contract()
  const apiParams = { abi: dexAbi, contractAddress: dexAddress }
  //******************* USE EFFECT **************/

  /**
   * @notice check allowance amount of token for DEX contract
   * @dev in order to add or remove liquidity, token has to be approved first
   * @dev as soon as page loads, get the approval amount
   */
  // useEffect(() => {
  //   const allowanceParams = {
  //     abi: zKageAbi,
  //     contractAddress: zKageAddress,
  //     functionName: "allowance",
  //     params: { owner: account, spender: dexAddress },
  //   }

  //   runContractFunction({
  //     params: allowanceParams,
  //     onSuccess: (value) => setAllowance(ethers.formatEther(value)),
  //     onError: errorHandler,
  //   })
  // }, [account])

  /**
   * @notice as soon as page is loaded, we need to recover # of LP tokens for user
   * @notice this also should be updated when user adds liquidity or account is changed
   */
  useEffect(() => {
    if (isUpdateLPTokens && chainId && account) {
      const liquidParams = {
        ...apiParams,
        functionName: "getLiquidity",
        params: { user: account },
      }

      runContractFunction({
        params: liquidParams,
        onSuccess: (values) => {
          setLpTokens(roundDecimals(ethers.utils.formatEther(values), 6))
          setIsUpdateLPTokens(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [isUpdateLPTokens, chainId, account])

  //****************** EVENT HANDLER FUNCTIONS *****************/

  /**
   * @notice populates LP tokens into the LP token input field in Remove Liquidity Card
   */
  const updateLPTokens = () => {
    setValue2("stakeTokens", lpTokens)
  }
  //----------------------------------------------------//

  //**************** CALLBACK FUNCTIONS ******************** */

  /**
   * @notice send success notification to user once txn receipt is generated
   * @param {any} values returns transaction response
   */
  const successAddLiquidityHandler = async (response) => {
    setIsConfirming(true)
    // wait for 1 block confirmation
    const txnReceipt = await response.wait(1)
    setIsConfirming(false)

    // insert success notification
    toast({
      title: `Success`,
      status: "success",
      description: `Liquidity added. Txn hash ${txnReceipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    // LP tokens need to be recalculated
    // setting to true for UI to update LP token value
    setIsUpdateLPTokens(true)
    setAllowanceApproved(false)
    setValue("stakeValue", null)
    setValue("tokenValue", null)
    // insert success notification here
  }

  const successRemoveLiquidityHandler = async (response) => {
    setIsConfirming(true)
    const removeTx = await response.wait(1)
    setIsConfirming(false)

    toast({
      title: `Success`,
      status: "success",
      description: `Liquidity withdrawn. Txn hash ${removeTx.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    setIsUpdateLPTokens(true)
  }

  const successApproveHandler = async (response) => {
    setIsConfirming(true)

    await response.wait(1)
    setIsConfirming(false)
    toast({
      title: `Token Approved`,
      status: "success",
      description: `Token approved. Click on 'Add Liquidity' to complete process`,
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
      params: { spender: dexAddress, amount: tokenAmount },
      functionName: "approve",
    }

    runContractFunction({
      params: approvalOptions,
      onSuccess: successApproveHandler,
      onError: errorHandler,
      onComplete: () => console.log("completed ....."),
    })
  }

  const onEthChanged = (e) => {
    const value = e.target.value
    if (value >= 0) {
      const ethChangeParams = {
        ...apiParams,
        functionName: "getTokensToPool",
        params: { numEth: ethers.utils.parseEther(value.toString()) },
      }
      runContractFunction({
        params: ethChangeParams,
        onSuccess: (value) => {
          const valueInEth = ethers.utils.formatEther(value)

          setValue("tokenValue", parseFloat(valueInEth))
        },
        onError: (e) => console.log("failed", e),
      })
    }
  }

  const on0KageChanged = (e) => {
    const value = e.target.value
    if (value >= 0) {
      const ZeroKageChangeParams = {
        ...apiParams,
        functionName: "getEthToPool",
        params: { numTokens: ethers.utils.parseEther(value.toString()) },
      }

      runContractFunction({
        params: ZeroKageChangeParams,
        onSuccess: (value) => {
          const valueInEth = ethers.utils.formatEther(value)
          setValue("stakeValue", parseFloat(valueInEth))
        },
        onError: (e) => console.log(e),
      })
    }
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
          onSuccess: successAddLiquidityHandler,
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
      onSuccess: successRemoveLiquidityHandler,
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
            <Text fontSize="md" fontWeight="bold">
              Add Liquidity
            </Text>
            <form onSubmit={handleSubmit(onAddLiquidity)}>
              <FormControl mt="10" isInvalid={Object.entries(errors).length}>
                <VStack spacing="4">
                  <SimpleGrid columns={2} spacingX="10px">
                    <Tag variant="outline" colorScheme="blue">
                      ETH
                    </Tag>
                    <VStack>
                      <Input
                        placeholder="Enter amt in Eth terms"
                        onInput={(e) => onEthChanged(e)}
                        {...register("stakeValue", {
                          required: {
                            value: true,
                            message: "Specify amount to send",
                          },
                        })}
                      />
                      {/* <FormErrorMessage>
                        {errors?.ethValue?.message}
                      </FormErrorMessage> */}
                    </VStack>
                  </SimpleGrid>
                  <SimpleGrid columns={2} spacingX="6px">
                    <Tag variant="outline" colorScheme="blue">
                      0KAGE
                    </Tag>
                    <VStack>
                      <Input
                        placeholder="Enter amt in Eth terms"
                        onInput={(e) => on0KageChanged(e)}
                        {...register("tokenValue", {
                          required: {
                            value: true,
                            message: "Specify amount to receive",
                          },
                        })}
                      />
                      {/* <FormErrorMessage>
                        {errors?.tokenValue?.message}
                      </FormErrorMessage> */}
                    </VStack>
                  </SimpleGrid>
                  <ErrorTemplate errors={errors} />
                </VStack>
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
                  Add Liquidity
                </Button>
              </VStack>
            </form>
          </Card>

          <Card mt="10" width="400">
            <HStack spacing="4">
              <Text fontSize="md" fontWeight="bold">
                Remove Liquidity
              </Text>
              <Badge variant="subtle" colorScheme="blue">
                {`Current LP Tokens: ${lpTokens}`}
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
                      onClick={updateLPTokens}>
                      Max
                    </Button>
                  </HStack>
                  <Input
                    {...register2("stakeTokens", {
                      required: { value: true, message: "Enter LP tokens" },
                      min: { value: 0, message: "Invalid value" },
                      max: {
                        value: { lpTokens },
                        message: "LP tokens exceed max balance",
                      },
                      validate: {
                        limit: (v) =>
                          parseFloat(v) < lpTokens ||
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
                  Remove
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
