import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import './assets/scss/black-dashboard-react.scss'
import './assets/css/nucleo-icons.css'

import MainLayout from './layouts/MainLayout'
import Cookies from 'universal-cookie'
import Constants from './Constants'
const hist = createBrowserHistory()

var user_home_url = '/index/guest/home'
const cookies = new Cookies()
var user_type = parseInt(cookies.get('user_type'))

if (isNaN(user_type)) {
  user_type = Constants.Enums.UserTypeEnum.Guest
  cookies.set('user_type', Constants.Enums.UserTypeEnum.Guest, { path: '/' })
  cookies.set('main_user_id', '-1', { path: '/' })
  cookies.set('main_user_is_admin', 'false', { path: '/' })
}

if (user_type != Constants.Enums.UserTypeEnum.Guest) {
  user_home_url = '/index/user/home'
}
console.log("selected url: " + user_home_url)

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path='/index' render={props => <MainLayout {...props} />} />
      <Redirect from='/' to={user_home_url} />
    </Switch>
  </Router>,
  document.getElementById('root')
)
