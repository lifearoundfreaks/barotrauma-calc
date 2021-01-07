
import React, { useState } from 'react'
import Select, { components, createFilter } from 'react-select'
import { getOptionsIterator } from './DataHandler'
import TextureLoader from './TextureLoader'
import { useHistory } from "react-router-dom"

const MAX_SEARCH_SUGGESTIONS = 5
const OPTION_HEIGHT = 56

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

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    padding: (OPTION_HEIGHT - 18) / 2,
  }),
  container: (provided, state) => ({
    ...provided,
    minWidth: 230,
    width: "100%",
    margin: "5x 5px 20px 10px",
  })
}

const customThemeOverrides = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary: 'darkgray',
    primary25: 'lightgray',
    primary50: 'gray',
  },
})

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
  const history = useHistory()

  function handleInputChange(newInput) {
    if (newInput.length) {
      updateFIlteredOptions(getSearchResults(newInput))
      setMenuIsOpen(true)
    } else {
      updateFIlteredOptions([])
      setMenuIsOpen(false)
    }
  }

  function handleChange(e) {
    return history.push(`/?identifier=${e.value}`)
  }

  return <Select
    value={() => null}
    options={filteredOptions}
    onInputChange={handleInputChange}
    onChange={handleChange}
    components={{ Option: iconOption, DropdownIndicator: () => null, IndicatorSeparator: () => null }}
    menuIsOpen={menuIsOpen}
    placeholder="Search for game items by name"
    noOptionsMessage={() => "No items were found."}
    filterOption={createFilter({ stringify: option => option.data.searchstring, ignoreCase: true })}
    styles={customStyles}
    maxMenuHeight={400}
    theme={customThemeOverrides}
  />
}