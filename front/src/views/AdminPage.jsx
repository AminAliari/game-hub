import React from "react";
import axios from 'axios'
import { Button, Card, CardHeader, CardBody, CardTitle, Table, Row, Col, ModalBody, Modal } from "reactstrap";
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";


class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: []
        };

        this.GetComments()
    }

    GetComments() {
        console.log("fetching comments");

        var index = -1

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetUsersComments)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.MakeCommentEntries(response.data, 'user', index)
                }
            })
            .catch(error => {
                this.ShowError(error)
            })


        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetGamesComments)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.MakeCommentEntries(response.data, 'game', index)
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    MakeCommentEntries(parsed_data, comment_type, index) {
        var comments_to_show = parsed_data.map((comment) => {
            index++

            var key = comment.id + ', ' + comment_type

            return (
                <tr key={key}>
                    <td>{index}</td>
                    <td>{comment.comment}</td>
                    <td className="text-center">
                        <Button className="animation-on-hover btn-icon" color="primary" size="sm" style={{ width: '100%' }} onClick={() => this.ApproveComment(comment.id, comment_type, key)}>Approve</Button>
                    </td>
                </tr>
            )
        })

        this.setState({ comments: this.state.comments.concat(comments_to_show) })
    }

    ApproveComment(comment_id, comment_type, comment_key) {
        var params = new URLSearchParams()
        params.append('method', comment_type == 'user' ? Constants.Enums.Methods.ApproveUserComment : Constants.Enums.Methods.ApproveGameComment)
        params.append('comment_id', comment_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    var new_comments = this.state.comments.filter((comment) => {
                        return comment.key != comment_key
                    })
                    console.log(new_comments.length)
                    this.setState({ comments: new_comments })
                    this.ShowMessage("Comment has been approved!")
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
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
                                    <CardTitle tag="h3"><i className="tim-icons icon-single-02 text-warning" style={{ marginRight: '10px' }} />Comments</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Comment</th>
                                                <th style={{ width: '15%' }}></th>
                                            </tr>
                                        </thead>
                                        <h4></h4>
                                        <tbody>
                                            {this.state.comments}
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

export default AdminPage;
