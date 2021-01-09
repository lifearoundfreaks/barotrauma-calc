import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { SearchBar, ReputationInput, OutpostSelect, PageContents, BrandNavLogo } from './BarotraumaCalc'
import './App.css';

export default function App() {

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar bg="dark" variant="dark" expand="md" defaultExpanded >
        <BrandNavLogo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="my-1" />
        <Navbar.Collapse id="basic-navbar-nav">
        <SearchBar />
        <ReputationInput />
        <OutpostSelect />
        </Navbar.Collapse>
      </Navbar>
      <Container className="pt-4 bg-white">
        <Row>
          <Col>
            <Route path="/" children={<PageContents />}></Route>
          </Col>
        </Row>
        <Row className="footer">
          <Col className="text-muted py-4">I do not claim any rights to images and data used.
            This is simply a convenience tool for the game
            called <a href="https://store.steampowered.com/app/602960/Barotrauma/">Barotrauma</a> (v0.11.0.10).</Col>
        </Row>
      </Container>
    </Router>
  )
}
