import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  HStack,
  Button,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import { PROJECTS } from "../../constants"
import { Card } from "../cards/Card"
import { Link as RouterLink } from "react-router-dom"
import { projectStatusColor } from "../../utils/misc"
import { ColorBadge } from "../badges/ColorBadge"

export const Projects = () => {
  return (
    <Box as="section" py="12" w="300">
      <Card>
        <Text as="h2" fontWeight="bold" fontSize="xl">
          My Applications
        </Text>
        {/* <Center maxW="sm" mx="auto" py={{ base: "4", md: "8" }}> */}
        <Box bg="bg-surface" py="4">
          <Stack divider={<StackDivider />} spacing="4">
            {PROJECTS.map((member) => (
              <Stack key={member.id} fontSize="sm" spacing="4">
                <Stack direction="row" justify="space-between" spacing="4">
                  <HStack spacing="3">
                    <Avatar src={member.img} boxSize="20">
                      {/* <AvatarBadge
                          boxSize="4"
                          bg={member.status === "done" ? "success" : "subtle"}
                        /> */}
                    </Avatar>
                    <Box>
                      <Text fontWeight="medium" color="emphasized">
                        {member.name}
                      </Text>
                      <ColorBadge color={projectStatusColor(member.status)}>
                        <Text>{member.status}</Text>
                      </ColorBadge>
                    </Box>
                  </HStack>
                  <Button
                    to={member.link}
                    as={RouterLink}
                    isDisabled={member.status === "soon"}>
                    Enter
                  </Button>
                  {/* <Text color="muted">{member.lastSeen}</Text> */}
                </Stack>
                <Text
                  color="muted"
                  sx={{
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": "2",
                    overflow: "hidden",
                    display: "-webkit-box",
                  }}>
                  {member.desc}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Box>
        {/* </Center> */}
      </Card>
    </Box>
  )
}
