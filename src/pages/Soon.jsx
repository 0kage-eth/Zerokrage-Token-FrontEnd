import {
  Box,
  Stack,
  Container,
  Text,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react"

export const ComingSoon = () => {
  return (
    <Box
      as="section"
      bg="blue.600"
      color="on-accent"
      py={{ base: "16", md: "24" }}>
      <Container>
        <Stack spacing={{ base: "8", md: "10" }} align="center">
          <Stack spacing={{ base: "4", md: "6" }} textAlign="center">
            <Stack spacing="3">
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
                color="blue.50">
                Coming Soon
              </Text>
              <Heading
                size={useBreakpointValue({ base: "md", md: "lg" })}
                fontWeight="semibold"
                color="blue.50">
                Working on this!
              </Heading>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
