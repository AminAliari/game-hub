import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PerfectScrollbar from 'perfect-scrollbar';

import UserNavbar from '../components/Navbars/UserNavbar';
import GuestNavbar from '../components/Navbars/GuestNavbar'
import Sidebar from '../components/Sidebar/Sidebar';

import routes from '../routes';
import Constants from '../Constants'
import Cookies from 'universal-cookie'

var ps;

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'primary'
    };
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      document.documentElement.className += ' perfect-scrollbar-on';
      document.documentElement.classList.remove('perfect-scrollbar-off');
      ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
      let tables = document.querySelectorAll('.table-responsive');
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
      document.documentElement.className += ' perfect-scrollbar-off';
      document.documentElement.classList.remove('perfect-scrollbar-on');
    }
  }

  componentDidUpdate(e) {
    if (e.history.action === 'PUSH') {
      if (navigator.platform.indexOf('Win') > -1) {
        let tables = document.querySelectorAll('.table-responsive');
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    document.documentElement.classList.toggle('nav-open');
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };

  GetRoutes = (routes, userType) => {
    return routes.map((prop, key) => {
      if (prop.type == Constants.Enums.PageTypeEnum.General || prop.type == Constants.Enums.PageTypeEnum.HiddenGeneral || prop.type == userType || (prop.type == Constants.Enums.PageTypeEnum.UserAndAdmin && (userType == Constants.Enums.UserTypeEnum.User || userType == Constants.Enums.UserTypeEnum.Admin))) {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  GetUserTypeRotues = (routes, userType) => {
    var res = []
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].type == Constants.Enums.PageTypeEnum.General || routes[i].type == userType) {
        res.push(routes[i])

      } else if (routes[i].type == Constants.Enums.PageTypeEnum.UserAndAdmin && (userType == Constants.Enums.UserTypeEnum.User || userType == Constants.Enums.UserTypeEnum.Admin)) {
        res.push(routes[i])
      }
    }
    return res
  }


  GetBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    if (path.includes('profile')) {
      return 'User Profile'
    } else if (path.includes('post-match')) {
      return 'Post Match'
    } else if (path.includes('result')) {
      return 'Game Result'
    } else if (path.includes('game')) {
      return 'Matchmaking'
    }
    return 'Null Route Name';
  };

  render() {
    var output = null

    const cookies = new Cookies()
    var user_type = parseInt(cookies.get('user_type'));

    console.log("user_type: " + user_type)
    var rotuesToShow = this.GetUserTypeRotues(routes, user_type)
    var switchRoutes = this.GetRoutes(routes, user_type)

    switch (user_type) {
      default:
      case Constants.Enums.UserTypeEnum.Guest:
        console.log("in guest layout")
        output = (
          <div className='wrapper'>
            <Sidebar
              {...this.props}
              routes={rotuesToShow}
              bgColor={this.state.backgroundColor}
              logo={{
                innerLink: '#',
                text: 'Game Hub',
                imgSrc: Constants.IMAGE_BASE_URL + 'logo.png'
              }}
              toggleSidebar={this.toggleSidebar}
            />
            <div
              className='main-panel'
              ref='mainPanel'
              data={this.state.backgroundColor}
            >
              <GuestNavbar
                {...this.props}
                brandText={this.GetBrandText(this.props.location.pathname)}
              />
              <Switch>{switchRoutes}</Switch>
            </div>
          </div>
        )
        break;

      case Constants.Enums.UserTypeEnum.User:
      case Constants.Enums.UserTypeEnum.Admin:
        console.log("in user/admin layout")
        output = (
          <div className='wrapper'>
            <Sidebar
              {...this.props}
              routes={rotuesToShow}
              bgColor={this.state.backgroundColor}
              logo={{
                innerLink: '#',
                text: 'Game Hub',
                imgSrc: Constants.IMAGE_BASE_URL + 'logo.png'
              }}
              toggleSidebar={this.toggleSidebar}
            />
            <div
              className='main-panel'
              ref='mainPanel'
              data={this.state.backgroundColor}
            >
              <UserNavbar
                {...this.props}
                brandText={this.GetBrandText(this.props.location.pathname)}
                toggleSidebar={this.toggleSidebar}
                sidebarOpened={this.state.sidebarOpened}
              />
              <Switch>{switchRoutes}</Switch>
            </div>
          </div>
        )
        break;
    }

    return (
      <>{output}</>
    );
  }
}

export default MainLayout;
