(function (angular) {
    'use strict';
    angular
            .module('arevea')
            .controller('BusinessTimeController', businessTimeController);
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
        console.log($state)
        $scope.calendar = {
            category: '',
            location: '',
            product: '',
            scheduled: [
                {
                    weekDay: '',
                    startTime: '',
                    endTime: '',
                    WeekDayErrorMsg: '',
                    startTimeErrorMsg: '',
                    endTimeErrorMsg: ''
                }
            ]
        };
        $scope.timePickerOptions = {
            step: 20,
            timeFormat: 'g:ia',
            appendTo: 'body'
        };

        $scope.weekdays = Arevea_Constant.week_days;
        var data = {
            'vendor_id': window.localStorage.vendorid
        };
        request.service('vendorCategories', 'post', data, function (response) {
            $scope.vendorCategory = response;
            request.service('vendorGetLocations', 'post', data, function (response1) {
                $scope.vendorLocation = response1;
                if (typeof $stateParams.id !== 'undefined') {
                    request.service('vendorGetBusinessTimes', 'post', data, function (response2) {
                        angular.forEach(response2, function (val, key) {
                            if (val.id == $stateParams.id) {
                                $scope.vendorBusinessData = val;
                                angular.forEach($scope.vendorCategory, function (v1, k1) {
                                    if (v1.category_id == val.category_id) {
                                        angular.forEach($scope.vendorLocation, function (v2, k2) {
                                            if (v2.id == val.location_id) {
                                                angular.forEach(Arevea_Constant.week_days, function (v3, k3) {
                                                    if (v3.id == val.week_number) {
                                                        $scope.calendar.category = v1;
                                                        $scope.calendar.location = v2;
                                                        $scope.calendar.scheduled = [];
                                                        $scope.calendar.scheduled.push(
                                                                {
                                                                    weekDay: v3,
                                                                    startTime: val.start_time,
                                                                    endTime: val.end_time
                                                                }
                                                        );
                                                        if (val.product_id == null) {
                                                            $scope.calendar.product = val.product_id;
                                                            $scope.hideProduct = true;
                                                        } else {
                                                            $scope.getProductDetails();
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });

        $scope.getProductDetails = function () {
            var product = {
                vendor_id: window.localStorage.vendorid,
                category_id: $scope.calendar.category.category_id,
                location_id: $scope.calendar.location.id
            };
            if ($scope.calendar.category !== '' && $scope.calendar.location !== '') {
                request.service('getProductsByCatLocVend', 'post', product, function (response) {
                    if (response.status == 0) {
                        $scope.vendorProducts = response.products;
                        if (typeof $stateParams.id !== 'undefined') {
                            angular.forEach($scope.vendorProducts, function (val, key) {
                                if (val.id == $scope.vendorBusinessData.product_id) {
                                    $scope.calendar.product = val.id;
                                }
                            });
                        }
                    }
                });
            }
        };
        $scope.showStartTime = function (index) {

//            $("body").on("click", "#startTime" + index, function () {
//                $(this).datetimepicker({
//                    datepicker: false,
//                    format: 'H:i',
//                    step: 30,
//                    onSelectTime: function () {
//                        var fromTime = $("#startTime" + index).val();
//                        var res = fromTime.split(":");
//                        var updatedTime = Number(res[0]) + 1;
//                        updatedTime = updatedTime + ":" + res[1];
//                    }
//                });
//                setTimeout(function () {
//                    $("#startTime" + index).datetimepicker('show');
//                }, 50);
//            });

            $('#startTime' + index).timepicker({
                'timeFormat': 'H:i',
                'scrollDefault': 'now'
            });
            $('#startTime' + index).focus();

        };

        $scope.end_time = function (calAvl, index) {
            console.log(calAvl, index);
            var product1 = {};
            product1.category = calAvl.category.category_id;
            product1.vendor = calAvl.category.vendor_id;
            product1.location = calAvl.location.id;
            product1.pkid = $stateParams.id;
            angular.forEach(calAvl.scheduled, function (val, key) {
                product1.scheduled = [{"weekDay": val.weekDay.id, "startTime": val.startTime, "endTime": val.endTime}];
            });

            if (calAvl.product != "" && calAvl.product != null) {
                product1.product = calAvl.product;
            } else {
                product1.product = [];
            }
            request.service('checkVendorBussinessTimes', 'post', product1, function (response) {
                console.log("checkVendorBussinessTimes response", response);
                $scope.add_status = response.status;
                if ($scope.add_status == '1') {
                    $scope.notification('Already booked for this day and time.', 'error');
                }
            });
        };

        $scope.showEndTime = function (index) {
//            $("body").on("click", "#endTime" + index, function () {
//                $(this).datetimepicker({
//                    datepicker: false,
//                    format: 'H:i',
//                    step: 30,
//                    onShow: function () {
//                        var fromTime = $("#startTime" + index).val();
//                        var res = fromTime.split(":");
//                        var updatedTime = Number(res[0]);
//                        updatedTime = updatedTime + ":" + (Number(res[1]) + 30);
//                        this.setOptions({
//                            minTime: updatedTime
//                        });
//
//                    },
//                    onSelectTime: function (e) {
//                        var tm = new Date(e);
//                        var time = tm.getHours() + ":" + tm.getMinutes();
//                        $("#startTime" + index).datetimepicker({maxTime: time})
//                    }
//                });
//                setTimeout(function () {
//                    $("#endTime" + index).datetimepicker('show');
//                }, 50);
//            });
            $('#endTime' + index).timepicker({
                'timeFormat': 'H:i',
                'minTime': $('#startTime' + index).val(),
                'maxTime': '23:30'
            });
            $('#endTime' + index).focus();
            $('#startTime' + index).timepicker({
                'timeFormat': 'H:i',
                'minTime': '00:00',
                'maxTime': $('#endTime' + index).val()
            });
        };
        $scope.clearTime = function (index, type) {
            if (type == 'start') {
                $scope.calendar.scheduled[index].startTime = '';
            } else {
                $scope.calendar.scheduled[index].endTime = '';
            }
        }
        $scope.showMultipleProduts = true;
        $scope.getProductItem = function (product) {
            console.log(product);
            angular.forEach(product, function (val, key) {
                if (val == 'all') {
                    $scope.loading = true;
                    $scope.showMultipleProduts = false;
                    $scope.calendar.product = 'all';
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
            $scope.calendar.product = arr;
            $timeout(function () {
                $scope.loading = false;
            }, 300);
        };
        $scope.add = function () {
            $scope.calendar.scheduled.push({
                weekDay: '',
                startTime: '',
                endTime: '',
                WeekDayErrorMsg: '',
                startTimeErrorMsg: '',
                endTimeErrorMsg: ''
            });
        }
        $scope.delete = function (index) {
            $scope.calendar.scheduled.splice(index, 1);
        }


        $scope.enddate = function () {
            console.log("enddate.<enddate", enddate)
        }

        $scope.isResponse = false;



        $scope.saveCalenderAvailability = function (e) {
            e.preventDefault();
            var data = {
                category: JSON.stringify($scope.calendar.category.category_id),
                location: JSON.stringify($scope.calendar.location.id),
                vendor: window.localStorage.vendorid,
                scheduled: []
            };
            angular.forEach($scope.calendar.scheduled, function (val, key) {
                data.scheduled.push({
                    weekDay: val.weekDay.id,
                    startTime: val.startTime,
                    endTime: val.endTime
                });
            });
            if ($scope.calendar.product == 'all') {
                data.product = [];
            } else {
                data.product = $scope.calendar.product;
            }

            if (data.category == undefined) {
                $('#selectCategoryMsg').show();
                $scope.categoryErrorMsg = "Please select a category";
            } else if (data.location == undefined) {
                $('#selectLocationMsg').show();
                $scope.locationErrorMsg = "Please select a location";
            } else {
                var flag = false;
                var sameInputs = false;
                for (var i = 0; i < data.scheduled.length; i++) {
                    if (!data.scheduled[i].weekDay) {
                        $('#selectWeekDayMsg').show();
                        $scope.calendar.scheduled[i].WeekDayErrorMsg = "Please select a day";
                        flag = true;
                    } else if (!data.scheduled[i].startTime) {
                        $('#selectstartTimeMsg').show();
                        $scope.calendar.scheduled[i].startTimeErrorMsg = "Please select start time";
                        flag = true;
                    } else if (!data.scheduled[i].endTime) {
                        $('#selectendTimeMsg').show();
                        $scope.calendar.scheduled[i].endTimeErrorMsg = "Please select end time";
                        flag = true;
                    } else {
                        if (data.scheduled.length == '1') {
                            flag = false;
                            var sameInputs = false;
                        } else {
                            for (var k = 0; k < data.scheduled.length; k++) {
                                for (var j = 0; j < data.scheduled.length; j++) {
                                    if (k != j) {
                                        if ((data.scheduled[k].weekDay == data.scheduled[j].weekDay)) {
                                            var startTime1 = data.scheduled[k].startTime.split(":")[0];
                                            var startTime2 = data.scheduled[j].startTime.split(":")[0];
                                            var endTime1 = data.scheduled[k].endTime.split(":")[0];
                                            var endTime2 = data.scheduled[j].endTime.split(":")[0];

                                            var st1 = miliseconds(data.scheduled[k].startTime.split(":")[0], data.scheduled[k].startTime.split(":")[1], 0);
                                            var st2 = miliseconds(data.scheduled[j].startTime.split(":")[0], data.scheduled[j].startTime.split(":")[1], 0);
                                            var et1 = miliseconds(data.scheduled[k].endTime.split(":")[0], data.scheduled[k].endTime.split(":")[1], 0);
                                            var et2 = miliseconds(data.scheduled[j].endTime.split(":")[0], data.scheduled[j].endTime.split(":")[1], 0);
                                            if ((st1 > st2 && st1 < et2) || (et1 > st2 && et1 < et2))
                                            {
                                                sameInputs = true;
                                                break;
                                            }
                                            /*if (((startTime2 >= startTime1) && (startTime2 < endTime1)) || ((endTime2 > startTime1) && (endTime2 <= endTime1)))
                                             {
                                             sameInputs = true;
                                             break;
                                             }*/
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (flag == false && sameInputs == false && !$scope.isResponse) {
                $scope.isResponse = true;
                request.service('vendorAddBusinessTimesProdNdLoc', 'post', data, function (response) {
                    console.log(response);
                    $scope.isResponse = false;
                    if (response.status == 0) {
                        $scope.notification('Working hours added successfully');
                        $window.location.href = "#/calendar/available_time_list";
//                        $state.go('calendar.available_time_list');
                    }
                });
            } else if (sameInputs) {
                $scope.notification("Start time and End time values are overlapping.", 'danger', 100000);
            }
        };
        function miliseconds(hrs, min, sec)
        {
            return((hrs * 60 * 60 + min * 60 + sec) * 1000);
        }
        $scope.updateCalenderAvailability = function (e) {
            if (($scope.add_status === undefined || $scope.add_status == '0') && !$scope.isResponse) {
                $scope.isResponse = true;
                e.preventDefault();
                var data = {
                    "pkid": $stateParams.id,
                    "weekDay": $scope.calendar.scheduled[0].weekDay.id,
                    "startTime": $scope.calendar.scheduled[0].startTime,
                    "endTime": $scope.calendar.scheduled[0].endTime,
                    "category": $scope.calendar.category.category_id,
                    "location": $scope.calendar.location.id,
                    "vendor": window.localStorage.vendorid,
                    "product": $scope.calendar.product
                };
                if ((data.category == "") && (data.location == "") && (data.product == "")) {
                    $scope.notification("Please enter all the fields");
                } else {
                    request.service('vendorUpdateBusinessTimesProdNdLoc', 'post', data, function (response) {
                        console.log(response);
                        $scope.isResponse = false;
                        if (response.status == 0) {
                            $scope.notification(response.message);
                            $window.location.href = "#/calendar/available_time_list";
//                                $state.go('calendar.available_time_list');
                        }
                    });
                }
            } else {
                e.preventDefault();
            }
        };
    }

})(window.angular);