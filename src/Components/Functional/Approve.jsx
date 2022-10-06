import {
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  Box,
} from "@chakra-ui/react"
import { Card } from "../cards/Card"
import { useForm } from "react-hook-form"
import { utils } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"

export const Approve = ({ abi, address, updateBalance }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const { chainId, account } = useMoralis()
  const { runContractFunction: approve, isFetching } = useWeb3Contract()

  const successHandler = () => {
    // insert success notification
    console.log(`txn completed `)
    updateBalance()
  }

  const errorHandler = (e) => {
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

    approve({
      params: approveParams,
      onSuccess: successHandler,
      onError: errorHandler,
    })
  }

  return (
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

          <Button
            type="submit"
            colorScheme="blue"
            mt={4}
            isLoading={isFetching}>
            Approve
          </Button>
        </form>
      </Box>
    </Card>
  )
}
