/*(function() {*/
var app = angular.module('arevea');
app.controller('vendorSettingCtrl', function ($scope, $rootScope, request, ctrlComm,$location, $filter, fileUpload, $timeout, $http, $state) {

        //window.location.hash = "#/login";
        console.log("in vendorSettingCtrl");
        console.log("in vendorSettingCtrl", $rootScope.title);


        $rootScope.$on('setTitle', function (event, title) {

            console.log(event);
            console.log(title);

            if (title == '1') {
                $('#a').addClass('active2');
                $('#b').removeClass('active2');
                $('#c').removeClass('active2');
            } else if (title == '2') {
                $('#b').addClass('active2');
                $('#a').removeClass('active2');
                $('#c').removeClass('active2');
            } else if (title == '3') {
                $('#c').addClass('active2');
                $('#a').removeClass('active2');
                $('#b').removeClass('active2');
            }


        });

      
        $scope.tabaction = function (result) {
            console.log(result)

            if (result == '1') {

                $state.go("vendorSettings.My-Account.tab1");

            } else if (result == '2') {

                $state.go("vendorSettings.My-Account.tab2");
            } else if (result == '3') {

                $state.go("vendorSettings.My-Account.tab3");
            }


            // $rootScope.$broadcast('setTitle', result);
            //window.location.hash = "#/My-Account";



        }





        console.log($scope.admin);

        $scope.selectMyAccount = function () {
            // window.location.hash = "#/vendorSettings/My-Account"
        }
        $scope.selectLocation = function () {

            $state.go("vendorSettings.Location");
        }
    })
    /*app.controller('vendorSettingCtrl', ['$scope', 'request', 'ctrlComm', '$filter', 'fileUpload', '$timeout', '$http', 'TableConstants','$state', vendorSettingCtrl]);
}());*/