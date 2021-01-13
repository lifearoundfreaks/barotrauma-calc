import TextureLoader from '../Components/TextureLoader'
import useGetParams from './useGetParams'
import data from "../parsed_data.json"
import validateReputation from '../Utils/validateReputation'
import validateOutpost from '../Utils/validateOutpost'
import ClickableItem from '../Components/ClickableItem'

const rnd = price => Math.floor(price)
const compareItems = (a, b) => a.rating < b.rating ? 1 : a.rating === b.rating ? 0 : -1

const InlineItem = props => {
    return <div>
        <ClickableItem
            item={props.item}
            identifier={props.identifier}
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

const calculateItem = (item, outpost, reputation, destoutpost, destreputation) => {

    const getOutpostData = (item, location) => item.price?.modified?.[location]

    const getOutpostMultiplier = (item, location) => getOutpostData(item, location)?.multiplier || 1

    const hasPriceData = item => item.price?.default !== undefined

    const isSoldThere = item => {
        const outpostData = getOutpostData(item, outpost)
        return hasPriceData(item) && (
            (item.price.soldeverywhere !== "false") ||
            (outpostData && (outpostData.sold !== "false"))
        )
    }

    const getBuyingPrice = item => {
        if (isSoldThere(item)) return Math.max(rnd(
            rnd(
                item.price.default * getOutpostMultiplier(item, outpost)
            ) * (1 - reputation * .001)
        ), 1)
    }

    const getSellingPrice = item => {
        if (hasPriceData(item)) return Math.max(rnd(
            rnd(
                rnd(item.price.default * getOutpostMultiplier(item, destoutpost)) * .8
            ) * (1 + destreputation * .001)
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
                getFabricationProfit(item, sellingprice) / item.fabricate_time * (item.skills ?  1 : 2)
            ) / 100 : 0

            if (fabrProfit > 0) {
                fabr.push({ item, identifier, rating: fabrProfit })
                updateUsefulMaterials(item.fabricate)

            } else if (fabrProfit === -Infinity) {
                fabrProfit = item.fabricate ? Math.round(100 *
                    getSellFabricationProfit(item, sellingprice) / item.fabricate_time * (item.skills ?  1 : 2)
                ) / 100 : 0
                if (fabrProfit > 0) {
                    sellFabr.push({ item, identifier, rating: fabrProfit })
                    updateUsefulMaterials(item.fabricate)
                }
            }

            let decProfit = item.deconstruct ? Math.round(100 *
                getDeconstructionProfit(item, buyingprice) / item.deconstruct_time
            ) / 100 : 0

            if (decProfit > 0) {
                dec.push({ item, identifier, rating: decProfit })

            } else if (decProfit === -Infinity) {
                decProfit = item.deconstruct ? Math.round(100 *
                    getSellDeconstructionProfit(item, sellingprice) / item.deconstruct_time
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
                    header="Deconstruction profits"
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

    return {
        buyingprice, sellingprice,
        minAmt: getOutpostData(item, outpost)?.min_amt,
        tradingProfit: (sellingprice === undefined || buyingprice === undefined) ?
            undefined : sellingprice - buyingprice,
        fabricationProfit: getFabricationProfit(item, sellingprice),
        deconstructionProfit: getDeconstructionProfit(item, buyingprice),
        sellFabricationProfit: getSellFabricationProfit(item, sellingprice),
        sellDeconstructionProfit: getSellDeconstructionProfit(item, sellingprice),
        outpostmultiplier: getOutpostMultiplier(item, outpost),
        destoutpostmultiplier: getOutpostMultiplier(item, destoutpost),
    }
}

const ProfitText = props => {
    if (props.profit === -Infinity) return <small>Source item(s) cannot be bought at departure</small>
    const profitable = props.profit >= 0
    return <span>{profitable ? "Profit" : "Loss"}: <b style={{
        color: profitable ? "green" : "red"
    }}>{profitable ? props.profit : -props.profit}</b> {props.children}</span>
}

const BlockWithItems = props => {
    return Object.keys(props.itemsObj || {}).length ? (
        <div className="mt-2">
            <h5>{props.mainText}</h5>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {Object.entries(props.itemsObj).map(
                    ([identifier, amount]) =>
                        <InlineItem
                            key={identifier}
                            item={data[identifier]}
                            identifier={identifier}
                            rating={amount}
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

    const calcData = calculateItem(item, outpost, reputation, destoutpost, destreputation)

    if (item === undefined) return {
        noItem: true,
        ...calcData,
    }
    return {
        displayName: item.display_name,
        fabricateTime: item.fabricate_time,
        deconstructTime: item.deconstruct_time,
        fabricatorTypes: item.fabricator_types?.split(",").join("; "),
        skills: Object.entries(item.skills || {}).map(([k, v]) => `${k}: ${v}`).join('; '),
        ...calcData,
        fabricationBlock: <BlockWithItems itemsObj={item.fabricate} mainText="Fabricated from">
            <ProfitText profit={calcData.fabricationProfit}><br />
                <small className="text-muted">(when you buy at departure and sell at destination)</small>
            </ProfitText><br />
            <ProfitText profit={calcData.sellFabricationProfit}><br />
                <small className="text-muted">(when you find the ingredients en route)</small>
            </ProfitText>
        </BlockWithItems>,
        deconstuctionBlock: <BlockWithItems itemsObj={item.deconstruct} mainText="Deconstructed to">
            <ProfitText profit={calcData.deconstructionProfit}><br />
                <small className="text-muted">(when you buy at departure and sell at destination)</small>
            </ProfitText><br />
            <ProfitText profit={calcData.sellDeconstructionProfit}><br />
                <small className="text-muted">(when you find the item en route)</small>
            </ProfitText>
        </BlockWithItems>,
        usedinBlock: <BlockWithItems itemsObj={item.used_in} mainText="Used in" />,
        scrappedfromBlock: <BlockWithItems itemsObj={item.scrapped_from} mainText="Scrapped from" />,
        image: <TextureLoader
            size={100}
            file={item.texture}
            sourcerect={item.sourcerect}
            margin={0}
        />,
    }
}