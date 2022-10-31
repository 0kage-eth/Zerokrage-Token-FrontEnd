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
  const { headers, data, ...others } = props
  return (
    <Table {...others}>
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
