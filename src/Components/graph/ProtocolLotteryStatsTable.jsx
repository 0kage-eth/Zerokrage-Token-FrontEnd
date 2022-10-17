import { useMoralis } from "react-moralis"
import { SimpleTable } from "../table/SimpleTable"
import { useState, useEffect } from "react"
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

const dummyLotteryDataHeaders = ["date", "tickets", "pot", "winner", "fees"]
const dummyLotteryData = [
  {
    id: "1",
    date: "02 Sep 22",
    tickets: "200",
    pot: "200",
    winner: "0xs21fv...dwedferf",
    fees: "4",
  },
  {
    id: "2",
    date: "03 Sep 22",
    tickets: "100",
    pot: "300",
    winner: "0xs21fv...dwedferf",
    fees: "2",
  },
  {
    id: "3",
    date: "04 Sep 22",
    tickets: "400",
    pot: "360",
    winner: "0xcsa223...dwedferf",
    fees: "4",
  },
  {
    id: "4",
    date: "05 Sep 22",
    tickets: "100",
    pot: "280",
    winner: "0xdsd122...dwedferf",
    fees: "4",
  },
]

export const ProtocolLotteryStats = () => {
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
                <Text fontSize="sm">{row.date}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.tickets}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.pot}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.winner}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.fees}</Text>
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
        History
      </Heading>

      {table(dummyLotteryDataHeaders, dummyLotteryData)}
    </VStack>
  )
}
