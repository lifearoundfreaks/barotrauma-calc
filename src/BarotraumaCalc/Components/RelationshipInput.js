import useGetParams from '../Hooks/useGetParams'

export default function RelationshipInput() {

  const [getParams, pushGetParams] = useGetParams()

  const updateRelations = e => {
    e.target.value = Math.max(Math.min(
      parseInt(e.target.value) || 0, 100
    ), -100)
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
      value={getParams.relations || ""}
    /></div>
}