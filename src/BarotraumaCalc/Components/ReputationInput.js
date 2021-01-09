import useGetParams from '../Hooks/useGetParams'
import validateReputation from '../Utils/validateReputation'

export default function ReputationInput() {

  const [getParams, pushGetParams] = useGetParams()

  const updateReputation = e => {
    e.target.value = validateReputation(e.target.value)
    pushGetParams({ reputation: e.target.value === "0" ? undefined : e.target.value })
  }

  return <div style={{
    margin: 10,
    flexBasis: 0,
    minWidth: 120,
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
      value={validateReputation(getParams.reputation) || ""}
    /></div>
}