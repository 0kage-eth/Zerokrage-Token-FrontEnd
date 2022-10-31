import {
  Flex,
  HStack,
  Icon,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react"
import * as React from "react"

export const ProductFeaturesTable = ({ job }) => {
  const modify = (key, value) => {
    if (key === "cliff" || key === "duration" || key === "cycle") {
      return `${value} months`
    }
    if (key === "revocable") {
      return value ? "true" : "false"
    }
    return value
  }
  return (
    <Table sx={{ tableLayout: "fixed" }} variant="striped">
      <Tbody>
        {Object.keys(job).map((key, index) => {
          return (
            <Tr>
              <Td>
                <Text fontSize="sm">{key}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{modify(key, job[key])}</Text>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
