var app = angular.module('arevea');
app.controller('businessTimeCtrl', function ($scope, $uibModal, request, ctrlComm, $filter, fileUpload, $interval, $http, $location, $state, $compile, $log) {
    $scope.verifyVendorStatus();
    $scope.calAvl = {};
    $scope.page = {};
    $scope.err = {};
    $scope.week_number = [{name: "Sunday", id: 1}, {name: "Monday", id: 2}, {name: "Tuesday", id: 3}, {name: "Wednesday", id: 4}, {name: "Thursday", id: 5}, {name: "Friday", id: 6}, {name: "Saturday", id: 7}];
// $scope.calAvl.selectedOption = $scope.weekOptions[1];



    var getVenderLocation = function () {
        $scope.loader(true);
        request.service('vendorGetLocations', 'post', {'vendor_id': $scope.admin.vendorid}, function (res) {
            $scope.loader(false);
            $scope.getLocation = res;
        });
    }
    var getBusinessTime = function () {
        $scope.loader(true);
        request.service('vendorGetBusinessTimes', 'post', {'vendor_id': $scope.admin.vendorid}, function (res) {
            $scope.loader(false);
            $scope.getBusinessTime = res;
            $scope.currentPage = 1;
            $scope.entryLimit = "10";
            $scope.maxSize = 5;
        });
    }
    if ($location.path() == "/calendar/available_time_list") {
        getBusinessTime();
    } else if ($location.path() == "/calendar/AvailabilityTiming") {
        getVenderLocation()
        $scope.page.type = 'post'
    } else if ($location.path() == "/calendar/update_available_time") {
        getVenderLocation()
        $scope.page.type = 'put';
        prePoppulateValues(ctrlComm.get('userObj'));
    }

    $scope.editCalenderAvailability = function (event) {
        console.log(event)
        $state.go('calendar.update_available_time', {id: event.id});
    };
    $scope.deleteCalenderAvailability = function (event) {

        var modalTimeInstance = $uibModal.open({
            animation: true,
            templateUrl: 'timeConfirmationDelete.html',
            controller: 'timeConfirmationController',
            size: 'md'
        });
        modalTimeInstance.result.then(function (response) {
            console.log(response);
            if (response == 'ok') {
                var data = {};
                data.id = event.id;
                request.service('vendorDeleteBusinessTimes', 'post', data, function (response) {
                    $scope.loader(false);
                    if (response.status == '0') {
//                        $scope.notification(response.message);
                        getBusinessTime();
                    }
                });
            }
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };
    function prePoppulateValues(obj) {
        if (obj) {
            $scope.calAvl = obj;
            console.log("prePoppulateValues", $scope.calAvl)
            $scope.calAvl.location_id = obj.location_id
            console.log("@@@@@@@@", $scope.calAvl.location_id)
        } else {
            $location.path("/calendar/available_time_list");
        }
    }
    if ($location.path() == "/calendar/update_available_time") {
        prePoppulateValues(ctrlComm.get('userObj'));
    }



    $('#start_time').datetimepicker({
        // minDate: '0',
        datepicker: false,
        format: 'H:i'
                //  format:'m-d-Y H:i',

    });
    $('#end_time').datetimepicker({
        // minDate: '0',
        datepicker: false,
        format: 'H:i'
                //  format:'m-d-Y H:i',

    });
    $scope.addAvailableTime = function (calAvl) {
        $scope.calAvl.start_time = $('#start_time').val();
        $scope.calAvl.end_time = $('#end_time').val();
        validateBusinessTime(function () {
            calAvl.vendor_id = $scope.admin.vendorid
            request.service('vendorAddBusinessTimes', 'post', calAvl, function (response) {
                console.log("response is", response)
                if (status == 0) {
                    $scope.calAvl = response;
                    $scope.notification('Business times added successfully');
                    $state.go('calendar.available_time_list');
                } else {
                    $scope.notification(response.message, "danger")
                }
            })
        })
    }
    $scope.updateAvailableTime = function (calAvl) {
        $scope.calAvl.start_time = $('#start_time').val();
        $scope.calAvl.end_time = $('#end_time').val();
        validateBusinessTime(function () {
            calAvl.vendor_id = $scope.admin.vendorid
            var params = {};
            params = angular.copy(calAvl);
            request.service('vendorUpdateBusinessTimes', 'post', params, function (response) {
                if (status == 0) {
                    $scope.notification('Business times updated successfully');
                    $state.go('calendar.available_time_list');
                } else {
                    $scope.notification(response.message, "danger")
                }
            })
        })
    }
    var deleteAvailableTime = function (calAvl) {
        var req = {};
        var params = {};
        params.id = calAvl.id;
        req.params = params;
        request.service('vendorDeleteBusinessTimes', 'post', params, function (response) {
            $scope.loader(false);
            if (typeof response == 'string') {
                response = JSON.parse(response)
            }
            if (response.status == '0') {
                getBusinessTime(function () {
                    $scope.notification("Business times deleted successfully");
                    $state.go('calendar.available_time_list');
                })
            }
        })
    }

    $scope.enddate = function (res) {
        var start_time = $('#start_time').val();
        var end_time = $('#end_time').val();
        console.log(start_time);
        console.log(end_time);
        var hh1 = start_time.split(':');
        var hh2 = end_time.split(':');
        console.log(hh1)
        console.log(hh2)

        var time1 = new Date('2016-10-30 ' + hh1[0] + ':' + hh1[1] + ':00:00').getTime();
        var time2 = new Date('2016-10-30 ' + hh2[0] + ':' + hh2[1] + ':00:00').getTime();
        if (time1 <= time2) {
            delete $scope.err.end_time_wrong;
            $scope.date_noti = "";
            console.log("time1", time1)
            console.log("time2", time2)
            $scope.calAvl.end_time = end_time;
        } else {


            $scope.calAvl.end_time = '';
            $scope.err.end_time_wrong = true;
            $scope.date_noti = "End Time should be greater than Start Time";
        }
    }
    var validateBusinessTime = function (cb) {
        if (!$scope.calAvl.week_number) {
            $scope.err.week_number = true;
        } else {
            delete $scope.err.week_number;
        }
        if (!$scope.calAvl.location_id) {
            $scope.err.location_id = true;
        } else {
            delete $scope.err.location_id;
        }
        if (!$scope.calAvl.start_time) {
            $scope.err.start_time = true;
        } else {
            delete $scope.err.start_time;
        }
        if (!$scope.calAvl.end_time) {
            $scope.err.end_time = true;
            delete $scope.err.end_time_wrong;
        } else {
            delete $scope.err.end_time;
        }
        if ($scope.calAvl.end_time)
        {
            $scope.enddate();
        }
        if (Object.keys($scope.err).length == 0) {

            if (cb)
                cb();
        }
    }
    $scope.enddate = function (res) {
        var start_time = $('#start_time').val();
        var end_time = $('#end_time').val();
        console.log(start_time);
        console.log(end_time);
        var timee1 = start_time.replace(/-/g, " ");
        var timee2 = end_time.replace(/-/g, " ");
        if (timee1 < timee2) {
            delete $scope.err.end_time_wrong;
            $scope.date_noti = "";
            delete $scope.err.end_time_wrong;
            $scope.calAvl.end_time = end_time;
        } else {


            $scope.calAvl.end_time = '';
            $scope.err.end_time_wrong = true;
            $scope.date_noti = "End Time should be greater than Start Time";
        }
    }


    $scope.clickon_time = function () {
        $scope.date_noti = "";
    }

});
app.controller('timeConfirmationController', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})