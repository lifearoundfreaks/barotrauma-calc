import useGetParams from '../Hooks/useGetParams'
import validateReputation from '../Utils/validateReputation'
import { useRef } from "react"

export default function ReputationInput(props) {

  const [getParams, pushGetParams] = useGetParams()
  const inputRef = useRef()

  const getParamName = props.getParamName || "reputation"

  const updateReputation = e => {
    e.target.value = validateReputation(e.target.value)
    pushGetParams({ [getParamName]: e.target.value === "0" ? undefined : e.target.value })
  }

  const onWheel = () => {
    inputRef.current.blur()
  }

  return <div style={{
    margin: 10,
    minWidth: 120,
    flexGrow: 1,
    flexBasis: 120,
  }}
  ><input
      type="number"
      style={{
        width: "100%",
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
      }}
      onInput={updateReputation}
      placeholder="Reputation"
      value={validateReputation(getParams[getParamName]) || ""}
      step={5}
      ref={inputRef}
      onWheel={onWheel}
    /></div>
}