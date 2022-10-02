import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react"
import * as React from "react"
import { Link as RouterLink } from "react-router-dom"
// import { ConnectButton } from "web3uikit"

export const Header = ({ pages, pageLinks }) => {
  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}>
      <Container py={{ base: "3", lg: "4" }}>
        <Flex justify="flex-end">
          <HStack spacing="4">
            {/* <Logo /> */}
            <ButtonGroup variant="ghost" spacing="1">
              {pages.map((page, indx) => {
                console.log("current page", page)
                console.log("page link", pageLinks[indx])
                return indx === 0 ? (
                  <Button
                    aria-current="page"
                    as={RouterLink}
                    to={`${pageLinks[indx]}`}>
                    {page}
                  </Button>
                ) : (
                  <Button as={RouterLink} to={`${pageLinks[indx]}`}>
                    {page}
                  </Button>
                )
              })}
            </ButtonGroup>
          </HStack>
          <HStack spacing="4">
            <ButtonGroup variant="ghost" spacing="1">
              {/* <IconButton
                    icon={<FiSearch fontSize="1.25rem" />}
                    aria-label="Search"
                  />
                  <IconButton
                    icon={<FiSettings fontSize="1.25rem" />}
                    aria-label="Settings"
                  /> */}
              {/* <ConnectButton /> */}
            </ButtonGroup>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
