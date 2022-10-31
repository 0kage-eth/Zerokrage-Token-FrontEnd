import { Card } from "./Card"
import {
  Box,
  Stack,
  useColorModeValue,
  Flex,
  Heading,
  Icon,
  HStack,
  Badge,
  Text,
} from "@chakra-ui/react"
import { GoGlobe } from "react-icons/go"
export const JobCard = ({ title, action, place, tokens, cliff, duration }) => {
  return (
    <Box as="section" py="4" bg={useColorModeValue("gray.100", "gray.800")}>
      <Card>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "4", md: "10" }}>
          <Box width="full">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                size="md"
                fontWeight="extrabold"
                letterSpacing="tight"
                marginEnd="6">
                {title}
              </Heading>
              {action}
            </Flex>
            <Text mt="1" fontWeight="medium">
              {`Compensation: ${tokens} 0Kage`}
            </Text>
            <Stack spacing="1" mt="2">
              <HStack fontSize="sm">
                <Icon as={GoGlobe} color="gray.500" />
                <Text>{place}</Text>
              </HStack>
            </Stack>
            <Stack spacing="1" mt="2">
              <Text fontWeight="semibold" mt="8" mb="2">
                {`Vesting over: `} <Badge colorScheme="blue">{duration}</Badge>
              </Text>
              <Text fontWeight="semibold" mt="8" mb="2">
                {`Cliff: `}
                <Badge colorScheme="red">{cliff}</Badge>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}
