import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react"

export const WaitingModal = ({ isOpen, network }) => {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount={true}
        isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pending transaction...</ModalHeader>
          <ModalBody>
            <Center>
              <VStack spacing="4">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
                <Text fontSize="sm">
                  {`Please wait while this transaction gets confirmed on ${network}
                  Network. Speed depends on network congestion...`}
                </Text>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
