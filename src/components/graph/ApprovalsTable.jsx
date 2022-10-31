import { useQuery, gql } from "@apollo/client"
import { SimpleTable } from "../table/SimpleTable"
import { utils } from "ethers"
import { roundDecimals, addressFormat } from "../../utils/web3-formats"
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

  const formattedData =
    (data &&
      data.approvals &&
      data.approvals.map((row) => {
        return {
          id: row.id,
          spender: addressFormat(row.spender, 6),
          value: `${roundDecimals(utils.formatEther(row.value))} 0KAGE`,
        }
      })) ||
    []
  console.log("approvals data", formattedData)
  if (loading) return <Text>Fetching data...</Text>
  if (error) return <Text>`Error! ${error.message}`</Text>

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
                <Text fontSize="sm">{row.spender}</Text>
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
        Approval History
      </Heading>

      {table(["Spender", "Approved"], formattedData)}
    </VStack>
  )
}
