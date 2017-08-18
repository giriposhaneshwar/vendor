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
        $scope.events = [];
        $scope.init = function () {
            $scope.getWorkingList();
        };

        $scope.initCalendar = function (sel, defaultEvents) {
            // Any value represanting monthly repeat flag
            var REPEAT_MONTHLY = 1;
            // Any value represanting yearly repeat flag
            var REPEAT_YEARLY = 2;
            $(sel).fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                eventSources: [defaultEvents],
                dayRender: function (date, cell) {
                    // Get all events                        var timeStart = moment(event.start);
                    var events = $('#calendar').fullCalendar('clientEvents').length ? $('#calendar').fullCalendar('clientEvents') : defaultEvents;
                    // Start of a day timestamp
                    var dateTimestamp = date.hour(0).minutes(0);
                    var recurringEvents = new Array();

                    // find all events with monthly repeating flag, having id, repeating at that day few months ago  
                    var monthlyEvents = events.filter(function (event) {
                        return event.repeat === REPEAT_MONTHLY &&
                                event.id &&
                                moment(event.start).hour(0).minutes(0).diff(dateTimestamp, 'months', true) % 1 == 0
                    });

                    // find all events with monthly repeating flag, having id, repeating at that day few years ago  
                    var yearlyEvents = events.filter(function (event) {
                        return event.repeat === REPEAT_YEARLY &&
                                event.id &&
                                moment(event.start).hour(0).minutes(0).diff(dateTimestamp, 'years', true) % 1 == 0
                    });

                    recurringEvents = monthlyEvents.concat(yearlyEvents);

                    $.each(recurringEvents, function (key, event) {

                        // Refething event fields for event rendering 
                        var eventData = {
                            id: event.id,
                            allDay: event.allDay,
                            title: event.title,
                            description: event.description,
                            start: date.hour(timeStart.hour()).minutes(timeStart.minutes()).format("YYYY-MM-DD"),
                            end: event.end ? event.end.format("YYYY-MM-DD") : "",
                            url: event.url,
                            className: 'scheduler_basic_event',
                            repeat: event.repeat
                        };

                        // Removing events to avoid duplication
                        $('#calendar').fullCalendar('removeEvents', function (event) {
                            return eventData.id === event.id &&
                                    moment(event.start).isSame(date, 'day');
                        });
                        // Render event
                        $('#calendar').fullCalendar('renderEvent', eventData, true);

                    });

                }
            });
        }

        $scope.getWorkingList = function () {
//            vendorGetBusinessTimes
            $scope.getUnAvailableTimeSlots();
            $scope.getWorkingHours();
            $timeout(function () {
                console.info("All Events are", $scope.events);
                if ($scope.events.length > 0) {
                    $scope.initCalendar("#fullCalendar", $scope.events);
                }
            }, 100);
        };
        $scope.getUnAvailableTimeSlots = function () {
            var data = {
                'vendor_id': window.localStorage.vendorid
            };
            request.service('vendorGetCalendarEvent', 'post', data, function (response2) {
                console.log("VendorGetCalendarEvent", response2);
                angular.forEach(response2, function (n, i) {
                    var obj = {
                        data: n,
                        id: n.id,
                        title: n.event_name,
                        start: $scope.changeDateFormat(n.booking_start_date),
                        end: $scope.changeDateFormat(n.booking_end_date),
                        color: '#ccc'
                    };
                    $scope.events.push(obj);
//                    $('#fullCalendar').fullCalendar('renderEvent', obj, true);
                });
                request.service('vendorGetBusinessTimes', 'post', data, function (response) {
                    console.log("Getting Vendor Working Hours List", response);
                    var workingHours = [];
                    angular.forEach(response, function (n, i) {
                        var obj = {
                            start: n.start_time,
                            end: n.end_time,
                            title: n.category_name + ", " + n.location_name,
                            color: '#ff735a',
                            dow: [1, 4],
                            ranges: [{//repeating events are only displayed if they are within one of the following ranges.
                                    start: moment().startOf('week'), //next two weeks
                                    end: moment().endOf('week').add(7, 'd'),
                                }, {
                                    start: moment('2017-06-01', 'YYYY-MM-DD'), //all of february
                                    end: moment('2017-06-01', 'YYYY-MM-DD').endOf('month'),
                                }],
                        };
                        $scope.events.push(obj);
//                        $('#fullCalendar').fullCalendar('renderEvent', obj, true);
                    });
                });
                console.log("Object Formation after is ", $scope.events);
//                    $scope.events = obj;
            });
        };
        $scope.getWorkingHours = function () {
            var data = {
                'vendor_id': window.localStorage.vendorid
            }
        }

        $scope.findDaysUsingWeekInMonth = function (data, curMonth) {
//            console.log("Finding Day ", data);
            var monday = moment(curMonth).startOf('month').day(data.weekName);
            var month = monday.month();
            var ele = [];
            for (var i = 0; i <= month; i++) {
                var obj = {};
                var currDate = monday.format();
                if (data.start_time != undefined)
                    obj.start = currDate.replace("00:00:00", data.start_time + ":00");
                if (data.end_time != undefined)
                    obj.end = currDate.replace("00:00:00", data.end_time + ":00");
                monday = monday.weekday(8);
                obj.data = data;
                obj.title = data.category_name + ", " + data.location_name;
                obj.color = '#FF735A';

                ele.push(obj);
                $scope.events.push(obj);
                $('#fullCalendar').fullCalendar('renderEvent', obj, true);
            }
        }

        $scope.changeDateFormat = function (data) {
            return data;
        }

    }

})(window.angular);