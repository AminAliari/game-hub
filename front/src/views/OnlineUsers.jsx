import React from 'react'
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, CardHeader, CardImg, Badge } from 'reactstrap'
import Constants from '../Constants'

const OnlineUsers = (props) => {

    var onlineUsers = props.onlineUsers
    var friends = props.friends

    var IsFriend = (user_id) => {
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].id == user_id) {
                return true
            }
        }
        return false
    }

    var users_list = null

    if (onlineUsers.length > 0) {
        users_list = onlineUsers.map((user) => {

            var badges = []

            if (user.is_online) {
                badges.push(<Badge color='success'>Online</Badge>)
            }

            if (IsFriend(user.id)) {
                badges.push(<Badge color='primary'>Friend</Badge>)
            }

            return (
                <Card className='text-center' style={{ backgroundColor: '#5d6375', width: '7.6rem', margin: '10px' }}>
                    <CardImg top style={{ width: '70%', alignSelf: 'center', paddingTop: '10px', marginBottom: '-10px' }} src={Constants.IMAGE_BASE_URL + user.image_url + '.png'} alt='...' />
                    <CardBody>
                        <CardTitle>@{user.username}</CardTitle>
                        <CardText>
                            {badges}
                        </CardText>
                        <Button color='primary' size='sm' style={{ marginBottom: '-5px' }} href={'/index/profile/' + user.id}>Visit Profile</Button>
                    </CardBody>
                </Card>
            )
        })
    } else {
        users_list = <h2 style={{ paddingLeft: '50px' }}>no user available</h2>
    }

    return (
        <>
            <CardTitle tag="h2">Online Users</CardTitle>
            <Row>
                <Col xs="12">
                    <Card className="card-chart" style={{ height: '100%', paddingRight: '20px', paddingLeft: '20px' }}>
                        <CardHeader>
                            <CardTitle tag="h3">
                                <i className="tim-icons icon-single-02 text-success" style={{ marginRight: '10px' }} />{onlineUsers.length} people
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                {users_list}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OnlineUsers

