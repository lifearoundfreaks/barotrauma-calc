import { useLocation } from 'react-router-dom'
import { Row, Col, Table } from 'react-bootstrap'
import DefaultPage from './DefaultPage'
import NotFoundPage from './NotFoundPage'
import gameData from "./parsed_data.json"
import TextureLoader from './TextureLoader'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function InfoTable(props) {
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
                <td>Can you buy it there?</td>
                <td>{props.item.soldeverywhere ? 'yes' : 'no'}</td>
            </tr>
        </tbody>
    </Table>
}

export default function PageContents() {

    let query = useQuery()

    let identifier = query.get('identifier')
    if (identifier === null) return <DefaultPage />

    let gameItem = gameData[identifier]
    if (gameItem === undefined) return <NotFoundPage />
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
