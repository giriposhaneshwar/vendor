var app = angular.module('arevea');
app.controller('teams_controller', ['$scope', '$rootScope', '$location', 'request', 'ctrlComm', '$filter', 'fileUpload', '$timeout', '$http', '$window', '$state', 'NgMap', '$stateParams', 'myTeamFactory',
    function ($scope, $rootScope, $location, request, ctrlComm, $filter, fileUpload, $timeout, $http, $window, $state, NgMap, $stateParams, myTeamFactory) {

        if (window.localStorage.getItem('adminDetails'))
            $scope.currUser = JSON.parse(window.localStorage.getItem('adminDetails'));
        $scope.team = {};

        $scope.getTeamList = function () {
            var response = myTeamFactory.team.getList({"vendor_id": $scope.currUser.vendorid});
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS :: ", data)
                $scope.teamList = data.result;
                $scope.teamMembers = [];
                angular.forEach(data.result, function (obj, key) {
                    if (obj.teammembers) {
                        var memberNames = obj.teammembers.split(',');
                        angular.forEach(memberNames, function (name, index) {
                            if ($scope.teamMembers.indexOf(name) == -1) {
                                $scope.teamMembers.push(name);
                            }
                        })
                    }
                })
                console.log("$scope.teamList ::: ", $scope.teamList);
                $scope.selectedTeam = null;
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })

        }

        if (ctrlComm.get('updateTeam')) {
            $scope.team = ctrlComm.get('updateTeam');
            $scope.team.location_id = $scope.team.team_location;
            $scope.team.category_id = $scope.team.team_category;
            console.log("$scope.team :: ", $scope.team);
            getUsersToAssignTeam($scope.team, function () {
                getTeamUsersByTeamID($scope.team);
            });
        }


        if (!ctrlComm.get('vendorCategories')) {
            getVendorCategories(function () {
                getVendorLocations();
            });
        } else {
            $scope.vendorCategories = ctrlComm.get('vendorCategories');
            console.log("$scope.vendorCategories :: ", $scope.vendorCategories);
            $scope.vendorLocations = ctrlComm.get('vendorLocations');
            console.log("$scope.vendorLocations :: ", $scope.vendorLocations);
        }

        function getVendorCategories(cb) {
            var response = myTeamFactory.vendorCategories.get({"vendor_id": $scope.currUser.vendorid});
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS vendorCategories :: ", data)
                $scope.vendorCategories = data.data;
                ctrlComm.put('vendorCategories', $scope.vendorCategories);
                if (cb)
                    cb();
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
                if (cb)
                    cb();
            })
        }

        function getVendorLocations() {
            var response = myTeamFactory.vendorGetLocations.get({"vendor_id": $scope.currUser.vendorid});
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS vendorLocations :: ", data)
                $scope.vendorLocations = data.data;
                ctrlComm.put('vendorLocations', $scope.vendorLocations);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })
        }

        $scope.saveTeam = function (form) {
            if (form.$valid) {
                if ($scope.team.id) {
                    updateTeamRESTapi();
                } else {
                    addTeamRESTapi();
                }
            } else {
                return false;
            }

        }

        function addTeamRESTapi() {
            $scope.team.vendor_id = $scope.currUser.vendorid
            $scope.team.userId = $scope.currUser.userId
            var response = myTeamFactory.createTeam.save($scope.team);
            response.$promise.then(function successCB(data) {
                $scope.notification(response.message);
                $state.go('teams');
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })
        }

        function updateTeamRESTapi() {
            var input = {
                "id": $scope.team.id,
                "team_name": $scope.team.team_name,
                "team_category": $scope.team.category_id,
                "team_location": $scope.team.location_id,
            }
            var response = myTeamFactory.updateTeam.save(input);
            response.$promise.then(function successCB(data) {
                $scope.notification(response.message);
                $state.go('teams');
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })
        }

        $scope.editTeam = function (team) {
            ctrlComm.put('updateTeam', team);
            $state.go('myTeam');
        }

        $scope.deleteTeam = function (team) {
            var response = myTeamFactory.deleteTeam.delete({id: team.id});
            response.$promise.then(function successCB(data) {
                $scope.notification(response.message);
                $scope.getTeamList();
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        $scope.filterTeams = function (team) {
            $scope.selectedTeam = team;
        }

        $scope.filterTeamMembers = function (member) {
            $scope.selectedTeamMember = member;
        }

        function getUsersToAssignTeam(team, cb) {
            var input = {
                "vendor_id": $scope.currUser.vendorid,
                "teamId": team.id
            }
            var response = myTeamFactory.usersToAssignTeam.get(input);
            response.$promise.then(function successCB(data) {
                $scope.peopleListForTeam = data.result;
                console.log("DATA :: ", data);
                if (cb)
                    cb();
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        function getTeamUsersByTeamID(team) {
            var input = {
                "teamId": team.id
            }
            var response = myTeamFactory.teamUsersByTeamID.get(input);
            response.$promise.then(function successCB(data) {
                prePopulateTeamUsers(data.result);
                console.log("DATA getTeamUsersByTeamID :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        $scope.allSelectedPersons = [];
        function prePopulateTeamUsers(users) {
            angular.forEach(users, function (user, key) {
                angular.forEach($scope.peopleListForTeam, function (obj, tkey) {
                    if (obj.id == user.id) {
                        $scope.allSelectedPersons.push(obj);
                        $scope.peopleListForTeam.splice(tkey, 1);
                    }
                })
            })
        }

        $scope.addPersonToTeam = function (selectedPerson) {
            var selectedPerson = angular.copy(selectedPerson);
            $scope.allSelectedPersons.push(selectedPerson);
            var input = {
                "users": [],
                "teamId": $scope.team.id
            }
            angular.forEach($scope.allSelectedPersons, function (obj, key) {
                input.users.push(obj.id)
            });
            $scope.selectedPerson = null;
            var response = myTeamFactory.assignTeamToUser.save(input);
            response.$promise.then(function successCB(data) {
                angular.forEach($scope.peopleListForTeam, function (obj, key) {
                    if (obj.id == selectedPerson.id) {
                        $scope.peopleListForTeam.splice(key, 1);
                    }
                });
                console.log("DATA :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }
        $scope.removePersonFromTeam = function (person) {
            var input = {
                "teamId": $scope.team.id,
                "userId": person.id
            }
            var response = myTeamFactory.deleteUserFromTeam.remove(input);
            response.$promise.then(function successCB(data) {
                $scope.notification(response.message);
                angular.forEach($scope.allSelectedPersons, function (obj, key) {
                    if (obj.id == person.id) {
                        $scope.allSelectedPersons.splice(key, 1);
                        $scope.peopleListForTeam.push(person);
                    }
                });
                console.log("DATA :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        $scope.back = function () {
            $state.go('teams');
        }

        $scope.addNewTeam = function () {
            $state.go('myTeam');
            ctrlComm.del('updateTeam');
        }

    }]);
