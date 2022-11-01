import { Box, Heading, Button, useToast } from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { JobCard } from "../../components/cards/JobCard"
import { JOBS } from "../../constants"
import { useState, useEffect } from "react"
import { VestingAgreementModal } from "./VestingAgreementModal"
import vestingContractAbi from "../../contracts/localhost_TokenVesting.json"
import vestingContractAbiGoerli from "../../contracts/goerli_TokenVesting.json"

import addressList from "../../contracts/addresses.json"
import { EmptyWaitingModal } from "../../components/modals/EmptyWaitingModal"

let vestingSchedules = [] // list of all vesting schedules for current beneficiary

export const VestingEnter = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)
  const toast = useToast()

  // Setting abis and addresses

  const vestingAbi =
    networkName && networkName === "goerli"
      ? vestingContractAbiGoerli
      : vestingContractAbi // TO DO - create and insert goerli address

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [schedulesUpdated, setSchedulesUpdated] = useState(false)

  const creatingVestingSchedule = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

  useEffect(() => {
    if (!schedulesUpdated && chainId && account) {
      vestingSchedules = [] // re-initialize back to empty array - figure if there is better way
      getVestingSchedulesForBeneficiary()
    }
  }, [account, chainId, schedulesUpdated])

  // ************************* API CALLS ***************************

  // const getVestingSchedulesForBeneficiary = () => {
  //   const vestingAddress = getVestingAddress()
  //   if (vestingAddress) {
  //     const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

  //     const getParams = {
  //       ...apiParams,
  //       functionName: "getVestingScheduleForBeneficiary",
  //       params: {
  //         beneficiary: account,
  //       },
  //     }

  //     runContractFunction({
  //       params: getParams,
  //       onSuccess: (schedules) => schedulesHandler(schedules),
  //       onError: (e) => errorHandler(e),
  //     })
  //   }
  // }

  const getVestingSchedulesForBeneficiary = () => {
    const vestingAddress = getVestingAddress()
    if (vestingAddress) {
      const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

      const getParams = {
        ...apiParams,
        functionName: "getCountPerBeneficiary",
        params: {
          beneficiary: account,
        },
      }

      runContractFunction({
        params: getParams,
        onSuccess: (scheduleCount) => successCountHandler(scheduleCount),
        onError: (e) => errorHandler(e),
      })
    }
  }

  const getVestingScheduleForBeneficiaryAndId = (beneficiary, index) => {
    const vestingAddress = getVestingAddress()
    if (vestingAddress) {
      const apiParams = { abi: vestingAbi, contractAddress: vestingAddress }

      const getParams = {
        ...apiParams,
        functionName: "getVestingScheduleForAddressAndIndex",
        params: {
          beneficiary: beneficiary,
          index: index,
        },
      }
      runContractFunction({
        params: getParams,
        onSuccess: (schedule) => schedulesArrayHandler(schedule),
        onError: (e) => errorHandler(e),
      })
    }
  }

  // ---------------------------------------------------------------

  // ************************** CALLBACKS FUNCTIONS ********************

  const successCountHandler = (scheduleCount) => {
    console.log("count of schedules", scheduleCount)

    if (scheduleCount > 0) {
      ;[...Array(scheduleCount).keys()].map((index) => {
        return getVestingScheduleForBeneficiaryAndId(account, index)
      })
    }
  }

  // const schedulesHandler = (schedules) => {
  //   console.log("all schedules", schedules)
  // }

  const schedulesArrayHandler = (schedule) => {
    const scheduleObj = getScheduledObject(schedule)
    vestingSchedules = [...vestingSchedules, scheduleObj]
    setSchedulesUpdated(true)
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

  // ************************** HELPER FUNCTIONS ********************

  const getVestingAddress = () => {
    if (!chainId) return null
    const chainIdString = parseInt(chainId)
    return addressList[chainIdString]["TokenVesting"][0]
  }

  const vestingExists = (job) => {
    if (vestingSchedules.length > 0) {
      const schedule = vestingSchedules.find((scheduleObj) => {
        return scheduleObj.identifier == job.id
      })
      if (schedule) return true
    }
    return false
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

  //-----------------------------------------------------------------//
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
        <Box width="70%" mx="auto">
          {JOBS.map((job) => {
            console.log("vesting exists for job", vestingExists(job))
            return (
              <JobCard
                id={job.id}
                title={job.role}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => creatingVestingSchedule(job)}
                    isDisabled={vestingExists(job)}>
                    {vestingExists(job) ? " Ongoing Vesting" : "Join Vesting"}
                  </Button>
                }
                place={job.place}
                tokens={job.tokens}
                cliff={job.cliff}
                duration={job.duration}></JobCard>
            )
          })}

          <VestingAgreementModal
            isOpen={isModalOpen}
            isOpenHandler={setIsModalOpen}
            updateScheduleHandler={setSchedulesUpdated}
            job={selectedJob}
          />
        </Box>
      )}
      <EmptyWaitingModal isOpen={isLoading} />
    </Box>
  )
}
