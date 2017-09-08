var app = angular.module('arevea');
app.controller('teamMembers_controller', ['$scope', '$rootScope', '$location', 'request', 'ctrlComm', '$filter', 'fileUpload', '$timeout', '$http', '$window', '$state', 'NgMap', '$stateParams', 'myTeamFactory', 'teamMemberFactory',
    function ($scope, $rootScope, $location, request, ctrlComm, $filter, fileUpload, $timeout, $http, $window, $state, NgMap, $stateParams, myTeamFactory, teamMemberFactory) {

        if (window.localStorage.getItem('adminDetails'))
            $scope.currUser = JSON.parse(window.localStorage.getItem('adminDetails'));

        console.log("$scope.currUser :: ", $scope.currUser);
        $scope.teamMember = {};
        $scope.emailFormat = /^[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

        $scope.getTeamMembersList = function () {
            var response = teamMemberFactory.teamMembers.getList({"vendor_id": $scope.currUser.vendorid});
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS :: ", data)
                $scope.teamMembersList = data.result;
                $scope.selectedTeamMember = null;
                $scope.searchByPersonName = '';
                $scope.selectedTeam = null;
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })
        }

        $scope.getTeamList = function () {
            var response = myTeamFactory.team.getList({"vendor_id": $scope.currUser.vendorid});
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS :: ", data)
                $scope.teamList = data.result;
                $scope.selectedTeam = null;
                prePopulateTeams($scope.teamList);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            })
        }

        if (ctrlComm.get('updateTeamMember')) {
            $scope.teamMember = ctrlComm.get('updateTeamMember');
            console.log("$scope.teamMember :: ", $scope.teamMember);
        }
        $scope.getTeamList();

        $scope.allSelectedTeams = [];
        function prePopulateTeams() {
            console.info("$scope.teamMember.teams", $scope.teamMember.teams);
            if ($scope.teamMember.teams !== undefined)
//                debugger;

                var memberNames = ($scope.teamMember.teams !== undefined && typeof $scope.teamMember.teams !== "string") ? $scope.teamMember.teams : [];
            console.log("memberNames :: ", memberNames);
            console.log("$scope.teamList :: ", $scope.teamList);
//            angular.forEach(memberNames, function (name, index) {
//                angular.forEach($scope.teamList, function (team, key) {
//                    if (name == team.id) {
//                        console.log(name, ' == ', team.team_name)
//                        $scope.allSelectedTeams.push(team);
//                        $scope.teamList.splice(key, 1);
//                    }
//                })
//            })
        }

        $scope.addNewTeamMember = function () {
            ctrlComm.del('updateTeamMember');
            $state.go('teamMember');
        }

        $scope.editTeamMember = function (member) {
            var data = {
                userId: member.id,
                vendor_id: $scope.currUser.vendorid
            };
            var response = teamMemberFactory.teamMembersByID.getData(data);
            response.$promise.then(function successCB(data) {
                if (data.status == "0") {
                    var obj = data.result[0];
                    obj.teams = [];

                    angular.forEach(data.teams, function (n, i) {
                        obj.teams.push(n.id);
                    });

                    ctrlComm.put('updateTeamMember', obj);
                    $state.go('teamMember');
                } else {
                    $scope.notification(data.message);
                }
            }, function errorCB(err) {
                console.log("ERROR ::");
            });

        };

        $scope.saveTeamMember = function (form) {
//            debugger;
            $scope.teamMember.vendor_id = $scope.currUser.vendorid;
            if (form.$valid) {
                if ($scope.teamMember.id) {
                    updateTeamMemberRESTapi();
                } else {
                    addTeamMemeberRESTapi();
                }
            } else {
                return false;
            }
        }

        function addTeamMemeberRESTapi() {
            console.log("ADD................................");
            var response = teamMemberFactory.createTeamMember.save($scope.teamMember);
            response.$promise.then(function successCB(data) {
                $state.go('teamMembers');
            }, function errorCB(err) {
                console.log("ERROR ::")
            })
        }

        function updateTeamMemberRESTapi() {
            var input = {
                "email": $scope.teamMember.email,
                "first_name": $scope.teamMember.first_name,
                "last_name": $scope.teamMember.last_name,
                "phone_number": $scope.teamMember.phone_number,
                "id": $scope.teamMember.id,
                "userId": $scope.teamMember.id,
                "teams": $scope.teamMember.teams
            }
            console.log("UPDATE ...............................");
            var response = teamMemberFactory.updateTeamMember.save(input);
            response.$promise.then(function successCB(data) {
                $state.go('teamMembers');
            }, function errorCB(err) {
                console.log("ERROR ::")
            })
        }

        $scope.addTeamToPerson = function (selectedTeam) {
            var selectedTeam = angular.copy(selectedTeam);
            console.log("selectedTeam :: ", selectedTeam);
            $scope.allSelectedTeams.push(selectedTeam);
            var input = {
                "teams": [],
                "userId": $scope.teamMember.id
            }
            angular.forEach($scope.allSelectedTeams, function (obj, key) {
                input.teams.push(obj.id)
            });
            $scope.selectedTeam = null;
            var response = myTeamFactory.assignUserToTeam.save(input);
            response.$promise.then(function successCB(data) {
                angular.forEach($scope.teamList, function (obj, key) {
                    if (obj.id == selectedTeam.id) {
                        $scope.teamList.splice(key, 1);
                    }
                });
                console.log("DATA :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }
        $scope.removeTeamFromPerson = function (team) {
            var input = {
                "teamId": team.id,
                "userId": $scope.teamMember.id
            }
            var response = myTeamFactory.deleteUserFromTeam.remove(input);
            response.$promise.then(function successCB(data) {
                angular.forEach($scope.allSelectedTeams, function (obj, key) {
                    if (obj.id == team.id) {
                        $scope.allSelectedTeams.splice(key, 1);
                        $scope.teamList.push(team);
                    }
                });
                console.log("DATA :: ", data);
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        $scope.deleteTeamMember = function (member) {
            var response = teamMemberFactory.deleteTeamMember.delete({id: member.id});
            response.$promise.then(function successCB(data) {
                $scope.notification(data.message);
                //$scope.notification('Team member deleted successfully');
                $scope.getTeamMembersList();
            }, function errorCB(err) {
                console.log("ERROR ::")
            })
        }

        $scope.filterTeamMembers = function (member) {
            $scope.selectedTeamMember = {};
            $scope.selectedTeamMember.full_name = member.full_name;
        }

        $scope.filterTeam = function (team) {
            $scope.selectedTeam = {};
            $scope.selectedTeam.teams = team.team_name;
        }

        $scope.clickFormSumitted = function () {
            document.getElementById('formSubmit').click();
            $scope.formSubmited = true;
        }

        $scope.back = function () {
            $state.go('teamMembers');
        }
    }]);
