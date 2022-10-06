import { useQuery, gql } from "@apollo/client"
import { SimpleTable } from "../table/SimpleTable"

import { Heading, VStack, Text } from "@chakra-ui/react"

const query = gql`
  {
    approvals(first: 5) {
      id
      owner
      spender
      value
    }
  }
`
export const ApprovalsTable = () => {
  const { loading, error, data } = useQuery(query)

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>`Error! ${error.message}`</Text>
  console.log("table data", data)
  return (
    <VStack>
      <Heading as="h3" fontSize="xl">
        Approval History
      </Heading>
      <SimpleTable data={data.approvals} />
    </VStack>
  )
}
