import useGetParams from '../Hooks/useGetParams'
import { Row, Col, Table } from 'react-bootstrap'
import DefaultPage from './DefaultPage'
import gameData from "../parsed_data.json"
import TextureLoader from './TextureLoader'

const InfoTable = props => {

    let soldEverywhere =
        props.item.price &&
        props.item.price.soldeverywhere !== undefined &&
        props.item.price.soldeverywhere !== "false"
        ? "yes" : "no"

    return <Table striped bordered hover variant="dark">
        <thead>
            <tr>
                <th colSpan="2">
                    <div style={{
                        border: "1.5px solid #454d55",
                        borderRadius: "10px",
                        display: "inline-block",
                        padding: "9px 8px 10px 10px",
                    }}>
                        <TextureLoader
                            size={100}
                            file={props.item.texture}
                            sourcerect={props.item.sourcerect}
                            margin={0}
                        />
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Default price</td>
                <td>{props.item.price ? props.item.price.default : undefined}</td>
            </tr>
            <tr>
                <td>Can you buy it everywhere?</td>
                <td>{soldEverywhere}</td>
            </tr>
        </tbody>
    </Table>
}

export default function PageContents() {

    const getParams = useGetParams()[0]

    let identifier = getParams.identifier
    if (identifier === undefined) return <DefaultPage />
    let gameItem = gameData[identifier]
    return <>
        <Row>
            <Col><h4>{gameItem.display_name}</h4></Col>
        </Row>
        <Row className="mt-3">
            <Col md={4} className="mb-3"><InfoTable item={gameItem} /></Col>
            <Col md={8}>
                <p>Crafting info will be here</p>
            </Col>
        </Row>
    </>
}
