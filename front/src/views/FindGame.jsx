import React from 'react'
import Cookies from 'universal-cookie'
import {
    Label,
    Badge,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col
} from 'reactstrap'
import axios from 'axios'
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert"

class FindGame extends React.Component {
    constructor(props) {
        super(props)

        var cookies = new Cookies()
        this.state = {
            game_id: props.match.params.id,
            user_id: cookies.get('main_user_id')
        }

        if (cookies.get('user_type') == Constants.Enums.UserTypeEnum.Guest) {
            window.location.href = '/core/offline/index.html?game_id=' + this.state.game_id
        } else {
            this.RequestGame()
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer_id)
    }

    RequestGame() {
        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.RequestGame)
        params.append('user_id', this.state.user_id)
        params.append('game_id', this.state.game_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    this.CheckRequest()
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    CheckRequest() {
        let func = () => {
            console.log("checking request")

            var params = new URLSearchParams()
            params.append('method', Constants.Enums.Methods.CheckRequest)
            params.append('user_id', this.state.user_id)
            params.append('game_id', this.state.game_id)

            axios.post(Constants.REQUEST_URL, params)
                .then(response => {
                    if (response.data == 'ERROR') {
                        this.ShowError("server problem")

                    } else {
                        if (response.data != '') { // found match
                            var match_id = response.data
                            this.ShowMessage('Founded an opponent!')
                            clearInterval(this.timer_id)
                            window.location.href = '/core/online/index.html?match_id=' + match_id + '&user_id=' + this.state.user_id
                        } else {
                            this.ShowError('Not found yet')
                        }
                    }
                })
                .catch(error => {
                    this.ShowError(error)
                })
        }

        func()

        this.timer_id = setInterval(() => {
            func()
        }, Constants.CHECK_TIME)
    }

    render() {
        return (
            <>
                <NotificationAlert ref="notify" />

                <div className='content'>
                    <Row style={{ marginTop: '130px' }}>
                        <Col></Col>
                        <Col md='4'>
                            <Card className='card-user' className='text-center'>
                                <CardHeader>

                                </CardHeader>
                                <CardBody >
                                    <img src='/loading.svg'></img>
                                    <h1>

                                    </h1>
                                    <h2>Finding a Match</h2>
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
            autoDismiss: 4
        }

        this.refs.notify.notificationAlert(options)
    }
}

export default FindGame
