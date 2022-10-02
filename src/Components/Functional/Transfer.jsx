import {
  Heading,
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react"
import { Card } from "../Cards/Card"
import { useForm } from "react-hook-form"

export const Transfer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
            isLoading={isSubmitting}>
            Transfer
          </Button>
        </form>
      </Box>
    </Card>
  )
}
