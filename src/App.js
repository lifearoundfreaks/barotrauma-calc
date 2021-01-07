import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { SearchBar, PageContents } from './BarotraumaCalc'
import './App.css';

function App() {
  return (
    <Router basename='/barotrauma-calc'>
      <Navbar bg="dark" variant="dark" expand="lg" defaultExpanded >
        <Navbar.Brand><Link to="/" style={{textDecoration: "none", color: "white"}}>BarotraumaCalc</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mb-1" />
        <Navbar.Collapse id="basic-navbar-nav">
        <SearchBar />
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
            called <a href="https://store.steampowered.com/app/602960/Barotrauma/">Barotrauma</a>.</Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
