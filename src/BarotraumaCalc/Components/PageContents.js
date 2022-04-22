import useGetParams from '../Hooks/useGetParams'
import { Row, Col, Table, Tabs, Tab } from 'react-bootstrap'
import useCalculator from '../Hooks/useCalculator'

const TableData = props => {
    return props.value !== props.missingValue ?
        <tr>
            <td style={{minWidth: 80}}>{props.children}</td>
            <td style={{minWidth: 80}}>{props.value}</td>
        </tr> : <></>
}

const PriceTableData = ({outpost, prices, baseprices}) => {
    const [buyingprice, sellingprice, buycolor, sellcolor] = prices
    return <tr>
        <td style={{minWidth: 80, padding: 5}}>{outpost}</td>
        <td style={{minWidth: 40, padding: 5, color: buycolor}}>{buyingprice}</td>
        <td style={{minWidth: 40, padding: 5, color: sellcolor}}>{sellingprice}</td>
    </tr>
}

const InfoTable = props => {

    return <div style={{overflowWrap: "anywhere"}}>
        <Table striped bordered hover variant="dark" style={{ margin: 0 }}>
            <thead>
                <tr>
                    <th colSpan="2">
                        <div style={{
                            border: "1.5px solid #454d55",
                            borderRadius: "10px",
                            display: "inline-block",
                            padding: "9px 8px 10px 10px",
                        }}>{props.calculator.image}</div>
                    </th>
                </tr>
            </thead>
        </Table>
        <Tabs
            defaultActiveKey="main-tab"
            className="table-dark table-striped"
            style={{ border: 0 }}
            fill
        >
            <Tab eventKey="main-tab" title="Main" style={{ backgroundColor: "black" }}>
                <Table striped bordered hover variant="dark">
                    <tbody>
                        <TableData value={props.calculator.requiresrecipe}>Requires recipe</TableData>
                        <TableData value={props.calculator.tradingProfit}>Trading margin</TableData>
                        <TableData value={props.calculator.buyingprice}>Buying price (best)</TableData>
                        <TableData value={props.calculator.sellingprice}>Selling price (best)</TableData>
                        <TableData value={props.calculator.minAmt}>Minimal amount sold at departure</TableData>
                        <TableData value={props.calculator.whereSold}>Sold at</TableData>
                        <TableData
                            value={props.calculator.outpostmultiplier.min === props.calculator.outpostmultiplier.max
                                ? props.calculator.outpostmultiplier.min :
                                `${props.calculator.outpostmultiplier.min}-${props.calculator.outpostmultiplier.max}`}
                            missingValue={1}
                        >Departure multiplier</TableData>
                        <TableData
                            value={props.calculator.destoutpostmultiplier.min === props.calculator.destoutpostmultiplier.max
                                ? props.calculator.destoutpostmultiplier.min :
                                `${props.calculator.destoutpostmultiplier.min}-${props.calculator.destoutpostmultiplier.max}`}
                            missingValue={1}
                        >Destination multiplier</TableData>
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey="crafting-tab" title="Crafting">

                <Table striped bordered hover variant="dark">
                    <tbody>
                        <TableData value={props.calculator.fabricateTime}>Fabrication time</TableData>
                        <TableData value={props.calculator.fabricatorTypes}>Fabricator type(s)</TableData>
                        <TableData value={props.calculator.fabricationBatch} missingValue={1.}>Fabrication batch</TableData>
                        <TableData value={props.calculator.deconstructTime}>Deconstruction time</TableData>
                        <TableData value={props.calculator.randomDeconstruction}>Deconstruction is random</TableData>
                        <TableData value={props.calculator.skills?.length ? props.calculator.skills : undefined}>Fabrication skills</TableData>
                        <TableData value={props.calculator.minleveldifficulty}>Minimum difficulty level</TableData>
                    </tbody>
                </Table>
            </Tab>

            <Tab eventKey="prices-tab" title="Prices (best)">
                <Table striped bordered hover variant="dark">
                    <tbody>
                        <PriceTableData
                            key={"head"}
                            prices={["Buy", "Sell"]}
                        />
                        {Object.entries(props.calculator.pricesData).map(
                            entry => <PriceTableData
                                key={entry[0]}
                                outpost={entry[0]}
                                prices={entry[1]}
                            />
                        )}
                    </tbody>
                </Table>
            </Tab>
        </Tabs>
    </div>
}

export default function PageContents() {

    const getParams = useGetParams()[0]
    const identifier = getParams.identifier
    const calculatorResults = useCalculator(identifier)
    if (calculatorResults.noItem) return calculatorResults.homepageResults

    return <>
        <Row>
            <Col><h4>{calculatorResults.displayName}</h4></Col>
        </Row>
        <Row className="mt-3">
            <Col md={5} className="mb-3"><InfoTable calculator={calculatorResults} /></Col>
            <Col md={7}>
                {calculatorResults.fabricationBlock}
                {calculatorResults.deconstuctionBlock}
                {calculatorResults.usedinBlock}
                {calculatorResults.scrappedfromBlock}
                {calculatorResults.refilledWithBlock}
            </Col>
        </Row>
    </>
}