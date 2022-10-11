import {
  Box,
  Text,
  Heading,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Input,
  SimpleGrid,
  FormErrorMessage,
} from "@chakra-ui/react"
import { createRef } from "react"
import { useForm } from "react-hook-form"
import { Card } from "../components/cards/Card"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { TokenDropdown } from "../components/dropdown/TokenDropdown"
import { useState } from "react"

import zeroKageLocalAbi from "../contracts/localhost_ZeroKage.json"
import zeroKageGoerliAbi from "../contracts/localhost_ZeroKage.json"
import dexLocalAbi from "../contracts/localhost_DEX.json"
import dexGoerliAbi from "../contracts/goerli_DEX.json"
import { getNetworkName } from "../utils/misc"
import addressList from "../contracts/addresses.json"
import { ethers } from "ethers"

export const Swap = () => {
  const { account, chainId } = useMoralis()

  console.log("chain Id", chainId)
  const networkName = getNetworkName(chainId)

  const zKageAbi =
    networkName && networkName == "goerli"
      ? zeroKageGoerliAbi
      : zeroKageLocalAbi

  const dexAbi =
    networkName && networkName == "goerli" ? dexGoerliAbi : dexLocalAbi

  const chainIdString = chainId && parseInt(chainId)
  const zKageAddress = chainIdString
    ? addressList[chainIdString]["ZeroKage"]
    : null
  const dexAddress = chainIdString ? addressList[chainIdString]["DEX"][0] : null

  const [timer, setTimer] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const sendTokenRef = createRef()
  const receiveTokenRef = createRef()

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

  console.log("send token ", sendTokenRef?.current?.value)
  console.log("receive token ", receiveTokenRef?.current?.value)

  // recalculate receive token qty when send token value qty is changed by user
  const onSendTokenValueChanged = (e, tokenRef) => {
    const value = e.target.value
    const sendToken = tokenRef?.current?.value

    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      console.log("toke ref current val in send", sendToken)
      sendToken === "ETH"
        ? EthToToken("receive", value)
        : TokenToEth("receive", value)
    }, 500)

    setTimer(newTimer)
  }

  const onReceiveTokenValueChanged = (e, tokenRef) => {
    const value = e.target.value
    const receiveToken = tokenRef?.current?.value
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      console.log("toke ref current val in receive", receiveToken)
      receiveToken === "ETH"
        ? EthToToken("send", value)
        : TokenToEth("send", value)
    }, 500)

    setTimer(newTimer)
  }

  const successSwapHandler = (values) => {
    console.log("output", values)
  }

  const errorHandler = () => {}

  // first get swap units
  const onSubmit = (values) => {
    console.log("values", values)
    console.log("send token", sendTokenRef.current?.value)
    console.log("receive token", receiveTokenRef.current?.value)

    const sendEth = sendTokenRef?.current?.value === "ETH"
    const swapParams = {
      abi: dexAbi,
      contractAddress: dexAddress,
      functionName: sendEth ? "ethToZeroKage" : "zeroKageToEth",
      params: sendEth
        ? {}
        : { zeroKageTokens: ethers.utils.parseEther(values.send) },
      msgValue: sendEth ? ethers.utils.parseEther(values.send) : null,
    }

    console.log("swap params", swapParams)

    runContractFunction({
      params: swapParams,
      onSuccess: successSwapHandler,
      onError: errorHandler,
    })
  }

  /**
   * @param {string} token token receive - receive field should be set, send - send field should be set
   * @notice function calculates # of $ETH tokens that need to be swapped for a user-specified $0KAGE
   * @dev set a timeout of 0.5 seconds after user stops typing -> query price API only aftet this using setTimeout
   */
  const TokenToEth = (token, value) => {
    console.log("Token->Eth conversion..")
    console.log("token is", token)
    const priceParams = {
      abi: dexAbi,
      contractAddress: dexAddress,
      params: { numTokens: ethers.utils.parseEther(value) },
      functionName: "getSwappableEth",
    }
    // runContractFunction()

    runContractFunction({
      params: priceParams,
      onSuccess: (value) => setValue(token, ethers.utils.formatEther(value)),
      onError: (e) => console.log(e),
    })
  }

  /**
   * @notice function calculates # of $0Kage tokens that need to be exchanged for a user-specified $ETH
   * @dev set a timeout of 0.5 seconds after user stops typing -> query price API only aftet this using setTimeout

  */
  const EthToToken = (token, value) => {
    console.log("Eth->Token conversion..")
    console.log("token is", token)

    console.log("dex abi", dexAbi)
    console.log("dex address", dexAddress)
    const priceParams = {
      abi: dexAbi,
      contractAddress: dexAddress,
      params: { numEth: ethers.utils.parseEther(value) },
      functionName: "getSwappableTokens",
    }

    runContractFunction({
      params: priceParams,
      onSuccess: (value) => setValue(token, ethers.utils.formatEther(value)),
      onError: (e) => console.log(e),
    })
  }

  return (
    <Box as="section" height="100vh" width={1200} overflowY="auto" mx="auto">
      {(!account || !chainId) && (
        <Heading as="h2" fontSize="2xl" my="auto" textAlign="10" mt="10">
          Please connect your wallet
        </Heading>
      )}

      {chainId && account && (
        <Container>
          <Card mt="10" width="400">
            <Text fontSize="md" fontWeight="bold">
              Swap
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt="10">
                <VStack spacing="4">
                  <SimpleGrid columns={3} spacingX="10px">
                    <FormLabel>Send</FormLabel>
                    <Input
                      placeholder="Enter amt in Eth terms"
                      onInput={(e) => onSendTokenValueChanged(e, sendTokenRef)}
                      {...register("send", {
                        required: {
                          value: true,
                          message: "Specify amount to send",
                        },
                      })}
                    />
                    <TokenDropdown
                      tokenList={["ETH", "0KAGE"]}
                      ref={sendTokenRef}
                    />
                  </SimpleGrid>
                  <SimpleGrid columns={3} spacingX="6px">
                    <FormLabel>Receive</FormLabel>
                    <Input
                      onInput={(e) =>
                        onReceiveTokenValueChanged(e, receiveTokenRef)
                      }
                      placeholder="Enter amt in Eth terms"
                      {...register("receive", {
                        required: {
                          value: true,
                          message: "Specify amount to receive",
                        },
                      })}
                    />
                    <TokenDropdown
                      tokenList={["0KAGE", "ETH"]}
                      ref={receiveTokenRef}
                    />
                  </SimpleGrid>
                </VStack>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                variant="solid"
                mt="10"
                width="50%">
                Swap
              </Button>
            </form>
          </Card>
        </Container>
      )}
    </Box>
  )
}
