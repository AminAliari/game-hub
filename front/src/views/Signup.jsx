import React from 'react'
import axios from 'axios'

import { Label, Button, Card, CardHeader, CardBody, CardFooter, FormGroup, Form, Input, Row, Col } from 'reactstrap'
import NotificationAlert from 'react-notification-alert'
import Constants from '../Constants'
import Cookies from 'universal-cookie'

class Signup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      image_url: '0',
      canSend: true
    }
  }

  OnSignupClicked() {
    if (this.state.username == '' || this.state.password == '' || this.state.firstname == '' || this.state.lastname == '' || this.state.email == '') {
      this.ShowError('please fill out all fileds')
      return
    }

    this.setState({ canSend: false })

    var params = new URLSearchParams()
    params.append('method', Constants.Enums.Methods.Signup)
    params.append('username', this.state.username)
    params.append('password', this.state.password)
    params.append('firstname', this.state.firstname)
    params.append('lastname', this.state.lastname)
    params.append('email', this.state.email)
    params.append('image_url', this.state.image_url)

    axios.post(Constants.REQUEST_URL, params)
      .then(response => {
        this.setState({ canSend: true })

        if (response.data == 'NO') {
          this.ShowError('username already taken')

        } else if (response.data == 'ERROR') {
          this.ShowError('server problem')

        } else { // success
          var user = response.data[0]

          var cookies = new Cookies()
          cookies.set('user_type', Constants.Enums.UserTypeEnum.User, { path: '/' })
          cookies.set('main_user_id', user.id, { path: '/' })
          cookies.set('main_user_name', user.username, { path: '/' })
          cookies.set('main_user_firstname', user.firstname, { path: '/' })
          cookies.set('main_user_lastname', user.lastname, { path: '/' })
          cookies.set('main_user_email', user.email, { path: '/' })
          cookies.set('main_user_image_url', user.image_url, { path: '/' })
          cookies.set('main_user_is_admin', 'false', { path: '/' })

          this.props.history.push('/index/user/home')
        }
      })
      .catch(error => {
        this.setState({ canSend: true })
        this.ShowError(error)
      })
  }

  ShowError(error) {
    var options = {
      place: 'br',
      message: (
        <div>{error}</div>
      ),
      type: 'danger',
      icon: 'tim-icons icon-button-power',
      autoDismiss: 5
    }

    this.refs.notify.notificationAlert(options)
  }

  render() {
    return (
      <>
        <NotificationAlert ref='notify' />

        <div className='content'>
          <Row>
            <Col md='8'>
              <Card>
                <CardHeader>
                  <h5 className='title'>Enter your information</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className='pr-md-1' md='4'>
                        <label><p className='tim-icons icon-badge' /> User Information</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='4'>
                        <FormGroup>
                          <Input placeholder='Username' type='text' onChange={event => this.setState({ username: event.target.value })} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='4'>
                        <FormGroup>
                          <Input type='password' placeholder='Password' autoComplete='off' onChange={event => this.setState({ password: event.target.value })} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <h2> </h2>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='4'>
                        <label><p className='tim-icons icon-badge' /> Personal Information</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='3'>
                        <FormGroup>
                          <Input placeholder='First Name' type='text' onChange={event => this.setState({ firstname: event.target.value })} />
                        </FormGroup>
                      </Col>
                      <Col className='pl-md-1' md='3'>
                        <FormGroup>
                          <Input placeholder='Last Name' type='text' onChange={event => this.setState({ lastname: event.target.value })} />
                        </FormGroup>
                      </Col>
                      <Col className='pr-md-1' md='4'>
                        <FormGroup>
                          <Input placeholder='Email Address' type='email' onChange={event => this.setState({ email: event.target.value })} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <h2> </h2>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='4'>
                        <label><p className='tim-icons icon-image-02' /> Avatar</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='pr-md-1' md='12'>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios11' value='0' defaultChecked onClick={() => this.setState({ image_url: '0' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/0.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='1' onClick={() => this.setState({ image_url: '1' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/1.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='2' onClick={() => this.setState({ image_url: '2' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/2.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='3' onClick={() => this.setState({ image_url: '3' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/3.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='4' onClick={() => this.setState({ image_url: '4' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/4.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='5' onClick={() => this.setState({ image_url: '5' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/5.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='6' onClick={() => this.setState({ image_url: '6' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/6.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='7' onClick={() => this.setState({ image_url: '7' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/7.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='8' onClick={() => this.setState({ image_url: '8' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/8.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='9' onClick={() => this.setState({ image_url: '9' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/9.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='10' onClick={() => this.setState({ image_url: '10' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/10.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='11' onClick={() => this.setState({ image_url: '11' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/11.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className='form-check-radio'>
                          <Label className='form-check-label'>
                            <Input type='radio' name='exampleRadios1' id='exampleRadios12' value='12' onClick={() => this.setState({ image_url: '12' })} />
                            <span className='form-check-sign'></span>
                            <img src='/avatars/12.png' style={{ width: '30%' }} />
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter className="text-right">
                  <fieldset disabled={!this.state.canSend}>
                    <Button className='btn-fill' color='primary' type='submit' onClick={() => this.OnSignupClicked()}>Sign Up</Button>
                  </fieldset>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default Signup
