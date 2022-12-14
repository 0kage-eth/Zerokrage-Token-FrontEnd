export const PAGES = ["Token", "Events" /*, "Dashboard"*/]
export const PAGE_LINKS = ["token", "events" /*, "dashboard"*/]
export const DEX_PAGES = ["Swap", "Liquidity", "Dashoard" /*, "Dashboard"*/]
export const DEX_PAGE_LINKS = [
  "swap",
  "liquidity",
  "dashboard" /*, "Dashboard"*/,
]

export const STAKING_PAGES = ["Stake", "Dashboard"]
export const STAKING_PAGE_LINKS = ["stake", "dashboard"]

export const LOTTERY_PAGES = ["Lottery", "Account", "Dashboard"]
export const LOTTERY_PAGE_LINKS = ["play", "account", "dashboard"]

export const VESTING_PAGES = ["Vesting", "Dashboard"]
export const VESTING_PAGE_LINKS = ["enter", "dashboard"]

export const CHAINS = [
  { chainId: 1, name: "mainnet" },
  { chainId: 5, name: "goerli" },
  { chainId: 31337, name: "localhost" },
]

export const PROJECTS = [
  {
    id: 1,
    name: "ZeroKage Token Controller",
    desc: "Get 0KAGE tokens, check balance & past transactions",
    link: "/main/token",
    img: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1476103033/xfu7exy5y6rkscsm1kns.png",
    status: "done",
  },
  {
    id: 2,
    name: "ETH-0KAGE Dex",
    desc: "Swap your 0KAGE tokens, add and remove liquidity ",
    link: "/dex/swap",
    img: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1476103033/xfu7exy5y6rkscsm1kns.png",
    status: "done",
  },
  {
    id: 3,
    name: "Stake 0KAGE",
    desc: "Stake your 0KAGE & get rKAGE reward tokens",
    link: "/staking/stake",
    img: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1476103033/xfu7exy5y6rkscsm1kns.png",
    status: "done",
  },
  {
    id: 4,
    name: "0KAGE Lottery",
    desc: "Decentralized smart lottery that chooses a winner every day. Pay 0KAGE to participate in lottery",
    link: "/lottery/play",
    img: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1476103033/xfu7exy5y6rkscsm1kns.png",
    status: "done",
  },
  {
    id: 5,
    name: "0KAGE Token Vesting",
    desc: "Become a core-member of 0KAGE & get tokens vested every day for your contibution",
    link: "/vesting/enter",
    img: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1476103033/xfu7exy5y6rkscsm1kns.png",
    status: "done",
  },
  {
    id: 6,
    name: "0KAGE NFT Marketplace",
    desc: "Mint your NFTs & post them for sale on marketplace. If you like any, buy them with you 0KAGE tokens",
    link: "/soon",
    img: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
    status: "working",
  },

  {
    id: 7,
    name: "0KAGE DAO",
    desc: "Use your 0KAGE to vote for outstanding proposals",
    link: "/soon",
    img: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
    status: "soon",
  },
  {
    id: 8,
    name: "Uniswap V2/V3",
    desc: "Swap currency pairs on both V2 & V3",
    link: "/soon",
    img: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
    status: "soon",
  },
  {
    id: 9,
    name: "Aave Flash Loan",
    desc: "Borrow from Aave and deploy flash loans across DEX",
    link: "/soon",
    img: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
    status: "soon",
  },
  {
    id: 10,
    name: "IDO Auction",
    desc: "Setup a IDO auction for new token launches",
    link: "/soon",
    img: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
    status: "soon",
  },
]

export const SUBGRAPH_URI =
  "https://api.studio.thegraph.com/query/34697/zerokage-token/v0.0.4"

export const JOBS = [
  {
    id: 1,
    role: "Smartcontract Engineer",
    place: "Remote",
    tokens: "100",
    cliff: "12", // in months
    duration: "36", // in months
    revocable: true,
    cycle: "1", // in months
  },
  {
    id: 2,
    role: "Marketing Manager",
    place: "NYC",
    tokens: "60",
    cliff: "6", // in months
    duration: "24", // in months
    revocable: true,
    cycle: "1", // in months
  },
  {
    id: 3,
    role: "Engagement Manager",
    place: "Remote",
    tokens: "40",
    cliff: "6", // in months
    duration: "24", // in months
    revocable: true,
    cycle: "1", // in months
  },
]

export const EMAIL = "0Kage.eth@gmail.com"
export const GITHUB = "https://github.com/0kage-eth"
export const TWITTER = "https://twitter.com/0kage_eth"
export const NOTION =
  "https://wonderful-newsprint-e13.notion.site/0KAGE-85a73c4b2ed445dfa7d6fbd7e80bbf91"
export const MIRROR =
  "https://mirror.xyz/0xd7Dd548772fF126999a1a02640beFA34C2ce470B"
