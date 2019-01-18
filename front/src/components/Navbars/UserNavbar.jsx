import React from 'react'
import classNames from 'classnames'
import { Collapse, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavbarBrand, Navbar, NavLink, Nav, Container, } from 'reactstrap'

import Cookies from 'universal-cookie'
import Constants from '../../Constants';

class UserNavbar extends React.Component {
  constructor(props) {
    super(props)

    this.cookies = new Cookies()

    this.state = {
      main_user_id: this.cookies.get('main_user_id'),
      main_user_image_url: this.cookies.get('main_user_image_url'),
      collapseOpen: false,
      color: 'navbar-transparent'
    }

  }

  componentDidMount() {
    window.addEventListener('resize', this.updateColor)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColor)
  }

  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: 'bg-white'
      })
    } else {
      this.setState({
        color: 'navbar-transparent'
      })
    }
  }

  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: 'navbar-transparent'
      })
    } else {
      this.setState({
        color: 'bg-white'
      })
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    })
  }

  OnLogoutClicked() {
    this.cookies.remove('user_type', { path: '/' })
    this.cookies.remove('main_user_name', { path: '/' })
    this.cookies.remove('main_user_firstname', { path: '/' })
    this.cookies.remove('main_user_lastname', { path: '/' })
    this.cookies.remove('main_user_email', { path: '/' })
    this.cookies.remove('main_user_image_url', { path: '/' })

    this.cookies.set('main_user_is_admin', 'false', { path: '/' })
    this.cookies.set('user_type', Constants.Enums.UserTypeEnum.Guest, { path: '/' })
    this.cookies.set('main_user_id', -1, { path: '/' })

    this.props.history.push('/index/guest/home')
  }

  OnProfileClicked() {
    window.location.href = '/index/profile/' + this.state.main_user_id
  }

  render() {
    return (
      <>
        <Navbar
          className={classNames('navbar-absolute', this.state.color)}
          expand='lg'
        >
          <Container fluid>
            <div className='navbar-wrapper'>
              <NavbarBrand href='#pablo' onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label='Toggle navigation'
              className='navbar-toggler'
              data-target='#navigation'
              data-toggle='collapse'
              id='navigation'
              type='button'
              onClick={this.toggleCollapse}
            >
              <span className='navbar-toggler-bar navbar-kebab' />
              <span className='navbar-toggler-bar navbar-kebab' />
              <span className='navbar-toggler-bar navbar-kebab' />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className='ml-auto' navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color='default'
                    data-toggle='dropdown'
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <div className='photo'>
                      <img alt='...' src={Constants.IMAGE_BASE_URL + this.state.main_user_image_url + '.png'} />
                    </div>
                    <b className='caret d-none d-lg-block d-xl-block' />
                    <p className='d-lg-none'>Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className='dropdown-navbar' right tag='ul'>
                    <NavLink tag='li'>
                      <DropdownItem className='nav-item' onClick={() => { this.OnProfileClicked() }} > Profile</DropdownItem>
                    </NavLink>

                    <DropdownItem divider tag='li' />
                    <NavLink tag='li'>
                      <DropdownItem className='nav-item' onClick={() => { this.OnLogoutClicked() }}>Log out</DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className='separator d-lg-none' />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    )
  }
}

export default UserNavbar
