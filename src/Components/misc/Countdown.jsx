import React from "react"
import { VStack, HStack, Heading, Text, Box } from "@chakra-ui/react"
import { useCountdown } from "../../hooks/useCountdown"

const DateTimeDisplay = ({ value, type, isDanger }) => {
  const color = isDanger ? "black" : "red"
  return (
    <Box>
      <VStack>
        <Heading as="h4" fontSize="3xl" color={color}>
          {value}
        </Heading>
        <Text fontSize="sm">{type}</Text>
      </VStack>
    </Box>
  )
}

const ExpiredNotice = () => {
  return (
    <Box>
      <Heading as="h3" fontSize="4xl">
        Expired
      </Heading>
    </Box>
  )
}

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  const isDanger = minutes < 60
  const color = isDanger ? "black" : "red"

  const renderSeparator = () => {
    return (
      <Heading as="h3" color={color} mx="0">
        :
      </Heading>
    )
  }

  return (
    <HStack spacing="6">
      <DateTimeDisplay value={days} type={"Days"} isDanger={isDanger} />
      {renderSeparator()}
      <DateTimeDisplay value={hours} type={"Hours"} isDanger={isDanger} />
      {renderSeparator()}

      <DateTimeDisplay value={minutes} type={"Mins"} isDanger={isDanger} />
      {renderSeparator()}

      <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={isDanger} />
    </HStack>
  )
}

export const CountdownTimer = ({ targetDate, ...props }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)

  if (!targetDate) {
    return <div>...</div>
  }

  console.log("target inside timer", targetDate)

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />
  } else {
    return (
      <Box {...props}>
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      </Box>
    )
  }
}
