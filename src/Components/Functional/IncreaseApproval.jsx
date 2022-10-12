import {
  Box,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useForm } from "react-hook-form"
import { Card } from "../cards/Card"
import { utils } from "ethers"
import { WaitingModal } from "../modals/WaitingModal"
import { getNetworkName } from "../../utils/misc"
import { useState } from "react"

export const IncreaseApproval = ({ abi, address }) => {
  const { network, chainId } = useMoralis()
  const toast = useToast()
  const [isConfirming, setIsConfirming] = useState(false)

  const { runContractFunction: increaseAllowance, isFetching } =
    useWeb3Contract()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const successHandler = async (txnResponse) => {
    setIsConfirming(true)
    const receipt = await txnResponse.wait(1)

    setIsConfirming(false)
    toast({
      title: `Success`,
      status: "success",
      description: `Increase allowance successful. Txn hash ${receipt.transactionHash}`,
      isClosable: true,
      duration: 9000,
    })
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
    const optionalParams = {
      abi: abi,
      contractAddress: address,
      functionName: "increaseAllowance",
      params: {
        spender: values.address,
        addedValue: utils.parseEther(values.allowance),
      },
    }

    increaseAllowance({
      params: optionalParams,
      onSuccess: successHandler,
      onError: errorHandler,
    })
  }

  return (
    <Box>
      <Card>
        <Heading as="h3" fontSize="xl">
          Increase Allowance
        </Heading>

        <Box mt={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name}>
              <Input
                placeholder="Spender address..."
                {...register("address", {
                  required: { value: true, message: "Enter spender address" },
                  pattern: {
                    value: "^0x[a-fA-F0-9]{40}$",
                    message: "Invalid address",
                  },
                })}
              />
              <Input
                placeholder="Increase allowance by (in Eth terms)"
                {...register("allowance", {
                  required: { value: true, message: "Enter amount" },
                  min: 0,
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              mt={4}
              isLoading={isFetching}>
              Increase Allowance
            </Button>
          </form>
        </Box>
      </Card>
      <WaitingModal isOpen={isConfirming} network={getNetworkName(chainId)} />
    </Box>
  )
}
