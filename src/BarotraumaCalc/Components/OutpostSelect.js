import Select from 'react-select'
import { generateStyles, customThemeOverrides } from '../Utils/selectTheme'
import { OUTPOST_OPTIONS, DEFAULT_OUTPOST_OPTION } from '../globals'
import useGetParams from '../Hooks/useGetParams'

export default function OutpostSelect() {

  const [getParams, pushGetParams] = useGetParams()

  const handleChange = e => {
    pushGetParams({outpost: e.value})
  }

  return <Select
    value={OUTPOST_OPTIONS[getParams.outpost] || DEFAULT_OUTPOST_OPTION}
    styles={generateStyles({minWidth: 120})}
    theme={customThemeOverrides}
    options={Object.values(OUTPOST_OPTIONS)}
    maxMenuHeight={400}
    isSearchable={false}
    onChange={handleChange}
  />
}