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

export const Approve = ({ contract: contract }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const onSubmit = (values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(values)
        resolve()
      }, 1000)
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
            isLoading={isSubmitting}>
            Approve
          </Button>
        </form>
      </Box>
    </Card>
  )
}
