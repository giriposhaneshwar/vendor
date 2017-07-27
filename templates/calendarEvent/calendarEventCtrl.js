(function (angular) {
    'use strict';
    angular
            .module('arevea')
            .controller('calendarEventCtrl', calendarEventController)
            .controller('confirmationDeleteController', confirmationDeleteController);
    calendarEventController.$inject = [
        '$scope',
        'request',
        '$state',
        '$stateParams',
        '$uibModal',
        '$log',
        '$timeout',
        'commonService'
    ];
    confirmationDeleteController.$inject = [
        '$scope',
        '$uibModalInstance'
    ];


    function calendarEventController(
            $scope,
            request,
            $state,
            $stateParams,
            $uibModal,
            $log,
            $timeout,
            commonService) {
        console.log($state)
        $scope.calendarEvent = {
            category: '',
            location: '',
            product: '',
            scheduledEvent: [
                {
                    fromDate: '',
                    toDate: '',
                    fromDateErrorMsg: '',
                    toDateErrorMsg: ''
                }
            ],
            eventName: '',
            eventDescription: ''
        };
        /*console.log("$state:",$state,"    ",$state.current.name)*/
        $("#page-container").scroll(function () {
            if ($state.current.name == "calendar.addcalendarEvent") {
                $(".xdsoft_datetimepicker").hide();
            }
        });
        $scope.add_status = '0';
        var data = {
            'vendor_id': window.localStorage.vendorid
        };
        request.service('vendorCategories', 'post', data, function (response) {
            $scope.calendarEventCategory = response;
            console.log("vendorCategories Request", response);
            request.service('vendorGetLocations', 'post', data, function (response1) {
                $scope.calendarEventLocation = response1;
                console.log("vendorGetLocations Request", response1);
                request.service('vendorGetCalendarEvent', 'post', data, function (response2) {

                    $scope.getCalEvent = response2;
                    $scope.currentPage = 1;
                    $scope.entryLimit = "10";
                    $scope.maxSize = 5;
                    console.log("vendorGetCalendarEvent Request", response2);
                    angular.forEach($scope.getCalEvent, function (val, i) {
                        /*
                         Checking if the from date and to date is single day envet or multiple day event
                         */
                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        var firstDate = new Date(val.homeFromDate);
                        var secondDate = new Date(val.homeToDate);
                        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                        val.dayDiff = diffDays;
                        val.homeFromDate = firstDate;
                        val.homeToDate = secondDate;
//                        console.log("Difference in Days", firstDate, secondDate, diffDays);
                    });



//                    debugger;
                    if (typeof $stateParams.id !== 'undefined') {
                        angular.forEach($scope.getCalEvent, function (val, key) {
//                            debugger;

                            if (val.id == $stateParams.id) {
                                angular.forEach($scope.calendarEventCategory, function (v, k) {
//                                    debugger;
                                    if (v.id == val.category_id) {
                                        angular.forEach($scope.calendarEventLocation, function (v1, k1) {
//                                            debugger;
                                            if (v1.location_name == val.location_name) {
                                                $scope.loader(false);
                                                $scope.calendarEvent.category = v;
                                                $scope.calendarEvent.location = v1;
                                                $scope.calendarEvent.eventName = val.event_name;
                                                $scope.calendarEvent.eventDescription = val.event_description;
                                                $scope.calendarEvent.scheduledEvent = [];
//                                                debugger;
                                                $scope.calendarEvent.scheduledEvent.push({
                                                    fromDate: val.homeFromDate,
                                                    toDate: val.homeToDate
                                                });
                                                if (val.product_id == null) {
                                                    $scope.calendarEvent.product = val.product_id;
                                                    $scope.calendarProduct = true;
                                                } else {
                                                    $scope.getProductDetails();
                                                }
                                                console.log("Scope chage in arr", JSON.stringify($scope.calendarEvent.scheduledEvent));
                                                commonService.safeApply($scope);
                                            }
                                        });

                                    }
                                });

                            }
                        });
                    }
                });
            });
        });

        $scope.$watch('calendarEvent.scheduledEvent', function (n, o) {
//            debugger;
            console.log("scope change\n New\n", JSON.stringify(n), "\n Old\n", JSON.stringify(o));
            commonService.safeApply($scope);
        });
        $scope.getProductDetails = function () {
            var product = {
                vendor_id: window.localStorage.vendorid,
                category_id: $scope.calendarEvent.category.category_id,
                location_id: $scope.calendarEvent.location.id
            };
            if ($scope.calendarEvent.category !== '' && $scope.calendarEvent.location !== '') {
                request.service('getProductsByCatLocVend', 'post', product, function (response) {
                    if (response.status == 0) {
                        $scope.calendarEventProducts = response.products;
                        if ($state.current.name == 'calendar.updatecalendarEvent') {
                            angular.forEach($scope.getCalEvent, function (val, key) {
                                if (val.id == $stateParams.id) {
                                    angular.forEach($scope.calendarEventProducts, function (v, k) {
                                        if (val.product_id == v.id) {
                                            $scope.calendarEvent.product = v.id;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        };
        $scope.showMultipleProduts = true;
        $scope.getProductItem = function (product) {
            angular.forEach(product, function (val, key) {
                if (val == 'all') {
                    $scope.loading = true;
                    $scope.showMultipleProduts = false;
                    $scope.calendarEvent.product = 'all';
                    $timeout(function () {
                        $scope.loading = false;
                    }, 300);
                }
            });
        };
        $scope.getProductItemList = function (product) {
            $scope.loading = true;
            var arr = [];
            arr.push(product);
            $scope.showMultipleProduts = true;
            $scope.calendarEvent.product = arr;
            $timeout(function () {
                $scope.loading = false;
            }, 300);
        };
        $scope.add = function () {
            $scope.calendarEvent.scheduledEvent.push({
                fromDate: '',
                toDate: '',
                fromDateErrorMsg: '',
                toDateErrorMsg: ''
            });
        };
        $scope.delete = function (index) {
            $scope.calendarEvent.scheduledEvent.splice(index, 1);
        };



        $('.startFromTime').timepicker({'step': 15});
        $('.endToTime').timepicker({'step': 15});

        $scope.dateOptsStart = {
            dateFormat: 'm-d-Y H:i',
            enableTime: false,
            time_24hr: true,
            onOpen: function () {
                var fp = this;
                var ele = this.element;
                var key = $(ele).attr('data-eleindex');
                if ($scope.calendarEvent.scheduledEvent[key].fromDate == "") {
                    fp.setDate(new Date(), true);
                    fp.config.minDate = new Date();
                } else {
//                    fp.setDate($scope.calendarEvent.scheduledEvent[key].fromDate, true);
                    fp.set('defaultDate', $scope.calendarEvent.scheduledEvent[key].fromDate);
                    fp.minDate = $scope.calendarEvent.scheduledEvent[key].fromDate;
                }
            },
            onClose: function () {
                var ele = this.element;
                var fp = this;
                var key = $(ele).attr('data-eleindex');
                if ($scope.calendarEvent.scheduledEvent[key].fromDate !== "") {
                    $('.startFromTime').timepicker({'step': 15, 'timeFormat': 'H:i'});
                    $('.startFromTime.ele' + key).focus();
                    $('.startFromTime.ele' + key).on('changeTime', function (e) {
                        var cdArr = $scope.calendarEvent.scheduledEvent[key].fromDate.split(' ');
                        cdArr[1] = $('.startFromTime.ele' + key).val();
                        $scope.calendarEvent.scheduledEvent[key].fromDate = cdArr.join(' ');
                        if (key !== '{{$index}}') {
                            if ($state.current.name === 'calendar.addcalendarEvent') {
                                $scope.calendarEvent.scheduledEvent[key].toDate = $scope.calendarEvent.scheduledEvent[key].fromDate
                            }
                        }
                        console.log("time changed", $scope.calendarEvent.scheduledEvent[key], cdArr);
                    });
                }
            },
            onChange: function () {
                var ele = this.element;
                var fp = this;
                $timeout(function () {
                    var key = $(ele).attr('data-eleindex');
                    if (key !== '{{$index}}') {
                        if ($state.current.name === 'calendar.updatecalendarEvent') {

                        } else {
                            $scope.calendarEvent.scheduledEvent[key].toDate = $scope.calendarEvent.scheduledEvent[key].fromDate
                        }
                        if ($scope.calendarEvent.scheduledEvent[key].fromDate != undefined && $scope.calendarEvent.scheduledEvent[key].fromDate != '') {
                        }
                    }
                }, 10);
            }
        }
        $scope.dateOptsEnd = {
            dateFormat: 'm-d-Y H:i',
            enableTime: false,
            time_24hr: true,
            onOpen: function () {
                var fp = this;
                var ele = this.element;
                var key = $(ele).attr('data-eleindex');
//                debugger;
                if ($scope.calendarEvent.scheduledEvent[key].fromDate == "") {
                    fp.setDate(new Date(), true);
                    fp.config.minDate = new Date();
                } else {
                    fp.config.minDate = $scope.calendarEvent.scheduledEvent[key].fromDate;
                    if ($scope.calendarEvent.scheduledEvent[key].toDate != undefined && $scope.calendarEvent.scheduledEvent[key].toDate != "") {

                    } else {
                        $scope.calendarEvent.scheduledEvent[key].toDate = $scope.calendarEvent.scheduledEvent[key].fromDate;
                        fp.setDate($scope.calendarEvent.scheduledEvent[key].fromDate, true);
                    }
                }
            },
            onClose: function () {
//                debugger;
                var fp = this;
                var ele = this.element;
                var key = $(ele).attr('data-eleindex');
                if ($scope.calendarEvent.scheduledEvent[key].toDate == "") {
                    $scope.calendarEvent.scheduledEvent[key].toDate = $scope.calendarEvent.scheduledEvent[key].fromDate;
                }
                var eTime = $scope.calendarEvent.scheduledEvent[key].toDate.split(' ');
                $('.endToTime').timepicker({
                    'step': 15,
                    'timeFormat': 'H:i',
                    'minTime': eTime[1],
                    'maxTime': '23:45'
                });
                $('.endToTime.ele' + key).focus();
                $('.endToTime.ele' + key).on('changeTime', function (e) {
                    var cdArr = $scope.calendarEvent.scheduledEvent[key].toDate.split(' ');
                    cdArr[1] = $('.endToTime.ele' + key).val();
                    $scope.calendarEvent.scheduledEvent[key].toDate = cdArr.join(' ');

                    console.log("time changed", $scope.calendarEvent.scheduledEvent[key], cdArr);
                });
            },
            onChange: function () {
                console.log("Start Time Chagned", this);

            }
        }

        $scope.getEventStart = function (fp, key, t) {
            if ($scope.calendarEvent.scheduledEvent[key].fromDate == "") {
                fp.setDate(new Date(), true);
                fp.config.minDate = new Date();
            } else {
                fp.setDate($scope.calendarEvent.scheduledEvent[key].fromDate, true);
                fp.config.minDate = $scope.calendarEvent.scheduledEvent[key].fromDate;
            }
        }
        $scope.getEventEnd = function (fp, key, t) {
            if ($scope.calendarEvent.scheduledEvent[key].toDate == "") {
                fp.setDate(new Date(), true);
                fp.config.minDate = new Date();
            } else {
                fp.setDate($scope.calendarEvent.scheduledEvent[key].toDate, true);
                fp.config.minDate = $scope.calendarEvent.scheduledEvent[key].toDate;
            }
        }
        $scope.isResponse = false;

        $scope.saveCalendarEvent = function () {
            data = {
                user_id: window.localStorage.userId,
                vendor: window.localStorage.vendorid,
                category: $scope.calendarEvent.category.category_id,
                location: $scope.calendarEvent.location.id,
                scheduledEvent: $scope.calendarEvent.scheduledEvent,
                eventName: $scope.calendarEvent.eventName,
                eventDescription: $scope.calendarEvent.eventDescription
            };
            if ($scope.calendarEvent.product == 'all') {
                data.product = [];
            } else {
                data.product = $scope.calendarEvent.product;
            }
            angular.forEach($scope.calendarEvent.scheduledEvent, function (val, key) {
                console.log(val);
            })
            if (data.category == undefined) {
                $('#selectCategoryMsg').show();
                $scope.categoryErrorMsg = "Please select a category";
            } else if (data.location == undefined) {
                $('#selectLocationMsg').show();
                $scope.LocationErrorMsg = "Please select a location";
            } else if (data.eventName == "") {
                $('#EventNameMsg').show();
                $scope.NameErrorMsg = "Please enter event name";
            } else if (data.eventDescription == "") {
                $('#EventDescriptionMsg').show();
                $scope.DescriptionErrorMsg = "Please enter event description";
            } else {
                var flag = false;
                for (var i = 0; i < data.scheduledEvent.length; i++) {
                    if (!data.scheduledEvent[i].fromDate) {
                        $('#EventFromDateMsg').show();
                        $scope.calendarEvent.scheduledEvent[i].fromDateErrorMsg = "Please select event start date & time";
                        flag = true;
                    } else if (!data.scheduledEvent[i].toDate) {
                        $('#EventToDateMsg').show();
                        $scope.calendarEvent.scheduledEvent[i].toDateErrorMsg = "Please select event end date & time";
                        flag = true;
                    }
                }
            }
            if (flag == false) {
                $scope.isResponse = true;
                request.service('vendorAddCalendarEventProdNdLoc', 'post', data, function (response) {
                    $scope.isResponse = false;
                    if (response.status == 0) {
                        $scope.calEvent = response;
                        $scope.notification(response.message);
                        $state.go('calendar.calendarEventList');
                    }
                });
            }
        };
        $scope.updateCalendarEvent = function () {
            console.log($scope.calendarEvent);
            var data = {
                "pkid": $stateParams.id,
                "vendor": window.localStorage.vendorid,
                "category": $scope.calendarEvent.category.category_id,
                "location": $scope.calendarEvent.location.id,
                "product": $scope.calendarEvent.product,
                "fromDate": $scope.calendarEvent.scheduledEvent[0].fromDate,
                "toDate": $scope.calendarEvent.scheduledEvent[0].toDate,
                "eventName": $scope.calendarEvent.eventName,
                "eventDescription": $scope.calendarEvent.eventDescription
            };
            console.log(data);
            request.service('vendorUpdateCalendarEventProdNdLoc', 'post', data, function (response) {
                console.log(response)
                if (response.status == 0) {
                    $scope.notification(response.message);
                    $state.go('calendar.calendarEventList');
                } else {
                    $scope.notification(response.message, "danger");
                }
            });
        }
        $scope.editCalendarEvent = function (event) {
            console.log(event);
            $state.go('calendar.updatecalendarEvent', {id: event.id});
        };




        $scope.end_time = function (calAvl) {
            console.log(calAvl);
            var data = {
                vendor: window.localStorage.vendorid,
                category: calAvl.category.category_id,
                location: calAvl.location.id,
                pkid: $stateParams.id
            };
            angular.forEach(calAvl.scheduledEvent, function (val, key) {
                data.fromDate = val.fromDate;
                data.toDate = val.toDate

            });

            if (typeof $stateParams.id !== 'undefined') {
                if (calAvl.product != null) {
                    data.product = calAvl.product;
                } else {
                    data.product = [];
                }
            } else {
                if (calAvl.product != "") {
                    data.product = calAvl.product;
                } else {
                    data.product = [];
                }
            }
            console.log("product1", data)
            request.service('checkVendorCalendar', 'post', data, function (response) {
                console.log("response", response);
                $scope.add_status = response.status;
                if ($scope.add_status == '1') {
                    $scope.notification('Already booked for this day and time');
                }
            });


        }

        $scope.deleteCalendarEvent = function (event) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmationDelete.html',
                controller: 'confirmationDeleteController',
                size: 'md'
            });
            modalInstance.result.then(function (response) {
                console.log(response)
                if (response == 'ok') {
                    var data = {};
                    data.id = event.id;
                    request.service('vendorDeleteCalendarEvent', 'post', data, function (response) {
                        console.log(response);
                        if (response.status == 0) {
//                            $scope.notification(response.message);
                            var id = {};
                            id.vendor_id = window.localStorage.vendorid;
                            request.service('vendorGetCalendarEvent', 'post', id, function (response2) {
                                $scope.getCalEvent = response2;
                                $scope.currentPage = 1;
                                $scope.entryLimit = "10";
                                $scope.maxSize = 5;

                                angular.forEach($scope.getCalEvent, function (val, i) {
                                    /*
                                     Checking if the from date and to date is single day envet or multiple day event
                                     */
//                        var stDate = moment(val.homeFromDate);
//                        var etDate = moment(val.homeToDate);
//                        var diff = etDate.moment(stDate, 'days');

                                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                                    var firstDate = new Date(val.homeFromDate);
                                    var secondDate = new Date(val.homeToDate);
                                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                                    val.dayDiff = diffDays;
                                    val.homeFromDate = firstDate;
                                    val.homeToDate = secondDate;
//                        console.log("Difference in Days", firstDate, secondDate, diffDays);
                                });
                            });
                        }
                    });
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
    function confirmationDeleteController(
            $scope,
            $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(window.angular);
//var app = angular.module('arevea');
//app.controller('calendarEventCtrl', function ($scope, $uibModal, request, ctrlComm, $filter, fileUpload, $interval, $http, $location, $state, $compile) {
//    $scope.verifyVendorStatus();
//    $scope.calEvent = {};
//    $scope.page = {};
//    $scope.err = {};
//
//    $scope.getCalEvent = {}
//    var getcalendarEventDetail = function () {
//        $scope.loader(true);
//        request.service('vendorGetCalendarEvent', 'post', {'vendor_id': $scope.admin.vendorid}, function (res) {
//            $scope.loader(false);
//            console.log("getcal", res)
//            $scope.getCalEvent = res;
//            /*    for(var i=0;i<res.length;i++)
//             {
//             console.log("resss",res[i]);
//             $scope.fromdatetime=res[i].homeFromDate;
//             console.log("dateeeeeee",$scope.fromdatetime);
//             var date1=$scope.fromdatetime;
//             console.log("date1 before",date1)
//             var date11 = $filter('date')(new Date(date1), "MM-dd-yyyy hh:mm");
//             console.log("date1 after",date11)
//             $scope.homeFromDate=date11;
//             }*/
//
//            $scope.currentPage = 1;
//            $scope.entryLimit = "10";
//            $scope.maxSize = 5;
//        });
//    }
//    if ($location.path() == '/calendar/calendarEventList') {
//        getcalendarEventDetail();
//    } else if ($location.path() == "/calendar/addcalendarEvent") {
////        getVenderLocation()
//        $scope.page.type = 'post'
//    } else if ($location.path() == "/calendar/updatecalendarEvent") {
////        getVenderLocation()
//        getcalendarEventDetail();
//        $scope.page.type = 'put';
//        prePoppulateValues(ctrlComm.get('userObj1'));
//    }
//    var editCalendarEvent = function (obj) {
//
//        /* var homeFromDate=obj.homeFromDate;
//         console.log("homeFromDate of edit",homeFromDate)
//         var date11 = $filter('date')(new Date(homeFromDate), "MM-dd-yyyy HH:mm");
//         obj.homeFromDate=date11;
//         var homeToDate=obj.homeToDate;
//         console.log("homeFromDate of edit",homeFromDate)
//         var date12 = $filter('date')(new Date(homeToDate), "MM-dd-yyyy HH:mm");
//         obj.homeToDate=date12;
//         */
//
//
//        ctrlComm.put('userObj1', obj);
//        console.log("@@@@@@@@", obj)
//        $location.path("/calendar/updatecalendarEvent");
//    }
//
//
//    $('#homeFromDate').datetimepicker({
//        minDate: '0',
//        format: 'm-d-Y H:i',
//        onClose: function (selectedDate) {
//
//            // Set the minDate of 'to' as the selectedDate of 'from'
//            $("#homeToDate").datetimepicker("option", "minDate", selectedDate);
//            // $("#homeToDate").focus();
//        }
//    });
//    $('#homeToDate').datetimepicker({
//        format: 'm-d-Y H:i',
//        onShow: function (ct) {
//
//            var startDate = jQuery('#homeFromDate').val();
//
//            //Interchanging month and date for javascript date format
//
//            startDate = startDate.split("-").join("/");
//            var startDateFormatted = new Date(startDate);
//            var startDateDay = startDateFormatted.getDate();
//            var startDateMonth = startDateFormatted.getMonth();
//            var startDateYear = startDateFormatted.getFullYear();
//            var startDateHour = startDateFormatted.getHours();
//            var startDateMinute = startDateFormatted.getMinutes();
//
//
//            var newFormattedStartDate = startDateYear + "/" + (startDateMonth + 1) + "/" + startDateDay + " " + startDateHour + ":" + startDateMinute;
//
//            this.setOptions({
//                minDate: new Date(newFormattedStartDate) ? new Date(newFormattedStartDate) : false
//            })
//        },
//    });
//    $scope.fromDateChanged = function (fromdate) {
//        if (fromdate == "" || fromdate == undefined) {
//            $scope.homeToDate = "";
//        }
//    };
//    $scope.enddate1 = function (res) {
//
//        var start_time = $('#homeFromDate').val();
//        var end_timee = $('#homeToDate').val();
//        console.log("start_time", start_time)
//        console.log("end_time", end_timee)
//
//
//        var a = start_time.split(/[^0-9]/);
//        console.log("aa", a[2], a[0], a[1], a[3], a[4])
//        var start_time = new Date(a[2], a[0] - 1, a[1], a[3], a[4]);
//        var b = end_timee.split(/[^0-9]/);
//
//        var end_time = new Date(b[2], b[0] - 1, b[1], b[3], b[4]);
//
//
//
//        /*   start_time=start_time.replace(/-/g," ");
//         var end_time=end_timee.replace(/-/g," ");*/
//        console.log("start_time1", start_time)
//        console.log("end_time1", end_time)
//        var time1 = new Date(start_time).getTime();
//        var time2 = new Date(end_time).getTime();
//        console.log("time1 before", time1)
//        console.log("time2 before", time2)
//        if (parseInt(time1) < parseInt(time2)) {
//            console.log("time1", time1)
//            console.log("time2", time2)
//            delete $scope.err.end_time_wrong;
//            $scope.calEvent.homeToDate = end_timee;
//        } else if (parseInt(time1) == parseInt(time2))
//        {
//
//            $scope.err.end_time_wrong = true;
//        } else {
//            $scope.calEvent.homeToDate = '';
//            $scope.err.end_time_wrong = true;
//            //$scope.notification("End Time should be greater than Start Time");
//        }
//    }
//    function prePoppulateValues(obj) {
//        if (obj) {
//            $scope.calEvent = obj;
//            $scope.calEvent.location_id = obj.location_id
//            $scope.booking_start_date = $filter('date')($scope.booking_start_date, "MM-dd-yyyy");
//            $scope.booking_end_date = $filter('date')($scope.booking_end_date, "MM-dd-yyyy");
//        } else {
//            $location.path("/calendar/calendarEventList");
//        }
//    }
//    if ($location.path() == "/calendar/updatecalendarEvent") {
//        prePoppulateValues(ctrlComm.get('userObj1'));
//    }
//    $scope.saveCalendarEvent = function (calEvent) {
//
//        $scope.calEvent.homeFromDate = $("#homeFromDate").val();
//        $scope.calEvent.homeToDate = $("#homeToDate").val();
//        /*  $scope.calEvent.booking_start_time_display = $('#time1').val();
//         $scope.calEvent.booking_end_time_display = $('#time2').val();*/
//        validateCalendarEvent(function () {
//            calEvent.vendor_id = $scope.admin.vendorid
//            calEvent.user_id = $scope.admin.userId
//            calEvent.booking_type = 'other'
//            /*calEvent.booking_start_date = calEvent.booking_start_date_display + ' ' + calEvent.booking_start_time_display;
//             calEvent.booking_end_date = calEvent.booking_end_date_display + ' ' + calEvent.booking_end_time_display;*/
//            request.service('vendorAddCalendarEvent', 'post', calEvent, function (response) {
//                if (response.status == 0) {
//                    console.log("response issss", response)
//                    $scope.calEvent = response;
//                    console.log("*********", $scope.calEvent)
//                    $scope.notification('Vendor Event added successfully');
//                    $state.go('calendar.calendarEventList')
//                } else {
//                    $scope.notification(response.message, "danger")
//                }
//            })
//        })
//    }
//    $scope.updateCalendarEvent = function (calEvent) {
//
//        $scope.calEvent.homeFromDate = $("#homeFromDate").val();
//        $scope.calEvent.homeToDate = $("#homeToDate").val();
//
//
//        validateCalendarEvent(function () {
//
//            calEvent.vendor_id = $scope.admin.vendorid
//            calEvent.user_id = $scope.admin.userId
//            calEvent.booking_type = 'other'
//            var params = {};
//            params = angular.copy(calEvent);
//            request.service('vendorUpdateCalendarEvent', 'post', params, function (response) {
//                if (status == 0) {
//                    $scope.notification('Vendor Event updated successfully');
//                    $state.go('calendar.calendarEventList');
//                } else {
//                    $scope.notification(response.message, "danger")
//                }
//            })
//        })
//    }
//    var deleteCalendarEvent = function (calEvent) {
//        var req = {};
//        var params = {};
//        params.id = calEvent.id;
//        console.log('params....', params)
//        req.params = params;
//        request.service('vendorDeleteCalendarEvent', 'post', params, function (response) {
//            $scope.loader(false);
//            if (typeof response == 'string') {
//                response = JSON.parse(response)
//            }
//            if (response.status == '0') {
//                getcalendarEventDetail(function () {
//                    $scope.notification("Vendor Event deleted successfully");
//                    $state.go('calendar.calendarEventList');
//                })
//            }
//        })
//    }
//
//    var deleteAvailableTimeConfirm = function (calEvent) {
//        var data = {
//            text: 'Are you sure you want to delete',
//            name: 'event'
//
//        }
//        $scope.askConfrimation(data, function () {
//
//            deleteCalendarEvent(calEvent);
//        });
//    }
//
//
//    $scope.cancel = function () {
//        $state.go('calendar.calendarEventList')
//    }
//
//    var validateCalendarEvent = function (cb) {
//
//        if (!$scope.calendarEvent.fromDate) {
//            $scope.err.booking_start_date_display = true;
//        } else {
//            delete $scope.err.booking_start_date_display;
//        }
//
//        if (!$scope.calendarEvent.toDate) {
//            $scope.err.booking_end_time_display = true;
//            delete $scope.err.end_time_wrong;
//        } else {
//            delete $scope.err.booking_end_time_display;
//        }
//
//        if (!$scope.calendarEvent.location) {
//            $scope.err.location_id = true;
//        } else {
//            delete $scope.err.location_id;
//        }
//        if ($scope.calEvent.homeToDate)
//        {
//            $scope.enddate1();
//        }
//        if (Object.keys($scope.err).length == 0) {
//            if (cb)
//                cb();
//
//        }
//    }
//    $scope.editCalendarEvent = editCalendarEvent;
//    $scope.deleteAvailableTimeConfirm = deleteAvailableTimeConfirm;
//});