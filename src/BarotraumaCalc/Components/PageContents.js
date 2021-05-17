import useGetParams from '../Hooks/useGetParams'
import { Row, Col, Table } from 'react-bootstrap'
import useCalculator from '../Hooks/useCalculator'

const TableData = props => {
    return props.value !== props.missingValue ?
        <tr>
            <td>{props.children}</td>
            <td>{props.value}</td>
        </tr> : <></>
}

const InfoTable = props => {

    return <Table striped bordered hover variant="dark">
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
        <tbody>
            <TableData value={props.calculator.tradingProfit}>Trading margin</TableData>
            <TableData value={props.calculator.buyingprice}>Buying price</TableData>
            <TableData value={props.calculator.sellingprice}>Selling price</TableData>
            <TableData value={props.calculator.minAmt}>Minimal amount sold at departure</TableData>
            <TableData value={props.calculator.outpostmultiplier} missingValue={1}>Departure multiplier</TableData>
            <TableData value={props.calculator.destoutpostmultiplier} missingValue={1}>Destination multiplier</TableData>
            <TableData value={props.calculator.fabricateTime}>Fabrication time</TableData>
            <TableData value={props.calculator.fabricatorTypes}>Fabricator type(s)</TableData>
            <TableData value={props.calculator.fabricationBatch} missingValue={1.}>Fabrication batch</TableData>
            <TableData value={props.calculator.deconstructTime}>Deconstruction time</TableData>
            <TableData value={props.calculator.randomDeconstruction}>Deconstruction is random</TableData>
            <TableData value={props.calculator.skills?.length ? props.calculator.skills : undefined }>Fabrication skills</TableData>
            <TableData value={props.calculator.minleveldifficulty}>Minimum difficulty level</TableData>
        </tbody>
    </Table>
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
            <Col md={4} className="mb-3"><InfoTable calculator={calculatorResults} /></Col>
            <Col md={8}>
                {calculatorResults.fabricationBlock}
                {calculatorResults.deconstuctionBlock}
                {calculatorResults.usedinBlock}
                {calculatorResults.scrappedfromBlock}
            </Col>
        </Row>
    </>
}