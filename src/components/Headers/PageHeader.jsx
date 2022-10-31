import {
  Flex,
  Stack,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

export const PageHeader = ({ title, subtitle }) => {
  return (
    <Flex mt="6" mx="auto" justify="center">
      <Stack spacing="1">
        <Heading
          fontSize="3xl"
          size={useBreakpointValue({ base: "xs", lg: "sm" })}
          fontWeight="bold">
          {title}
        </Heading>
        <Text color="muted">{subtitle}</Text>
      </Stack>
    </Flex>
  )
}
