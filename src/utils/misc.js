import { CHAINS } from "../constants"
import { BigNumber, ethers } from "ethers"
export const TransactionStatus = {
  Success: 0,
  Error: 1,
  Note: 2,
}

const monthString = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

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

/**
 *
 * @param {Date} date
 */
export const dateFormatddMMMyyHHMM = (date) => {
  if (!date) return ""
  const day = date.getUTCDate()
  const month = monthString[date.getUTCMonth()]
  const year = date.getUTCFullYear().toString().substring(2)
  const hour = date.getUTCHours()
  const mins = date.getUTCMinutes()
  const secs = date.getUTCSeconds()

  const dayString = day < 10 ? `0${day}` : day.toString()
  const hourString = hour < 10 ? `0${hour}` : hour.toString()
  const minString = mins < 10 ? `0${mins}` : mins.toString()
  const secsString = secs < 10 ? `0${secs}` : secs.toString()

  return `${dayString}-${month}-${year} ${hourString}:${minString}:${secsString}`
}

export const dateFormatddMMMyy = (date) => {
  if (!date) return ""
  const day = date.getUTCDate()
  const month = monthString[date.getUTCMonth()]
  const year = date.getUTCFullYear().toString().substring(2)

  const dayString = day < 10 ? `0${day}` : day.toString()

  return `${dayString}-${month}-${year}`
}

export const convertMonthsToSeconds = (month) => {
  return parseInt(month) * 30 * 24 * 60 * 60
}

export const getMonthsFromCliff = (startTime, cliff) => {
  const numMonths = BigNumber.from(cliff)
    .sub(startTime)
    .div(24)
    .div(30)
    .div(60)
    .div(60)
  const months = ethers.utils.formatUnits(numMonths, "wei")
  return `${months} months`
}
