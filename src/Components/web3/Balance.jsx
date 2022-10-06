import { Text, VStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import { utils, providers } from "ethers"
import { roundDecimals } from "../../utils/web3-formats"

export const Balance = () => {
  const [balance, setBalance] = useState(null)

  const { account, chainId, web3 } = useMoralis()
  const network = chainId ? providers.getNetwork(parseInt(chainId)).name : ""

  const getBalance = (balance, decimals) => {
    const rounding = decimals || 4
    return `${roundDecimals(utils.formatEther(balance), rounding)} ETH`
  }

  const displayBalance = () => {
    return (
      <VStack spacing="0.5px">
        {balance && <Text>{balance}</Text>}
        {network && <Text fontSize="sm">{network}</Text>}
      </VStack>
    )
  }

  // re-evaluate balance if account or chainId is changed
  useEffect(() => {
    if (account && chainId) {
      web3?.getBalance(account).then((result) => {
        setBalance(getBalance(result, 4))
      })
    }
  }, [account, chainId])

  return balance ? displayBalance() : null
}
