var app = angular.module('arevea');
app.controller('assignmentView_controller', ['$scope', '$rootScope', '$location', 'request', 'ctrlComm', '$filter', 'fileUpload', '$timeout', '$http', '$window', '$state', 'NgMap', '$stateParams', 'teamMemberFactory', '$http', '$uibModal',
    function ($scope, $rootScope, $location, request, ctrlComm, $filter, fileUpload, $timeout, $http, $window, $state, NgMap, $stateParams, teamMemberFactory, $http, $uibModal) {
        $scope.events = [];
        $scope.getAssignmentList = function () {
            var response = teamMemberFactory.userAssignments.getList($stateParams);
            response.$promise.then(function successCB(data) {
                console.log("SUCCESS :: ", data)
                angular.forEach(data.result, function (event, key) {
                    $scope.events.push({
                        data: event,
                        title: event.event_name,
                        start: event.event_start_date,
                        end: event.event_end_date
                    })
                })
                $scope.initCalendar("#fullCalendar");
                var gv = $("#fullCalendar").fullCalendar('getView');
            }, function errorCB(err) {
                console.log("ERROR :: ", err);
            });
        }

        $scope.initCalendar = function (sel) {
            $(sel).fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: new Date(),
                navLinks: false, // can click day/week names to navigate views
                selectable: false,
                selectHelper: false,
                select: function (start, end) {

                },
                eventClick: function (event, element) {
                    showEventDetails(event.data)
                },
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: $scope.events,
                viewRender: function (view, a) {
                    var gv = $(sel).fullCalendar('getView');
                    // $scope.getWorkingList(gv.title);
                }
            });
        }

        function showEventDetails(event) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/myTeam/eventDetails.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.eventDetails = event;
                    var data = $scope.eventDetails.event_summary_data;
                    $scope.eventDetails.event_summary_data = (typeof (data) == 'string') ? JSON.parse(data) : data;
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {

            }, function () {

            });
        }

    }]);