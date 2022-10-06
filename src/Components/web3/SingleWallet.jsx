import { Box, Text, useColorModeValue } from "@chakra-ui/react"

export const SingleWallet = ({ title }) => {
  return (
    <Box
      maxW="xl"
      mx="auto"
      bg={useColorModeValue("white", "gray.700")}
      rounded={{ md: "xl" }}
      padding="10"
      shadow={{ md: "base" }}
      px={{ base: "6", md: "8" }}>
      <Text>{title}</Text>
    </Box>
  )
}
