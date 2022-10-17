import { Box, Stack, Heading, Text, useBreakpointValue } from "@chakra-ui/react"

export const Tile = ({ header, value, ...props }) => {
  return (
    <Box {...props}>
      <Stack spacing="4" direction="row" maxW="2xl" justify="space-between">
        <Text size="sm">{header}</Text>
        <Text color="muted">{value}</Text>
      </Stack>
    </Box>
  )
}
