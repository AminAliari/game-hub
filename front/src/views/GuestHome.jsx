import React from "react";

import axios from 'axios'
import Constants from '../Constants'
import NotificationAlert from "react-notification-alert";

import Cookies from 'universal-cookie'
import TopGames from './TopGames'
import OnlineUsers from './OnlineUsers'

class GuestHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineUsers: [],
      best_game: {},
      newest_game: {},
      most_online_game: {}
    };
  }

  componentDidMount() {
    this.GetTopGames()
    this.GetOnlineUsers()
  }

  componentWillUnmount() {
    clearInterval(this.timer_id)
  }

  GetOnlineUsers() {
    let func = () => {
      console.log("fetching online users");

      var params = new URLSearchParams()
      params.append('method', Constants.Enums.Methods.GetOnlineUsers)
      params.append('id', new Cookies().get('main_user_id'))

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
    }

    func()

    this.timer_id = setInterval(() => {
      func()
    }, Constants.REFRESH_TIME)
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

  render() {
    return (
      <>
        <NotificationAlert ref="notify" />
        <div className="content">
          <TopGames best_game={this.state.best_game} newest_game={this.state.newest_game} most_online_game={this.state.most_online_game} />
          <OnlineUsers onlineUsers={this.state.onlineUsers} friends={[]} />
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

export default GuestHome;
