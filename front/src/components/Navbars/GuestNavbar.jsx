import React from 'react'
import classNames from 'classnames'
import { Button, NavbarBrand, Navbar, Nav, Container } from 'reactstrap'

class GuestNavbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <Navbar
                    className={classNames('navbar-absolute', 'navbar-transparent')}
                    expand='lg'
                >
                    <Container fluid>
                        <div className='navbar-wrapper'>
                            <NavbarBrand href='#' onClick={e => e.preventDefault()}>
                                {this.props.brandText}
                            </NavbarBrand>
                        </div>
                        <Nav className='ml-auto' navbar>
                            <Button color='primary' className='btn-link' onClick={() => { this.props.history.push('/index/login') }}>Login</Button>
                            <Button color='primary' className='animation-on-hover' onClick={() => { this.props.history.push('/index/signup') }}>Sign Up</Button>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        )
    }
}

export default GuestNavbar