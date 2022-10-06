import { useMoralis } from "react-moralis"
import { Text } from "@chakra-ui/react"

export const Address = () => {
  const addressFormat = (address, numLetters) => {
    if (address) {
      const len = address.length
      const numLength = numLetters || 6 // 6 is default
      return `${address.substring(0, numLength)}...${address.substring(
        len - numLength
      )}`
    }
    return ""
  }
  const { account } = useMoralis()

  return <Text color="blue">{addressFormat(account)}</Text>
}
