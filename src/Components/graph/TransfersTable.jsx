import { gql, useQuery } from "@apollo/client"
import { SimpleTable } from "../table/SimpleTable"
import { useMoralis } from "react-moralis"
import { Heading, VStack, Text } from "@chakra-ui/react"

const query = gql`
  {
    transfers(first: 5) {
      id
      from
      to
      valie
    }
  }
`

export const TransfersTable = () => {
  const { account } = useMoralis()
  const { loading, error, data } = useQuery(query)

  if (loading) return <Text>"Fetching data..."</Text>
  if (error) return <Text>`Error! ${error.message}`</Text>

  return (
    <VStack>
      <Heading as="h3" fontSize="xl">
        Transfer History
      </Heading>
      <SimpleTable data={data} />
    </VStack>
  )
}
