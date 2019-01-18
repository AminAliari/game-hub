import React from "react";
import axios from 'axios'
import { Button, Card, CardHeader, CardBody, CardTitle, Table, Row, Col, ModalBody, Modal } from "reactstrap";
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";


class Games extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parsed_data: [],
            games: [],
            game_comments: [],
            show_comments: false,
        };

        this.GetGames()
    }

    GetGames() {
        console.log("fetching games");

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetGames)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ parsed_data: response.data })
                    this.MakeGameEntries(response.data)
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    MakeGameEntries(parsed_data) {
        var games_to_show = parsed_data.map((game) => {
            return (
                <tr>
                    <td><a href={'/index/profile/' + game.designer_id} style={{ color: 'Cyan' }}>@{game.username}</a></td>
                    <td>{game.score}</td>
                    <td>{game.current_playing}</td>
                    <td>{game.total_played}</td>
                    <td>{game.created_date}</td>
                    <td className="text-right">
                        <Button className="btn-icon" color="info" size="sm" onClick={() => this.GetGameComments(game.id)}>
                            <i className="fa fa-bars" />
                        </Button>
                    </td>
                    <td className="text-center">
                        <Button className="animation-on-hover btn-icon" color="primary" size="sm" style={{ width: '100%' }} onClick={() => window.location.href = '/index/game/' + game.id}>Play</Button>
                    </td>
                </tr>
            )
        })
        this.setState({ games: games_to_show })
    }

    GetGameComments(game_id) {
        console.log("fetching game_" + game_id + " comments");

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetGameComment)
        params.append('id', game_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    var comments_to_show = null
                    if (response.data.length > 0) {
                        comments_to_show = response.data.map((comment) => {
                            return (
                                <>
                                    <Card color='info'>
                                        <CardHeader>
                                            <a href={'/index/profile/' + comment.reviwer_id} style={{ color: 'White' }}><img src={Constants.IMAGE_BASE_URL + comment.image_url + '.png'} style={{ width: '8%', marginRight: '5px' }}></img>@{comment.username}</a>
                                        </CardHeader>
                                        <CardBody>
                                            <h4 style={{ marginLeft: '10px' }}>{comment.comment}</h4>
                                        </CardBody>
                                    </Card>
                                </>
                            )
                        })
                    } else {
                        comments_to_show = (
                            <h3 style={{ color: 'Black' }}>No Comments</h3>
                        )
                    }

                    this.setState({ game_comments: comments_to_show, show_comments: true })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    ToggleModal() {
        this.setState({ show_comments: !this.state.show_comments })
    }

    SortGames(sort_type) {
        var new_data = this.state.parsed_data

        switch (sort_type) {
            case 'Score':
                new_data.sort((a, b) => {
                    return b.score - a.score
                })

                break;

            case 'CurrentPlayers':
                new_data.sort((a, b) => {
                    return b.current_playing - a.current_playing
                })
                break;

            case 'TotalPlayed':
                new_data.sort((a, b) => {
                    return b.total_played - a.total_played
                })
                break;
        }

        this.MakeGameEntries(new_data)
    }

    render() {
        return (
            <>
                <NotificationAlert ref="notify" />
                <div className="content">
                    <Row>
                        <Col lg="12">
                            <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '251px' }}>
                                <CardHeader>

                                    <CardTitle tag="h3"><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />Games</CardTitle>
                                    <Row>
                                        <Col>
                                            <h5></h5>
                                            <h5>Sort By:
                                                <Button className="btn-link" color="primary" onClick={() => this.SortGames('Score')}>Score</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortGames('CurrentPlayers')}>Current Players</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortGames('TotalPlayed')}>Total Played</Button>
                                            </h5>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Designer</th>
                                                <th>Score</th>
                                                <th>Current Players</th>
                                                <th>Total Played</th>
                                                <th>Created Date</th>
                                                <th></th>
                                                <th style={{ width: '10%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.games}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Modal isOpen={this.state.show_comments} toggle={() => this.ToggleModal()}>
                    <div className="modal-header" style={{ backgroundColor: '#f6f9fc', marginBottom: '10px' }}>
                        <h5 className="modal-title" id="exampleModalLabel">Comments</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => this.ToggleModal()}><i className="tim-icons icon-simple-remove" style={{ color: 'Black' }} /></button>
                    </div>
                    <ModalBody style={{ backgroundColor: '#f6f9fc' }}>
                        {this.state.game_comments}
                    </ModalBody>
                </Modal>
            </>
        );
    }

    ShowError(error) {
        var options = {
            place: "br",
            message: (
                <div>
                    <div>
                        There was a problem: <b>{error}</b>
                    </div>
                </div>
            ),
            type: "danger",
            icon: "tim-icons icon-button-power",
            autoDismiss: 5
        };

        this.refs.notify.notificationAlert(options);
    }
}

export default Games;
