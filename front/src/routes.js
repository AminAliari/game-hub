import Login from './views/Login'
import Games from './views/Games'
import Users from './views/Users'
import Signup from './views/Signup'
import Profile from './views/Profile'
import FindGame from './views/FindGame'
import UserHome from './views/UserHome'
import GuestHome from './views/GuestHome'
import PostMatch from './views/PostMatch'
import AdminPage from './views/AdminPage'
import GameDesign from './views/GameDesign'
import GameResult from './views/GameResult'

import Constants from './Constants'

var routes = [
  {
    path: '/guest/home',
    type: Constants.Enums.PageTypeEnum.Guest,
    name: 'Guest Home',
    icon: 'tim-icons icon-molecule-40',
    component: GuestHome,
    layout: '/index'
  },
  {
    path: '/user/home',
    type: Constants.Enums.PageTypeEnum.UserAndAdmin,
    name: 'User Home',
    icon: 'tim-icons icon-molecule-40',
    component: UserHome,
    layout: '/index'
  },
  {
    path: '/admin/comments',
    type: Constants.Enums.PageTypeEnum.Admin,
    name: 'Review Comments',
    icon: 'tim-icons icon-paper',
    component: AdminPage,
    layout: '/index'
  },
  {
    path: '/design',
    type: Constants.Enums.PageTypeEnum.UserAndAdmin,
    name: 'Design a Game',
    icon: 'tim-icons icon-bulb-63',
    component: GameDesign,
    layout: '/index'
  },
  {
    path: '/users',
    type: Constants.Enums.PageTypeEnum.General,
    name: 'Users',
    icon: 'tim-icons icon-single-02',
    component: Users,
    layout: '/index'
  },
  {
    path: '/games',
    type: Constants.Enums.PageTypeEnum.General,
    name: 'Games',
    icon: 'tim-icons icon-controller',
    component: Games,
    layout: '/index'
  },
  {
    path: '/profile/:id',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Profile',
    icon: 'tim-icons icon-single-02',
    component: Profile,
    layout: '/index'
  },
  {
    path: '/post-match/result_id=:result_id&game_id=:game_id&user_id=:user_id&opponent_id=:opponent_id',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Post Match',
    icon: 'tim-icons icon-single-02',
    component: PostMatch,
    layout: '/index'
  },
  {
    path: '/result/:id',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Game Result',
    icon: 'tim-icons icon-single-02',
    component: GameResult,
    layout: '/index'
  },
  {
    path: '/game/:id',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Matchmaking',
    icon: 'tim-icons icon-single-02',
    component: FindGame,
    layout: '/index'
  },
  {
    path: '/signup',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Signup',
    icon: 'tim-icons icon-single-02',
    component: Signup,
    layout: '/index'
  },
  {
    path: '/login',
    type: Constants.Enums.PageTypeEnum.HiddenGeneral,
    name: 'Login',
    icon: 'tim-icons icon-single-02',
    component: Login,
    layout: '/index'
  }
]
export default routes
