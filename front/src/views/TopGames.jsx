import React from 'react'

import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import Constants from '../Constants'

const TopGames = (props) => {

    var best_game = props.best_game
    var newest_game = props.newest_game
    var most_online_game = props.most_online_game

    if (isNaN(best_game.image_url)) {
        best_game.image_url = '0'
        newest_game.image_url = '0'
        most_online_game.image_url = '0'
    }

    return (
        <>
            <CardTitle tag="h2">Top Games</CardTitle>
            <Row>
                <Col lg="4">
                    <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '250px', maxHeight: '250px', overflowY: 'auto' }}>
                        <CardHeader>
                            <Row lg='12'>
                                <Col lg='9'><CardTitle tag="h3"><i className="tim-icons icon-spaceship text-warning" style={{ marginRight: '10px' }} />Best Score</CardTitle></Col>
                                <Col><Button color="primary" className="animation-on-hover" onClick={() => { window.location.href = '/index/game/' + best_game.game_id }} size='sm'>Play</Button></Col>
                            </Row>
                        </CardHeader>
                        <CardBody style={{ paddingLeft: '20px', paddingRight: '0px', paddingTop: '30px', paddingBottom: '20px' }}>
                            <Row>
                                <Col>
                                    <h4><i className="tim-icons icon-shape-star text-warning" style={{ marginRight: '10px' }} />score: {best_game.score}</h4>

                                    <h5><i className="tim-icons icon-user-run text-danger" style={{ marginRight: '10px' }} />current players: {best_game.current_playing}</h5>

                                    <h5><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />times played: {best_game.total_played}</h5>
                                </Col>
                                <Col>
                                    <h5><i className="tim-icons icon-single-02 text-primary" style={{ marginRight: '10px' }} />created by:  <a href={'/index/profile/' + best_game.id} style={{ color: 'Cyan' }}><img src={Constants.IMAGE_BASE_URL + best_game.image_url + '.png'} style={{ width: '8%', marginLeft: '10px', marginRight: '5px' }}></img>@{best_game.username}</a></h5>

                                    <h5><i className="tim-icons icon-time-alarm text-info" style={{ marginRight: '10px' }} />uploaded at: {best_game.created_date}</h5>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '250px', maxHeight: '250px', overflowY: 'auto' }}>
                        <CardHeader>
                            <Row lg='12'>
                                <Col lg='9'><CardTitle tag="h3"><i className="tim-icons icon-sound-wave text-danger" style={{ marginRight: '10px' }} />Newest</CardTitle></Col>
                                <Col><Button color="primary" className="animation-on-hover" onClick={() => { window.location.href = '/index/game/' + newest_game.game_id }} size='sm'>Play</Button></Col>
                            </Row>
                        </CardHeader>
                        <CardBody style={{ paddingLeft: '20px', paddingRight: '0px', paddingTop: '30px', paddingBottom: '20px' }}>
                            <Row>
                                <Col>
                                    <h4><i className="tim-icons icon-shape-star text-warning" style={{ marginRight: '10px' }} />score: {newest_game.score}</h4>

                                    <h5><i className="tim-icons icon-user-run text-danger" style={{ marginRight: '10px' }} />current players: {newest_game.current_playing}</h5>

                                    <h5><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />times played: {newest_game.total_played}</h5>
                                </Col>
                                <Col>
                                    <h5><i className="tim-icons icon-single-02 text-primary" style={{ marginRight: '10px' }} />created by:  <a href={'/index/profile/' + newest_game.id} style={{ color: 'Cyan' }}><img src={Constants.IMAGE_BASE_URL + newest_game.image_url + '.png'} style={{ width: '8%', marginLeft: '10px', marginRight: '5px' }}></img>@{newest_game.username}</a></h5>

                                    <h5><i className="tim-icons icon-time-alarm text-info" style={{ marginRight: '10px' }} />uploaded at: {newest_game.created_date}</h5>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card className="card-chart" style={{ paddingRight: '10px', paddingLeft: '15px', minHeight: '250px', maxHeight: '250px', overflowY: 'auto' }}>
                        <CardHeader>
                            <Row lg='12'>
                                <Col lg='9'><CardTitle tag="h3"><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />Most Online Players</CardTitle></Col>
                                <Col><Button color="primary" className="animation-on-hover" onClick={() => { window.location.href = '/index/game/' + most_online_game.game_id }} size='sm'>Play</Button></Col>
                            </Row>
                        </CardHeader>
                        <CardBody style={{ paddingLeft: '20px', paddingRight: '0px', paddingTop: '30px', paddingBottom: '20px' }}>
                            <Row>
                                <Col>
                                    <h4><i className="tim-icons icon-shape-star text-warning" style={{ marginRight: '10px' }} />score: {most_online_game.score}</h4>

                                    <h5><i className="tim-icons icon-user-run text-danger" style={{ marginRight: '10px' }} />current players: {most_online_game.current_playing}</h5>

                                    <h5><i className="tim-icons icon-controller text-success" style={{ marginRight: '10px' }} />times played: {most_online_game.total_played}</h5>
                                </Col>
                                <Col>
                                    <h5><i className="tim-icons icon-single-02 text-primary" style={{ marginRight: '10px' }} />created by:  <a href={'/index/profile/' + most_online_game.id} style={{ color: 'Cyan' }}><img src={Constants.IMAGE_BASE_URL + most_online_game.image_url + '.png'} style={{ width: '8%', marginLeft: '10px', marginRight: '5px' }}></img>@{most_online_game.username}</a></h5>

                                    <h5><i className="tim-icons icon-time-alarm text-info" style={{ marginRight: '10px' }} />uploaded at: {most_online_game.created_date}</h5>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row >
        </>
    )
}

export default TopGames
