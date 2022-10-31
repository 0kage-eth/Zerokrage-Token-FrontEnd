import {
  Box,
  VStack,
  Button,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react"

export const SingleWallet = ({ title, icon, provider, connectWallet, key }) => {
  return (
    <Box
      width="180px"
      mx="auto"
      bg={useColorModeValue("white", "gray.700")}
      rounded={{ md: "xl" }}
      padding="10"
      shadow={{ md: "base" }}
      px={{ base: "6", md: "8" }}>
      <VStack spacing="4">
        <Icon as={icon} />
        <Button
          key={key}
          onClick={() => {
            connectWallet(provider)
          }}>
          {title}
        </Button>
      </VStack>
    </Box>
  )
}
