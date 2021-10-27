import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { SearchBar, ReputationInput, OutpostSelect, PageContents, BrandNavLogo, AdditionalFilters } from './BarotraumaCalc'
import './App.css';

export default function App() {

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar bg="dark" variant="dark" expand="lg" defaultExpanded className="pb-4" >
        <BrandNavLogo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mt-3" />
        <Navbar.Collapse id="basic-navbar-nav">
          <SearchBar />
          <div style={{ display: 'flex', flexBasis: 250, flexGrow: 0, flexDirection: "column" }}>
            <div><b style={{ color: "white" }}>
              Departure
          </b></div>
            <div style={{ display: 'flex', flexGrow: 1 }}>
              <OutpostSelect />
              <ReputationInput />
            </div></div>
          <div style={{ display: 'flex', flexBasis: 250, flexGrow: 0, flexDirection: "column" }}>
            <div><b style={{ color: "white" }}>
              Destination
          </b></div>
            <div style={{ display: 'flex', flexGrow: 1 }}>
              <OutpostSelect getParamName="destoutpost" />
              <ReputationInput getParamName="destreputation" />
            </div></div>
        </Navbar.Collapse>
      </Navbar>
      <AdditionalFilters />
      <Container className="pt-4 bg-white">
        <Row>
          <Col>
            <Route path="/" children={<PageContents />}></Route>
          </Col>
        </Row>
        <Row className="footer">
          <Col className="text-muted py-4"><hr />I do not claim any rights to images and data used.
            This is simply a convenience tool for the game called <a href="https://store.steampowered.com/app/602960/Barotrauma/">Barotrauma</a> (v0.15.12.0).<br />
            If you have found a bug or have a suggestion for me, you can <a href="https://github.com/lifearoundfreaks/barotrauma-calc/issues/new">start an issue</a>.</Col>
        </Row>
      </Container>
    </Router>
  )
}
