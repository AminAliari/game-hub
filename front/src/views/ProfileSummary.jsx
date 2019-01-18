import React from 'react'

import { Button, Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";

import Constants from '../Constants'

const ProfileSummary = (props) => {
    var user_image_url = props.user_image_url

    var is_profile_editable = props.is_profile_editable ? 'initial' : 'none'

    var user_profile_summary = props.user_profile_summary

    if (typeof props.user_profile_summary == 'undefined') {
        user_profile_summary = {}
        user_profile_summary.id = props.profile_id
        user_profile_summary.score = 0
        user_profile_summary.total_count = 0
        user_profile_summary.total_wins = 0
        user_profile_summary.total_lose = 0
    }

    var user_played_games = props.user_played_games.map((game) => {
        var result_text = user_profile_summary.id == game.winner_id ? 'Won' : 'Lost'
        var result_color = user_profile_summary.id == game.winner_id ? 'text-success' : 'text-danger'

        return (
            <tr>
                <td><a href={'/index/profile/' + game.enemy_id} style={{ color: 'Cyan' }}>@{game.username}</a></td>
                <td>{game.played_date}</td>
                <td><h6 className={result_color}>{result_text}</h6></td>
                <td className="text-right">
                    <Button className="btn-icon" color="info" size="sm" onClick={() => window.location.href = '/index/result/' + game.id}>
                        <i className="fa fa-bars" />
                    </Button>
                </td>
            </tr>
        )
    })

    var user_designed_games = props.user_designed_games.map((game) => {
        return (
            <tr>
                <td style={{ color: '#88ff00' }}>{game.score}</td>
                <td>{game.total_played}</td>
                <td>{game.created_date}</td>
                <td className="text-center">
                    <Button className="animation-on-hover btn-icon" color="primary" size="sm" style={{ width: '100%' }} onClick={() => window.location.href = '/index/game/' + game.id}>
                        Play
                    </Button>
                </td>
            </tr>
        )
    })

    return (
        <>
            <CardTitle tag="h2">Player Summary</CardTitle>
            <Row>
                <Col lg="3">
                    <Card className="card-chart" style={{ paddingLeft: '10px', paddingTop: '10px', minHeight: '250px' }}>
                        <CardHeader>
                            <Row lg='12'>
                                <Col lg='7'><CardTitle tag="h3"><i className="tim-icons icon-single-02 text-warning" style={{ marginRight: '10px' }} />Profile</CardTitle></Col>
                                <Col style={{ display: is_profile_editable }}><Button color="primary" className="animation-on-hover" onClick={() => { window.location.href = '/index/profile/' + user_profile_summary.id }} size='sm'>Edit Profile</Button></Col>
                            </Row>
                        </CardHeader>
                        <CardBody style={{ paddingLeft: '20px', paddingRight: '0px', paddingBottom: '20px' }}>
                            <Row>
                                <Col lg='5'>
                                    <img src={Constants.IMAGE_BASE_URL + user_image_url + '.png'} style={{ width: '100%' }}></img>
                                </Col>
                                <Col style={{ paddingTop: '10px' }}>
                                    <h4><i className="tim-icons icon-shape-star text-warning" style={{ marginRight: '10px' }} />score: {user_profile_summary.score}</h4>

                                    <h5><i className="tim-icons icon-controller text-primary" style={{ marginRight: '10px' }} />Games Played: {user_profile_summary.total_count}</h5>

                                    <h5><i className="tim-icons icon-trophy text-success" style={{ marginRight: '10px' }} />Wins: {user_profile_summary.total_wins}</h5>

                                    <h5><i className="tim-icons icon-lock-circle text-danger" style={{ marginRight: '10px' }} />Losses: {user_profile_summary.total_lose}</h5>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="5">
                    <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '250px' }}>
                        <CardHeader>
                            <CardTitle tag="h3"><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />Recent Games Played</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'block', maxHeight: '162px', overflowY: 'auto', msOverflowStyle: '-ms-autohiding-scrollbar' }}>
                                <Table responsive className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Against</th>
                                            <th>Played Date</th>
                                            <th></th>
                                            <th className="text-right">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user_played_games}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '250px' }}>
                        <CardHeader>
                            <CardTitle tag="h3"><i className="tim-icons icon-tap-02 text-primary" style={{ marginRight: '10px' }} />Designed Games</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'block', maxHeight: '162px', overflowY: 'auto', msOverflowStyle: '-ms-autohiding-scrollbar' }}>
                                <Table responsive className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Score</th>
                                            <th>Total Played</th>
                                            <th>Created Date</th>
                                            <th style={{ width: '20%' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user_designed_games}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ProfileSummary
