import { Box, SimpleGrid, Stack } from "@chakra-ui/react"
import { Stat } from "../Components/Dashboard/Stat"
import { PageHeader } from "../Components/Headers/PageHeader"
import { Approve } from "../Components/Functional/Approve"
import { Transfer } from "../Components/Functional/Transfer"
import { Purchase } from "../Components/Functional/Purchase"

export const Token = () => {
  return (
    <Box as="section" height="100vh" overflowY="auto" width="50%" mx="auto">
      <PageHeader title="0KAGE Token" subtitle="Token usage metrics" />
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: "5", md: "6" }}
        py={{ base: "50", md: "50" }}>
        <Stat label="Balance" value={2543} />
        <Stat label="Transfers" value={6} />
        <Stat label="Approvals" value={3} />
      </SimpleGrid>
      <Stack direction="column" spacing="4" w="full">
        <Transfer />
        <Approve />
        <Purchase />
      </Stack>
    </Box>
  )
}
