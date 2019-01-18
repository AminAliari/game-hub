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
            user_id: props.match.params.user_id,
            result_id: props.match.params.result_id,
            opponent_id: props.match.params.opponent_id,
            game_id: props.match.params.game_id,
            user_comment: '',
            user_score: 1,
            game_comment: '',
            game_score: 1,
            canSend: true
        }
    }

    OnSendClicked() {
        if (this.state.user_comment == '' || this.state.game_comment == '') {
            this.ShowError('please fill out all fileds')
            return
        }

        this.SendUserComment()
    }

    SendUserComment() {
        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.SubmitUserComment)
        params.append('reviewer_id', this.state.user_id)
        params.append('score', this.state.user_score)
        params.append('comment', this.state.user_comment)
        params.append('user_id', this.state.opponent_id)
        params.append('result_id', this.state.result_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {

                if (response.data == 'ERROR') {
                    this.ShowError('server problem')
                    this.setState({ canSend: true })

                } else { // success
                    this.SendGameComment()
                }
            })
            .catch(error => {
                this.setState({ canSend: true })
                this.ShowError(error)
            })
    }

    SendGameComment() {

        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.SubmitGameComment)
        params.append('reviewer_id', this.state.user_id)
        params.append('score', this.state.game_score)
        params.append('comment', this.state.game_comment)
        params.append('game_id', this.state.game_id)


        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canSend: true })

                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    this.ShowMessage('Comment Sent!')
                    this.props.history.push('/index/result/' + this.state.result_id)
                }
            })
            .catch(error => {
                this.setState({ canSend: true })
                this.ShowError(error)
            })
    }

    SetUserScore(score) {
        this.setState({ user_score: score })
    }

    SetGameScore(score) {
        this.setState({ user_score: score })
    }

    render() {
        return (
            <>
                <NotificationAlert ref='notify' />

                <div className='content'>
                    <Row>
                        <Col md='8'>
                            <Card style={{ padding: '10px' }}>
                                <CardHeader>
                                    <h5 className='title'>Leave a comment!</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <Label><p className='tim-icons icon-chat-33' style={{ marginRight: '5px' }} /> Comment about your opponent</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <FormGroup>
                                                    <Input placeholder='comment' type='text' onChange={event => this.setState({ user_comment: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <Label style={{ marginRight: '15px' }}>Score: </Label>

                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" defaultChecked onClick={() => this.SetUserScore(1)} />1<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetUserScore(2)} />2<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetUserScore(3)} />3<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetUserScore(4)} />4<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetUserScore(5)} />5<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Row>
                                        <h2> </h2>
                                    </Row>
                                    <Row>
                                        <h2> </h2>
                                    </Row>
                                    <Form>

                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <Label><p className='tim-icons icon-chat-33' style={{ marginRight: '5px' }} /> Comment about the game</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <FormGroup>
                                                    <Input placeholder='comment' type='text' onChange={event => this.setState({ game_comment: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='8'>
                                                <Label style={{ marginRight: '15px' }}>Score: </Label>

                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" defaultChecked onClick={() => this.SetGameScore(1)} />1<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetGameScore(2)} />2<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetGameScore(3)} />3<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetGameScore(4)} />4<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-radio">
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="exampleRadios1" id="exampleRadios11" value="option1" onClick={() => this.SetGameScore(5)} />5<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>

                                </CardBody>
                                <CardFooter className="text-right">
                                    <fieldset disabled={!this.state.canSend}>
                                        <Button className='btn-fill' color='primary' type='submit' onClick={() => this.OnSendClicked()}>Send</Button>
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
