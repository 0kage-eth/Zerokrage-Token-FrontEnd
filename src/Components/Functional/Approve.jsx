import {
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  HStack,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react"
import { Card } from "../cards/Card"
import { useForm } from "react-hook-form"
import { utils } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState } from "react"
import { roundDecimals } from "../../utils/web3-formats"
import { WaitingModal } from "../modals/WaitingModal"

export const Approve = ({ abi, address, updateBalance }) => {
  const [allowance, setAllowance] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const { account } = useMoralis()
  const { runContractFunction, isFetching, isLoading } = useWeb3Contract()

  const successHandler = async (txnResponse) => {
    setIsConfirming(true)
    // wait for 1 block confirmation
    const txnReceipt = await txnResponse.wait(1)

    setIsConfirming(false)
    // insert success notification
    toast({
      title: `Success`,
      status: "success",
      description: `Transaction Approved. Txn hash ${txnReceipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
    updateBalance()
  }

  const errorHandler = (e) => {
    toast({
      title: `Error`,
      status: "error",
      description: `${e.message}`,
      isClosable: true,
      duration: 9000,
    })
    // insert error notification
    console.log("error")
  }

  const onSubmit = (values) => {
    const approveParams = {
      abi: abi,
      contractAddress: address,
      params: {
        spender: values.spender,
        amount: utils.parseEther(values.amount),
      },
      functionName: "approve",
    }

    runContractFunction({
      params: approveParams,
      onSuccess: successHandler,
      onError: errorHandler,
    })
  }

  const chkAllowanceSuccessHandler = (result) => {
    console.log(
      "Successfully calculated allownace of value,",
      parseInt(result).toString()
    )
    setAllowance(result)
  }

  const checkBalance = () => {
    const spender = watch("spender")
    const amount = watch("amount")
    const optionalParams = {
      abi: abi,
      contractAddress: address,
      functionName: "allowance",
      params: { owner: account, spender: spender },
    }
    console.log("params sent", optionalParams)

    runContractFunction({
      params: optionalParams,
      onSuccess: chkAllowanceSuccessHandler,
      onError: errorHandler,
    })
  }

  return (
    <Box>
      <Card>
        <Heading as="h4" fontSize="xl">
          Approve
        </Heading>

        <Box mt="2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name}>
              {/* <FormLabel htmlFor="spender">Spender</FormLabel> */}
              <Input
                id="spender"
                placeholder="spender address.."
                {...register("spender", {
                  required: "Spender address is needed",
                  pattern: {
                    value: "^0x[a-fA-F0-9]{40}$",
                    message: "Invalid address",
                  },
                })}
              />
              {/* <FormLabel htmlFor="amount">Amount</FormLabel> */}
              <Input
                mt={2}
                id="amount"
                placeholder="amount in eth units"
                {...register("amount", {
                  required: "Amount needed",
                  min: { value: 0, message: "Approval amount has to be >0" },
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <HStack spacing="4" mt={4}>
              <Button type="submit" colorScheme="blue" isLoading={isFetching}>
                Approve
              </Button>
              <Button
                colorScheme="gray"
                variant="outline"
                isLoading={isLoading}
                onClick={checkBalance}>
                <Text fontSize="sm">Check Allowance</Text>
              </Button>
              {allowance && (
                <Text fontSize="sm">{`Allowance: ${roundDecimals(
                  utils.formatEther(allowance)
                )} 0KAGE`}</Text>
              )}
            </HStack>
          </form>
        </Box>
      </Card>
      <WaitingModal isOpen={isConfirming} />
    </Box>
  )
}
