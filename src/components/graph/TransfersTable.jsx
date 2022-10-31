import { gql, useQuery } from "@apollo/client"
import { SimpleTable } from "../table/SimpleTable"
import { useMoralis } from "react-moralis"
import {
  Heading,
  VStack,
  Text,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { roundDecimals, addressFormat } from "../../utils/web3-formats"
import { utils } from "ethers"

const query = gql`
  query ($limit: Int!, $from: String!) {
    transfers(first: $limit, where: { from: $from }) {
      id
      from
      to
      value
    }
  }
`

export const TransfersTable = () => {
  const { account } = useMoralis()
  const { loading, error, data } = useQuery(query, {
    variables: { limit: 5, from: account },
  })

  if (loading) return <Text>"Fetching data..."</Text>
  if (error) return <Text>`Error! ${error.message}`</Text>

  const formattedData =
    data &&
    data.transfers &&
    data.transfers.map((row) => {
      console.log("to address", row.to)
      return {
        id: row.id,
        to: addressFormat(row.to, 6),
        value: `${roundDecimals(utils.formatEther(row.value))} 0KAGE`,
      }
    })

  const table = (headers, data) => {
    return (
      <Table>
        <Thead>
          <Tr>
            {headers.map((header, id) => (
              <Th key={id}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.id}>
              {/* <Td>
                      <Text>{row.owner}</Text>
                    </Td> */}

              <Td>
                <Text fontSize="sm">{row.to}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.value}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  return (
    <VStack>
      <Heading as="h3" fontSize="xl">
        Transfer History
      </Heading>
      {table(["To", "Amount"], formattedData)}
      {/* <SimpleTable data={formattedData} headers={["To", "Amount"]} /> */}
    </VStack>
  )
}
