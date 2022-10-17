import { createBrowserRouter } from "react-router-dom"
import { Home } from "../../pages/Home"
import { Events } from "../../pages/Events"
import { Main } from "../../pages/Main"
import { Token } from "../../pages/Token"
import { Dex } from "../../pages/Dex"
import { Swap } from "../../pages/Swap"
import { Liquidity } from "../../pages/Liquidity"
import { DexDashboard } from "../../pages/DexDashboard"
import { StakingDashboard } from "../../pages/StakingDashboard"
import { Staking } from "../../pages/Staking"
import { StakingHome } from "../../pages/StakingHome"
import { LotteryHome } from "../../pages/lottery/LotteryHome"
import { LotteryEnter } from "../../pages/lottery/LotteryEnter"
import { LotteryAccount } from "../../pages/lottery/LotteryAccount"
import { LotteryDashboard } from "../../pages/lottery/LotteryDashboard"
import { VestingHome } from "../../pages/vesting/VestingHome"
import { VestingEnter } from "../../pages/vesting/VestingEnter"
import { VestingDashboard } from "../../pages/vesting/VestingDashboard"

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "main",
    element: <Main />,
    children: [
      {
        path: "token",
        element: <Token />,
      },
      {
        path: "events",
        element: <Events />,
      },
      // {
      //   path: "dashboard",
      //   element: <Dashboard />,
      // },
    ],
  },
  {
    path: "dex",
    element: <Dex />,
    children: [
      {
        path: "swap",
        element: <Swap />,
      },
      { path: "liquidity", element: <Liquidity /> },
      { path: "dashboard", element: <DexDashboard /> },
    ],
  },

  {
    path: "staking",
    element: <StakingHome />,
    children: [
      {
        path: "stake",
        element: <Staking />,
      },
      { path: "dashboard", element: <StakingDashboard /> },
    ],
  },

  {
    path: "lottery",
    element: <LotteryHome />,
    children: [
      {
        path: "play",
        element: <LotteryEnter />,
      },
      {
        path: "account",
        element: <LotteryAccount />,
      },
      {
        path: "dashboard",
        element: <LotteryDashboard />,
      },
    ],
  },

  {
    path: "vesting",
    element: <VestingHome />,
    children: [
      {
        path: "enter",
        element: <VestingEnter />,
      },
      {
        path: "dashboard",
        element: <VestingDashboard />,
      },
    ],
  },
])
