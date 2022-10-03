import React from "react"
import { useEtherBalance, useEthers } from "@usedapp/core"
import { Button, HStack, VStack, Text } from "@chakra-ui/react"
import { addressFormat, balanceInEther } from "../../utils/web3-formats"
export const MetamaskConnect = () => {
  const { account, library, activateBrowserWallet, deactivate } = useEthers()
  const etherBalance = useEtherBalance(account)

  const ConnectButton = () => (
    <Button
      colorScheme="blue"
      variant="outline"
      onClick={() => activateBrowserWallet()}>
      Connect Wallet
    </Button>
  )

  const Disconnect = () => {
    const address = addressFormat(account, 6)
    const balance = 0.0 //balanceInEther(etherBalance, 4)
    return (
      <HStack spacing={4}>
        <VStack spacing="0.125rem">
          {/* <Text fontSize="sm">{`${addressFormat(account, 6)}`}</Text> */}

          <Text fontSize="sm" color="gray.500">{`${address} ${balance}`}</Text>
          <Text fontSize="sm" color="blue.600" fontWeight="bold">
            {library.network.name}
          </Text>
        </VStack>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => deactivate()}>
          Disconnect
        </Button>
      </HStack>
    )
  }

  const WalletButton = () => (account ? <Disconnect /> : <ConnectButton />)

  return <WalletButton />

  // <div>
  //   {account && (
  //     <div>
  //       <div className="inline">
  //         {/* <AccountIcon account={account} />
  //         &nbsp; */}
  //         <div className="account">{account}</div>
  //       </div>
  //       <br />
  //     </div>
  //   )}
  // </div>
}
