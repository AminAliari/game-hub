import React from "react";
import axios from 'axios'
import Cookies from 'universal-cookie'
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";

import TopGames from './TopGames'
import ProfileSummary from './ProfileSummary'
import OnlineUsers from './OnlineUsers'


class UserHome extends React.Component {
    constructor(props) {
        super(props);

        var cookies = new Cookies()

        this.state = {
            main_user_id: cookies.get('main_user_id'),
            user_image_url: cookies.get('main_user_image_url'),
            onlineUsers: [],
            friends: [],
            best_game: {},
            newest_game: {},
            most_online_game: {},
            user_profile_summary: {},
            user_played_games: [],
            user_designed_games: []
        };
    }

    componentDidMount() {
        this.GetTopGames()
        this.GetProfileSummary()
        this.GetOnlineUsers()
    }

    componentWillUnmount() {
        clearInterval(this.timer_id)
    }

    GetTopGames() {
        console.log("fetching top games");

        var params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetBestGame)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ best_game: response.data[0] })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })

        params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetNewestGame)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ newest_game: response.data[0] })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })

        params = new URLSearchParams()
        params.append('method', Constants.Enums.Methods.GetMostPlayedGame)

        axios.post(Constants.REQUEST_URL, params)
            .then(response => {
                if (response.data == 'ERROR') {
                    this.ShowError("server problem")
                } else {
                    this.setState({ most_online_game: response.data[0] })
                }
            })
            .catch(error => {
                this.ShowError(error)
            })
    }

    GetProfileSummary() {
        console.log("fetching profile summary");

        const main_user_id = this.state.main_user_id

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

    GetOnlineUsers() {
        let func = () => {
            console.log("fetching online users");

            const main_user_id = this.state.main_user_id

            var params = new URLSearchParams()
            params.append('method', Constants.Enums.Methods.GetOnlineUsers)
            params.append('id', main_user_id)

            axios.post(Constants.REQUEST_URL, params)
                .then(response => {
                    if (response.data == 'ERROR') {
                        this.ShowError("server problem")
                    } else {
                        this.setState({ onlineUsers: response.data })
                    }
                })
                .catch(error => {
                    this.ShowError(error)
                })

            params = new URLSearchParams()
            params.append('method', Constants.Enums.Methods.GetFriends)
            params.append('id', main_user_id)

            axios.post(Constants.REQUEST_URL, params)
                .then(response => {

                    if (response.data == 'ERROR') {
                        this.ShowError('server problem')

                    } else { // success
                        var friends = response.data
                        this.setState({ friends: friends })
                    }
                })
                .catch(error => {
                    this.ShowError(error)
                })
        }

        func()

        this.timer_id = setInterval(() => {
            func()
        }, Constants.REFRESH_TIME)
    }

    render() {
        return (
            <>
                <NotificationAlert ref="notify" />
                <div className="content">
                    <TopGames best_game={this.state.best_game} newest_game={this.state.newest_game} most_online_game={this.state.most_online_game} />

                    <ProfileSummary user_profile_summary={this.state.user_profile_summary} user_played_games={this.state.user_played_games} user_designed_games={this.state.user_designed_games} user_image_url={this.state.user_image_url} is_profile_editable={true} profile_id={this.state.main_user_id} />

                    <OnlineUsers onlineUsers={this.state.onlineUsers} friends={this.state.friends} />
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

export default UserHome;
