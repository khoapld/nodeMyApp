app.controller('UserDetailController', ['$scope', '$routeParams', 'Users', '$location', function ($scope, $routeParams, Users, $location) {
        $scope.user = Users.get({id: $routeParams.id});

        $scope.update = function () {
            var props = {};
            props.is_actived = $scope.user.is_actived;
            Users.get({id: $routeParams.id}, function (user) {
                if (user.email !== $scope.user.email)
                    props.email = $scope.user.email;
                Users.update({id: $scope.user._id}, props, function (res) {
                    if (typeof res.errors !== 'undefined') {
                        $scope.validationError = res.errors;
                        return;
                    } else {
                        $location.url('/');
                    }
                });
            });
        };

        $scope.remove = function () {
            Users.remove({id: $scope.user._id}, function () {
                $location.url('/');
            });
        };
    }]);
