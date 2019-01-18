import React from 'react'
import axios from 'axios'

import { Label, Button, Card, CardHeader, CardBody, CardFooter, FormGroup, Form, Input, Row, Col } from 'reactstrap'
import NotificationAlert from 'react-notification-alert'
import Constants from '../Constants'
import Cookies from 'universal-cookie'

class Login extends React.Component {
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

    OnLoginClicked() {
        if (this.state.username == '' || this.state.password == '') {
            this.ShowError('please fill out all fileds')
            return
        }

        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.Login)
        params.append('username', this.state.username)
        params.append('password', this.state.password)


        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canSend: true })
                if (response.data == 'NO') {
                    this.ShowError('wrong username / password')

                } else if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    var user = response.data[0]

                    var cookies = new Cookies()
                    cookies.set('main_user_id', user.id, { path: '/' })
                    cookies.set('main_user_name', user.username, { path: '/' })
                    cookies.set('main_user_firstname', user.firstname, { path: '/' })
                    cookies.set('main_user_lastname', user.lastname, { path: '/' })
                    cookies.set('main_user_email', user.email, { path: '/' })
                    cookies.set('main_user_image_url', user.image_url, { path: '/' })
                    cookies.set('main_user_is_admin', user.is_admin, { path: '/' })

                    if (user.is_admin == 't') {
                        cookies.set('user_type', Constants.Enums.UserTypeEnum.Admin, { path: '/' })
                    } else {
                        cookies.set('user_type', Constants.Enums.UserTypeEnum.User, { path: '/' })
                    }

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
                    <Row style={{ alignContent: 'center' }}>
                        <Col md='4'>
                            <Card>
                                <CardHeader>
                                    <h5 className='title'>Enter your username and password</h5>
                                </CardHeader>
                                <CardBody >
                                    <Form>
                                        <Row>
                                            <Col className='pr-md-1' md='10'>
                                                <FormGroup>
                                                    <Input placeholder='Username' type='text' onChange={event => this.setState({ username: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='10'>
                                                <FormGroup>
                                                    <Input type='password' placeholder='Password' autoComplete='off' onChange={event => this.setState({ password: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <fieldset disabled={!this.state.canSend}>
                                        <Button className='btn-fill' color='primary' type='submit' onClick={() => this.OnLoginClicked()}>Login</Button>
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

export default Login
