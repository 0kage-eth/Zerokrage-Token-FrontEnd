import { Box, Stack } from "@chakra-ui/react"
import { Header } from "../../components/headers/Header"
import { VESTING_PAGES, VESTING_PAGE_LINKS } from "../../constants"
import { Outlet } from "react-router-dom"

export const VestingHome = () => {
  return (
    <Box as="section" height="100vh" overflowY="auto" maxW="1200" mx="auto">
      <Header pages={VESTING_PAGES} pageLinks={VESTING_PAGE_LINKS} />

      <Stack spacing={{ base: "8", lg: "6" }}>
        <Outlet />
      </Stack>
    </Box>
  )
}
