
import React, { useState } from 'react'
import Select, { components, createFilter } from 'react-select'
import { getOptionsIterator } from '../Utils/dataHandler'
import TextureLoader from './TextureLoader'
import useGetParams from '../Hooks/useGetParams'
import { generateStyles, customThemeOverrides, OPTION_HEIGHT } from '../Utils/selectTheme'

const MAX_SEARCH_SUGGESTIONS = 5

const { Option } = components;
const iconOption = props => (
  <>
    <TextureLoader
      size={OPTION_HEIGHT}
      file={props.data.texture}
      sourcerect={props.data.sourcerect}
      margin={5}
    />
    <Option {...props}>
      {props.data.label}
    </Option>
  </>
)

const getSearchResults = input => {
  let [results, iter] = [[], getOptionsIterator()];
  while (results.length < MAX_SEARCH_SUGGESTIONS) {
    let nextOption = iter.next().value
    if (nextOption === undefined) break
    else if (nextOption.searchstring.includes(input.toLowerCase())) results.push(nextOption)
  }
  return results
}

export default function SearchBar() {

  const [filteredOptions, updateFIlteredOptions] = useState([])
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const pushGetParams = useGetParams()[1]

  const handleInputChange = newInput => {
    if (newInput.length) {
      updateFIlteredOptions(getSearchResults(newInput))
      setMenuIsOpen(true)
    } else {
      updateFIlteredOptions([])
      setMenuIsOpen(false)
    }
  }

  const handleChange = e => {
    pushGetParams({identifier: e.value})
  }

  return <Select
    value={() => null}
    options={filteredOptions}
    onInputChange={handleInputChange}
    onChange={handleChange}
    components={{ Option: iconOption, DropdownIndicator: () => null, IndicatorSeparator: () => null }}
    menuIsOpen={menuIsOpen}
    placeholder="Search for items by name"
    noOptionsMessage={() => "No items were found."}
    filterOption={createFilter({ stringify: option => option.data.searchstring, ignoreCase: true })}
    styles={generateStyles({flexGrow: 1, marginTop: 34})}
    maxMenuHeight={400}
    theme={customThemeOverrides}
  />
}