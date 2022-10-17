import { Box, Heading, Button, Icon } from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import { getNetworkName } from "../../utils/misc"
import { JobCard } from "../../components/cards/JobCard"
import { GoPencil } from "react-icons/go"
const JobProfiles = [
  {
    role: "Smartcontract Engineer",
    place: "Remote",
    tokens: "100,000",
    cliff: "12 months",
    duration: "36 months",
  },
  {
    role: "Marketing Manager",
    place: "NYC",
    tokens: "60,000",
    cliff: "6 months",
    duration: "24 months",
  },
  {
    role: "Engagement Manager",
    place: "Remote",
    tokens: "40,000",
    cliff: "6 months",
    duration: "24 months",
  },
]

export const VestingEnter = () => {
  const { account, chainId } = useMoralis()
  const numChainId = parseInt(chainId)

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
          {JobProfiles.map((profile, index) => {
            return (
              <JobCard
                id={index}
                title={profile.role}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={
                      <Icon as={GoPencil} color="gray.400" marginStart="-1" />
                    }>
                    Join
                  </Button>
                }
                place={profile.place}
                tokens={profile.tokens}
                cliff={profile.cliff}
                duration={profile.duration}></JobCard>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
