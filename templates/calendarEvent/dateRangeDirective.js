(function (angular) {

    angular.module('arevea')
            .directive('dateRange', dateRange);

    /*
     * Date Range Directive
     */
    function dateRange() {
        return {
            restrickt: 'EA',
            replace: true,
            scope: {rowid: '@'},
            templateUrl: 'templates/calendarEvent/dateRangeDirective.html',
            controller: dateRangeCtrl
        }
    }
    dateRangeCtrl.$inject = ['$scope'];
    function dateRangeCtrl($scope) {
        console.log("scope is like this", $scope);
        $scope.name = "test " + $scope.rowid;



        $('.startFromTime').timepicker();
        $('.endToTime').timepicker();

        $scope.dateOptsStart = {
            dateFormat: 'm-d-Y H:i',
            enableTime: false,
            time_24hr: true,
            onClose: function () {
                var fp = this;
                var ele = this.element;
                var key = $(ele).attr('data-eleindex');
                if ($scope.calendarEvent.scheduledEvent[key].fromDate !== "") {
                    $('.startFromTime').timepicker({'timeFormat': 'H:i'});
                    $('.startFromTime.ele' + key).focus();
                    $('.startFromTime.ele' + key).timepicker('show');
                    $('.startFromTime.ele' + key).on('changeTime', function (e) {
                        var cdArr = $scope.calendarEvent.scheduledEvent[key].fromDate.split(' ');
                        cdArr[1] = $('.startFromTime.ele' + key).val();
                        $scope.calendarEvent.scheduledEvent[key].fromDate = cdArr.join(' ');
                        if (key !== '{{$index}}') {
                            $scope.calendarEvent.scheduledEvent[key].toDate = $scope.calendarEvent.scheduledEvent[key].fromDate
                        }
                        console.log("time changed", $scope.calendarEvent.scheduledEvent[key], cdArr);
                    });
                }
            }
        }
        $scope.dateOptsEnd = {
            dateFormat: 'm-d-Y H:i',
            enableTime: false,
            time_24hr: true
        }
    }


})(window.angular);


