var app = angular.module('arevea');
app.controller('importTeamCtrl', [ '$scope', '$rootScope', '$location', 'request', 'ctrlComm', '$filter', 'fileUpload', '$timeout', '$http', '$window', '$state', 'NgMap', '$stateParams', 'myTeamFactory', '$http',
	function ($scope, $rootScope, $location, request, ctrlComm, $filter, fileUpload, $timeout, $http, $window, $state, NgMap, $stateParams, myTeamFactory, $http) {

		if(window.localStorage.getItem('adminDetails'))
		$scope.currUser = JSON.parse(window.localStorage.getItem('adminDetails'));

		$scope.fileSelect = function (e) {
			if(e.files && e.files.length >0 && e.files[0]){
				$scope.fileDetails = e.files[0];
				if(!$scope.$$phase) { $scope.$apply(); }
			}
		};

		$scope.importTeamMembers = function(){
			var fd = new FormData();
			fd.append('file', $scope.fileDetails);
			fd.append('vendor_id', $scope.currUser.vendorid);
			var response = myTeamFactory.importTeamMemberTemplate.import(fd);
			response.$promise.then(function successCB(data){
				console.log("SUCCESS :: ",data)
				$scope.notification(response.message);
			}, function errorCB(err){
				console.log("ERROR :: ",err);
			})
		}

}]);