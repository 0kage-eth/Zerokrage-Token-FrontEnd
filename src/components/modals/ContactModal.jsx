import {
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Text,
  Stack,
  VStack,
  Center,
  Button,
  useDisclosure,
  Icon,
  HStack,
} from "@chakra-ui/react"
import {
  AiOutlineMail,
  AiOutlineTwitter,
  AiOutlineGithub,
} from "react-icons/ai"

import { EMAIL, TWITTER, GITHUB, MIRROR, NOTION } from "../../constants"

export const ContactModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <Button onClick={onOpen} size="md" colorScheme="blue" varint="outline">
        Contact Me
      </Button>
      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount={true}
        isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>Contact Details</ModalHeader>
          <ModalBody>
            <Center>
              <VStack spacing="4">
                <Text>
                  Hi. I'm 0Kage, a Web 3 full stack developer. I'm open to
                  opportunities in Defi. Please reach out if you have a project
                  where I can contribute
                </Text>
                <Stack spacing="1">
                  <Button variant="outline" colorScheme="blue" size="lg">
                    <HStack spacing="4">
                      <Icon as={AiOutlineMail} />
                      <Text>0kage.eth@gmail.com</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => openInNewTab(TWITTER)}>
                    <HStack spacing="4">
                      <Icon as={AiOutlineTwitter} />
                      <Text>Twitter</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => openInNewTab(GITHUB)}>
                    <HStack spacing="4">
                      <Icon as={AiOutlineGithub} />
                      <Text>Github</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => openInNewTab(NOTION)}>
                    <HStack spacing="4">
                      <Icon as={AiOutlineMail} />
                      <Text>Notion</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => openInNewTab(MIRROR)}>
                    <HStack spacing="4">
                      <Icon as={AiOutlineMail} />
                      <Text>Mirror</Text>
                    </HStack>
                  </Button>
                </Stack>
              </VStack>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
