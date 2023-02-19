import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import Networks from '../Networks/Networks.json';

const Navigation = ({ web3Handler, account, changeNetwork, currentNetwork }) => {
    return (
        <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand>
                    &nbsp; NFT Mint
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                    </Nav>

                    <Nav>
                       {  currentNetwork &&
                             <select value={currentNetwork.chainName } onChange={(e)=>changeNetwork(e.target.value)} placeholder="Please select Network" className="form-select form-select-sm" aria-label=".form-select-sm example">
                                {
                                    Networks.map((value, index)=>{
                                       return <option key={index} value={value.chainName}>{ value.chainName }</option>
                                    })
                                }
                            </select>
                        }
                    </Nav>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Nav>
                        { currentNetwork && account ? (
                            <Nav.Link
                                href={`https://mumbai.polygonscan.com/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
 
}

export default Navigation;