import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  OrderedList,
  Link,
  ListItem,
  Tag,
  TagLabel,
  Input,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react"
import { Card } from "../../components/cards/Card"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getNetworkName } from "../../utils/misc"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { CountdownTimer } from "../../components/misc/Countdown"
import { Tile } from "../../components/dashboard/Tile"
import { Link as RouterLink } from "react-router-dom"
import lotteryContractAbi from "../../contracts/localhost_Raffle.json"
import addressList from "../../contracts/addresses.json"
import { ethers } from "ethers"
import { roundDecimals } from "../../utils/web3-formats"
console.log("addressList", addressList)
export const LotteryEnter = () => {
  const { account, chainId } = useMoralis()
  console.log("chainId", chainId)

  const networkName = getNetworkName(chainId)
  const numChainId = parseInt(chainId)

  // TO DO - NEED TO ADD GOERLI ADDRESSES
  const lotteryAbi =
    networkName && networkName === "goerli"
      ? lotteryContractAbi
      : lotteryContractAbi

  const [allowanceApproved, setAllowanceApproved] = useState(false)
  const [entryFee, setEntryFee] = useState("0")
  const targetDate = new Date(2022, 9, 16).getTime() + 24 * 60 * 60 * 1000
  let lotteryAddress
  let apiParams

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { runContractFunction, isLoading } = useWeb3Contract()
  //***************************** USE EFFECT FUCNTIONS ************/
  useEffect(() => {
    if (!chainId) return
    const chainIdString = parseInt(chainId)
    // get lottery fee here`
    lotteryAddress = addressList[chainIdString]["Raffle"][0]
    apiParams = { abi: lotteryAbi, contractAddress: lotteryAddress }
    const lotteryParams = {
      ...apiParams,
      functionName: "getEntranceFee",
      params: {},
    }

    runContractFunction({
      params: lotteryParams,
      onSuccess: (value) => {
        setEntryFee(roundDecimals(ethers.utils.formatEther(value), 6))
      },
      onError: errorHandler,
    })
  }, [account, chainId])

  //******************************************************* */

  //********************** CALL BACK FUNCTIONS ***************/

  const errorHandler = (e) => {
    console.log(e)

    // insert error notification here
  }
  //----------------------------------------------------------/

  //********************* API FUNCTIONS ************************ */

  //-------------------------------------------------------------/

  const enterLottery = (values) => {}

  //--------------------------------------------------------------- */
  return (
    // <div>dfddff</div>
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
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="6" width="inherit">
          <Card mt="10" width="600px">
            <Text fontSize="md" fontWeight="bold">
              Decentralized Lottery Rules
            </Text>

            <OrderedList mt="4" spacing="4">
              <ListItem>Lottery only works on Goerli network</ListItem>
              <ListItem>
                Entry fees and rewards paid in 0KAGE token. Go to{" "}
                <Link as={RouterLink} to="/dex/swap" color="blue">
                  DEX
                </Link>{" "}
                to get 0KAGE tokens
              </ListItem>
              <ListItem>Lottery duration is 24 hours</ListItem>
              <ListItem>Lottery starts at 00:00 hrs UTC</ListItem>
              <ListItem>Lottery ends at 23:45 hrs UTC</ListItem>

              <ListItem>
                Winner is chosen randomly using Chainlink VRF Random Number
                generator
              </ListItem>
              <ListItem>Winner is decided within 15 mins</ListItem>
              <ListItem>
                User will have to withdraw proceeds. No automatic transfer
              </ListItem>
              <ListItem>
                Changes in lottery will be voted via governance
              </ListItem>
            </OrderedList>
          </Card>
          <VStack>
            <Card mt="10" width="400px">
              <HStack spacing="4">
                <Text fontSize="md" fontWeight="bold">
                  Enter Lottery
                </Text>
                <Tag variant="outline" colorScheme="blue" size="md">
                  <TagLabel>{`Fee: ${entryFee} 0KAGE per ticket`}</TagLabel>
                </Tag>
              </HStack>

              <form onSubmit={handleSubmit(enterLottery)}>
                <FormControl mt="6" isInvalid={Object.entries(errors).length}>
                  <HStack spacing="4">
                    <FormLabel>Tickets</FormLabel>
                    <VStack>
                      <Input
                        placeholder="Enter tickets to buy"
                        {...register("numTickets", {
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
                    disabled={!allowanceApproved}>
                    Enter
                  </Button>
                </VStack>
              </form>
            </Card>
            <Card mt="10" width="400px">
              <Text fontSize="md" fontWeight="bold">
                Closes in
              </Text>
              <CountdownTimer targetDate={targetDate} mt="6" />
            </Card>
            <Card mt="10" width="400px">
              <Text fontSize="md" fontWeight="bold">
                Current Stats
              </Text>

              <Tile header="Unique addresses" value="20" mt="2" />
              <Tile header="# of tickets sold" value="100" mt="2" />
              <Tile header="Pot size" value={`200 0Kage`} mt="2" />
            </Card>
          </VStack>
        </SimpleGrid>
      )}
    </Box>
  )
}
