import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  SimpleGrid,
  Center,
  Tabs,
  TabPanel,
  TabList,
  TabPanels,
  Tab,
} from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState, useEffect } from "react"

import { Card } from "../components/cards/Card"
import { Stat } from "../components/dashboard/Stat"

import zeroKageLocalAbi from "../contracts/localhost_ZeroKage.json"
import zeroKageGoerliAbi from "../contracts/localhost_ZeroKage.json"
import stakeLocalAbi from "../contracts/localhost_StakingRewards.json"
//import stakeGoerliAbi from "../contracts/goerli_DEX.json"
import rKageLocalAbi from "../contracts/localhost_r0Kage.json"
import { getNetworkName } from "../utils/misc"
import addressList from "../contracts/addresses.json"

import { ethers } from "ethers"
import { roundDecimals } from "../utils/web3-formats"

export const StakingDashboard = () => {
  const { account, chainId } = useMoralis()
  const [staked, setStaked] = useState("0")
  const [accruedReward, setAccruredReward] = useState("0")
  const [redeemableReward, setRedeemableReward] = useState("0")
  const [updateStake, setUpdateStake] = useState(true)
  const [updateAccrued, setUpdateAccrued] = useState(true)
  const [updateReward, setUpdateReward] = useState(true)
  const numChainId = parseInt(chainId)
  const chainIdString = chainId && parseInt(chainId)
  const networkName = getNetworkName(chainId)
  const { runContractFunction, isLoading } = useWeb3Contract()

  //******* Contract ABIs and addresses ******************//

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

  const zKageAddress = chainIdString
    ? addressList[chainIdString]["ZeroKage"][0]
    : null

  const stakeAddress = chainIdString
    ? addressList[chainIdString]["StakingRewards"][0]
    : null

  const rKageAddress = chainIdString
    ? addressList[chainIdString]["r0Kage"][0]
    : null
  //******************************************************//

  //***************** USE EFFECT FUNCTIONS ***************//

  /**
   * On opening screen, need to calculate following
   *  1. Staked 0Kage
   *  2. Accrued rewards Kage (that will be redeemable if user unstakes)
   *  3. Redeemable rewards Kage (this is 0Kage that is not yet transferred to users)
   */

  useEffect(() => {
    // get staked tokens

    if (updateStake) {
      const stakeOptions = {
        abi: stakingAbi,
        contractAddress: stakeAddress,
        functionName: "getStakingBalance",
        params: { staker: account },
      }

      runContractFunction({
        params: stakeOptions,
        onSuccess: (values) => {
          setStaked(roundDecimals(ethers.utils.formatEther(values), 6))
          setUpdateStake(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [account, chainId, updateStake])

  useEffect(() => {
    // get accrued reward tokens
    if (updateAccrued) {
      const accureRewardsOptions = {
        abi: stakingAbi,
        contractAddress: stakeAddress,
        functionName: "getStakerAccruedRewards",
        params: {},
      }

      runContractFunction({
        params: accureRewardsOptions,
        onSuccess: (values) => {
          console.log("returning accrued reward output", values)
          setAccruredReward(roundDecimals(ethers.utils.formatEther(values), 6))
          setUpdateAccrued(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [account, chainId])

  useEffect(() => {
    // get redeemable reward tokens
    if (updateReward) {
      const redeemableRewardsOptions = {
        abi: stakingAbi,
        contractAddress: stakeAddress,
        functionName: "getStakerReward",
        params: { staker: account },
      }

      runContractFunction({
        params: redeemableRewardsOptions,
        onSuccess: (values) => {
          console.log("returning redeem reward output", values)
          setRedeemableReward(
            roundDecimals(ethers.utils.formatEther(values), 6)
          )
          setUpdateReward(false)
        },
        onError: (e) => console.log(e),
      })
    }
  }, [account, chainId])

  const redeemRewardsHandler = () => {
    const redeemRewardsOptions = {
      abi: stakingAbi,
      contractAddress: stakeAddress,
      functionName: "distributeReward",
      params: {},
    }

    runContractFunction({
      params: redeemRewardsOptions,
      onSuccess: (values) => {
        setRedeemableReward(roundDecimals(ethers.utils.formatEther(values), 6))
        setUpdateReward(true)
        setUpdateAccrued(true)
      },
      onError: (e) => console.log(e),
    })
  }

  //-----------------------------------------------------------//
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

      {(numChainId === 5 || numChainId === 31337) && account && (
        <Container>
          <Card mt="10" width="400">
            <Text fontSize="md" fontWeight="bold">
              Your Stats
            </Text>
            <SimpleGrid columns="3" spacing="10">
              <Stat label="Current Staked 0Kage" value={staked} />
              <Stat
                label="Accrued Rewards"
                value={accruedReward - redeemableReward}
              />
              <Stat label="Redeemable Rewards" value={redeemableReward} />
            </SimpleGrid>
            <Center>
              <Button
                size="sm"
                colorScheme="blue"
                mt="10"
                onClick={redeemRewardsHandler}>
                Redeem Rewards
              </Button>
            </Center>
          </Card>

          <Card mt="10" overflowY="auto">
            <Heading as="h3" fontSize="md">
              History
            </Heading>
            <Tabs mt="4">
              <TabList>
                <Tab>Stake</Tab>
                <Tab>Withdrawals</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>Import stake/unstake txns from Subgraph - TBD</p>
                </TabPanel>
                <TabPanel>
                  <p>Import withdrawal txns from Subgraph - TBD</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </Container>
      )}
    </Box>
  )
}
