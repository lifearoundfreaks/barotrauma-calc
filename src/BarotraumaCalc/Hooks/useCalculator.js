import TextureLoader from '../Components/TextureLoader'
import useGetParams from './useGetParams'
import data from "../parsed_data.json"
import validateReputation from '../Utils/validateReputation'
import validateOutpost from '../Utils/validateOutpost'
import ClickableItem from '../Components/ClickableItem'

const rnd = price => Math.floor(price)

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

    const buyingprice = getBuyingPrice(item)
    const sellingprice = getSellingPrice(item)

    const getFabricationProfit = item => Object.entries(item.fabricate || {}).reduce(
        (sum, [id, amt]) => sum - ((getBuyingPrice(data[id])) || Infinity) * amt, 0
    ) + (sellingprice || 0)

    const getDeconstructionProfit = item => Object.entries(item.deconstruct || {}).reduce(
        (sum, [id, amt]) => sum + ((getSellingPrice(data[id])) || 0) * amt, 0
    ) - (buyingprice || Infinity)

    const getSellFabricationProfit = item => Object.entries(item.fabricate || {}).reduce(
        (sum, [id, amt]) => sum - ((getSellingPrice(data[id])) || 0) * amt, 0
    ) + (sellingprice || 0)

    const getSellDeconstructionProfit = item => Object.entries(item.deconstruct || {}).reduce(
        (sum, [id, amt]) => sum + ((getSellingPrice(data[id])) || 0) * amt, 0
    ) - (sellingprice || 0)

    return {
        buyingprice, sellingprice,
        minAmt: getOutpostData(item, outpost).min_amt,
        tradingProfit: (sellingprice === undefined || buyingprice === undefined) ? undefined : sellingprice - buyingprice,
        fabricationProfit: getFabricationProfit(item),
        deconstructionProfit: getDeconstructionProfit(item),
        sellFabricationProfit: getSellFabricationProfit(item),
        sellDeconstructionProfit: getSellDeconstructionProfit(item),
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

const ItemWithAmount = props => {
    return <div>
        <b>x {props.amount}</b>
        <ClickableItem
            item={data[props.identifier]}
            identifier={props.identifier}
        /></div>
}

const BlockWithItems = props => {
    return Object.keys(props.itemsObj || {}).length ? (
        <div className="mt-2">
            <h5>{props.mainText}</h5>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {Object.entries(props.itemsObj).map(
                    ([identifier, amount]) => <ItemWithAmount key={identifier} identifier={identifier} amount={amount} />
                )}
            </div>
            {props.children}
        </div>) : <></>
}

export default function useCalculator(identifier) {

    const getParams = useGetParams()[0]
    const item = data[identifier]

    if (item === undefined) return { missing: true }

    const outpost = validateOutpost(getParams.outpost).value
    const reputation = validateReputation(getParams.reputation)
    const destoutpost = validateOutpost(getParams.destoutpost).value
    const destreputation = validateReputation(getParams.destreputation)

    const getImage = item => {
        return <TextureLoader
            size={100}
            file={item.texture}
            sourcerect={item.sourcerect}
            margin={0}
        />
    }

    const calcData = calculateItem(item, outpost, reputation, destoutpost, destreputation)
    return {
        displayName: item.display_name,
        fabricateTime: item.fabricate_time,
        deconstructTime: item.deconstruct_time,
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
        image: getImage(item),
    }
}