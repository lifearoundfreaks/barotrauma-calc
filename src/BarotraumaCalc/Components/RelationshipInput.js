import useGetParams from '../Hooks/useGetParams'

const validateInput = input => Math.max(Math.min(parseInt(input) || 0, 100), -100)

export default function RelationshipInput() {

  const [getParams, pushGetParams] = useGetParams()

  const updateRelations = e => {
    e.target.value = validateInput(e.target.value)
    pushGetParams({ relations: e.target.value === "0" ? undefined : e.target.value })
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
      onInput={updateRelations}
      placeholder="Relations"
      value={validateInput(getParams.relations) || ""}
    /></div>
}