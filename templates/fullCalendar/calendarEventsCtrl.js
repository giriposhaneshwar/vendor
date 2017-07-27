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
        '$timeout'
    ];
    function businessTimeController(
            $scope,
            request,
            Arevea_Constant,
            $state,
            $stateParams,
            $window,
            $timeout) {


        $scope.msg = "at Controller";
        $scope.events = {};

        $scope.init = function () {
            $scope.initCalendar("#fullCalendar");
            $scope.getWorkingList();
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
                    // Display the modal.
                    // You could fill in the start and end fields based on the parameters

//                    $('#fullCalendarModal').modal('show');

                },
                eventClick: function (event, element) {
                    // Display the modal and set the values to the event values.
//                    $('#fullCalendarModal').modal('show');
//                    $('#fullCalendarModal').find('#title').val(event.title);
//                    $('#fullCalendarModal').find('#starts-at').val(event.start);
//                    $('#fullCalendarModal').find('#ends-at').val(event.end);

                },
                editable: true,
                eventLimit: true, // allow "more" link when too many events
            });
        }

        $scope.getWorkingList = function () {
//            vendorGetBusinessTimes
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            $scope.events = [];
            request.service('vendorGetBusinessTimes', 'post', data, function (response) {
                console.log("Getting Vendor Working Hours List", response);
                angular.forEach(response, function (n, i) {
                    angular.forEach(Arevea_Constant.week_days, function (a, b) {
                        if (n.week_number == a.id) {
                            n.weekName = a.name;
                            $scope.findDaysUsingWeekInMonth(n);
                        }
                    });
//                    console.log("response is ", i, n);
                });


                request.service('vendorGetCalendarEvent', 'post', data, function (response2) {
                    console.log("VendorGetCalendarEvent", response2);
//                    var obj = [];
                    angular.forEach(response2, function (n, i) {
                        var obj = {
                            data: n,
                            id: n.id,
                            title: n.event_name,
                            start: $scope.changeDateFormat(n.booking_start_date),
                            end: $scope.changeDateFormat(n.booking_end_date),
                            color: '#ccc'
                        };
                        $('#fullCalendar').fullCalendar('renderEvent', obj, true);
                        $scope.events.push(obj);
                    });
                    console.log("Object Formation after is ", $scope.events);
//                    $scope.events = obj;
                });
            });

        }

        $scope.findDaysUsingWeekInMonth = function (data) {
            console.log("Finding Day ", data);
            var monday = moment().startOf('month').day("Monday");
            var st = data.start_time.split(":");
            var et = data.end_time.split(":");




//            console.log("Monday at beginning", monday);
            var month = monday.month();
            var ele = [];
            for (var i = 0; i < month; i++) {
                var obj = {};
                obj.startTime = monday.add(st[0], 'hours').add(st[1], 'minute');
                obj.endTime = monday.add('hours', et[0]);
                obj.endTime = monday.add('minutes', et[1]);

                ele.push(monday.toString());
                //document.body.innerHTML += "<p>"+monday.toString()+"</p>";
                monday = monday.weekday(8);
            }

            console.log("find Days using week in month is", ele);
        }

        $scope.changeDateFormat = function (data) {
            return data;
        }

    }

})(window.angular);