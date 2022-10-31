import React from "react"
import { useMoralis } from "react-moralis"
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
} from "@chakra-ui/react"
import connectors from "../../utils/walletConfig"
import { SingleWallet } from "./SingleWallet"

export const WalletModal = ({
  chainId,
  isOpened = true,
  refreshWindow,
  setIsOpened,
  ...props
}) => {
  const { enableWeb3 } = useMoralis()

  function connectWallet(provider) {
    // to avoid problems in Next.JS apps because of localStorage
    if (typeof window == "undefined") return
    if (typeof window.ethereum == "undefined" && provider == "metamask") {
      return alert("Please install web3 wallet first")
    }
    const connectProps = {
      provider,
      chainId,
      onSuccess: () => {
        window.localStorage.setItem("provider", provider)
        setIsOpened(false)
        refreshWindow()
      },
    }
    enableWeb3(connectProps)
  }

  const closeModal = () => {
    setIsOpened(false)
  }

  // if (!isOpened) return null

  return (
    <>
      {/* <Button onClick={openModal}>Connect Wallet</Button> */}

      <Modal isOpen={isOpened} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              {connectors.map(({ title, icon, provider }, key) => {
                return (
                  // <Button
                  //   key={key}
                  //   onClick={() => {
                  //     connectWallet(provider)
                  //   }}>
                  <SingleWallet
                    title={title}
                    icon={icon}
                    provider={provider}
                    connectWallet={connectWallet}
                    key={key}
                  />
                  // </Button>
                )
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletModal
