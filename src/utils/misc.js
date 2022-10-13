import { CHAINS } from "../constants"
export const TransactionStatus = {
  Success: 0,
  Error: 1,
  Note: 2,
}

/**
 * @notice returns network name for a given chain Id
 * @param {string} chainId chain id of the chain
 *
 * @returns network name, if valid chain id or null
 */
export const getNetworkName = (chainId) => {
  if (!chainId) return null
  const chainIdInt = parseInt(chainId)
  const chain = CHAINS.find((x) => x.chainId == chainIdInt)

  return chain ? chain.name : null
}

export const projectStatusColor = (status) => {
  let color
  switch (status) {
    case "done":
      color = "green"
      break
    case "soon":
      color = "grey"
      break
    case "working":
      color = "blue"
      break
    default:
      color = "grey"
  }
  return color
}
