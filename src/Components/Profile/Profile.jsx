import {
  Box,
  Stack,
  Avatar,
  Button,
  Text,
  Tag,
  VStack,
  HStack,
  Wrap,
  ListItem,
  Link,
  UnorderedList,
} from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/react"
import { Card } from "../Cards/Card"

export const Profile = () => {
  return (
    <Box as="section" py="12" w="300">
      <VStack spacing="4">
        <Card>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: "3", md: "10" }}
            align="flex-start">
            <Stack spacing="4">
              <Avatar
                size="2xl"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsPu6EkQxHDSn7-1qiYqeeP7mTN5a-JDz2Mw&usqp=CAU"
                name="0Kage" //drive.google.com/file/d/15sFpQYAMXYYihWryFdPfsVyul0dDlRT6/view?usp=sharing"
              />
              <Button
                width="full"
                colorScheme="blue"
                display={{ base: "none", md: "initial" }}>
                Contact me
              </Button>
            </Stack>
            <Box>
              <Stack
                spacing={{ base: "1", md: "2" }}
                direction={{ base: "column", md: "row" }}>
                <Text as="h2" fontWeight="bold" fontSize="xl">
                  0Kage
                </Text>
                <HStack fontSize={{ base: "md", md: "lg" }}>
                  <Text
                    as="span"
                    color={useColorModeValue("gray.500", "gray.300")}
                    lineHeight="1">
                    @0kage_eth
                  </Text>
                  {/* <Icon as={HiShieldCheck} color="green.500" /> */}
                </HStack>
              </Stack>
              <Text mt="2">Full-stack Web3 Developer</Text>
              {/* <Wrap shouldWrapChildren my="4" spacing="4">
              <CustomerReviews reviewCount={84} rating={5.0} />
              <HStack>
                <Icon as={HiCash} fontSize="xl" color="gray.400" />
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={useColorModeValue("gray.600", "gray.300")}>
                  <b>$2.5k</b> earned
                </Text>
              </HStack>

              <HStack spacing="1">
                <Icon as={HiLocationMarker} color="gray.400" />
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={useColorModeValue("gray.600", "gray.300")}>
                  Dubai, UAE
                </Text>
              </HStack>
            </Wrap> */}
              <Box fontSize="sm" noOfLines={2}>
                Hi, I am a former finance professional and a self-taught full
                stack developer.
              </Box>
              <Wrap
                shouldWrapChildren
                mt="5"
                color={useColorModeValue("gray.600", "gray.300")}>
                {[
                  "Solidity",
                  "Nodejs",
                  "React",
                  "Javascript",
                  "GraphQL",
                  "Mocha",
                  "Hardhat",
                  "Html/Css",
                ].map((tag) => (
                  <Tag key={tag} color="inherit" px="3">
                    {tag}
                  </Tag>
                ))}
              </Wrap>
            </Box>
          </Stack>
          <Button
            mt="8"
            width="full"
            colorScheme="blue"
            display={{ md: "none" }}>
            Contact me
          </Button>
        </Card>
        <Card width="100%">
          <Text as="h2" fontWeight="bold" fontSize="xl">
            Read me
          </Text>

          <UnorderedList mt="2">
            <ListItem>All apps are deployed on Goerli network</ListItem>
            <ListItem>Get test ETH from goerli faucet to play around</ListItem>
            <ListItem>
              I am interested to collaborate with teams working on Defi
              primitives
            </ListItem>
            <ListItem>
              You can find all projects on my
              <Link
                href="https://github.com/0kage-eth"
                color="blue.500"
                isExternal
                px="1">
                git repo
              </Link>
            </ListItem>
            <ListItem>
              You can find me on
              <Link
                href="	https://medium.com/@0kage"
                color="blue.500"
                isExternal
                px="1">
                Medium
              </Link>{" "}
              and
              <Link
                href="https://twitter.com/0kage_eth"
                color="blue.500"
                isExternal
                px="1">
                Twitter
              </Link>
            </ListItem>
          </UnorderedList>
        </Card>
      </VStack>
    </Box>
  )
}
