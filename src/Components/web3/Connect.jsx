import { HStack, VStack, Button } from "@chakra-ui/react"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { Balance } from "./Balance"
import { Address } from "./Address"
import { WalletModal } from "./WalletModal"

export const Connect = ({ chainId, ...props }) => {
  const {
    account,
    deactivateWeb3,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
  } = useMoralis()

  const [web3Status, setWeb3Status] = useState("disconnected")
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  useEffect(() => {
    // to avoid problems in Next.JS because of window object
    if (typeof window == "undefined") return

    const provider = window.localStorage.getItem("provider")

    if (
      !isWeb3Enabled &&
      !isWeb3EnableLoading &&
      provider &&
      web3Status === "disconnected"
    ) {
      setWeb3Status("pending")
      enableWeb3({
        provider,
        chainId,
        onSuccess: () => setWeb3Status("connected"),
      })
    }
  }, [isWeb3Enabled, isWeb3EnableLoading, web3Status])

  useEffect(() => {
    Moralis.onAccountChanged((address) => {
      if (!address) disconnectWallet()
    })
  }, [])

  const disconnectWallet = async () => {
    if (typeof window == "undefined") return

    window.localStorage.removeItem("provider")
    setWeb3Status("disconnected")

    deactivateWeb3()
  }

  const refreshPage = () => {
    console.log("Page refreshing....")
    window.location.reload()
  }

  return (
    <VStack>
      {/*Wallet Modal should open if there is no active account & no provider  */}
      {web3Status === "disconnected" && (
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => setIsConnectModalOpen(true)}>
          Connect Wallet
        </Button>
      )}

      <WalletModal
        chainId={chainId}
        isOpened={isConnectModalOpen}
        setIsOpened={setIsConnectModalOpen}
        refreshWindow={refreshPage}
      />
      {web3Status === "connected" && (
        <HStack spacing={4}>
          <Button
            onClick={disconnectWallet}
            variant="outline"
            colorScheme="blue">
            <Address />
          </Button>
          <Balance />
        </HStack>
      )}
    </VStack>
  )
}
