import { Card } from "../../components/cards/Card"
import {
  Box,
  Text,
  SimpleGrid,
  Heading,
  Flex,
  Button,
  Stack,
  Spinner,
  Tooltip,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import vestingContractAbi from "../../contracts/localhost_TokenVesting.json"
import vestingContractAbiGoerli from "../../contracts/goerli_TokenVesting.json"

import { useState, useEffect } from "react"
import {
  dateFormatddMMMyy,
  getNetworkName,
  getMonthsFromCliff,
} from "../../utils/misc"
import { useMoralis, useWeb3Contract } from "react-moralis"
import addressList from "../../contracts/addresses.json"
import { ethers } from "ethers"
import { roundDecimals } from "../../utils/web3-formats"

export const VestingSummaryCard = ({ schedule, updateSchedule }) => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()
  const toast = useToast()
  const [releasable, setReleasable] = useState("0")
  const [id, setId] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [updateReleasable, setUpdateReleasable] = useState(true)
  // Setting abis and addresses

  const vestingAbi =
    networkName && networkName === "goerli"
      ? vestingContractAbiGoerli
      : vestingContractAbi

  // ************************* USE EFFECT CALLS ***************************

  useEffect(() => {
    if (updateReleasable && chainId && account) {
      getPendingRelease()
    }
  }, [account, chainId, updateReleasable])

  // --------------------------------------------------------------

  // ************************* API CALLS ***************************

  const release = () => {
    if (releasable == 0) {
      toast({
        title: `Error`,
        status: "error",
        description:
          "Looks like you don't have enough vested tokens to release",
        isClosable: true,
        duration: 9000,
      })
      return
    }
    const vestingAddress = getVestingAddress()
    const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }
    if (id && vestingAddress) {
      const releaseParams = {
        ...apiParams,
        functionName: "release",
        params: {
          vestingScheduleId: id,
          amount: ethers.utils.parseEther(releasable),
        },
      }
      console.log("release params", releaseParams)
      runContractFunction({
        params: releaseParams,
        onSuccess: (response) => releaseHandler(response),
        onError: (e) => errorHandler(e),
      })
    }
  }

  const getPendingRelease = () => {
    const vestingAddress = getVestingAddress()
    if (vestingAddress) {
      const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

      const getParams = {
        ...apiParams,
        functionName: "getId",
        params: {
          beneficiary: account,
          index: schedule.identifier - 1, // identifier starts from 1 -> subtracting to get 0 indexed array
        },
      }

      runContractFunction({
        params: getParams,
        onSuccess: (id) => {
          setId(id)
          calculateReleasableAmount(id)
        },
        onError: (e) => errorHandler(e),
      })
    }
  }
  const calculateReleasableAmount = (inputId) => {
    const vestingAddress = getVestingAddress()
    if (vestingAddress) {
      const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

      const getParams = {
        ...apiParams,
        functionName: "getReleasableAmount",
        params: {
          id: inputId,
        },
      }

      runContractFunction({
        params: getParams,
        onSuccess: (amount) => {
          setReleasable(roundDecimals(ethers.utils.formatEther(amount), 6))
          setUpdateReleasable(false) // this is now updated
        },
        onError: (e) => errorHandler(e),
      })
    }
  }
  // ---------------------------------------------------------------

  // ************************** CALLBACKS FUNCTIONS ********************

  const releaseHandler = async (response) => {
    setIsConfirming(false)
    const receipt = await response.wait(1)
    setIsConfirming(true)
    toast({
      title: `Success`,
      status: "success",
      description: `Pending amount released. Txn hash ${receipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    updateSchedule(true)
    setUpdateReleasable(false)
  }
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

  // ---------------------------------------------------------------

  // ************************** HELPER FUNCTIONS ********************
  const getVestingAddress = () => {
    if (!chainId) return null
    const chainIdString = parseInt(chainId)
    return addressList[chainIdString]["TokenVesting"][0]
  }

  const getDate = (dateValue) => {
    if (!dateValue) return null

    const dateInSecs = dateValue * 1000
    const tmpDate = new Date(dateInSecs)

    return dateFormatddMMMyy(tmpDate)
  }

  //-----------------------------------------------------------------//

  return (
    <Box as="section" py="4" bg={useColorModeValue("gray.100", "gray.800")}>
      <Card>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "4", md: "10" }}>
          <Box width="full">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                size="md"
                fontWeight="extrabold"
                letterSpacing="tight"
                marginEnd="6">
                {schedule.role}
              </Heading>
              <Tooltip label="Click here to release your pending vested amount till date">
                <Button
                  colorScheme="blue"
                  onClick={() => release()}
                  isDisabled={isFetching || isLoading || isConfirming}>
                  {isFetching || isLoading || isConfirming ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                    />
                  ) : (
                    "Release"
                  )}
                </Button>
              </Tooltip>
              {/* {revoke} */}
            </Flex>
            <SimpleGrid columns={3} spacing={10}>
              <Text mt="1" fontWeight="medium">
                {`Start: ${getDate(schedule.vestingStart)}`}
              </Text>
              <Text mt="1" fontWeight="medium">
                {`End: ${getDate(schedule.vestingEnd)}`}
              </Text>
              <Text mt="1" fontWeight="medium">
                {`Cliff: ${getMonthsFromCliff(
                  schedule.vestingStart,
                  schedule.cliff
                )}`}
              </Text>
              <Text mt="1" fontWeight="medium">
                {`Allocated: ${roundDecimals(
                  ethers.utils.formatEther(schedule.allocated),
                  6
                )} 0Kage`}
              </Text>
              <Text mt="1" fontWeight="medium">
                {`Released: ${roundDecimals(
                  ethers.utils.formatEther(schedule.released),
                  6
                )} 0Kage`}
              </Text>
              <Text mt="1" fontWeight="medium">
                {`Pending Release: ${releasable} 0Kage`}
              </Text>
            </SimpleGrid>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}
