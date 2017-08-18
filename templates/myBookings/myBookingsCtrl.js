var app = angular.module('arevea');
app.controller('myBookingsCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $http, $window,
        $state, NgMap, $stateParams, commonService, $uibModal) {
    console.log("in myBookings ctrl", $stateParams);
//    $('#myBookingsDateRange').daterangepicker({
//        'autoApply': true,
//    });
    $('#myBookingsDateRange').flatpickr({
        mode: "range",
        enableTime: false,
        onClose: function () {
            $scope.showFilterDate = false;
            $scope.start_date = $('#myBookingsDateRange').val();
            if ($scope.start_date != undefined && $scope.start_date != "") {
                $scope.showEvtDate = true;
                $scope.datesClear = true;
            } else {
                $scope.showEvtDate = false;
            }
            $scope.filterMyBookings();
        },
        onOpen: function () {
            $scope.showFilterDate = false;
            $scope.showEvtDate = false;
        }
    });
    $scope.clearDatePicker = function () {
//        debugger;
        $('#myBookingsDateRange').flatpickr({
            mode: "range",
            enableTime: false,
            clear: true,
            onReady: function () {
                $scope.showFilterDate = false;
                $scope.showEvtDate = false;
                $scope.datesClear = false;
                $scope.start_date = undefined;
                $scope.end_date = undefined;
                $scope.myBookingsDateRange = '';
                $scope.renderDateRange = '';
                $scope.filterMyBookings();
            },
            onClose: function () {
                $scope.showFilterDate = false;
                $scope.start_date = $('#myBookingsDateRange').val();
                if ($scope.start_date != undefined && $scope.start_date != "") {
                    $scope.showEvtDate = true;
                    $scope.datesClear = true;
                } else {
                    $scope.showEvtDate = false;
                }
                $scope.filterMyBookings();
            },
            onOpen: function () {
                $scope.showFilterDate = false;
                $scope.showEvtDate = false;
            }
        });


    }

//    $scope.dateFlag = false;
//    $scope.typeFlag = false;
    /*$(document).on("click", "#page-container", function(){*/
    $('body').on("click", function (e) {
        //alert(1)
        if ($(".evtDate1").hasClass("open")) {
            $scope.showFilterDate = false;
            commonService.safeApply($scope);
            if ($scope.myBookingsDateRange != null && $scope.myBookingsDateRange != "") {
                $scope.showEvtDate = true;

                $scope.filterMyBookings();
                commonService.safeApply($scope);
            }
        }

        if ($(".evtType1").hasClass("open")) {
            $scope.showFilterType = false;
            commonService.safeApply($scope);
            if ($scope.eventType != null && $scope.eventType != "" && $scope.eventType != '0' && $scope.eventType != undefined) {
                $scope.showEvtType = true;
                commonService.safeApply($scope);
            }
            if ($(e.target).hasClass('dropInput')) {
                $scope.showFilterType = true;
                commonService.safeApply($scope);
            }
        }
    });
    $('body').on("click", ".flatpickr-day", function () {
        $scope.filterMyBookings();
    });
    $scope.init = function () {
//        $(".my-booking-product-details").removeClass("show-element");
        $scope.vendorId = window.localStorage.vendorid;
//        $stateParams.bookingStatus = ($location.path()).split('/')[($location.path()).split('/').length - 1];
        $stateParams.bookingStatus = $state.current.name;
//        alert($stateParams.bookingStatus);
        if ($stateParams.bookingStatus == "myBookings.all") {
            $scope.eventStatus = '0';
        } else if ($stateParams.bookingStatus == "myBookings.scheduled") {
            $scope.eventStatus = '1';
        } else if ($stateParams.bookingStatus == "myBookings.completed") {
            $scope.eventStatus = '2';
        }

        $rootScope.args = {
            'vendor_id': $scope.vendorId,
            "status": $scope.eventStatus,
        };
        $scope.getMyBookings($rootScope.args);

        $scope.event_names = [];
        $scope.eventTypeObj = {};
        request
                .service(
                        'eventsList',
                        'get',
                        {},
                        function (response) {
                            console.log("eventsList response:", response)
                            $scope.eventsList = response;
                            for (i = 0; i < response.length; i++) {
                                $scope.event_names
                                        .push(response[i].event_type);
                                $scope.eventTypeObj[response[i].event_type] = response[i].id;

                            }
                            //$("#eventType").hide();
                            $("#eventType").autocomplete({
                                source: $scope.event_names,
                                appendTo: '.eventTypeHolder',
                                select: function (event, ui) {
                                    $scope.eventType = ui.item.label;
                                    $scope.$apply();
                                }
                            });
                        });

        var displayId = "";
        $scope.$on('bookingProdId', function (event, data) {
            console.log("bookingProdId", data); // 'Some data'
            displayId = data;

        });
        $("#" + displayId).find(".hideshowproducts .showproducts").html('Hide Products');
        $("#" + displayId).find(".my-booking-product-details").toggleClass("show-element");

//        $scope.dateFlag = angular.element("#menu1").attr("aria-expanded");
//        $scope.typeFlag = angular.element("#menu2").attr("aria-expanded");
        console.log("Flags", $scope.dateFlag, ",", $scope.typeFlag);
    };

    $scope.formatPricing = function (price) {
        return parseFloat(price).toFixed(2);
    };

    $scope.gotoBookingConfirmation = function (bookingId) {
        ///Customer/#/bookingConfirmation?bookid=52
        $scope.siteUrl = request.setup.protocol + "://"
                + request.setup.host;
        $scope.BookingUrl = $scope.siteUrl + request.setup.customer_portal + '/#/bookingConfirmation?bookid=' + bookingId;
        window.open($scope.BookingUrl, '_blank');
    };

    $scope.getMyBookings = function (args) {
        request.service('myBookings', 'post', args, function (response) {

            if (response.status == 0) {
                $scope.myBookings = response.events;
                console.log("Bookings are", $scope.myBookings);
                for (var i = 0; i < $scope.myBookings.length; i++) {
                    $scope.myBookings[i].booking_total_price = $scope.myBookings[i].event.booking_total_price.toFixed(2);
                    $scope.myBookings[i].event.eventStartDate = $scope.formatDBDate($scope.myBookings[i].event.event_start_date);
                    $scope.myBookings[i].event.eventEndDate = $scope.formatDBDate($scope.myBookings[i].event.event_end_date);
                    $scope.myBookings[i].event.formattedFromDate = $scope.formatDate($scope.myBookings[i].event.eventStartDate);
                    $scope.myBookings[i].event.formattedToDate = $scope.formatDate($scope.myBookings[i].event.eventEndDate);
                    $scope.myBookings[i].event.fromTime = $scope.getHoursMinutes($scope.myBookings[i].event.eventStartDate);
                    $scope.myBookings[i].event.toTime = $scope.getHoursMinutes($scope.myBookings[i].event.eventEndDate);
                    $scope.myBookings[i].event.formattedFromTime = $scope.formatTime($scope.myBookings[i].event.fromTime);
                    $scope.myBookings[i].event.formattedToTime = $scope.formatTime($scope.myBookings[i].event.toTime);

                    $scope.myBookings[i].products;

                    var startDate = moment($scope.myBookings[i].event.eventStartDate);
                    var endDate = moment($scope.myBookings[i].event.event_end_date);
                    var dayDiff = moment.duration(endDate.diff(startDate));
                    $scope.diffDays = dayDiff.asDays();
                    $scope.myBookings[i].event.daysDiff = $scope.diffDays;
                    $scope.myBookings[i].event.stDate = new Date($scope.myBookings[i].event.eventStartDate);
                    $scope.myBookings[i].event.edDate = new Date($scope.myBookings[i].event.eventEndDate);

                    $scope.myBookings[i].totalSumUnit = 0;
                    if($scope.myBookings[i].products){
                        for (var j = 0; j < $scope.myBookings[i].products.length; j++) {
                            $scope.myBookings[i].totalSumUnit = $scope.myBookings[i].totalSumUnit + (parseFloat($scope.myBookings[i].products[j].delivery_cost) + parseFloat($scope.myBookings[i].products[j].total_price));
                            $scope.myBookings[i].products[j].event_summary_data = JSON.parse($scope.myBookings[i].products[j].event_summary_data);
                            //console.log($scope.myBookings[i].products[j].event_summary_data)
                        }
                    }

                    // for (var j = 0; j < $scope.myBookings[i].products.length; j++) {
                    //     $scope.myBookings[i].products[j].event_summary_data = JSON.parse($scope.myBookings[i].products[j].event_summary_data);
                    // //console.log($scope.myBookings[i].products[j].event_summary_data)
                    // }

                }
            } else if (response.status == 1) {
                $scope.myBookings = [];
            }

        });

    };

    $scope.assingTeamMembers = function(product){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/myBookings/assign.html',
            controller: 'assign_controller',
            resolve:{
                items: function(){
                    return product;
                }
            }
        });
        modalInstance.result.then(function(data){
            $scope.notification(data.message);
            console.log("CLOSE.................");
        },function(){
            console.log("DISMISS....................");
        });
    }

    $scope.getDecodedValue = function (str) {
        return unescape(str);
    };

    $scope.getWeekDay = function (day) {
        var weekday = [];
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[day];
    };

    $scope.getMonthName = function (monthNumber) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[monthNumber];
    };

    $scope.formatDate = function (date) {
        var onlyDate = date.split(" ")[0];
        var onlyTime = date.split(" ")[1];
        var onlyDateArray = onlyDate.split("-");
        /*
         * var temp = onlyDateArray[1]; onlyDateArray[1] = onlyDateArray[0];
         * onlyDateArray[0] = onlyDateArray[2]; onlyDateArray[2] =
         * onlyDateArray[1];
         */
        date = onlyDateArray[2] + "-" + onlyDateArray[0] + "-"
                + onlyDateArray[1] + " " + onlyTime;

        var dateJs = new Date(date);
        // alert(dateJs);

        var weekDay = $scope.getWeekDay(dateJs.getDay());
        var dateh = dateJs.getDate();
        var month = $scope.getMonthName(dateJs.getMonth());
        var year = dateJs.getFullYear();
        // console.log("date+++++++++", date, month, year);
        return weekDay + ", " + dateh + " " + month + " " + year;
    };

    $scope.formatTime = function (time) {
        var timeArray = time.split(":");
        var hour = timeArray[0];
        var minute = timeArray[1];
        var ap = "AM";
        if (hour > 11) {
            ap = "PM";
        }
        if (hour > 12) {
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }

        if (hour < 10) {
            hour = "0" + hour;
        }

        if (minute < 10) {
            minute = "0" + minute;
        }

        return hour + ':' + minute + " " + ap;
    };

    $scope.getHoursMinutes = function (date) {
        var onlyDate = date.split(" ")[0];
        var onlyTime = date.split(" ")[1];
        var onlyDateArray = onlyDate.split("-");
        /*
         * var temp = onlyDateArray[1]; onlyDateArray[1] = onlyDateArray[0];
         * onlyDateArray[0] = onlyDateArray[2]; onlyDateArray[2] =
         * onlyDateArray[1];
         */
        date = onlyDateArray[2] + "-" + onlyDateArray[0] + "-"
                + onlyDateArray[1] + " " + onlyTime;
        var dateJs = new Date(date);
        var hours = dateJs.getHours();
        var minutes = dateJs.getMinutes();
        return hours + ":" + minutes;
    };

    $scope.formatDBDate = function (date) {

        var onlyDate = date.split(" ")[0];// 11-06-2016
        var onlyTime = date.split(" ")[1];// 13:00
        var onlyDateArray = onlyDate.split("-");// 11,06,2016
        date = onlyDateArray[2] + "-" + onlyDateArray[0] + "-"
                + onlyDateArray[1] + " " + onlyTime;
        var dateJs = new Date(date);
        var hours = $scope.addZero(dateJs.getHours());
        var minutes = $scope.addZero(dateJs.getMinutes());
        var dateh = $scope.addZero(dateJs.getDate());
        var month = $scope.addZero(dateJs.getMonth() + 1);
        var year = $scope.addZero(dateJs.getFullYear());

        return month + "-" + dateh + "-" + year + " " + hours + ":"
                + minutes;
    };
    $scope.addZero = function (value) {
        return value = value < 10 ? "0" + value : value;
    };

    $scope.$watch('dateFlag', function (n, o) {
        // do something here
        /*$scope.n = n;
         $scope.o= o;
         $scope.count += 1;*/
        if (n == true) {
            $scope.showEvtDate = true;
            $scope.dateRange = $("#myBookingsDateRange").val();
            alert("dateFlag" + $scope.dateFlag)
        }
    }, true);
    $scope.$watch('typeFlag', function (n, o) {
        // do something here
        /*$scope.n = n;
         $scope.o= o;
         $scope.count += 1;*/
        if (n == true) {
            $scope.showEvtType = true;
            $scope.eventStatus = $("#eventStatus").val();
            alert("dateFlag" + $scope.typeFlag)
        }
    }, true);

    $scope.filterMyBookings = function () {
        $scope.dateFlag = angular.element("#menu1").attr("aria-expanded");
        $scope.typeFlag = angular.element("#menu2").attr("aria-expanded");
        console.log("Flags", $scope.dateFlag, ",", $scope.typeFlag);


        $scope.myBookings = [];
        $scope.eventType = $("#eventType").val();
        $scope.event_type_id = $scope.eventTypeObj[$scope.eventType];
        $scope.eventStatus = $("#eventStatus").val();
//        $scope.dateRange = $("#myBookingsDateRange").val();
        $scope.dateRange = $scope.myBookingsDateRange;
        console.log("eventType::::::::::", $scope.eventStatus, "/n   $scope.myBookingsDateRange::::::::::::", $scope.dateRange);
        var datesArray = [];
//        debugger;
        if ($scope.dateRange) {
            $scope.renderDateRange = $scope.dateRange;
            var datesArray = $scope.dateRange.split(" to ");
            $scope.start_date = datesArray[0];
            $scope.end_date = datesArray[1];
            if ($scope.start_date !== undefined && $scope.end_date !== undefined) {
                var startDate = new Date($scope.start_date);
                var endDate = new Date($scope.end_date);
                var stMonth = startDate.getMonth();
                var etMonth = endDate.getMonth();

                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct", "Nov", "Dec"];
//                debugger;
                var stDay = (startDate.getDate() > 9) ? startDate.getDate() : "0" + startDate.getDate();
                var etDay = (endDate.getDate() > 9) ? endDate.getDate() : "0" + endDate.getDate();
                if (stMonth == etMonth) {
                    // same month
//                    console.log("Diff Date", stMonth, etMonth);
                    $scope.renderDateRange = stDay + " - " + etDay + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear();
                } else {
                    // diff month
                    $scope.renderDateRange = stDay + " " + monthNames[startDate.getMonth()] + " " + startDate.getFullYear() + " - " + etDay + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear();
//                    console.log("Diff Date", stMonth, etMonth);
                }
                $scope.datesClear = true;
            }
        }
        if (!$scope.event_type_id) {
            $scope.event_type_id = "";
        }
//        debugger;
        $rootScope.args = {
            'vendor_id': $scope.vendorId,
            "status": $scope.eventStatus,
            "event_type": $scope.event_type_id,
            "start_date": undefined,
            "end_date": undefined,
        };
        if ($scope.datesClear) {
            $rootScope.args.start_date = $scope.start_date;
            $rootScope.args.end_date = ($scope.end_date == undefined) ? $scope.start_date : $scope.end_date;
        }
        console.log($rootScope.args);
        $scope.getMyBookings($rootScope.args);

        var evtType = angular.element(".dropFilter").is(':visible');
        var evtDate = angular.element(".dropFilter").is(':visible');
        if (evtType == false && $scope.eventStatus != null && $scope.eventStatus != "") {
            $scope.showEvtType = true;
        }
        if (evtDate == false && $scope.eventStatus != null && $scope.eventStatus != "") {
            $scope.showEvtDate = true;
        }

    };
    $scope.scrollPosToElement = function () {
        $scope.currentItem = ($state.params.id != undefined) ? $state.params.id : "";

        if ($state.params.id !== "" || undefined) {
            console.log("$state.params.id", typeof $state.params.id, $state.params.id);

            $timeout(function () {
//            alert($('#' + $state.params.id).position().top);
                $('.mainContainer').clearQueue();
                $('.mainContainer').stop();
                if ($state.params.id != null || $state.params.id != "" || $state.params.id != undefined) {
                    $scope.scrollToEle = "page-container";
                } else {
                    $scope.scrollToEle = $state.params.id;
                }
                $('.mainContainer').animate({scrollTop: $('#' + $scope.scrollToEle).position().top + 100}, 500);
            }, 100);
        } else {
            $('.mainContainer').clearQueue();
            $('.mainContainer').stop();
            $('.mainContainer').animate({scrollTop: 0}, 500);
        }
    }
    $scope.viewBookingProduct = function (data) {
//        console.log("bookingDATa", data.event.event_id, $state);
        if ($state.current.name === 'myBookings.all') {
            $state.go('myBookings.all', {id: data.event.event_id});
        } else if ($state.current.name === 'myBookings.scheduled') {
            $state.go('myBookings.scheduled', {id: data.event.event_id});
        } else if ($state.current.name === 'myBookings.completed') {
            $state.go('myBookings.completed', {id: data.event.event_id});
        }
    }
    $scope.hideBookingProduct = function (data) {
        if ($state.current.name == 'myBookings.all') {
            $state.go('myBookings.all', {id: ""});
        } else if ($state.current.name == 'myBookings.scheduled') {
            $state.go('myBookings.scheduled', {id: ""});
        } else if ($state.current.name == 'myBookings.completed') {
            $state.go('myBookings.completed', {id: ""});
        }
//        $state.go('myBookings.all', {id: ""});
    }
    $scope.stateParamsId = $state.params.id;

    $scope.$watch('$state.params.id', function (n, o) {
        console.log("$state.params.id Watch", JSON.stringify(n), JSON.stringify(o));
        $scope.scrollPosToElement();
    })
    $scope.$watch('$state.current.url', function (n, o) {
        $scope.init();
    })

    $scope.filterBookingsType = function (eventStatus) {
        $scope.myBookings = [];
        $scope.eventType = $("#eventType").val();
        $scope.event_type_id = $scope.eventTypeObj[$scope.eventType];
        $scope.dateRange = $("#myBookingsDateRange").val();
        var datesArray = [];
        if ($scope.dateRange) {
            var datesArray = $scope.dateRange.split(" - ");
            $scope.start_date = datesArray[0];
            $scope.end_date = datesArray[1];
        } else {
            $scope.start_date = "";
            $scope.end_date = "";
        }
        if (!$scope.event_type_id) {
            $scope.event_type_id = "";
        }
        $scope.eventStatus = eventStatus;
        $rootScope.args = {
            'vendor_id': $scope.vendorId,
            "status": $scope.eventStatus,
            "event_type": $scope.event_type_id,
            "start_date": $scope.start_date,
            "end_date": $scope.end_date,
        };
        console.log($rootScope.args);
        $scope.getMyBookings($rootScope.args);
    };

});