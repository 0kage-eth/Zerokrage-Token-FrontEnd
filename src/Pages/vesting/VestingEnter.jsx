import { Box, Heading, Button, Icon, useToast } from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { JobCard } from "../../components/cards/JobCard"
import { GoPencil } from "react-icons/go"
import { JOBS } from "../../constants"
import { useState, useEffect } from "react"
import { VestingAgreementModal } from "./VestingAgreementModal"
import vestingContractAbi from "../../contracts/localhost_TokenVesting.json"
import addressList from "../../contracts/addresses.json"

export const VestingEnter = () => {
  const { account, chainId } = useMoralis()
  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)
  const toast = useToast()
  const [isConfirming, setIsConfirming] = useState(false)
  const [vestingSchedules, setVestingSchedules] = useState([])

  // Setting abis and addresses

  const vestingAbi =
    networkName && networkName === "goerli"
      ? vestingContractAbi
      : vestingContractAbi // TO DO - create and insert goerli address

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})

  const creatingVestingSchedule = (job) => {
    console.log("asdasdasdas")
    console.log("job selected", job)
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

  useEffect(() => {
    getVestingSchedulesForBeneficiary()
  }, [account, chainId])

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
        functionName: "getVestingScheduleIdForAddressAndIndex",
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
        console.log("index", index)
        return getVestingScheduleForBeneficiaryAndId(account, index)
      })
    }
  }

  const schedulesHandler = (schedules) => {
    console.log("all schedules", schedules)
    setVestingSchedules(schedules)
  }

  const schedulesArrayHandler = (schedule) => {
    console.log("schedule", schedule)
    setVestingSchedules([...vestingSchedules, schedule])
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

  const vestingExists = (job) => {
    // if (vestingSchedules.length > 0) {
    //   console.log("entering find function")
    //   const schedule = vestingSchedules.find((scheduleArray) => {
    //     console.log("schedule array", scheduleArray)
    //     const identifierObject = scheduleArray.find((element) => {
    //       console.log("element", element)
    //     })
    //     if (identifierObject) {
    //       return identifierObject["identifer"] == job.id
    //     }
    //   })
    //   console.log("schedule", schedule)
    //   if (schedule) return true
    // }
    return false
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
            return (
              <JobCard
                id={job.id}
                title={job.role}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => creatingVestingSchedule(job)}
                    isDisabled={() => vestingExists(job)}>
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
            job={selectedJob}
          />
        </Box>
      )}
    </Box>
  )
}
