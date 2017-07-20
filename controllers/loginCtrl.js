/*(function() {*/
var app = angular.module('arevea');
app.controller('loginCtrl', function ($scope, $rootScope, request, $http, $location) {
    $scope.login = {};
    var error = false;
    $scope.err = {};
	$scope.changeLoginStatus(false);
	if (window.localStorage.userId) {
			$location.path('dashboard');
	}
    var validation = function (cb) {
        if ($scope.login.email && $scope.login.password) {
            if (cb)
                cb();
        }
    }
    
    var validateLogin = function (cb) {
        //if (!$scope.login.email) { $scope.err.email = true; } else { delete $scope.err.email; }
        if (!$scope.login.email) {
            $scope.err.email = true;
        } else {
            if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test($scope.login.email)) {
                $scope.err.valid_email = true;

            } else {
                delete $scope.err.email;
                delete $scope.err.valid_email;
            }
        }
        if (!$scope.login.password) {
            $scope.err.password = true;
        } else {
            delete $scope.err.password;
        }

        console.log("lengthy::", Object.keys($scope.err).length);
        console.log("err", $scope.err);
        if (Object.keys($scope.err).length == 0) {

            if (cb)
                cb();

        }
    }
    var adminLogin = function () {
        validateLogin(function () {
            $scope.loader(true);
            /*window.location.hash = "#/My-Account"
             $scope.loginToggle();
             $scope.loader(false);*/
            request.service('login', 'post', $scope.login, function (response) {
                console.log(response)
                $scope.loader(false);
                if (response.status == 0) {
                    $rootScope.vendorid = response.vendorid.toString();
                    request.setItem('status', response.status.toString());
                    request.setItem('vendorid', response.vendorid.toString());
                    request.setItem('firstName', response.firstName);
                    request.setItem('lastName', response.lastName);
                    request.setItem('bussinessName', response.bussinessName);
                    request.setItem('email', response.email);
                    request.setObj('vendor', response.vendor);
                    //console.log("email status",response.vendor.email_verification[0]);
                    request.setItem('emailStatus', response.vendor.email_verification);
                    request.setItem('userid', response.userid.toString());
                    console.log(response.vendor);
                    if(response.vendor.email_verification=="01")
                        window.location.hash = "#/My-Account"
                    else
                        window.location.hash = "#/Verification"
                    $scope.loginToggle();
                } else {
                    $scope.notification(response.message, 'danger');
                }
            })
        });
    }

    $scope.adminLogin = adminLogin;
})

