var Constants = {
    REQUEST_URL: 'https://game-hub-back.herokuapp.com/request.php',

    IMAGE_BASE_URL: '/avatars/',

    REFRESH_TIME: 300000,
    CHECK_TIME: 5000,

    Enums: {
        Methods: {
            Login: 'Login',
            Signup: 'Signup',
            UpdateUser: 'UpdateUser',
            GetUser: 'GetUser',
            GetOnlineUsers: 'GetOnlineUsers',
            GetFriends: 'GetFriends',
            AddFriend: 'AddFriend',
            GetBestGame: 'GetBestGame',
            GetNewestGame: 'GetNewestGame',
            GetMostPlayedGame: 'GetMostPlayedGame',
            GetProfileSummary: 'GetProfileSummary',
            GetProfilePlayedGames: 'GetProfilePlayedGames',
            GetProfileDesignedGames: 'GetProfileDesignedGames',
            GetGames: 'GetGames',
            GetGameComment: 'GetGameComments',
            GetUsers: 'GetUsers',
            DesignGame: 'DesignGame',
            SubmitUserComment: 'SubmitUserComment',
            SubmitGameComment: 'SubmitGameComment',
            GetGameResult: 'GetGameResult',
            GetUsersComments: 'GetUsersComments',
            GetGamesComments: 'GetGamesComments',
            ApproveUserComment: 'ApproveUserComment',
            ApproveGameComment: 'ApproveGameComment',
            RequestGame: 'RequestGame',
            CheckRequest: 'CheckRequest',
            GetResultId: 'GetResultId'
        },

        UserTypeEnum: {
            Guest: 0,
            User: 1,
            Admin: 2
        },

        PageTypeEnum: {
            HiddenGeneral: -2,
            General: -1,
            Guest: 0,
            User: 1,
            Admin: 2,
            UserAndAdmin: 3
        }
    }
}

export default Constants