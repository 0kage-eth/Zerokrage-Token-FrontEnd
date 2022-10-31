import { Box, Stack, Heading, Text, Badge } from "@chakra-ui/react"

export const Tile = ({ header, value, color, ...props }) => {
  return (
    <Box {...props}>
      <Stack spacing="4" direction="row" maxW="2xl" justify="space-between">
        <Text size="sm">{header}</Text>
        {color ? (
          <Badge colorScheme={color}>{value}</Badge>
        ) : (
          <Text color="muted" fontSize="sm">
            {value}
          </Text>
        )}
      </Stack>
    </Box>
  )
}
