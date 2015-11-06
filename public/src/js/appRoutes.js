app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: '/template/users.html',
                    controller: 'UserController'
                })

                .when('/:id', {
                    templateUrl: '/template/userDetails.html',
                    controller: 'UserDetailController'
                });
    }]);
