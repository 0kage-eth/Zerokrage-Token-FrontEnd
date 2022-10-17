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

const dummyLotteryDataHeaders = [
  "role",
  "start",
  "end",
  "total",
  "vested",
  "released",
]
const dummyLotteryData = [
  {
    id: "1",
    start: "02 Sep 22",
    end: "02 Sep 25",
    total: "100000",
    vested: "10000",
    released: "2000",
    beneficiary: "0xs21fv...dwedferf",
    role: "Smart Contract Engineer",
  },
  {
    id: "2",
    start: "02 Jun 22",
    end: "02 Jun 24",
    total: "60000",
    vested: "10000",
    released: "0",
    beneficiary: "0xsa434s...dwedferf",
    role: "Engagement Manager",
  },
  {
    id: "3",
    start: "02 Apr 22",
    end: "02 Apr 24",
    total: "30000",
    vested: "5000",
    released: "0",
    beneficiary: "0xdsd122...dwedferf",
    role: "Marketing Manager",
  },
]

export const VestingScheduleTable = () => {
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
                <Text fontSize="sm">{row.role}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.start}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.end}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.total}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.vested}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{row.released}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  return <div>{table(dummyLotteryDataHeaders, dummyLotteryData)}</div>
}
