/*(function() {
 */
var app = angular.module('arevea');
app.controller('datePickerCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $http, $window,
        $state, NgMap) {

    $scope.options = {
        labels: true, // false (hide labels)
        time: "true", // true (default)
        timeRange: "true", // true (default)
        calendar: "day" // range
    };
    $scope.datePickerResult = {};

    $scope.optionsSpan = {
        labels: true,
        time: true,
        dateType: 'range', // 'range' | 'day'
        dateFormat: '',
        format: "date time - date time"
    };
    $scope.datePickerSpanResult = {};

});