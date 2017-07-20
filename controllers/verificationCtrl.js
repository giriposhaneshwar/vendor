/*(function() {*/
var app = angular.module('arevea');
app.controller('verificationCtrl', function ($scope, request, ctrlComm, $filter, fileUpload, $timeout, $http, $location, $state) {
    console.log("in verificationCtrl");
    console.log($scope.admin);
//    if (!$scope.admin.vendorid)
//    {
//        window.location.hash = "#/login";
//    }
//    else
//    {
//        window.location.hash = "#/vendorSettings/My-Account"
//    }
//    
//    var params=[];
//    if(window.location.hash.split('?')[1])
//        params = window.location.hash.split('?')[1].split('=');
//    //$scope.admin = {};
//    console.log(params);
//    console.log("in verification controll admin",$scope.admin);
//    var request1 = {};
//    if (params[1]){
//    request1[params[0]] = params[1];
//    console.log(request1)
//    //$scope.admin = {};
//    //console.log($scope.admin)
//    //$location.path('#/login')
//    //$state.go('login')
//    
//        $scope.verifyMail(request1);
//    }
    $scope.resendLink = function () {
        console.log("will send link");
        request.service('verifymail', 'post', {
     		"userId" : window.localStorage.getItem("Arevea_userId")
     		}, function(response) {
     			
     			console.log("verifymail response",response);
     	 		if (response.length>0&&response[0].email_verification.data[0] ==1) {
     	 			window.localStorage.setItem("Arevea_userToken",response[0].auth_code);
     	 			$scope.admin.emailStatus = (response[0].email_verification.data[0] ==1) ? true : false;
     	 			window.location.hash = "#/Home";
     	 		}else{
     	 			 request.service('vendorResendVerification', 'post', {"userId": $scope.admin.userId}, function (response) {
     	 	            console.log("verifyToken response ", response);
     	 	            if (response.status == 0) {
     	 	                $scope.notification(response.message);
     	 	            } else {
     	 	                $scope.notification(response.message, 'danger');
     	 	            }
     	 	        });
     	 		} 
     		});
       

    };

    $scope.gotoBusinessInfoPage = function(){
        window.location.hash = "#/vendorSettings/My-Account/basicInfo";
    };

    /*
     $http.post('http://192.168.0.172:8000/arevea/vendorMailconfirm', request).success(function(response) {
     console.log(response)
     if (response.status == 0) {
     $scope.notification(response.message);
     window.location.hash = '#/My-Account';
     }
     })*/


})
