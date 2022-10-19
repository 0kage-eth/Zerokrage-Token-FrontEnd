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

const dummyLotteryDataHeaders = ["date", "status", "tickets", "fee", "paid"]
const dummyLotteryData = [
  {
    id: "1",
    date: "02 Sep 22",
    status: "won",
    tickets: "3",
    fee: "12",
    paid: "44",
  },
  {
    id: "2",
    date: "03 Sep 22",
    status: "lost",
    tickets: "1",
    fee: "4",
    paid: "0",
  },
  {
    id: "3",
    date: "04 Sep 22",
    status: "lost",
    tickets: "4",
    fee: "12",
    paid: "0",
  },
  {
    id: "4",
    date: "02 Sep 22",
    status: "lost",
    tickets: "3",
    fee: "12",
    paid: "0",
  },
]

export const UserLotteryTable = () => {
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
                <Text fontSize="sm">{row.status}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.tickets}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.fee}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.paid}</Text>
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
        History (dummy data)
      </Heading>

      {table(dummyLotteryDataHeaders, dummyLotteryData)}
    </VStack>
  )
}
