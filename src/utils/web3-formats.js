import { utils } from "ethers"

export const addressFormat = (address, numLetters) => {
  const len = address.length
  const numLength = numLetters || 6 // 6 is default
  return `${address.substring(0, numLetters)}...${address.substring(
    len - numLength
  )}`
}

export const roundDecimals = (inputString, decimals) => {
  const decimalPosition = inputString.indexOf(".")
  const roundedPosition = decimals
    ? decimalPosition + decimals
    : decimalPosition + 2
  return inputString.substring(0, roundedPosition)
}
export const balanceInEther = (balanceinHex, decimals) => {
  if (balanceinHex) {
    try {
      const balance = parseInt(balanceinHex).toString()
      const rounding = decimals || 4
      //    const ethBalanceStringRounded = ethBalanceString(0, len -)
      return `${roundDecimals(utils.formatEther(balance), rounding)} ETH`
    } catch (e) {
      console.log(e)
    }
  }
}

export const balanceInGwei = (balanceinHex, decimals) => {
  const balance = parseInt(balanceinHex).toString()
  const rounding = decimals || 4
  return `${roundDecimals(utils.formatUnits(balance, "gwei"), rounding)} GWEI`
}

export const balanceInWei = (balanceinHex, decimals) => {
  const balance = parseInt(balanceinHex).toString()
  const rounding = decimals || 4
  return `${roundDecimals(utils.formatUnits(balance, "wei"), rounding)} WEI`
}
