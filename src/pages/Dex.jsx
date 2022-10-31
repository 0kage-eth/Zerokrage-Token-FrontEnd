import { Box, Stack } from "@chakra-ui/react"
import { Header } from "../components/headers/Header"
import { DEX_PAGES, DEX_PAGE_LINKS } from "../constants"
import { Outlet } from "react-router-dom"

export const Dex = () => {
  return (
    <Box as="section" height="100vh" overflowY="auto" maxW="1200" mx="auto">
      <Header pages={DEX_PAGES} pageLinks={DEX_PAGE_LINKS} />

      <Stack spacing={{ base: "8", lg: "6" }}>
        <Outlet />
      </Stack>
    </Box>
  )
}
