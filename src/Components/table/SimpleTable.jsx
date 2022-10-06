import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"

export const SimpleTable = (props) => {
  const { data, ...others } = props
  return (
    <Table {...others}>
      <Thead>
        <Tr>
          <Th>Owner</Th>
          <Th>Spender</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row) => (
          <Tr key={row.id}>
            <Td>
              <Text>{row.owner}</Text>
            </Td>
            <Td>
              <Text>{row.spender}</Text>
            </Td>
            <Td>
              <Text>{row.value}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
