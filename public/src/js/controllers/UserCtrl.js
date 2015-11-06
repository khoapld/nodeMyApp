app.controller('UserController', ['$scope', 'Users', function ($scope, Users) {
        $scope.validationError = null;
        $scope.editing = [];
        $scope.users = Users.query();

        $scope.save = function () {
            if (!$scope.newUsername || $scope.newUsername.length < 1)
                return;
            var user = new Users({username: $scope.newUsername, email: $scope.newUsername + "@test.com", password: "123456", is_actived: false});

            user.$save(function () {
                if (typeof user.errors !== 'undefined') {
                    $scope.validationError = user.errors;
                    return;
                }
                $scope.users.push(user);
                $scope.newUsername = ''; // clear textbox
                $scope.validationError = null;
            });
        };

        $scope.update = function (index, field) {
            var props = {};
            var user = $scope.users[index];
            var editing = $scope.editing[index];
            if (field === 'is_actived') {
                props.is_actived = user.is_actived;
            } else if (field === 'username') {
                props.username = user.username;
                if (user.username === editing.username) {
                    $scope.cancel(index);
                    return;
                }
            }

            Users.update({id: user._id}, props, function (res) {
                if (typeof res.errors !== 'undefined') {
                    $scope.validationError = res.errors;
                    return;
                } else {
                    $scope.editing[index] = false;
                    $scope.validationError = null;
                }
            });
        };

        $scope.edit = function (index) {
            $scope.editing[index] = angular.copy($scope.users[index]);
        };

        $scope.cancel = function (index) {
            $scope.users[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        };

        $scope.remove = function (index) {
            var user = $scope.users[index];
            Users.remove({id: user._id}, function () {
                $scope.users.splice(index, 1);
            });
        };
    }]);
