/*(function() {
 */
var app = angular.module('arevea');
app.controller('dashboardCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $http, $window,
        $state, NgMap) {

    console.log("in Dashboard ctrl");
    if (($state.current.name.indexOf("dashboard") > -1) && (window.localStorage.getItem('venodorStatus') == false || window.localStorage.getItem('venodorStatus') == "false")) {
        window.location.hash = "#/Verification";
    }
    $scope.resendLink = function () {
        console.log("will send link");
        request.service('vendorResendVerification', 'post', {"userId": $scope.admin.userId}, function (response) {
            console.log("verifyToken response ", response);
            if (response.status == 0) {
                $scope.notification(response.message);
            } else {
                $scope.notification(response.message, 'danger');
            }
        });
    };
    $scope.getstatus = function ()
    {

        console.log("calling methods");
        /*  request.service('productsList', 'post', {
         'vendor_id': $scope.admin.vendorid,
         'status':7
         }, function (response) {
         
         $scope.productsList = response;
         console.log("productlist", response)
         $location.path('/product_service_catalog/Products')
         //  window.location.hash="#/product_service_catalog/Products"
         })*/
        $rootScope.status = 7;
        $location.path('/product_service_catalog/Products')

    }

    $scope.init = function () {
//        if (window.localStorage.vendorid) {
        $scope.loading = true;
//        }
        $timeout(function () {
            $scope.vendorId = window.localStorage.vendorid;
            $scope.status = window.localStorage.status;
            $scope.verifiedVendor = false;
            if (window.localStorage.getItem('venodorStatus') == true || window.localStorage.getItem('venodorStatus') == 'true') {
                $scope.verifiedVendor = true;
            }
            console.log(localStorage);
            request.service('dashBoardCounts', 'post', {
                "vendor_id": $scope.vendorId
            }, function (response) {
                $scope.loading = false;
                console.log("dashBoardCounts", response);
                $scope.dashboardData = response;
                $scope.productDetails = $scope.dashboardData.product_details;
                $scope.productsCount = response.products;
                $scope.bookingsCount = response.bookings;
                $scope.requestsCount = response.requests;
                $scope.inquiresCount = response.inquires;

            });

            request.service('myBookings', 'post', {
                "vendor_id": $scope.vendorId, status: "0"
            }, function (response) {
                $scope.loading = false;
                $rootScope.dashboardBookingData = response;
                if ($rootScope.dashboardBookingData.events != undefined) {
                    var start = moment($rootScope.dashboardBookingData.events[0].event.event_start_date);
                    var end = moment($rootScope.dashboardBookingData.events[0].event.event_end_date);
                    var dayDiff = moment.duration(end.diff(start));
                    $scope.diffDays = dayDiff.asDays();

                    $rootScope.dashboardBookingData.events[0].event.eventdate = new Date($rootScope.dashboardBookingData.events[0].event.eventdate);
                    var stDate = new Date($rootScope.dashboardBookingData.events[0].event.event_start_date);
                    var edDate = new Date($rootScope.dashboardBookingData.events[0].event.event_end_date);
                    $rootScope.dashboardBookingData.events[0].event.event_start_date = stDate.getTime();
                    $rootScope.dashboardBookingData.events[0].event.event_end_date = edDate.getTime();

                }
                var dateToday = new Date();
                //var $scope.upcomingDays = moment.duration(start.diff(dateToday));
                console.log("myBookings", $rootScope.dashboardBookingData, "dateToday:", dateToday);

                /*
                 $scope.productsCount = response.products;
                 $scope.bookingsCount = response.bookings;
                 $scope.requestsCount = response.requests;
                 $scope.inquiresCount = response.inquires;*/

            });

            request.service('getCustomRequestVendors', 'post', {
                "vendor_id": $scope.vendorId, crStatus: "1"
            }, function (response) {
                $scope.loading = false;
                console.log("getCustomRequestVendors", response);
                $scope.CustomRequestData = response;
                if ($scope.CustomRequestData.requests != undefined && $scope.CustomRequestData.requests.length > 0) {
                    var start = moment($scope.CustomRequestData.requests[0].start_time);
                    var end = moment($scope.CustomRequestData.requests[0].end_time);
                    var dayDiff = moment.duration(end.diff(start));
                    $scope.diffDays2 = dayDiff.asDays();

                    var stDate = new Date($scope.CustomRequestData.requests[0].start_time);
                    var edDate = new Date($scope.CustomRequestData.requests[0].end_time);
                    $scope.CustomRequestData.requests[0].start_time = stDate.getTime();
                    $scope.CustomRequestData.requests[0].end_time = edDate.getTime();

                }
                /*
                 $scope.productsCount = response.products;
                 $scope.bookingsCount = response.bookings;
                 $scope.requestsCount = response.requests;
                 $scope.inquiresCount = response.inquires;*/

            });
        }, 1000);

    };

    /*	Products	*/
    var editProductCatalog = function (obj) {
        ctrlComm.put('userObj', obj);
        $location.path("/product_service_catalog/updateProduct");
    }
    $scope.editProductCatalog = editProductCatalog;

    $scope.deleteProductConfirm = function (product) {
        var data = {
            text: 'Are you sure you want to delete',
            name: 'product'

        }
        $scope.askConfrimation(data, function () {
            product.vendor_id = $scope.admin.vendorid
            deleteProduct(product);

        });
    }
    var deleteProduct = function (product) {
        console.log("product.id;", product.id)
        var params = {};
        params.product_id = product.id;
        console.log('params....', params)
        request.service('deleteProduct', 'post', product, function (response) {
            
            $scope.loader(false);
            if (typeof response == 'string') {
                response = JSON.parse(response)
            }
            if (response.status == '0') {
                $scope.init(function () {
                    $scope.notification("Product deleted successfully");
                    $state.go('product_service_catalog.Products');
                });
            }
        })
    }
    $scope.viewProduct = function (id) {
        $window.location.href = "#/myBookings/scheduled/" + id;
    }
    $scope.viewRequest = function (id) {
        $state.go('customRequests.pending', {id: id});
//        $window.location.href = "#/customRequests/pending/" + id;
    }

});