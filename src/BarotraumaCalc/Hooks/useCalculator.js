import TextureLoader from '../Components/TextureLoader'
import useGetParams from './useGetParams'
import data from "../parsed_data.json"
import validateReputation from '../Utils/validateReputation'
import validateOutpost from '../Utils/validateOutpost'
import ClickableItem from '../Components/ClickableItem'

const round = price => Math.max(Math.floor(price), 1)

const calculateItem = (item, outpost, reputation) => {

    const getOutpostData = item => item.price?.modified?.[outpost]

    const getOutpostMultiplier = item => getOutpostData(item)?.multiplier || 1

    const hasPriceData = item => item.price?.default !== undefined

    const isSoldThere = item => {
        const outpostData = getOutpostData(item)
        return hasPriceData(item) && (
            (item.price.soldeverywhere !== "false") ||
            (outpostData && (outpostData.sold !== "false"))
        )
    }

    const getBuyingPrice = item => {
        const reputationMultiplier = 1 - reputation * .001
        if (isSoldThere(item)) return round(
            item.price.default * getOutpostMultiplier(item) * reputationMultiplier)
    }

    const getSellingPrice = item => {
        const reputationMultiplier = .8 + reputation * .0008
        if (hasPriceData(item)) return round(
            item.price.default * getOutpostMultiplier(item) * reputationMultiplier)
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
        fabricationProfit: getFabricationProfit(item),
        deconstructionProfit: getDeconstructionProfit(item),
        sellFabricationProfit: getSellFabricationProfit(item),
        sellDeconstructionProfit: getSellDeconstructionProfit(item),
        outpostmultiplier: getOutpostMultiplier(item),
    }
}

const ProfitText = props => {
    if (props.profit === -Infinity) return <span>Source item(s) cannot be bought here</span>
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

    const getImage = item => {
        return <TextureLoader
            size={100}
            file={item.texture}
            sourcerect={item.sourcerect}
            margin={0}
        />
    }

    const calcData = calculateItem(item, outpost, reputation)
    return {
        displayName: item.display_name,
        ...calcData,
        fabricationBlock: <BlockWithItems itemsObj={item.fabricate} mainText="Fabricated from">
            <ProfitText profit={calcData.fabricationProfit}>(when you buy the ingredients)</ProfitText><br />
            <ProfitText profit={calcData.sellFabricationProfit}>(when you have the ingredients)</ProfitText>
        </BlockWithItems>,
        deconstuctionBlock: <BlockWithItems itemsObj={item.deconstruct} mainText="Deconstructed to">
            <ProfitText profit={calcData.deconstructionProfit}>(when you buy the item)</ProfitText><br />
            <ProfitText profit={calcData.sellDeconstructionProfit}>(when you have the item)</ProfitText>
        </BlockWithItems>,
        usedinBlock: <BlockWithItems itemsObj={item.used_in} mainText="Used in" />,
        scrappedfromBlock: <BlockWithItems itemsObj={item.scrapped_from} mainText="Scrapped from" />,
        image: getImage(item),
    }
}