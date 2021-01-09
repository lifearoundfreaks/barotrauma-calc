import useGetParams from '../Hooks/useGetParams'
import { Row, Col, Table } from 'react-bootstrap'
import DefaultPage from './DefaultPage'
import useCalculator from '../Hooks/useCalculator'

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
            <tr>
                <td>Buying price</td>
                <td>{props.calculator.buyingprice}</td>
            </tr>
            <tr>
                <td>Selling price</td>
                <td>{props.calculator.sellingprice}</td>
            </tr>
            <tr>
                <td>Local multiplier</td>
                <td>{props.calculator.outpostmultiplier}</td>
            </tr>
        </tbody>
    </Table>
}

export default function PageContents() {

    const getParams = useGetParams()[0]
    const identifier = getParams.identifier
    const calculatorResults = useCalculator(identifier)
    if (calculatorResults.missing) return <DefaultPage />

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