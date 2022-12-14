import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react"
import * as React from "react"
import { Link as RouterLink } from "react-router-dom"
import { Connect } from "../web3/Connect"

// import { ConnectButton } from "web3uikit"

export const Header = ({ pages, pageLinks }) => {
  return (
    // <Box
    //   as="nav"
    //   bg="bg-surface"
    //   boxShadow={useColorModeValue("sm", "sm-dark")}>
    <Box
      py={{ base: "3", lg: "4" }}
      boxShadow={useColorModeValue("sm", "sm-dark")}
      width="100%">
      <Flex justify="space-between">
        <Button aria-current="page" as={RouterLink} to="/">
          Home
        </Button>
        <Flex justify="flex-end">
          <HStack spacing="8">
            {/* <Logo /> */}
            <ButtonGroup variant="ghost">
              {pages.map((page, indx) => {
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
          <Connect />
        </Flex>
      </Flex>
    </Box>
    // </Box>
  )
}
