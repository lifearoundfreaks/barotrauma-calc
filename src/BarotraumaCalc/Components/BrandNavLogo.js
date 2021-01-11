import { Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useGetParams from '../Hooks/useGetParams'

export default function BrandNavLogo() {

    const returnHomeGetParams = useGetParams(true)[0]

    return <Navbar.Brand className="mt-3">
        <Link
            to={returnHomeGetParams}
            style={{ textDecoration: "none", color: "white" }}
        >
            BarotraumaCalc
        </Link>
    </Navbar.Brand>
}
