import React from 'react'
import axios from 'axios'
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";
import { Label, Button, Card, CardHeader, CardBody, CardFooter, FormGroup, Form, Input, Row, Col, CardText, Badge } from 'reactstrap'

class GameDesign extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            result_id: props.match.params.id,

            p0_user_id: '',
            p0_username: '',
            p0_image_url: 'logo',
            p0_comment: null,

            p1_user_id: '',
            p1_username: '',
            p1_image_url: 'logo',
            p1_comment: null,

            played_date: '...',
            winner_id: null
        }
    }

    componentDidMount() {
        this.GetGameResult()
    }

    GetGameResult() {
        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetGameResult)
        params.append('result_id', this.state.result_id)


        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canSend: true })

                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    var r = response.data[0]
                    if (r == null) return
                    this.setState({ p0_user_id: r.p0_user_id, p0_username: r.p0_username, p0_image_url: r.p0_image_url, p0_comment: r.p0_comment, p1_user_id: r.p1_user_id, p1_username: r.p1_username, p1_image_url: r.p1_image_url, p1_comment: r.p1_comment, winner_id: r.winner_id, played_date: r.played_date })
                }
            })
            .catch(error => {
                this.setState({ canSend: true })
                this.ShowError(error)
            })
    }


    render() {
        return (
            <>
                <NotificationAlert ref="notify" />

                <div className='content'>
                    <Row>
                        <Col></Col>
                        <Col md='8'>
                            <Card className='card-user'>
                                <CardBody>
                                    <Row>
                                        <Col md='5'>
                                            <div className='author' >
                                                <div className='block block-one' />
                                                <div className='block block-two' />
                                                <div className='block block-three' />
                                                <div className='block block-four' />
                                                <a href={'/index/profile/' + this.state.p0_user_id}>
                                                    <img alt='...' className='avatar' src={Constants.IMAGE_BASE_URL + this.state.p0_image_url + '.png'} />
                                                    <h5 className='title'>@{this.state.p0_username}
                                                    </h5>
                                                </a>
                                                <Badge style={{ display: (this.state.winner_id != this.state.p0_user_id) ? 'initial' : 'none' }} color='danger' pill>Lost</Badge>
                                                <Badge style={{ display: (this.state.winner_id == this.state.p0_user_id) ? 'initial' : 'none' }} color='success' pill>Won</Badge>
                                            </div>

                                            <Card color='info' style={this.state.p0_comment == null ? { display: 'none' } : { marginTop: '40px', height: '150px', overflow: 'auto' }}>
                                                <CardHeader style={{ marginBottom: '-30px' }}>
                                                    <h3>Comment </h3>
                                                </CardHeader>
                                                <CardBody>
                                                    <h4 style={{ marginLeft: '10px' }}>{this.state.p0_comment}</h4>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col style={{ marginTop: '50px' }}>
                                            <h1 style={{ textAlign: 'center', fontSize: '80px' }}>VS</h1>
                                            <h6 style={{ textAlign: 'center' }}>Played at:</h6>
                                            <h4 style={{ textAlign: 'center' }}>{this.state.played_date}</h4>
                                        </Col>

                                        <Col md='5'>
                                            <div className='author' >
                                                <div className='block block-one' />
                                                <div className='block block-two' />
                                                <div className='block block-three' />
                                                <div className='block block-four' />
                                                <a href={'/index/profile/' + this.state.p1_user_id}>
                                                    <img alt='...' className='avatar' src={Constants.IMAGE_BASE_URL + this.state.p1_image_url + '.png'} />
                                                    <h5 className='title'>@{this.state.p1_username}
                                                    </h5>
                                                </a>
                                                <Badge style={{ display: (this.state.winner_id != this.state.p1_user_id) ? 'initial' : 'none' }} color='danger' pill>Lost</Badge>
                                                <Badge style={{ display: (this.state.winner_id == this.state.p1_user_id) ? 'initial' : 'none' }} color='success' pill>Won</Badge>
                                            </div>

                                            <Card color='info' style={this.state.p1_comment == null ? { display: 'none' } : { marginTop: '40px', height: '150px', overflow: 'auto' }}>
                                                <CardHeader style={{ marginBottom: '-30px' }}>
                                                    <h3>Comment </h3>
                                                </CardHeader>
                                                <CardBody>
                                                    <h4 style={{ marginLeft: '10px' }}>{this.state.p1_comment}</h4>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col></Col>
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
