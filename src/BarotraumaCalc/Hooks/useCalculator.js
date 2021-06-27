import TextureLoader from '../Components/TextureLoader'
import useGetParams from './useGetParams'
import gameData from "../parsed_data.json"
import validateReputation from '../Utils/validateReputation'
import validateOutpost from '../Utils/validateOutpost'
import validateFabricator from '../Utils/validateFabricator'
import validateSkill from '../Utils/validateSkill'
import validateUpgrades from '../Utils/validateUpgrades'
import validateStoreBalance from '../Utils/validateStoreBalance'
import validateDifficultyLevel from '../Utils/validateDifficultyLevel'
import ClickableItem from '../Components/ClickableItem'
import getRGB from '../Utils/getRGB'
import {
    ENGLISH_SKILL_NAMES,
    FABRICATOR_OPTIONS,
    BASE_MULTIPLIER_OPTION,
    LOWEST_MULTIPLIER_OPTION,
    HIGHEST_MULTIPLIER_OPTION,
    LOCATIONAL_OUTPOST_OPTIONS,
    OUTPOST_OPTIONS,
} from '../globals'

const data = gameData.items
const rnd = price => Math.floor(price)
const compareItems = (a, b) => a.rating < b.rating ? 1 : a.rating === b.rating ? 0 : -1

const InlineItem = props => {
    return <div>
        <ClickableItem
            item={props.item}
            identifier={props.identifier}
            rating={props.additionalRating}
        /><b>{(props.prefix || "") + props.rating + (props.postfix || "")}</b></div>
}

const RatedItems = props => {
    return props.items.length ? <>
        <h5 className="mb-0">{props.header}</h5><small>{props.explanation}</small>
        <div className="py-4" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {props.items.sort(compareItems).map(
                obj => <InlineItem key={obj.identifier} identifier={obj.identifier} item={obj.item} rating={obj.rating} postfix={props.postfix} />
            )}
        </div></> : <></>
}

const calculateItem = (item, outpost, reputation, destoutpost, destreputation, fabricatortypes, skills, upgrades, sellmultiplier, leveldifficulty) => {

    const getOutpostData = (item, location) => item.price?.modified?.[location]

    const getOutpostMultiplier = (item, location) => {
        const price_data = item.price
        if (price_data === undefined) return 1

        if (location === LOWEST_MULTIPLIER_OPTION.value) return price_data.min_multiplier
        else if (location === HIGHEST_MULTIPLIER_OPTION.value) return price_data.max_multiplier
        else return price_data.modified?.[location]?.multiplier || 1
    }

    const hasPriceData = item => item.price?.default !== undefined

    const isSoldThere = (item, location) => {
        if (location === undefined) location = outpost
        if (
            location === BASE_MULTIPLIER_OPTION.value ||
            location === LOWEST_MULTIPLIER_OPTION.value ||
            location === HIGHEST_MULTIPLIER_OPTION.value
        ) {
            return item.price?.soldsomewhere === "true"
        }
        const outpostData = getOutpostData(item, location)
        return hasPriceData(item) && item.price.minleveldifficulty <= leveldifficulty && (
            (item.price.soldeverywhere !== "false") ||
            (outpostData && (outpostData.sold !== "false"))
        )
    }

    const getBuyingPrice = (item, location) => {
        if (isSoldThere(item, location)) return Math.max(rnd(
            rnd(
                item.price.default * getOutpostMultiplier(item, location || outpost)
            ) * (location === undefined ? (1 - reputation * .001) : 1)
        ), 1)
    }

    const getSellingPrice = (item, location) => {
        if (hasPriceData(item)) return Math.max(rnd(
            rnd(
                rnd(item.price.default * getOutpostMultiplier(item, location || destoutpost)) * .8
            ) * (location === undefined ? sellmultiplier * (1 + destreputation * .001) : 1)
        ), 1)
    }

    const getFabricationProfit = (item, sellingprice) => Object.entries(item.fabricate || {}).reduce(
        (sum, [id, amt]) => sum - ((getBuyingPrice(data[id])) || Infinity) * amt, 0
    ) + (sellingprice || 0)

    const getDeconstructionProfit = (item, buyingprice) => Object.entries(item.deconstruct || {}).reduce(
        (sum, [id, amt]) => sum + ((getSellingPrice(data[id])) || 0) * amt, 0
    ) - (buyingprice || Infinity)

    const getSellFabricationProfit = (item, sellingprice) => Object.entries(item.fabricate || {}).reduce(
        (sum, [id, amt]) => sum - ((getSellingPrice(data[id])) || 0) * amt, 0
    ) + (sellingprice || 0)

    const getSellDeconstructionProfit = (item, sellingprice) => Object.entries(item.deconstruct || {}).reduce(
        (sum, [id, amt]) => sum + ((getSellingPrice(data[id])) || 0) * amt, 0
    ) - (sellingprice || 0)

    const getRealFabricationTime = item => {
        if (item.skills === undefined) return item.fabricate_time / 2
        const degreeOfSuccess = (Object.entries(item.skills).reduce(
            (sum, [skill, level]) =>
                sum + skills[skill] - level, 0
        ) / Object.keys(item.skills).length + 100) / 200
        const t = degreeOfSuccess < .5 ? degreeOfSuccess * degreeOfSuccess : degreeOfSuccess * 2
        return item.fabricate_time / (Math.pow(1.05, upgrades.fabricator)) / Math.max(Math.min(t, 2), .01)
    }

    const getRealDeconstructionTime = item => item.deconstruct_time / (Math.pow(1.05, upgrades.deconstructor))

    if (item === undefined) {
        const [trade, fabr, sellFabr, dec, sellDec] = [[], [], [], [], []]

        const usefulMats = {}

        const updateUsefulMaterials = ingredients => {
            for (const ingredientId in ingredients) {
                let ingredient = data[ingredientId]
                if (getBuyingPrice(ingredient)) {
                    if (ingredientId in usefulMats) {
                        usefulMats[ingredientId].rating += 1
                    } else {
                        usefulMats[ingredientId] = { item: ingredient, identifier: ingredientId, rating: 1 }
                    }
                }
            }
        }

        for (const [identifier, item] of Object.entries(data)) {

            let buyingprice = getBuyingPrice(item)
            let sellingprice = getSellingPrice(item)
            let tradeProfit = sellingprice - buyingprice

            if (tradeProfit > 0) {
                trade.push({ item, identifier, rating: Math.round(1000 * tradeProfit / buyingprice) / 10 })
            }

            let fabrProfit = item.fabricate ? Math.round(100 *
                getFabricationProfit(item, sellingprice) / getRealFabricationTime(item)
            ) / 100 : 0

            if (fabricatortypes.value === "all" || (item.fabricator_types || "").split(",").includes(fabricatortypes.value)) {
                if (fabrProfit > 0) {
                    fabr.push({ item, identifier, rating: fabrProfit })
                    updateUsefulMaterials(item.fabricate)

                } else if (fabrProfit === -Infinity) {
                    fabrProfit = item.fabricate ? Math.round(100 *
                        getSellFabricationProfit(item, sellingprice) / getRealFabricationTime(item)
                    ) / 100 : 0
                    if (fabrProfit > 0) {
                        sellFabr.push({ item, identifier, rating: fabrProfit })
                        updateUsefulMaterials(item.fabricate)
                    }
                }
            }

            let decProfit = item.deconstruct ? Math.round(100 *
                getDeconstructionProfit(item, buyingprice) / getRealDeconstructionTime(item)
            ) / 100 : 0

            if (decProfit > 0) {
                dec.push({ item, identifier, rating: decProfit })

            } else if (decProfit === -Infinity) {
                decProfit = item.deconstruct ? Math.round(100 *
                    getSellDeconstructionProfit(item, sellingprice) / getRealDeconstructionTime(item)
                ) / 100 : 0
                if (decProfit > 0) {
                    sellDec.push({ item, identifier, rating: decProfit })
                }
            }
        }
        return {
            homepageResults: <>
                <RatedItems
                    items={trade}
                    postfix="%"
                    header="Trading investment returns"
                    explanation="(with no crafting involved)" />
                <RatedItems
                    items={Object.values(usefulMats)}
                    header="Useful crafting materials"
                    explanation="(involved in N profitable recipes and sold here)" />
                <RatedItems
                    items={fabr}
                    postfix="/s"
                    header="Fabrication profits per fabrication time"
                    explanation="(departure sells ingredients)" />
                <RatedItems
                    items={sellFabr}
                    postfix="/s"
                    header="Other fabrication profits"
                    explanation="(you have to acquire the ingredients through means other than trading)" />
                <RatedItems
                    items={dec}
                    postfix="/s"
                    header="Deconstruction profits per deconstruction time"
                    explanation="(departure sells those items)" />
                <RatedItems
                    items={sellDec}
                    postfix="/s"
                    header="Other deconstruction profits"
                    explanation="(you have to acquire the item through means other than trading)" />
            </>
        }
    }

    const buyingprice = getBuyingPrice(item)
    const sellingprice = getSellingPrice(item)

    const getColorCodedUsedIn = () => {
        return Object.fromEntries(
            Object.entries(item.used_in || {}).map(
                ([usedInId, amount]) =>
                ([usedInId, {
                    amount: amount,
                    additionalRating: getSellFabricationProfit(
                        data[usedInId], getSellingPrice(data[usedInId])) * amount * 2
                }])
            )
        )
    }

    const getColorCodedScrappedFrom = () => {
        return Object.fromEntries(
            Object.entries(item.scrapped_from || {}).map(
                ([scrappedFromId, amount]) =>
                ([scrappedFromId, {
                    amount: amount,
                    additionalRating: getSellDeconstructionProfit(
                        data[scrappedFromId], getSellingPrice(data[scrappedFromId])) * amount * 2
                }])
            )
        )
    }

    const baseprice = item.price?.default
    const pricesData = LOCATIONAL_OUTPOST_OPTIONS.reduce((result, outpostType) => {
        result[OUTPOST_OPTIONS[outpostType]?.label] = [
            getBuyingPrice(item, outpostType),
            getSellingPrice(item, outpostType),
            getRGB((baseprice - getBuyingPrice(item, outpostType)) / baseprice * 600),
            getRGB((getSellingPrice(item, outpostType) - baseprice) / baseprice * 600),
        ]
        return result
    }, {})

    return {
        buyingprice, sellingprice, pricesData,
        fabricateTime: (Math.round(100 * getRealFabricationTime(item)) / 100) || undefined,
        fabricationBatch: item.fabrication_batch || 1.,
        deconstructTime: (Math.round(100 * getRealDeconstructionTime(item)) / 100) || undefined,
        randomDeconstruction: item.random_deconstruction ? "yes" : undefined,
        minAmt: getOutpostData(item, outpost)?.min_amt,
        tradingProfit: (sellingprice === undefined || buyingprice === undefined) ?
            undefined : sellingprice - buyingprice,
        fabricationProfit: getFabricationProfit(item, sellingprice),
        deconstructionProfit: getDeconstructionProfit(item, buyingprice),
        sellFabricationProfit: getSellFabricationProfit(item, sellingprice),
        sellDeconstructionProfit: getSellDeconstructionProfit(item, sellingprice),
        outpostmultiplier: getOutpostMultiplier(item, outpost),
        destoutpostmultiplier: getOutpostMultiplier(item, destoutpost),
        usedIn: getColorCodedUsedIn(),
        scrappedFrom: getColorCodedScrappedFrom(),
        minleveldifficulty: item.price?.minleveldifficulty || undefined,
    }
}

const ProfitText = props => {
    if (props.profit === -Infinity) return <small>Source item(s) cannot be bought at departure</small>
    const profitable = props.profit >= 0
    return <span>{profitable ? "Profit" : "Loss"}: <b style={{
        color: profitable ? "green" : "red"
    }}>{Math.round((profitable ? props.profit : -props.profit) * 100) / 100}</b> <span className="text-muted">
        ({Math.round(props.profit/props.time*100)/100}/s) {props.children}
    </span></span>
}

const BlockWithItems = props => {
    return Object.keys(props.itemsObj || {}).length ? (
        <div className="mt-2">
            <h5>{props.mainText}</h5>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {Object.entries(props.itemsObj).map(
                    ([identifier, value]) =>
                        <InlineItem
                            key={identifier}
                            item={data[identifier]}
                            identifier={identifier}
                            rating={props.colorCoded ? value.amount : value}
                            additionalRating={props.colorCoded && value.additionalRating}
                            prefix="x " />
                )}
            </div>
            {props.children}
        </div>) : <></>
}

export default function useCalculator(identifier) {

    const getParams = useGetParams()[0]
    const item = data[identifier]


    const outpost = validateOutpost(getParams.outpost).value
    const reputation = validateReputation(getParams.reputation)
    const destoutpost = validateOutpost(getParams.destoutpost).value
    const destreputation = validateReputation(getParams.destreputation)
    const fabricatortypes = validateFabricator(getParams.fabricator)
    const skills = {
        helm: validateSkill(getParams.helm),
        weapons: validateSkill(getParams.weapons),
        mechanical: validateSkill(getParams.mechanical),
        electrical: validateSkill(getParams.electrical),
        medical: validateSkill(getParams.medical),
    }
    const upgrades = {
        fabricator: validateUpgrades(getParams.fabrlvl),
        deconstructor: validateUpgrades(getParams.declvl),
    }
    const sellmultiplier = validateStoreBalance(getParams.balance).numeric
    const leveldifficulty = validateDifficultyLevel(getParams.difficulty)

    const calcData = calculateItem(item, outpost, reputation, destoutpost, destreputation, fabricatortypes, skills, upgrades, sellmultiplier, leveldifficulty)

    if (item === undefined) return {
        noItem: true,
        ...calcData,
    }
    return {
        displayName: item.display_name,
        fabricatorTypes: item.fabricator_types?.split(",").map(name => FABRICATOR_OPTIONS[name]?.label || name).join(", "),
        skills: Object.entries(item.skills || {}).map(
            ([k, v], i) => <div key={i} style={{marginBottom: 5}}>{`${ENGLISH_SKILL_NAMES[k] || k}: ${v}`}</div>
        ),
        ...calcData,
        fabricationBlock: <BlockWithItems itemsObj={item.fabricate} mainText="Fabricated from">
            <ProfitText profit={calcData.fabricationProfit} time={calcData.fabricateTime}><br />
                <small className="text-muted">(when you buy at departure and sell at destination)</small>
            </ProfitText><br />
            <ProfitText profit={calcData.sellFabricationProfit} time={calcData.fabricateTime}><br />
                <small className="text-muted">(when you find the ingredients en route)</small>
            </ProfitText>
        </BlockWithItems>,
        deconstuctionBlock: <BlockWithItems itemsObj={item.deconstruct} mainText="Deconstructed to">
            <ProfitText profit={calcData.deconstructionProfit} time={calcData.deconstructTime}><br />
                <small className="text-muted">(when you buy at departure and sell at destination)</small>
            </ProfitText><br />
            <ProfitText profit={calcData.sellDeconstructionProfit} time={calcData.deconstructTime}><br />
                <small className="text-muted">(when you find the item en route)</small>
            </ProfitText>
        </BlockWithItems>,
        usedinBlock: <BlockWithItems itemsObj={calcData.usedIn} mainText="Used in" colorCoded />,
        scrappedfromBlock: <BlockWithItems itemsObj={calcData.scrappedFrom} mainText="Scrapped from" colorCoded />,
        refilledWithBlock: <BlockWithItems itemsObj={item.refilled_with} mainText="Refilled with">
            <small className="text-muted">(deconstruction may not yield resources</small><br />
            <small className="text-muted">if an item is partially depleted)</small>
        </BlockWithItems>,
        image: <TextureLoader
            size={100}
            file={item.texture}
            sourcerect={item.sourcerect}
            margin={0}
        />,
    }
}