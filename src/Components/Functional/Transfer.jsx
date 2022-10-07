import {
  Heading,
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react"
import { Card } from "../cards/Card"
import { useForm } from "react-hook-form"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { utils } from "ethers"
import { useState } from "react"
import { WaitingModal } from "../modals/WaitingModal"

export const Transfer = ({ abi, address, updateBalance }) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const {
    runContractFunction: transfer,
    isFetching,
    isLoading,
  } = useWeb3Contract()

  const successHandler = async (txn) => {
    setIsConfirming(true)
    const receipt = await txn.wait(1)

    // insert success notification
    toast({
      title: `Success`,
      status: "success",
      description: `Transfer successful. Txn hash ${receipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })

    setIsConfirming(false)
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
    <Box>
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
              isLoading={isLoading}>
              Transfer
            </Button>
          </form>
        </Box>
      </Card>
      <WaitingModal isOpen={isConfirming} />
    </Box>
  )
}
