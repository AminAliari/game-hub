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
import NotificationAlert from "react-notification-alert";
import ProfileSummary from './ProfileSummary'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        var cookies = new Cookies()

        this.state = {
            userId: props.match.params.id,
            mainUserId: cookies.get('main_user_id'),
            IsFriend: false,
            canAddFriend: false,
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            image_url: '-1',
            is_online: false,
            canSend: true,
            user_profile_summary: {},
            user_played_games: [],
            user_designed_games: [],
            show_add_friend: parseInt(cookies.get('user_type')) != Constants.Enums.UserTypeEnum.Guest ? 'initial' : 'none'
        }
    }

    componentDidMount() {
        this.GetProfile()
        this.GetProfileSummary()
    }

    GetProfile() {
        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetUser)
        params.append('id', this.state.userId)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    var user = response.data[0]
                    this.setState({ username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname, image_url: user.image_url, email: user.email, is_online: user.is_online == 't' })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })


        params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetFriends)
        params.append('id', this.state.userId)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canAddFriend: true })

                if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    var friends = response.data
                    this.setState({ friends: friends })
                    this.CheckFriends()
                }
            })
            .catch(error => {
                this.setState({ canAddFriend: true })
                this.ShowError(error)
            })
    }

    CheckFriends() {
        for (let i = 0; i < this.state.friends.length; i++) {
            if (this.state.friends[i].id == this.state.mainUserId) {
                this.setState({ IsFriend: true })
                break;
            }
        }
    }

    GetProfileSummary() {
        if (this.state.mainUserId == this.state.userId) return

        console.log("fetching profile summary");

        const main_user_id = this.state.userId

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetProfileSummary)
        params.append('id', main_user_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ user_profile_summary: response.data[0] })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })

        params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetProfilePlayedGames)
        params.append('id', main_user_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ user_played_games: response.data })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })

        params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetProfileDesignedGames)
        params.append('id', main_user_id)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ user_designed_games: response.data })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    AddFriend() {
        if (!this.state.IsFriend) {
            this.setState({ canAddFriend: false })
            var params = new URLSearchParams()
            params.append('method', Constants.Enums.Methods.AddFriend)
            params.append('id', new Cookies().get('main_user_id'))
            params.append('friend_id', this.state.userId)

            axios.post(Constants.REQUEST_URL, params)
                .then(response => {
                    this.setState({ canAddFriend: true })
                    if (response.data == 'ERROR') {
                        this.ShowError('server problem')

                    } else { // success
                        this.setState({ IsFriend: true })
                    }
                })
                .catch(error => {
                    this.setState({ canAddFriend: true })
                    this.ShowError(error)
                })
        }
    }

    OnUpdateClicked() {
        if (this.state.username == '' || this.state.password == '' || this.state.firstname == '' || this.state.lastname == '' || this.state.email == '') {
            this.ShowError('please fill out all fileds')
            return
        }

        this.setState({ canSend: false })

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.UpdateUser)
        params.append('id', this.state.userId)
        params.append('password', this.state.password)
        params.append('firstname', this.state.firstname)
        params.append('lastname', this.state.lastname)
        params.append('email', this.state.email)
        params.append('image_url', this.state.image_url)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                this.setState({ canSend: true })

                if (response.data == 'NO') {
                    this.ShowError('problem in updating your profile')

                } else if (response.data == 'ERROR') {
                    this.ShowError('server problem')

                } else { // success
                    var cookies = new Cookies()
                    cookies.set('main_user_firstname', this.state.firstname, { path: '/' })
                    cookies.set('main_user_lastname', this.state.lastname, { path: '/' })
                    cookies.set('main_user_email', this.state.email, { path: '/' })
                    cookies.set('main_user_image_url', this.state.image_url, { path: '/' })
                    this.ShowMessage("Profile updated")
                    window.location.reload();
                }
            })
            .catch(error => {
                this.setState({ canSend: true })
                this.ShowError(error)
            })
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

    render() {
        var output = null

        if (this.state.mainUserId != this.state.userId) {
            output = (
                <div className='content'>
                    <Row>
                        <Col></Col>
                        <Col md='4'>
                            <Card className='card-user'>
                                <CardBody>
                                    <CardText />
                                    <div className='author'>
                                        <div className='block block-one' />
                                        <div className='block block-two' />
                                        <div className='block block-three' />
                                        <div className='block block-four' />
                                        <a href='' onClick={e => e.preventDefault()}>
                                            <img alt='...' className='avatar' src={Constants.IMAGE_BASE_URL + this.state.image_url + '.png'} />
                                            <h5 className='title'>@{this.state.username}
                                                <Badge style={{ marginLeft: '10px' }} color={this.state.is_online ? 'success' : 'danger'} pill>{this.state.is_online ? 'Online' : 'Offline'}</Badge>
                                            </h5>

                                        </a>
                                        <p className='description'>{this.state.firstname + ' ' + this.state.lastname}</p>
                                    </div>
                                    <div className='card-description' style={{ textAlign: 'center' }}>{this.state.email}</div>
                                </CardBody>
                                <CardFooter>
                                    <div className='button-container'>
                                        <fieldset disabled={!this.state.canAddFriend}>
                                            <Button color='primary' className='animation-on-hover' size='sm' onClick={() => { this.AddFriend() }} style={{ display: this.state.show_add_friend }}>{this.state.IsFriend ? 'Friend' : 'Add Friend'}</Button>
                                        </fieldset>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                    <ProfileSummary user_profile_summary={this.state.user_profile_summary} user_played_games={this.state.user_played_games} user_designed_games={this.state.user_designed_games} user_image_url={this.state.image_url} is_profile_editable={false} profile_id={this.state.userId} />
                </div>
            )
        } else {
            output = (
                <div className='content'>
                    <Row>
                        <Col md='8'>
                            <Card>
                                <CardHeader>
                                    <h5 className='title'>Edit your profile</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <label><p className='tim-icons icon-badge' /> User Information</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input disabled placeholder={this.state.username} type='text' onChange={event => this.setState({ username: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input type='password' defaultValue={this.state.password} placeholder='Password' autoComplete='off' onChange={event => this.setState({ password: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <h2> </h2>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <label><p className='tim-icons icon-badge' /> Personal Information</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='3'>
                                                <FormGroup>
                                                    <Input defaultValue={this.state.firstname} placeholder='First Name' type='text' onChange={event => this.setState({ firstname: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col className='pl-md-1' md='3'>
                                                <FormGroup>
                                                    <Input defaultValue={this.state.lastname} placeholder='Last Name' type='text' onChange={event => this.setState({ lastname: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col className='pr-md-1' md='4'>
                                                <FormGroup>
                                                    <Input defaultValue={this.state.email} placeholder='Email Address' type='email' onChange={event => this.setState({ email: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <h2> </h2>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='4'>
                                                <label><p className='tim-icons icon-image-02' /> Avatar</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='pr-md-1' md='12'>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '0'} type='radio' name='exampleRadios1' id='exampleRadios11' value='0' onClick={() => this.setState({ image_url: '0' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/0.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '1'} type='radio' name='exampleRadios1' id='exampleRadios12' value='1' onClick={() => this.setState({ image_url: '1' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/1.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '2'} type='radio' name='exampleRadios1' id='exampleRadios12' value='2' onClick={() => this.setState({ image_url: '2' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/2.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '3'} type='radio' name='exampleRadios1' id='exampleRadios12' value='3' onClick={() => this.setState({ image_url: '3' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/3.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '4'} type='radio' name='exampleRadios1' id='exampleRadios12' value='4' onClick={() => this.setState({ image_url: '4' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/4.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '5'} type='radio' name='exampleRadios1' id='exampleRadios12' value='5' onClick={() => this.setState({ image_url: '5' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/5.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '6'} type='radio' name='exampleRadios1' id='exampleRadios12' value='6' onClick={() => this.setState({ image_url: '6' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/6.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '7'} type='radio' name='exampleRadios1' id='exampleRadios12' value='7' onClick={() => this.setState({ image_url: '7' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/7.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '8'} type='radio' name='exampleRadios1' id='exampleRadios12' value='8' onClick={() => this.setState({ image_url: '8' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/8.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '9'} type='radio' name='exampleRadios1' id='exampleRadios12' value='9' onClick={() => this.setState({ image_url: '9' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/9.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '10'} type='radio' name='exampleRadios1' id='exampleRadios12' value='10' onClick={() => this.setState({ image_url: '10' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/10.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '11'} type='radio' name='exampleRadios1' id='exampleRadios12' value='11' onClick={() => this.setState({ image_url: '11' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/11.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check inline className='form-check-radio'>
                                                    <Label className='form-check-label'>
                                                        <Input checked={this.state.image_url == '12'} type='radio' name='exampleRadios1' id='exampleRadios12' value='12' onClick={() => this.setState({ image_url: '12' })} />
                                                        <span className='form-check-sign'></span>
                                                        <img src='/avatars/12.png' style={{ width: '30%' }} />
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <fieldset disabled={!this.state.canSend}>
                                        <Button className='btn-fill' color='primary' type='submit' onClick={() => this.OnUpdateClicked()}>Update</Button>
                                    </fieldset>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <>
                <NotificationAlert ref="notify" />
                {output}
            </>
        )
    }
}

export default Profile
