import {
  Heading,
  Box,
  Text,
  FormControl,
  FormErrorMessage,
  Button,
  Input,
} from "@chakra-ui/react"
import { Card } from "../cards/Card"
import { useForm } from "react-hook-form"

export const Purchase = ({ contract: contract }) => {
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
    <Card>
      <Heading as="h4" fontSize="xl">
        Purchase
      </Heading>

      <Text color="muted" fontSize="sm">
        Conversion: 1 ETH = 10 0KAGE
      </Text>
      <Box mt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Input
              id="amount"
              placeholder="amount in eth units"
              {...register("amount", {
                required: "Amount cannot be empty",
                min: { value: 0, message: "Invalid amount entered" },
              })}></Input>

            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={isSubmitting}>
            Purchase
          </Button>
        </form>
      </Box>
    </Card>
  )
}
