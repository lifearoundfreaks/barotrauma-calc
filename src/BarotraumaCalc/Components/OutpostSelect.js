import Select from 'react-select'
import { generateStyles, customThemeOverrides } from '../Utils/selectTheme'
import { OUTPOST_OPTIONS, DEFAULT_OUTPOST_OPTION } from '../globals'
import validateOutpost from '../Utils/validateOutpost'
import useGetParams from '../Hooks/useGetParams'

export default function OutpostSelect() {

  const [getParams, pushGetParams] = useGetParams()

  const handleChange = e => {
    pushGetParams({ outpost: e.value === DEFAULT_OUTPOST_OPTION.value ? undefined : e.value })
  }

  return <Select
    value={validateOutpost(getParams.outpost)}
    styles={generateStyles({ minWidth: 120 })}
    theme={customThemeOverrides}
    options={Object.values(OUTPOST_OPTIONS)}
    maxMenuHeight={400}
    isSearchable={false}
    onChange={handleChange}
  />
}
