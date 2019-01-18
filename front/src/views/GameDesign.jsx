import React from 'react'
import axios from 'axios'
import Constants from '../Constants'
import Cookies from 'universal-cookie'
import NotificationAlert from 'react-notification-alert'

import { Label, Button, Card, CardHeader, CardBody, CardFooter, FormGroup, Form, Input, Row, Col } from 'reactstrap'

class GameDesign extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            designer_id: new Cookies().get('main_user_id'),
            current_lose: '',
            past_lose: '',
            max_score: '',
            canSend: true
        }
    }

    OnCreateClicked() {
        if (this.CheckConditions()) return


        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.DesignGame)
        params.append('designer_id', this.state.designer_id)
        params.append('current_number_lose', this.state.current_lose)
        params.append('past_number_lose', this.state.past_lose)
        params.append('max_score', this.state.max_score)


        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canSend: true })

                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    this.ShowMessage('Game Created!')
                    this.props.history.push('/index/user/home')
                }
            })
            .catch(error => {
                this.setState({ canSend: true })
                this.ShowError(error)
            })
    }

    CheckConditions() {
        var has_error = false

        if (this.state.current_lose == '' || this.state.past_lose == '' || this.state.max_score == '') {
            this.ShowError('please fill out all fileds')
            return true
        }

        if (this.state.current_lose < 1 || this.state.current_lose > 6) {
            this.ShowError('current dice wrong value must be in range of (1, 6)')
            has_error = true
        }

        if (this.state.past_lose < 1 || this.state.past_lose > 6) {
            this.ShowError('past dice wrong value must be in range of (1, 6)')
            has_error = true
        }

        if (this.state.max_score < 1) {
            this.ShowError('max score must be positive')
            has_error = true
        }

        return has_error
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
                                    <h5 className='title'>Design your game</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <Label>Dice that when apeear you lose your current score</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input placeholder='1' type='number' min='1' max='6' onChange={event => this.setState({ current_lose: parseInt(event.target.value) })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <h2> </h2>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <Label>Dice that if apeear in last round and now you lose your current score</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input placeholder='1' type='number' min='1' max='6' onChange={event => this.setState({ past_lose: parseInt(event.target.value) })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <h2> </h2>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <Label>Maximum score to claim the win</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input placeholder='1' type='number' min='1' onChange={event => this.setState({ max_score: parseInt(event.target.value) })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <fieldset disabled={!this.state.canSend}>
                                        <Button className='btn-fill' color='primary' type='submit' onClick={() => this.OnCreateClicked()}>Create</Button>
                                    </fieldset>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }

    ShowMessage(message) {
        var options = {
            place: 'br',
            message: (
                <div>{message}</div>
            ),
            type: 'success',
            icon: 'tim-icons icon-check-2',
            autoDismiss: 5
        }

        this.refs.notify.notificationAlert(options)
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
}

export default GameDesign
