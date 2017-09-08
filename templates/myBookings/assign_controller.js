var app = angular.module('arevea');
app.controller('assign_controller', ['$scope', '$rootScope', 'request', 'ctrlComm', 'myBookingFactory', '$uibModalInstance', 'items', '$filter',
    function ($scope, $rootScope, request, ctrlComm, myBookingFactory, $uibModalInstance, items, $filter) {
        $scope.teams = [];
        $scope.availableUsers = [];

        if (window.localStorage.getItem('adminDetails'))
            $scope.currUser = JSON.parse(window.localStorage.getItem('adminDetails'));

        var product = items;
        /*var start_date = $filter('date')(new Date(product.event_start_date), 'yyyy-MM-dd HH:mm');
        var end_date = $filter('date')(new Date(product.event_end_date), 'yyyy-MM-dd HH:mm');*/
        var start_date = product.event_start_date;
        var end_date = product.event_end_date;
        getAvailableUsers(product.team_id, product.booking_product_id);
        $scope.getTeamsByCatAndLoc = function () {
            var input = {
                "category_id": product.category_id,
                "location_id": product.location_id,
                "vendor_id": product.vendor_id,
                "start_date": start_date,
                "end_date": end_date,
            }
            var responce = myBookingFactory.teamsByCatAndLoc.getList(input);
            responce.$promise.then(function successCB(data) {
                $scope.teams = data.result;
                console.log("data :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err)
            });
        }
        function getAvailableUsers(teamId, booking_product_id) {
            product.teamId = teamId;
            var input = {
                "teamId": teamId,
                "start_date": start_date,
                "end_date": end_date,
                "booking_product_id": booking_product_id
            }
            var responce = myBookingFactory.availableUsersByTeamID.getList(input);
            responce.$promise.then(function successCB(data) {
                console.log("availableUsers data.result :: ", data.result)
                $scope.availableUsers = data.result;
                $scope.selectedUsers = [];
                $scope.deletedUsers = [];
                // getAssignedTeamUsersForBooking();
                makeCheckAssignedUsers($scope.availableUsers);
            }, function errorCB(err) {
                console.log("ERROR :: ", err)
            });
        }
        $scope.getAvailableUsers = function (teamId) {
            product.teamId = teamId;
            var input = {
                "teamId": teamId,
                "start_date": start_date,
                "end_date": end_date,
            }
            var responce = myBookingFactory.availableUsersByTeamID.getList(input);
            responce.$promise.then(function successCB(data) {
                console.log("availableUsers data.result :: ", data.result)
                $scope.availableUsers = data.result;
                $scope.selectedUsers = [];
                $scope.deletedUsers = [];
                // getAssignedTeamUsersForBooking();
                makeCheckAssignedUsers($scope.availableUsers);
            }, function errorCB(err) {
                console.log("ERROR :: ", err)
            });
        }

        // function getAssignedTeamUsersForBooking(){
        // 	console.log("product :: ",product);
        // 	var input = {
        // 		"booked_prod_id": product.booking_product_id,
        // 		"teamId": product.teamId
        // 	}
        // 	var responce = myBookingFactory.assignedTeamUsersForBooking.getList(input);
        // 	responce.$promise.then(function successCB(data){
        // 		console.log("DATA ::: ",data);
        // 		makeCheckAssignedUsers(data.result);
        // 	},function errorCB(err){
        // 		console.log("ERROR :: ",err)
        // 	});
        // }
        function makeCheckAssignedUsers(users) {
            angular.forEach(users, function (user, uKey) {
                if (user.recordexts == 1) {
                    user.selection = true;
                    if ($scope.selectedUsers.indexOf(user.id) == -1)
                        $scope.selectedUsers.push(user.id);
                }
            });
        }
        $scope.userSelectionChange = function (user) {
            
            if (user.selection) {
                $scope.selectedUsers.push(user.id);
                if (user.vbid) {
                    $scope.deletedUsers.splice($scope.deletedUsers.indexOf(user.vbid), 1);
                }
            } else {
                if (user.vbid) {
                    $scope.selectedUsers.splice($scope.selectedUsers.indexOf(user.id), 1);
                    $scope.deletedUsers.push(user.vbid);
                    /*var responce = myBookingFactory.removeFromVendorAssignment.remove({id:user.vbid,
                     teamId:user.teamId,
                     assignment_start_date: start_date,
                     assignment_end_date: end_date
                     });
                     responce.$promise.then(function successCB(data){
                     console.log("DATA ============= :: ",data);
                     },function errorCB(err){
                     console.log("ERROR ============ :: ",err);
                     });*/
                }
            }
        }

        $scope.saveSelectedTeamMembers = function () {
            var input = {
                "booking_id": product.booking_id,
                "booking_product_id": product.booking_product_id,
                "event_id": product.event_id,
                "userId": $scope.currUser.userId,
                "teamId": product.team_id,
                "assignment_start_date": start_date,
                "assignment_end_date": end_date,
                "users": $scope.selectedUsers,
                "deleteUsers": $scope.deletedUsers,
                "category_id": product.category_id
            }
            var responce = myBookingFactory.assignUsersToBooking.save(input);
            responce.$promise.then(function successCB(data) {
                $uibModalInstance.close(data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err)
            });
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        }

    }]);
