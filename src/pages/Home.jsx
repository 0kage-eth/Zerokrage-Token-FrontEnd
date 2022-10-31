import * as React from "react"
import { SimpleGrid } from "@chakra-ui/react"

import { Profile } from "../components/profile/Profile"
import { Projects } from "../components/profile/Projects"

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
