import {
  Heading,
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react"
import { Card } from "../cards/Card"
import { useForm } from "react-hook-form"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { utils } from "ethers"
import { useState } from "react"

export const Transfer = ({ abi, address, updateBalance }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const [isComplete, setIsComplete] = useState(false)

  const {
    runContractFunction: transfer,
    isFetching,
    isLoading,
  } = useWeb3Contract()

  const successHandler = async (txn) => {
    console.log("txn details on transfer success", txn)

    const receipt = await txn.wait(1)
    console.log("transfer receipt ", receipt)
    setIsComplete(true)
    updateBalance()
  }
  const errorHandler = (e) => {
    console.log("error", e)
  }
  const onSubmit = (values) => {
    const options = {
      params: {
        to: values.receiver,
        amount: utils.parseEther(values.amount),
      },
      functionName: "transfer",
      abi: abi,
      contractAddress: address,
    }
    setIsComplete(false)
    transfer({
      params: options,
      onSuccess: successHandler,
      onError: errorHandler,
    })

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log(values)
    //     resolve()
    //   }, 1000)
    // })
  }

  return (
    <Card w="inherit">
      <Heading as="h4" fontSize="xl">
        Transfer
      </Heading>
      <Box mt="2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Input
              id="receiver"
              placeholder="receiver address..."
              {...register("receiver", {
                required: "Receiver cannot be empty",
                pattern: {
                  value: "^0x[a-fA-F0-9]{40}$",
                  message: "Invalid address",
                },
              })}
            />
            <Input
              mt={2}
              id="amount"
              placeholder="amount in eth units"
              {...register("amount", {
                required: "Amount cannot be empty",
                min: { value: 0, message: "Invalid amount" },
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="blue"
            mt={4}
            type="submit"
            isLoading={isLoading || isComplete}>
            Transfer
          </Button>
        </form>
      </Box>
    </Card>
  )
}
