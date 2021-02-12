import { useState } from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
import Select from 'react-select'
import { generateStyles, customThemeOverrides } from '../Utils/selectTheme'
import {
    DEFAULT_SKILL_LEVEL,
    FABRICATOR_OPTIONS,
    DEFAULT_FABRICATOR_OPTION,
    ENGLISH_SKILL_NAMES,
    DEFAULT_UPGRADE_LEVELS,
    STORE_BALANCE_MULTIPLIERS,
    DEFAULT_STORE_BALANCE_MULTIPLIER,
} from '../globals'
import validateFabricator from '../Utils/validateFabricator'
import validateSkill from '../Utils/validateSkill'
import validateUpgrades from '../Utils/validateUpgrades'
import validateStoreBalance from '../Utils/validateStoreBalance'
import useGetParams from '../Hooks/useGetParams'
import { useRef } from "react"

const OutpostSwapper = () => {

    const [getParams, pushGetParams] = useGetParams()

    const handleClick = () => {
        pushGetParams({
            outpost: getParams.destoutpost,
            destoutpost: getParams.outpost,
            reputation: getParams.destreputation,
            destreputation: getParams.reputation,
        })
    }

    return <Button
        style={{ padding: "1px 5px", margin: 5, borderRadius: 0 }}
        variant="dark"
        onClick={handleClick}
    >
        Swap outposts
    </Button>
}

const OutpostRepeater = () => {
    
    const [getParams, pushGetParams] = useGetParams()

    const handleClick = () => {
        pushGetParams({
            destoutpost: getParams.outpost,
            destreputation: getParams.reputation,
        })
    }

    return <Button
        style={{ padding: "1px 5px", margin: 5, borderRadius: 0 }}
        variant="dark"
        onClick={handleClick}
    >
        Same destination
    </Button>

}

const SellingPriceMultPicker = props => {

        const [getParams, pushGetParams] = useGetParams()
    
        const handleChange = e => {
            pushGetParams({ balance: e.value === DEFAULT_STORE_BALANCE_MULTIPLIER.value ? undefined : e.value })
        }
    
        return <Select
            value={validateStoreBalance(getParams.balance)}
            styles={generateStyles({ flexGrow: 1, minWidth: 120, flexBasis: 120 })}
            theme={customThemeOverrides}
            options={Object.values(STORE_BALANCE_MULTIPLIERS)}
            isSearchable={false}
            onChange={handleChange} />
    }

const SkillPicker = props => {

    const [getParams, pushGetParams] = useGetParams()
    const [previousValue, changeValue] = useState(validateSkill(getParams[props.skill]))
    const inputRef = useRef()

    const getParamName = props.skill

    const updateSkill = e => {
        if (parseInt(previousValue) === DEFAULT_SKILL_LEVEL && (e.target.value === "10" || e.target.value === "-10")) {
            e.target.value = DEFAULT_SKILL_LEVEL + parseInt(e.target.value)
        }
        e.target.value = validateSkill(e.target.value)
        changeValue(e.target.value)
        pushGetParams({ [props.skill]: parseInt(e.target.value) === DEFAULT_SKILL_LEVEL ? undefined : e.target.value })
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
    >
        <input
            type="number"
            style={{
                width: "100%",
                paddingLeft: 10,
                paddingTop: 5,
                paddingBottom: 5,
            }}
            step={10}
            onInput={updateSkill}
            placeholder={ENGLISH_SKILL_NAMES[props.skill] || props.skill}
            value={validateSkill(getParams[getParamName]) === DEFAULT_SKILL_LEVEL ? "" : getParams[getParamName]}
            ref={inputRef}
            onWheel={onWheel}
        /></div>
}

const UpgradesPicker = props => {

    const [getParams, pushGetParams] = useGetParams()
    const inputRef = useRef()

    const updateUpgrades = e => {
        e.target.value = validateUpgrades(e.target.value)
        pushGetParams({ [props.getparam]: e.target.value === "0" ? undefined : e.target.value })
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
    >
        <input
            type="number"
            style={{
                width: "100%",
                paddingLeft: 10,
                paddingTop: 5,
                paddingBottom: 5,
            }}
            onInput={updateUpgrades}
            placeholder={props.label}
            value={validateUpgrades(getParams[props.getparam]) === DEFAULT_UPGRADE_LEVELS ? "" : getParams[props.getparam]}
            ref={inputRef}
            onWheel={onWheel}
        /></div>
}

const FabricatorPicker = () => {

    const [getParams, pushGetParams] = useGetParams()

    const handleChange = e => {
        pushGetParams({ fabricator: e.value === DEFAULT_FABRICATOR_OPTION.value ? undefined : e.value })
    }

    return <Select
        value={validateFabricator(getParams.fabricator)}
        styles={generateStyles({ flexGrow: 1, minWidth: 120, flexBasis: 120 })}
        theme={customThemeOverrides}
        options={Object.values(FABRICATOR_OPTIONS)}
        isSearchable={false}
        onChange={handleChange} />
}

export default function AdditionalFilters(props) {

    return <Accordion>
        <Card>
            <Card.Header style={{ padding: 5 }}>
                <Accordion.Toggle
                    as={Button}
                    variant="dark"
                    eventKey="additional-filters"
                    style={{ padding: "1px 5px", borderRadius: 0, margin: 5 }}>
                    Toggle additional options
                </Accordion.Toggle>
                <OutpostSwapper />
                <OutpostRepeater />
            </Card.Header>
            <Accordion.Collapse eventKey="additional-filters">
                <Card.Body>
                    <b>Sell price multiplier</b>
                    <SellingPriceMultPicker />
                    <b>Allowed fabricators</b>
                    <FabricatorPicker />
                    <b>Skills (default is {DEFAULT_SKILL_LEVEL})</b>
                    <SkillPicker skill="helm" />
                    <SkillPicker skill="weapons" />
                    <SkillPicker skill="mechanical" />
                    <SkillPicker skill="electrical" />
                    <SkillPicker skill="medical" />
                    <b>Fabrication speed upgrades</b>
                    <UpgradesPicker label="Every level increases speed by 5%" getparam="fabrlvl" />
                    <b>Deconstruction speed upgrades</b>
                    <UpgradesPicker label="Every level increases speed by 5%" getparam="declvl" />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>
}