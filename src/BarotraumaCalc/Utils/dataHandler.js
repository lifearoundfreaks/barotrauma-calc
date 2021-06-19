import gameData from "../parsed_data.json"
  
const getAggregatedOptions = (rawItems) => {
    return Object.entries(rawItems).map(([key, value]) => {
        return {
            value: key,
            label: value.display_name,
            searchstring: value.searchstring,
            texture: value.texture,
            sourcerect: value.sourcerect,
        }
    })
}

const aggregatedOptions = getAggregatedOptions(gameData.items)

export const getOptionsIterator = () => {
    return aggregatedOptions[Symbol.iterator]()
}
