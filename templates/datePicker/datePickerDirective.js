//rangePicker;

(function () {
    var app = angular.module('arevea');
    /*
     * Range Picker Span Directive
     */
    app.directive('rangePickerSpan', rangePickerSpan);
    function rangePickerSpan() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {ngModel: '=', options: "="},
            controller: datePickerControllerSpan,
            templateUrl: "./templates/datePicker/datePickerDirectiveView_Span.html"
        }
    }
    datePickerControllerSpan.$inject = ['$scope', '$timeout'];
    function datePickerControllerSpan($scope, $timeout) {
        console.log("Got INto Directive", $scope);
        $scope.showSpace = false;
        $scope.showEle = {
            sd: true, st: true, ed: true, et: true
        };
        $scope.ngModel = {startDate: '', startTime: '', endDate: '', endTime: ''};
        $scope.options.dateFormat = ($scope.options.dateFormat == undefined)
                ? 'dd-MM-yyyy'
                : $scope.options.dateFormat;
        if ($scope.options.dateType == 'day')
            $scope.showEle.ed = false;
        if ($scope.options.time == false) {
            $scope.showEle.st = false;
            $scope.showEle.et = false;
        }
        if (!$scope.options.time && $scope.options.dateType == 'day') {
            $scope.showSpace = true;
        }
        $scope.selArr = [
            'dt_startDate',
            'dt_startTime',
            'dt_endDate',
            'dt_endTime',
            'dt_innerContainer',
            'space'
        ];
        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $scope.addMinutes = function (minutes) {
            if (minutes !== undefined) {
                var val = minutes.split(':');
                var addMin = parseFloat(val[1]) + 30;
                var hrs = parseInt(val[0]);
                if (addMin >= 60) {
                    hrs = hrs + 1;
                    addMin = 0;
                }
                hrs = hrs > 9 ? "" + hrs : "0" + hrs;
                var min = addMin > 9 ? "" + addMin : "0" + addMin;
                return hrs + ":" + min;
            }
        }
        $scope.checkState = function (key) {
            var checkState;
            if (key === undefined && key === '') {
                checkState = false;
            } else {
                checkState = true;
            }
            return checkState;
        }

        // HANDLED CLICK HERE
        angular.element('.dt_Holder').on('click', function (e) {
//            console.log("Clicked Element", e.target.id, $(e.target));
            $scope.clickHandleEvent(e.target.id);
        });
        $scope.clickHandleEvent = function (id) {
            var selState = $scope.selArr.indexOf(id);
            console.log("Clcicked Elemet", id, selState);
            if (selState === 0 || selState === 4) {
                $('.' + $scope.selArr[0]).focus();
            }
        }

        $scope.handleChange = function (data, key) {
            console.log("HandelingChages", data, key);
        }

        $scope.startDateFn = function () {
            var item = $scope.selArr[0];
            var opts = {
                minDate: new Date(),
//                defaultDate: new Date('june 23'),
                onOpen: function () {
                    $scope.startDateOpen = true;
                },
                onClose: function () {
                    console.log("Date Picker Start Closed");
//                    $('.' + $scope.selArr[1]).timepicker('show');
                    $scope.startDateOpen = false;
                    $scope.startTimeFn();
                }
            };
            $('.' + item).flatpickr(opts);
        }
        $scope.startTimeFn = function () {
            $('.' + $scope.selArr[1]).timepicker({
                timeFormat: 'H:i'
            });
            $timeout(function () {
                if (!$scope.startDateOpen) {
                    $('.' + $scope.selArr[1]).focus();
                }
            }, 100);
            $('.' + $scope.selArr[1]).on('showTimepicker', function () {
                $scope.startTimeOpen = true;
            })
            $('.' + $scope.selArr[1]).on('hideTimepicker', function () {
                $scope.startTimeOpen = false;
//                debugger;
                if ($scope.options.dateType === 'range') {
                    $scope.endDateFn();
                } else {
                    $scope.endTimeFn();
                }
            });
        }
        $scope.endDateFn = function () {
            var item = $scope.selArr[2];
            var opts = {
//                minDate: new Date($scope.ngModel.startDate),
                defaultDate: new Date($scope.ngModel.startDate),
                onOpen: function () {
                    $scope.endDateOpen = true;
                    $('.' + $scope.selArr[2]).focus();
                    console.log("Date Picker End Opened");
                },
                onClose: function () {
                    $scope.endDateOpen = false;
                    $scope.endTimeFn();
                    console.log("Date Picker End Closed");

                }
            };
            if (!$scope.startTimeOpen) {
                $('.' + item).flatpickr(opts);
            }
        }
        $scope.endTimeFn = function () {
            $('.' + $scope.selArr[3]).timepicker({
                timeFormat: 'H:i'
            });
            $timeout(function () {
                if ($scope.options.dateType === 'range') {
                    if (!$scope.endDateOpen) {
                        $('.' + $scope.selArr[3]).focus();
                    }
                } else {
                    if (!$scope.startTimeOpen) {
                        $('.' + $scope.selArr[3]).focus();
                    }
                }
            }, 100);
        }

        angular.forEach($scope.showEle, function (n, i) {
            if (n) {
                if (i === 'sd') {
                    $scope.startDateFn();
                } else if (i === 'st') {
//                    $scope.startTimeFn();
                } else if (i === 'ed') {
                    console.log("end Date is ready");
                    $scope.endDateFn();
                } else if (i === 'et') {
//                    $scope.endTimeFn();
                }
            }
        });



    }

    /*
     * Range Picker Directive
     */
    app.directive('rangePicker', rangePicker);
    function rangePicker() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {ngModel: '=', options: "="},
            controller: datePickerController,
            templateUrl: "./templates/datePicker/datePickerDirectiveView.html"
        }
    }
    datePickerController.$inject = ['$scope', '$timeout'];
    function datePickerController($scope, $timeout) {
        // Const Variables
        var s = "#customDatePickerStart",
                e = "#customDatePickerEnd",
                st = "#customTimePickerStart",
                et = "#customTimePickerEnd",
                res = "#outPutEle";
        $scope.vis = {s: true, e: false, st: false, et: false, res: false, process: false};
        $scope.arrVis = ['s', 'st', 'e', 'et'];
//                console.log(" Scope in Directive ------- ", $scope);
        if ($scope.vis.process) {
            $(document).on('click', function (e) {
                console.log("eeeeee", e.target.id);
                var hitEle = e.target.id;
                if (hitEle != "customDatePickerStart" || hitEle != "customDatePickerEnd" || hitEle != "customTimePickerStart" || hitEle != "customTimePickerEnd" || hitEle != "outPutEle") {
                    delete $scope.ngModel.output;
                }
            });
        }

        $scope.setDatePicker = function (sel, opts) {
            $(sel).flatpickr(opts);
        }
        $scope.setTimePicker = function (sel, opts) {
            $(sel).timepicker(opts);
        }
        $scope.showDate = function (sel) {
            $timeout(function () {
                $(sel).flatpickr().open();
            }, 1000);
        }
        $scope.showTime = function (sel) {
            $timeout(function () {
                $(sel).timepicker('show');
            }, 1000);
        }
        // enabling pluging for fields
        $scope.setDatePicker(s, {});
        $scope.setTimePicker(st, {'timeFormat': 'H:i'});
        $scope.setDatePicker(e, {});
        $scope.setTimePicker(et, {'timeFormat': 'H:i'});
        $(st).on('changeTime', function () {
            $(et).timepicker({
                'timeFormat': 'H:i',
                'minTime': $(st).val(),
                'maxTime': '23:30',
            });
        });
        $(et).on('changeTime', function () {
            $(st).timepicker({
                'timeFormat': 'H:i',
                'maxTime': $(et).val(),
            });
        });
        $scope.startDateProcess = function () {
//                    $scope.ngModel = {};
            angular.forEach($scope.vis, function (n, i) {
                n = false;
            });
            $scope.vis.s = true;
            $scope.vis.res = false;
            $scope.showDate(s);
        }
        $scope.next = function (cur, nxt) {
            console.log("Testing Next", $scope.vis[$scope.arrVis[0]])
        }


        $scope.updateFields = function (data, target) {
            $scope.vis.process = true;
            if (target == 's') {
                if ($scope.options.calendar == 'day') {
                    // go to start time and fill end date 
                    $scope.ngModel.endDate = data.startDate;
                    $scope.vis.s = false;
                    $scope.vis.st = true;
                    $scope.showTime(st);
                } else if ($scope.options.calendar == 'day') {
                    $scope.ngModel.endDate = data.endDate;
                    $scope.ngModel.startDate = data.startDate;
                    $scope.vis.s = false;
                    $scope.vis.st = true;
                    $scope.showTime(st);
                }
            } else if (target == 'st') {
                if ($scope.options.calendar == 'day') {
                    // go to start time and fill end date 
                    $scope.ngModel.endDate = data.startDate;
                    $scope.vis.st = false;
                    $scope.vis.et = true;
                    $scope.showTime(et);
                }
            } else if (target == 'e') {

            } else if (target == 'et') {
                if ($scope.options.calendar == 'day') {
                    // go to start time and fill end date 
                    $scope.ngModel.endDate = data.startDate;
                    $scope.vis.et = false;
                    $scope.vis.res = true;
                }
            } else if (target == 'res') {
                if ($scope.options.calendar == 'day') {
                    // go to start time and fill end date 
                    $scope.ngModel.endDate = data.startDate;
                    $scope.vis.et = false;
                    $scope.vis.res = true;
                    $scope.vis.process = false;
                }
            }
//            $scope.$watch($scope.ngModel, function (n, o) {
//                console.log("Watch Fired", n, o);
//            });
            data.startDate = (data.startDate == undefined) ? "" : data.startDate;
            data.startTime = (data.startTime == undefined) ? "" : data.startTime;
            data.endDate = (data.endDate == undefined) ? "" : data.endDate;
            data.endTime = (data.endTime == undefined) ? "" : data.endTime;
            $scope.ngModel.output = data.startDate + " " + data.startTime + " - " + data.endDate + " " + " " + data.endTime;
            console.log("Final Date Object is", $scope.ngModel);
        }
    }
}());