(function (angular) {
    'use strict';
    angular
            .module('arevea')
            .controller('calendarEventsController', businessTimeController);
    businessTimeController.$inject = [
        '$scope',
        'request',
        'Arevea_Constant',
        '$state',
        '$stateParams',
        '$window',
        '$timeout',
        '$http',
        '$uibModal',
        '$interval'
    ];
    function businessTimeController(
            $scope,
            request,
            Arevea_Constant,
            $state,
            $stateParams,
            $window,
            $timeout,
            $http,
            $uibModal,
            $interval) {

        $scope.events = [];
        $scope.assignTeamMembers = [];
        $scope.calendarSel = $("#fullCalendar");
        $scope.init = function () {
            $scope.renderCalender();
//            $scope.getUnAvailableTimeSlots();
            $scope.getTeamMemebers();
            $scope.getTeams();
            $scope.renderCalendarData();
//            $scope.getTeamsByFilter();

        };

        $scope.initCalendar = function (sel, defaultEvents) {
            $scope.calendarSel.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: new Date(),
                navLinks: false, // can click day/week names to navigate views
                selectable: true,
                selectHelper: false,
                timeFormat: "",
                timezone: "local",
                select: function (start, end) {
//                    console.log(start, end);
                },
                eventClick: function (event, element) {
                    //booking, teamMember, unavailabletimeslots, workingHours
                    if (event.type == "teamMember") {
                        $scope.showEventDetails(event.data);
                    } else if (event.type == "booking") {
                        $scope.showBookings(event.data);
                    } else if (event.type == "workingHours") {
//                        alert(2);
                    } else if (event.type == "unavailabletimeslots") {
                        $scope.showUnAvailableTimeSlots(event.data);
                    }
                },
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                viewRender: function (view, a) {
                    var gv = $scope.calendarSel.fullCalendar('getView');
                    // $scope.getWorkingList(gv.title);
                },
                eventRender: function (event, element, view) {
//                    console.info("Event Render", event, "\n", element, "\n", view, "\n","\n","\n");
                }
            });
        }
        $scope.renderCalender = function (event) {
            $scope.initCalendar();
            var gv = $scope.calendarSel.fullCalendar('getView');
        }
        $scope.changeDateFormat = function (data) {
            var d = new Date(data);
            var n = d.toISOString();
            return n;
        }
        $scope.updateCalendar = function (data) {
            $scope.calendarSel.fullCalendar('addEventSource', data);
        }


        // Service Calls
        $scope.getUnAvailableTimeSlots = function (type) {
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            request.service('vendorGetCalendarEvent', 'post', data, function (res) {
//                debugger;
                if (res.status == "1") {
                    $scope.unAvailabletimeSlots = [];
                } else {
                    $scope.unAvailabletimeSlots = res;
                }
                console.log("VendorGetCalendarEvent", res);

                angular.forEach($scope.unAvailabletimeSlots, function (event, key) {
//                        console.log("booking is ", key, booking);
                    var obj = event;
                    var marker = [{
                            data: obj,
                            title: obj.event_name,
                            type: "unavailabletimeslots",
                            start: $scope.changeDateFormat(obj.homeFromDate),
                            end: $scope.changeDateFormat(obj.homeToDate),
                            color: '#FF735A',
                            textColor: "#fff"
                        }];
                    console.info("UnAvailableSlots", marker[0].start, marker[0].end);

                    // Rendering bookings
//                    debugger;
                    if (type !== undefined && type == "update") {
                        $scope.updateCalendar(marker);
                    } else {
                        $scope.addCalendar(marker);
                    }
                });
            });
        };
        $scope.getTeamMemebers = function () {
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            request.service('getTeamMembers', 'post', data, function (response) {
//                console.log("getTeamMembers", response2);
                $scope.teamMembersList = response.result;
                console.log("GetTeamMembersList", $scope.teamMembersList);
            });
        };
        $scope.getTeams = function () {
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            request.service('getTeams', 'post', data, function (response) {
                $scope.teamsList = response.result;
                console.log("GetTeamsList", $scope.teamsList);
            });
        };
        $scope.getBookings = function (type) {
            var data = {
                'vendor_id': window.localStorage.vendorid,
                "status": "0"
            };
            request.service('myBookings', 'post', data, function (response) {
                if (response.status == "0") {
                    $scope.myBookings = response.events;
                    angular.forEach($scope.myBookings, function (booking, key) {
                        console.log("booking is ", key, booking);
                        var obj = booking.event;
//                        debugger;
                        var marker = [{
                                data: booking,
                                title: obj.event_name,
                                type: "booking",
                                start: $scope.changeDateFormat(obj.event_start_date),
                                end: $scope.changeDateFormat(obj.event_end_date),
                                color: '#FF735A',
                                textColor: "#fff"
                            }];
                        console.info("Bookings", marker[0].start, marker[0].end);

                        // Rendering bookings
                        if (type !== undefined && type == "update") {
                            $scope.updateCalendar(marker);
                        } else {
                            $scope.addCalendar(marker);
                        }
                    });
                } else {
                    $scope.myBookings = [];
                }
                console.log("GetMyBookings", $scope.myBookings);
            });
        };
        $scope.getTeamsByFilter = function (type, obj) {
            var data = {};
            data.vendor_id = window.localStorage.vendorid;
            if (obj != undefined && obj.team_id != undefined)
                data.team_id = obj.team_id;

            if (obj != undefined && obj.user_id != undefined)
                data.user_id = obj.user_id;

            request.service('vendorCalendarEvents', 'post', data, function (response) {
                console.info("vendorCalendarEvents", response);
                if (response.status == "1") {
                    $scope.bookedEvents = [];
                } else {
                    $scope.bookedEvents = response;
                }
                $scope.calendarEvt = [];
                angular.forEach($scope.bookedEvents, function (event, i) {
                    var obj = {};
                    obj.data = event;
                    obj.title = event.event_name;
                    obj.type = "teamMember";
                    obj.start = event.booking_start_date;
                    obj.end = event.booking_end_date;
                    obj.color = '#FF735A';
                    obj.textColor = "#fff";

                    console.info("Team Assignment", obj.start, obj.end);
                    var dataObj = [];
                    $scope.calendarEvt.push(obj);
                    dataObj.push(obj);

                    // Rendering bookings
                    if (type !== undefined && type == "update") {
                        $scope.updateCalendar(dataObj);
                    } else {
                        $scope.addCalendar(dataObj);
                    }
//                    $scope.updateCalendar(dataObj);
                });
            });
        }
        $scope.getWorkingHours = function (type) {
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            request.service('vendorGetBusinessTimes', 'post', data, function (response) {
                if (response.status == '1') {
                    $scope.workingHoursList = [];
                } else {
                    $scope.workingHoursList = response;
                }
                console.log("getWorkingHours", $scope.workingHoursList);
                $scope.workingHourObj = [];
                angular.forEach($scope.workingHoursList, function (event, key) {
                    var obj = event;
                    var marker = [{
                            title: "Event Title",
                            start: obj.start_time,
                            end: obj.end_time,
                            dow: [3]
                        }];
                    $scope.workingHourObj.push(marker[0]);

                    if ((key + 1) == $scope.workingHoursList.length) {

                        $scope.calendarSel.fullCalendar({
                            defaultDate: moment(),
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            },
                            defaultView: 'month'
                        });
                        $scope.calendarSel.fullCalendar('addEventSource', $scope.workingHourObj);

                        console.info("Working Hours", $scope.workingHourObj);
//                        $scope.renderWorkingHoursCalender($scope.workingHourObj);
//                        $scope.updateCalendar($scope.workingHourObj);
                    }
                });
            });
        };
        // End Service Calls
        $scope.renderWorkingHoursCalender = function (data) {
            $scope.renderCalender();
            $scope.calendarSel.fullCalendar('addEventSource', data);
        };

        $scope.showEventDetails = function (event) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/fullCalendar/modalView_eventDetails.html',
                controller: function ($scope, $uibModalInstance, request, Arevea_Constant, $state, $stateParams, $window, $timeout, $http) {
                    $scope.eventDetails = event;

                    console.log("Events Details ", $scope.eventDetails);
                    $scope.isAssing = true;
                    var data = $scope.eventDetails.event_summary_data;
                    $scope.eventDetails.event_summary_data = (typeof (data) == 'string') ? JSON.parse(data) : data;
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    }
                    $scope.reAssign = function () {
                        $scope.isAssing = false;
                        $scope.selectedUsers = [];
                        $scope.deletedUsers = [];

                        if (window.localStorage.getItem('adminDetails'))
                            $scope.currUser = JSON.parse(window.localStorage.getItem('adminDetails'));
//                        debugger;
                        var obj = {
                            "category_id": $scope.eventDetails.category_id,
                            "location_id": $scope.eventDetails.location_id,
                            "vendor_id": $scope.eventDetails.vendor_id,
                            "start_date": $scope.eventDetails.booking_start_date,
                            "end_date": $scope.eventDetails.booking_end_date
                        }
                        var data = {
                            "teamId": $scope.eventDetails.team_id,
                            "start_date": $scope.eventDetails.event_start_date,
                            "end_date": $scope.eventDetails.event_end_date
                        };
//                        debugger;
                        request.service('getAvailableUsersByTeamID', 'post', data, function (res) {
                            $scope.availableTeams = res.result;
                        });
                    }
                    $scope.reAssignTeamMember = function () {
                        console.log("RE Assign Member", $scope.eventDetails);
//                        debugger;
                        var data = {
                            "booking_id": $scope.eventDetails.booking_id,
                            "booking_product_id": $scope.eventDetails.booking_product_id,
                            "event_id": $scope.eventDetails.event_id,
                            "userId": $scope.currUser.userId,
                            "teamId": $scope.eventDetails.team_id,
                            "assignment_start_date": $scope.eventDetails.event_start_date,
                            "assignment_end_date": $scope.eventDetails.event_end_date,
                            "users": $scope.selectedUsers,
                            "deleteUsers": $scope.deletedUsers,
                            "category_id": $scope.eventDetails.category_id
                        };

                        request.service('assignUsersToBooking', 'post', data, function (res) {
                            console.log("Res Assign Users to Booking", res);
                            $uibModalInstance.close(res);
                        });
                    }
                    $scope.userSelectionChange = function (data) {
                        console.log("User Selection changed", data);
                        if (data.selection) {
                            $scope.selectedUsers.push(data.id);
                            if (data.vbid) {
                                $scope.deletedUsers.splice($scope.deletedUsers.indexOf(data.vbid), 1);
                            }
                        } else {
                            $scope.selectedUsers.splice($scope.selectedUsers.indexOf(data.id), 1);
                            if (data.vbid) {
                                $scope.deletedUsers.push(data.vbid);
                            }
                        }
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $scope.notification(data.message);
            }, function () {

            });
        }
        $scope.showBookings = function (event) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                scope: $scope,
                templateUrl: 'templates/fullCalendar/modalView_eventBookings.html',
                controller: function ($scope, $uibModalInstance, request, Arevea_Constant, $state, $stateParams, $window, $timeout, $http) {
                    $scope.bookings = event;

                    $scope.bookings.event.event_start_date = new Date($scope.bookings.event.event_start_date);
                    $scope.bookings.event.event_end_date = new Date($scope.bookings.event.event_end_date);

                    angular.forEach($scope.bookings.products, function (n, i) {
                        if (typeof n.event_summary_data == "string") {
                            n.event_summary_data = JSON.parse(n.event_summary_data);
                        }
                    });

                    $scope.getDecodedValue = function (str) {
                        return unescape(str);
                    };
                    $scope.formatPricing = function (price) {
                        return parseFloat(price).toFixed(2);
                    };

                    console.log("Events Details ", $scope.bookings);
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $scope.notification(data.message);
            }, function () {

            });
        }
        $scope.showUnAvailableTimeSlots = function (event) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/fullCalendar/modalView_UnAvailableTimeSlots.html',
                controller: function ($scope, $uibModalInstance, request, Arevea_Constant, $state, $stateParams, $window, $timeout, $http) {
                    $scope.data = event;

                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDate = new Date($scope.data.homeFromDate);
                    var secondDate = new Date($scope.data.homeToDate);
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    $scope.data.dayDiff = diffDays;
                    $scope.data.homeFromDate = firstDate;
                    $scope.data.homeToDate = secondDate;


                    console.log("Events Details ", $scope.bookings);
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    }
                }
            });

            modalInstance.result.then(function (data) {
                $scope.notification(data.message);
            }, function () {

            });
        }
        $scope.teams_show = "";
        $scope.team_filter = false;
        $scope.filterTeams = function (data) {
//            debugger;
            console.info("Filter Team ", data);

            if (data == undefined) {
                $scope.teams_show = "";
                $scope.team_filter = false;
                $scope.clearCalendar();
                $scope.getTeamsByFilter("update", filterObj);
                return;
            }
            $scope.teams_show = data.team_name;
            $scope.team_filter = false;

            var filterObj = {};
            filterObj.team_id = data.id;
            filterObj.type = 'teams';
            $scope.clearCalendar();
            $scope.getTeamsByFilter("update", filterObj);
        }
        $scope.teamMember_show = "";
        $scope.teamMember_filter = false;
        $scope.filterTeamMembers = function (data) {
//            debugger;
            console.info("Filter Team ", data);

            if (data == undefined) {
                $scope.teamMember_show = "";
                $scope.teamMember_filter = false;
                $scope.clearCalendar();
                $scope.getTeamsByFilter("update", filterObj);
                return;
            }
            $scope.teamMember_show = data.full_name;
            $scope.teamMember_filter = false;

            var filterObj = {};
            filterObj.user_id = data.id;
            filterObj.type = 'teamMember';
            $scope.clearCalendar();
            $scope.getTeamsByFilter("update", filterObj);
        }
        $scope.categoriesList = [
            {id: 1, name: "Assignments", link: "assignments", show: true},
            {id: 2, name: "Bookings", link: "bookings", show: true},
            {id: 3, name: "Unavailability", link: "unAvailability", show: true},
//            {id: 4, name: "Working Hours", link: "workingHours", show: false}
        ];
        $scope.category_show = "Bookings";
        $scope.category_filter = false;
        $scope.calendarData = $scope.categoriesList[1];
        $scope.filterCategories = function (data) {
            console.info("category ", data);
            // toggling team and team member filters
            if (data != undefined && data.link == 'assignments') {
                $scope.showTeamFilters = true;
            } else {
                $scope.showTeamFilters = false;
            }

            if (data == undefined) {
                $scope.category_show = "";
                $scope.category_filter = true;
                return;
            }
            $scope.category_filter = false;
            $scope.category_show = data.name;

            $scope.selectedFilter = data;

            // based on the option trigger relevent method
            $scope.renderCalendarData(data);
        }

        $scope.renderCalendarData = function (view) {
            // prepare calendar data
            var type = "update";
            if (view == undefined) {
                type = "update";
//                type = "render";
                view = $scope.categoriesList[1];
            }
            console.info("\n\n\nFilter typeis liek---------------\n", type, "\n\n\n");
            console.info("Calender to prepare is", view);

            $scope.clearCalendar();
            switch (view.id) {
                case 1:
                    // Assignmetns view
                    $scope.getTeamsByFilter(type);
                    break;
                case 2:
                    // Bookings view
                    $scope.getBookings(type);
                    break;
                case 3:
                    // UnAvailable Timeslots
                    $scope.getUnAvailableTimeSlots(type);
                    break;
                case 4:
                    // Working Hours
                    $scope.getWorkingHours(type);
                    break;
                default:
                // Bookings
            }

            // render data with method $scope.addCalendar();
//            $scope.addCalendar();
        }

        $scope.clearCalendar = function () {
//            debugger;
            var allEvents = $scope.calendarSel.fullCalendar('clientEvents');
            console.log("All Cleared", allEvents);
            angular.forEach(allEvents, function (n, i) {
                $scope.calendarSel.fullCalendar('removeEvents', n._id);
            });
        };
        $scope.addCalendar = function (data) {
            if (data === undefined)
                data = ($scope.calendarEvt != undefined && $scope.calendarEvt.length > 0) ? $scope.calendarEvt : [];
            if (data.length > 0) {
                angular.forEach(data, function (n, i) {
                    $scope.calendarSel.fullCalendar('renderEvents', n);
                });
            } else {
                console.log("no data to show");
            }
        };

        // Handeling click for filter other than filter element
        angular.element('body').click(function (e) {
            var target = $(e.target);
            if (target.parents('.filterContainer').length) {
//                targeting other elements 
            } else {
                $scope.team_filter = false;
                $scope.teamMember_filter = false;
                $scope.category_filter = false;
                $scope.$apply();
            }
        });
    }

})(window.angular);