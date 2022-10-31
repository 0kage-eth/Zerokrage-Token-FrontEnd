import { FormErrorMessage } from "@chakra-ui/react"

export const ErrorTemplate = ({ errors }) => {
  console.log("error template, error", errors)
  console.log("error template, ssss", Object.entries(errors))
  return (
    errors &&
    Object.entries(errors).map(([type, message]) => (
      <FormErrorMessage key={type}>{message?.message}</FormErrorMessage>
    ))
  )
}
