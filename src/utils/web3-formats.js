import { utils } from "ethers"

export const addressFormat = (address, numLetters) => {
  const len = address.length
  const numLength = numLetters || 6 // 6 is default
  return `${address.substring(0, numLetters)}...${address.substring(
    len - numLetters
  )}`
}

const roundDecimals = (inputString, decimals) => {
  const decimalPosition = inputString.indexOf(".")
  const roundedPosition = decimalPosition + decimals
  return inputString.substring(0, roundedPosition)
}
export const balanceInEther = (balance, decimals) => {
  const rounding = decimals || 4
  //    const ethBalanceStringRounded = ethBalanceString(0, len -)
  return `${roundDecimals(utils.formatEther(balance), rounding)} ETH`
}

export const balanceInGwei = (balance, decimals) => {
  const rounding = decimals || 4
  return `${roundDecimals(utils.formatUnits(balance, "gwei"), rounding)} GWEI`
}

export const balanceInWei = (balance, decimals) => {
  const rounding = decimals || 4
  return `${roundDecimals(utils.formatUnits(balance, "wei"), rounding)} WEI`
}
