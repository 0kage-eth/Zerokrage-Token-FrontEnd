import { Header } from "../components/headers/Header"
import { PAGES, PAGE_LINKS } from "../constants"
import { Outlet } from "react-router-dom"
import { Box, Stack } from "@chakra-ui/react"

export const Main = () => {
  console.log("PAGES", PAGES)
  console.log("PAGE LINKS", PAGE_LINKS)

  return (
    <Box as="section" height="100vh" overflowY="auto" maxW="1200" mx="auto">
      <Header pages={PAGES} pageLinks={PAGE_LINKS} />

      <Stack spacing={{ base: "8", lg: "6" }}>
        <Outlet />
      </Stack>
    </Box>
  )
}
