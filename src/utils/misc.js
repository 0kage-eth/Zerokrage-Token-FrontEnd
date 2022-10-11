import { CHAINS } from "../constants"
export const TransactionStatus = {
  Success: 0,
  Error: 1,
  Note: 2,
}

/**
 * @notice returns network name for a given chain Id
 * @param {number} chainId chain id of the chain
 *
 * @returns network name, if valid chain id or null
 */
export const getNetworkName = (chainId) => {
  const chainIdInt = parseInt(chainId)
  const chain = CHAINS.find((x) => x.chainId == chainIdInt)

  return chain ? chain.name : null
}
