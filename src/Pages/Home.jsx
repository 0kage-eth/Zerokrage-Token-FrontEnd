import * as React from "react"
import { Flex, SimpleGrid, List, ListItem, ListIcon } from "@chakra-ui/react"

import { MdCheckCircle } from "react-icons/md"
import { Profile } from "../Components/Profile/Profile"
import { Card } from "../Components/Cards/Card"
import { Projects } from "../Components/Profile/Projects"
const pointers = () => (
  <div>
    <List spacing={5}>
      <ListItem>
        <ListIcon as={MdCheckCircle} color="blue.500" />
        Switch to Goerli Network to play with this dapp
      </ListItem>
      <ListItem>
        <ListIcon as={MdCheckCircle} color="blue.500" />
        App allows you to acquire 0KAGE tokens, check your balance, approve
        usage etc
      </ListItem>
      <ListItem>
        <ListIcon as={MdCheckCircle} color="blue.500" />
        Staking 0KAGE token gives you rKAGE token
      </ListItem>
      {/* You can also use custom icons from react-icons */}
      <ListItem>
        <ListIcon as={MdCheckCircle} color="blue.500" />
        Exchange rate 1 ETH = 1 USD (App uses ChainLink to get latest USD/ETH
        prices)
      </ListItem>
    </List>
  </div>
)

export const Home = () => {
  return (
    // <Flex align="center" justify="space-between">
    <SimpleGrid columns={{ base: 1, md: 2 }} gap="10" maxW="1200" mx="auto">
      <Profile />
      <Projects />
    </SimpleGrid>
    // </Flex>
  )
}
