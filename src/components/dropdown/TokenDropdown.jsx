import { Select } from "@chakra-ui/react"
import { forwardRef } from "react"
/**
 *
 * @param {string[]} tokenList List of tokens symbols
 */
export const TokenDropdown = forwardRef(({ tokenList }, ref) => {
  return (
    ref && (
      <Select placeholder="Choose Token" ref={ref}>
        {tokenList.map((token, id) => (
          <option value={token} key={id}>
            {token}
          </option>
        ))}
      </Select>
    )
  )
})
