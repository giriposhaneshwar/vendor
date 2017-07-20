(function () {
    var app = angular.module('arevea');
    var homeCtrl = function ($scope, $rootScope, request, $location) {
		$scope.changeLoginStatus(true);
        $scope.verifyVendorStatus();
        console.log("in homeCtrl")

        // $scope.dashboard = {
        // 	totalUsers:12323,
        // 	todayNewUsers:2837,
        // 	activeUsers:12102,
        // 	mwServiceStatus:'Active',
        // 	eliteCoreStatus:'Active',
        // 	msgQueue: 10,
        // 	lastActivities:[
        // 		{
        // 			time:'Just Now',
        // 			name:'Jordan Carter',
        // 			desc:'The trip was an amazing and a life changing experience!'
        // 		},
        // 		{
        // 			time: '5 min ago',
        // 			name:'Administrator',
        // 			desc:'Free courses for all our customers at A1 Conference Room - 9:00 am tomorrow!'
        // 		},
        // 		{
        // 			time:'15 min ago',
        // 			name:'Jordan Carter',
        // 			desc:'The trip was an amazing and a life changing experience!'
        // 		},
        // 		{
        // 			time: '25 min ago',
        // 			name:'Administrator',
        // 			desc:'Free courses for all our customers at A1 Conference Room - 9:00 am tomorrow!'
        // 		}
        // 	]
        // }



    }
    app.controller('homeCtrl', ['$scope', '$rootScope', 'request', homeCtrl]);
}());
