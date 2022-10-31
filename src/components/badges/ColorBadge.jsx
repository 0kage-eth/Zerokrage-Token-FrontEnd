import { Badge } from "@chakra-ui/react"
export const ColorBadge = ({ color, ...rest }) => {
  return <Badge colorScheme={color}>{rest.children}</Badge>
}
