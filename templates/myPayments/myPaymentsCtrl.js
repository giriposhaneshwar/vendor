var app = angular.module('arevea');
app.controller('myPaymentsCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $http, $window,
        $state, NgMap, $stateParams, commonService) {

    $scope.entryLimit = 10;
    var pageNo = ctrlComm.get('currentPage');
    $scope.currentPage = pageNo ? pageNo : 1;

    $scope.pageChanged = function (currentPage) {
        ctrlComm.put('currentPage', currentPage);
        // console.log('Page changed to: ' ,currentPage);
    };

    /*
     * Initalizing Controller on on ready state
     */
    $scope.init = function () {
        $scope.paymentCheck = {};
        $scope.getMyPayments();
    };
    /*
     * Checking Booking Number and making service call
     */
    $scope.checkBookingNumber = function () {
        if ($scope.paymentCheck != undefined && $scope.paymentCheck != "") {
            $scope.showBookingId = true;
            $scope.getMyPayments({booking_number: $scope.paymentCheck.booking_number});
        } else {
            $scope.showBookingId = false;

        }
        console.info($scope.paymentCheck);
    }

    $scope.checkDateRange = function (obj) {
        var data = {};
        $scope.dateRange = obj.myBookingsDateRange;
        var datesArray = $scope.dateRange.split(" to ");
        data.start_date = datesArray[0];
        data.end_date = datesArray[1];
        $scope.paymentCheck.start_date = data.start_date;
        $scope.paymentCheck.end_date = data.end_date;
        if (data.start_date !== undefined && data.end_date !== undefined) {
            var startDate = new Date(data.start_date);
            var endDate = new Date(data.end_date);
            var stMonth = startDate.getMonth();
            var etMonth = endDate.getMonth();

            var stYear = startDate.getFullYear();
            var etYear = endDate.getFullYear();

            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"];
            var stDay = (startDate.getDate() > 9) ? startDate.getDate() : "0" + startDate.getDate();
            var etDay = (endDate.getDate() > 9) ? endDate.getDate() : "0" + endDate.getDate();
            if (stMonth == etMonth) {
                // same month
                $scope.renderDateRange = stDay + " - " + etDay + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear();
            } else if (stYear == etYear) {
                $scope.renderDateRange = stDay + " " + monthNames[startDate.getMonth()] + " - " + etDay + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear();
            } else {
                // diff month
                $scope.renderDateRange = stDay + " " + monthNames[startDate.getMonth()] + " " + startDate.getFullYear() + " - " + etDay + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear();
            }
            $scope.datesClear = true;
        }

        $scope.getMyPayments(data);
    }

    /*
     * Service Call - Getting My Payment Object
     * Service: vendorPaymentsByEventID
     * Required Object: { vendor_id: "", event_type: "", start_date: "",  end_date: "", booking_number: "" }
     */
    $scope.getMyPayments = function (dta) {
        dta = $scope.paymentCheck;
        $scope.vendorId = window.localStorage.vendorid;
        var obj = {};
        obj.vendor_id = $scope.vendorId;
        obj.event_type = "";
        obj.booking_number = (dta != undefined && dta.booking_number != undefined) ? dta.booking_number : "";
        obj.start_date = (dta != undefined && dta.start_date != undefined) ? dta.start_date : "";
        obj.end_date = (dta != undefined && dta.end_date != undefined) ? dta.end_date : "";
        request.service('vendorPaymentsByEventID', 'post', obj, function (response) {
            if (response.status == '0') {
                $scope.myPayments = response.bookings;
                $scope.bookingNumbers = [];
                angular.forEach($scope.myPayments, function (n, i) {
                    $scope.bookingNumbers.push(n.booking_number);
                    n.event_start_date = new Date(n.event_start_date);
                });
                $("#eventType").autocomplete({
                    source: $scope.bookingNumbers,
                    appendTo: '.eventTypeHolder',
                    select: function (event, ui) {
                        console.log("Selected one is", ui);
                        $scope.paymentCheck.booking_number = ui.item.label;
                        $scope.checkBookingNumber();
                        $scope.$apply();
                    }
                });
            } else {
                $scope.myPayments = [];
            }
        });
    }
    $scope.flatPickerInit = function (obj) {
        obj = (obj == undefined) ? {} : obj;
        obj.mode = "range";
        obj.enableTime = false;
        obj.onClose = function () {
            $scope.showFilterDate = false;
            $scope.start_date = $('#myBookingsDateRange').val();
            if ($scope.start_date != undefined && $scope.start_date != "") {
                $scope.showEvtDate = true;
                $scope.datesClear = true;
            } else {
                $scope.showEvtDate = false;
            }
            $scope.checkDateRange($scope.paymentCheck);
        };
        obj.onOpen = function () {
            $scope.showFilterDate = false;
            $scope.showEvtDate = false;
        };

        $('#myBookingsDateRange').flatpickr(obj);
    }
    $scope.flatPickerInit();

    $scope.clearDatePicker = function (key) {
        if (key == 'date') {
            var obj = {};
            obj.clear = true;
            $scope.flatPickerInit(obj);
            $scope.paymentCheck.myBookingsDateRange = "";
            $scope.paymentCheck.start_date = "";
            $scope.paymentCheck.end_date = "";
            $scope.showEvtDate = false;
        }

        if (key == 'bookingId') {
            $scope.paymentCheck.booking_number = "";
            $scope.showBookingId = false;
        }
        $scope.getMyPayments($scope.paymentCheck);
    };
});