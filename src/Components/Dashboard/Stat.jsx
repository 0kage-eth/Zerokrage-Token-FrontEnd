import {
  Box,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import * as React from "react"

export const Stat = (props) => {
  const { label, value, ...boxProps } = props
  return (
    <Box
      px={{ base: "4", md: "6" }}
      py={{ base: "5", md: "6" }}
      bg="white"
      borderRadius="lg"
      boxShadow={useColorModeValue("sm", "sm-dark")}
      {...boxProps}>
      <Stack>
        <Text fontSize="sm" color="muted">
          {label}
        </Text>
        <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
          {value}
        </Heading>
      </Stack>
    </Box>
  )
}
