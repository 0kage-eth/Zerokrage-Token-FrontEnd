import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react"

export const EmptyWaitingModal = ({ isOpen }) => {
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount={true}
        isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loading...</ModalHeader>
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
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
