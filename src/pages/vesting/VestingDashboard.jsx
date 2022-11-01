import { Card } from "../../components/cards/Card"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { useState, useEffect } from "react"
// import { VestingScheduleTable } from "./VestingScheduleTable"
import { EmptyWaitingModal } from "../../components/modals/EmptyWaitingModal"
import { ethers } from "ethers"
import vestingContractAbi from "../../contracts/localhost_TokenVesting.json"
import vestingContractAbiGoerli from "../../contracts/goerli_TokenVesting.json"

import {
  Box,
  // Center,
  VStack,
  // HStack,
  Text,
  Heading,
  // Button,
  // Container,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react"
import addressList from "../../contracts/addresses.json"
import { roundDecimals } from "../../utils/web3-formats"
import { VestingSummaryCard } from "./VestingSummaryCard"

export const VestingDashboard = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)
  const toast = useToast()

  const [allocated, setAllocated] = useState(0)
  const [released, setReleased] = useState(0)
  const [pending, setPending] = useState(0)
  const [schedules, setSchedules] = useState([])
  const [updateschedules, setUpdateSchedules] = useState(true)
  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()
  const vestingAbi =
    networkName && networkName === "goerli"
      ? vestingContractAbiGoerli
      : vestingContractAbi

  //***************** USE EFFECT FUNCTIONS ************** */

  useEffect(() => {
    if (!chainId || !account) return
    if (updateschedules) {
      Promise.all([allMetrics(), getVestingSchedulesForBeneficiary()])
        .then(([metrics, schedules]) => {
          successHandler(metrics)
          schedulesHandler(schedules)
          setUpdateSchedules(false)
        })
        .catch((e) => errorHandler(e))
    }

    // allMetrics()
    // getVestingSchedulesForBeneficiary()
  }, [account, chainId, updateschedules])

  //--------------------------------------------------/

  //***************** API FUNCTIONS ************** */

  const allMetrics = () => {
    const vestingAddress = getVestingAddress()
    const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }
    if (vestingAddress) {
      const allMetricsParams = {
        ...apiParams,
        functionName: "getAllVestingMetcis",
        params: {
          beneficiary: account,
        },
      }

      return runContractFunction({
        params: allMetricsParams,
        // onSuccess: (metrics) => successHandler(metrics),
        // onError: (e) => errorHandler(e),
      })
    }
    return
  }

  const getVestingSchedulesForBeneficiary = () => {
    const vestingAddress = getVestingAddress()
    if (vestingAddress) {
      const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

      const getParams = {
        ...apiParams,
        functionName: "getVestingScheduleForBeneficiary",
        params: {
          beneficiary: account,
        },
      }

      return runContractFunction({
        params: getParams,
        // onSuccess: (schedules) => schedulesHandler(schedules),
        // onError: (e) => errorHandler(e),
      })
    }
    return
  }
  //--------------------------------------------------/

  // ************************** CALLBACKS FUNCTIONS ********************

  const schedulesHandler = (schedulesArray) => {
    const localSchedules = []
    for (let i = 0; i < schedulesArray.length; i++) {
      const scheduleObj = getScheduledObject(schedulesArray[i])
      localSchedules.push(scheduleObj)
    }
    setSchedules(localSchedules)
  }

  const successHandler = (metrics) => {
    const { totalAllocated, totalReleased, totalPending } = metrics

    setAllocated(roundDecimals(ethers.utils.formatEther(totalAllocated), 6))
    setPending(roundDecimals(ethers.utils.formatEther(totalPending), 6))
    setReleased(roundDecimals(ethers.utils.formatEther(totalReleased), 6))
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
    // insert error notification here
  }

  // ---------------------------------------------------------------
  //***************** HELPER FUNCTIONS ************** */

  const getVestingAddress = () => {
    if (!chainId) return null
    const chainIdString = parseInt(chainId)
    return addressList[chainIdString]["TokenVesting"][0]
  }

  const getScheduledObject = (scheduleArray) => {
    const mapping = {
      0: "initialized",
      1: "beneficiary",
      2: "cliff",
      3: "vestingStart",
      4: "vestingEnd",
      5: "vestingCycle",
      6: "revocable",
      7: "allocated",
      8: "released",
      9: "revoked",
      10: "identifier",
    }
    return scheduleArray.reduce((prev, current, indx) => {
      return { ...prev, ...{ [mapping[indx]]: current } }
    }, {})
  }

  //--------------------------------------------------/

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
                  <Text fontWeight="bold">Total Allocated</Text>
                  <Text fontSize="2xl">{allocated}</Text>
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
                  <Text fontWeight="bold">Pending Release</Text>
                  <Text fontSize="2xl">{pending}</Text>
                </span>
              </Card>
            </SimpleGrid>
          </VStack>

          <VStack mt="10" spacing="4">
            <Heading as="h4" fontSize="xl">
              Vesting Breakdown
            </Heading>
            {schedules &&
              schedules.map((schedule) => (
                <VestingSummaryCard
                  schedule={schedule}
                  updateSchedule={setUpdateSchedules}
                  // revoke={<Button>Revoke</Button>}
                />
              ))}
          </VStack>
        </Box>
      )}
      <EmptyWaitingModal isOpen={isLoading} />
    </Box>
  )
}
