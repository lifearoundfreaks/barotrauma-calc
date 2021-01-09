import TextureLoader from '../Components/TextureLoader'
import useGetParams from './useGetParams'
import data from "../parsed_data.json"
import validateReputation from '../Utils/validateReputation'
import validateOutpost from '../Utils/validateOutpost'
import ClickableItem from '../Components/ClickableItem'

const round = price => Math.max(Math.floor(price), 1)

const ItemWithAmount = props => {
    return <div>
        <b>x {props.amount}</b>
        <ClickableItem
            item={data[props.identifier]}
            identifier={props.identifier}
        /></div>
}

const FabricationBlock = props => {
    const fabricationObj = props.item.fabricate || {}
    return Object.keys(fabricationObj).length ? (<div className="mt-2">
        <h5>Fabricated from:</h5>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(fabricationObj).map(
                ([identifier, amount]) => <ItemWithAmount key={identifier} identifier={identifier} amount={amount} />
            )}
        </div>
    </div>) : <></>
}

const DeconstuctionBlock = props => {
    const deconstructObj = props.item.deconstruct || {}
    return Object.keys(deconstructObj).length ? (<div className="mt-2">
    <h5>Deconstucted to:</h5>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(deconstructObj).map(
                ([identifier, amount]) => <ItemWithAmount key={identifier} identifier={identifier} amount={amount} />
            )}
        </div>
    </div>) : <></>
}

const UsedInBlock = props => {
    const usedinObj = props.item.used_in || {}
    return Object.keys(usedinObj).length ? (<div className="mt-2">
    <h5>Used in:</h5>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(usedinObj).map(
                ([identifier, amount]) => <ItemWithAmount key={identifier} identifier={identifier} amount={amount} />
            )}
        </div>
    </div>) : <></>
}

const ScrappedFromBlock = props => {
    const scrappedFromObj = props.item.scrapped_from || {}
    return Object.keys(scrappedFromObj).length ? (<div className="mt-2">
    <h5>Scrapped from:</h5>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(scrappedFromObj).map(
                ([identifier, amount]) => <ItemWithAmount key={identifier} identifier={identifier} amount={amount} />
            )}
        </div>
    </div>) : <></>
}

export default function useCalculator(identifier) {

    const getParams = useGetParams()[0]
    const item = data[identifier]

    if (item === undefined) return { missing: true }

    const outpost = validateOutpost(getParams.outpost).value
    const reputation = validateReputation(getParams.reputation)
    const outpostData = item.price?.modified?.[outpost]
    const hasPriceData = item.price?.default !== undefined
    const isSoldThere = (
        hasPriceData && (
            (item.price.soldeverywhere !== "false") ||
            (outpostData && (outpostData.sold !== "false"))
        )
    )
    const outpostMultiplier = outpostData?.multiplier || 1

    const getImage = item => {
        return <TextureLoader
            size={100}
            file={item.texture}
            sourcerect={item.sourcerect}
            margin={0}
        />
    }

    const getBuyingPrice = () => {
        const reputationMultiplier = 1 - reputation * .001
        if (isSoldThere) return round(
            item.price.default * outpostMultiplier * reputationMultiplier)
    }

    const getSellingPrice = () => {
        const reputationMultiplier = .8 + reputation * .0008
        if (hasPriceData) return round(
            item.price.default * outpostMultiplier * reputationMultiplier)
    }

    return {
        displayName: item.display_name,
        buyingprice: getBuyingPrice(item),
        sellingprice: getSellingPrice(item),
        outpostmultiplier: outpostMultiplier,
        // They are almost identical, maybe factor it out as one component?
        fabricationBlock: <FabricationBlock item={item} />,
        deconstuctionBlock: <DeconstuctionBlock item={item} />,
        usedinBlock: <UsedInBlock item={item} />,
        scrappedfromBlock: <ScrappedFromBlock item={item} />,
        image: getImage(item),
    }
}