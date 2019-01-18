import React from "react";
import axios from 'axios'
import { Button, Card, CardHeader, CardBody, CardTitle, Table, Row, Col, ModalBody, Modal } from "reactstrap";
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";


class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parsed_data: [],
            users: []
        };

        this.GetUsers()
    }

    GetUsers() {
        console.log("fetching users");

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetUsers)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ parsed_data: response.data })
                    this.MakeUserEntries(response.data)
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    MakeUserEntries(parsed_data) {
        var users_to_show = parsed_data.map((user) => {
            var status_text = user.is_online == 't' ? 'Online' : 'Offline'
            var status_color = user.is_online == 't' ? 'text-success' : 'text-danger'

            return (
                <tr>
                    <h5 style={{ marginLeft: '10px' }}><a href={'/index/profile/' + user.id} style={{ color: 'Cyan' }}><img src={Constants.IMAGE_BASE_URL + user.image_url + '.png'} style={{ width: '8%', marginRight: '5px' }}></img>@{user.username}</a></h5>
                    <td>{user.score}</td>
                    <td>{user.total_played}</td>
                    <td>{user.total_wins}</td>
                    <td>{user.total_designed}</td>
                    <td>{user.max_score}</td>
                    <td>{user.max_played}</td>
                    <td><h6 className={status_color}>{status_text}</h6></td>
                </tr>
            )
        })
        this.setState({ users: users_to_show })
    }

    SortUsers(sort_type) {
        var new_data = this.state.parsed_data

        switch (sort_type) {
            case 'Score':
                new_data.sort((a, b) => {
                    return b.score - a.score
                })

                break;

            case 'TotalPlayed':
                new_data.sort((a, b) => {
                    return b.total_played - a.total_played
                })
                break;

            case 'Wins':
                new_data.sort((a, b) => {
                    return b.total_wins - a.total_wins
                })
                break;

            case 'DesignedGames':
                new_data.sort((a, b) => {
                    return b.total_designed - a.total_designed
                })
                break;

            case 'MaxScore':
                new_data.sort((a, b) => {
                    return b.max_score - a.max_score
                })
                break;

            case 'MaxPlayed':
                new_data.sort((a, b) => {
                    return b.max_played - a.max_played
                })
                break;
        }

        this.MakeUserEntries(new_data)
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

                                    <CardTitle tag="h3"><i className="tim-icons icon-single-02 text-warning" style={{ marginRight: '10px' }} />Users</CardTitle>
                                    <Row>
                                        <Col>
                                            <h5></h5>
                                            <h5>Sort By:
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('Score')}>Score</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('TotalPlayed')}>Total Played</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('Wins')}>Wins</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('DesignedGames')}>Designed Games</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('MaxScore')}>Best Designed Game Score</Button>
                                                <Button className="btn-link" color="primary" onClick={() => this.SortUsers('MaxPlayed')}>Max Played Designed Game</Button>
                                            </h5>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '15%' }}>Username</th>
                                                <th>Score</th>
                                                <th>Total Played</th>
                                                <th>Wins</th>
                                                <th>Designed Games</th>
                                                <th>Best Designed Game Score</th>
                                                <th>Max Played Designed Game</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <h4></h4>
                                        <tbody>
                                            {this.state.users}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
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

export default Users;
