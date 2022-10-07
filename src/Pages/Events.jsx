import { Box, SimpleGrid, Heading, Container } from "@chakra-ui/react"
import { PageHeader } from "../components/headers/PageHeader"
import { useMoralis } from "react-moralis"
import { ApprovalsTable } from "../components/graph/ApprovalsTable"
import { TransfersTable } from "../components/graph/TransfersTable"
import { useEffect } from "react"

export const Events = () => {
  const { account, chainId } = useMoralis()

  useEffect(() => {
    return
  }, [account, chainId])
  return (
    <Box as="section" height="100vh" overflowY="auto" mx="auto">
      {(!chainId || !account) && (
        <Heading as="h3" fontSize="2xl">
          Please connect your wallet
        </Heading>
      )}
      {chainId && account && (
        <Container>
          <PageHeader
            title="Past Transactions"
            subtitle="All interactions with 0KAGE token"
          />
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: "5", md: "6" }}
            py={{ base: "50", md: "50" }}>
            <ApprovalsTable />
            <TransfersTable />
          </SimpleGrid>
        </Container>
      )}
    </Box>
  )
}
