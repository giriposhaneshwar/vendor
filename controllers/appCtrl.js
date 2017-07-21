/*(function() {*/
var app = angular.module('arevea');

app.controller('mainCtrl', function ($scope, $rootScope, request, ctrlComm, $uibModal, $http, $filter, $timeout, $state, $location, $uibModalStack, $window, commonService) {
    $scope.appUsersList = [];
    $scope.admin = {};
    $scope.appMasterList = false;
    $scope.login = {};
    $scope.loginStatus = false;
    $scope.defaultLogo = './images/arevea-logo.png';
    $scope.defaultUser = "./images/defaultUser.png";

    $rootScope.state_change = function (active_path) {
        $scope.activePath = active_path;
        console.log("$scope.activePath", $scope.activePath);
        $scope.hash = $location.path();
        $scope.hash1 = $scope.hash.split('/');
        console.log("$scope.hash1[3]", $scope.hash1[3]);
        $scope.hash2 = $scope.hash1[3];

        if ($state.params.id != undefined) {
            $scope.stateParams = $state.params.id;
        }
    }
    $scope.signout = function () {
        localStorage.clear();
        location.reload();
//        console.log("localStorage.clear();", localStorage);
    }

    $scope.init = function () {
        $rootScope.state_change($location.path());
    };
    /*$("#navbar-logo").css("display", "none");
     
     $(window).scroll(function () {
     var nav = $('#custom-bootstrap-menu');
     var body = $('body');
     var top = 50;
     var logo = $('div#navlogo');
     if ($(window).scrollTop() >= top) {
     $("#navbar-logo").css("display", "block");
     nav.addClass('navbar-fixed-top');
     body.addClass('padding-fifty');
     logo.css('display', 'block');
     } else {
     nav.removeClass('navbar-fixed-top');
     body.removeClass('padding-fifty');
     logo.css('display', 'none');
     
     
     }
     });*/
    $scope.tabaction = function (result) {
        console.log(result)

        //$rootScope.$broadcast('setTitle', result);
        //window.location.hash = "#/My-Account";

        if (result == '1') {
            $state.go("vendorSettings.My-Account.tab1");
        } else if (result == '2') {
            $state.go("vendorSettings.My-Account.tab2");
        } else if (result == '3') {
            $state.go("vendorSettings.My-Account.tab3");
        }
    }

    console.log("AppController - $scope.admin", $scope.admin);


    $scope.verifyMail = function (request1) {
        console.log("rrrr", request1)
        console.log("in verifyMail");
        request.service('vendorMailconfirm', 'post', request1, function (response) {
            console.log("vendorMailconfirm", response);
            if (response.status == 0) {
                $scope.login.userToken = response.token;
                $scope.login.userId = response.userid.toString();
                window.localStorage.setItem("Arevea_userToken", response.token);
                window.localStorage.setItem("Arevea_userId", response.userid.toString());
                request.service('verifyToken', 'post', $scope.login, function (response) {
                    console.log("verifyToken response ", response);
                    if (response.status == 0) {
                        request.setItem('status', response.status.toString());
                        request.setItem('vendorid', response.vendorid.toString());
                        request.setItem('firstName', response.firstName);
                        request.setItem('lastName', response.lastName);
                        request.setItem('bussinessName', response.bussinessName);
                        request.setItem('email', response.email);
                        request.setItem('userid', response.userid.toString());
                        request.setObj('vendor', response.vendor);
                        //request.setItem('emailStatus',(response.vendor.email_verification == "01") ? true : false );

                        if (response.vendor.logo == null) {
                            response.vendor.logo = $scope.defaultLogo;
                        } else {
                            response.vendor.logo = response.logopath + response.vendor.logo;
                        }
                        if (response.vendor.profile_pic_path == null) {
                            response.vendor.profile_pic_path = $scope.defaultUser;
                        } else {
                            response.vendor.profile_pic_path = response.profilepicpath + response.vendor.profile_pic_path;
                        }


                        window.localStorage.setItem("status", response.status.toString());
                        window.localStorage.setItem('vendorid', response.vendorid.toString());
                        window.localStorage.setItem('firstName', response.firstName);
                        window.localStorage.setItem('lastName', response.lastName);
                        window.localStorage.setItem('bussinessName', response.bussinessName);
                        window.localStorage.setItem('email', response.email);
                        window.localStorage.setItem('userid', response.userid.toString());
                        window.localStorage.setItem('userId', response.userid.toString());
                        window.localStorage.setItem('vendor', JSON.stringify(response.vendor));
                        window.localStorage.setItem('emailStatus', response.vendor.email_verification);
                        $scope.admin.emailStatus = (response.vendor.email_verification == "01") ? true : false
                        $scope.admin.venodorStatus = (response.vendor.vendor_category_count > 0 && response.vendor.vendor_locations_count > 0) ? true : false;
                        $scope.admin.venodorVStatus = response.vendor.validation_status;
                        $scope.admin.bankStatus = (response.vendor.bank_count > 0) ? true : false;

                        if (response.vendor.email_verification.toString() == "01" && $scope.admin.venodorVStatus == 4 && $scope.admin.bankStatus == true)
                            window.location.hash = "#/Home"
                        /* else if (response.vendor.email_verification.toString() == "01")
                         window.location.hash = "#/My-Account"*/
                        else
                            window.location.hash = "#/Verification"

                        $scope.login = {};
                        $scope.loginToggle();
                    } else {
                        $scope.notification(response.message, 'danger');
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                        window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;
                    }
                });
            } else {
                $scope.notification(response.message, 'danger');
                window.localStorage.clear();
                window.sessionStorage.clear();
                window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;
            }
            $scope.notification(response.message);
            //            request.setItem('status', response.status.toString());
            //            request.setItem('vendorid', response.vendorid.toString());
            //            request.setItem('firstName', response.firstName);
            //            request.setItem('lastName', response.lastName);
            //            request.setItem('bussinessName', response.bussinessName);
            //            request.setItem('email', response.email);
            //            request.setItem('userid', response.userid.toString());
            //            request.setObj('vendor', response.vendor);
            //            console.log("response.vendor",request.getObj('vendor'));
            //            request.setItem('emailStatus', response.vendor.email_verification);
            //            $scope.loginToggle();
            //            if (response.vendor.email_verification.toString() == "01")
            //                window.location.hash = "#/My-Account"
            //            else
            //                window.location.hash = "#/Verification"

            //$scope.login = {};


        })
    }

    var params = [];
    if (window.location.hash.split('?')[1]) {
        params = window.location.hash.split('?')[1].split('=');
        //$scope.admin = {};
        console.log(params);
        console.log("in verification admin", $scope.admin);
        var request1 = {};
        if (params[1]) {
            request1[params[0]] = params[1];
            console.log(request1)
            $scope.verifyMail(request1);
        }
    } else {
        $scope.login.userToken = window.localStorage.getItem("Arevea_userToken");
        $scope.login.userId = window.localStorage.getItem("Arevea_userId");
        console.log($scope.login);
        if ($scope.login.userToken && $scope.login.userId) {
            request.service('verifymail', 'post', {
                "userId": window.localStorage.getItem("Arevea_userId")
            }, function (response) {

                console.log("verifymail response", response);
                if (response.length > 0 && response[0].email_verification.data[0] == 1) {
                    window.localStorage.setItem("Arevea_userToken", response[0].auth_code);
                } else {
                }
                $scope.login.userToken = window.localStorage.getItem("Arevea_userToken");
                request.service('verifyToken', 'post', $scope.login, function (response) {
                    console.log("verifyToken response ", response);
                    if (response.status == 0) {
                        if (response.vendor.logo == null) {
                            response.vendor.logo = $scope.defaultLogo;
                        } else {
                            response.vendor.logo = response.logopath + response.vendor.logo;
                        }
                        if (response.vendor.profile_pic_path == null) {
                            response.vendor.profile_pic_path = $scope.defaultUser;
                        } else {
                            response.vendor.profile_pic_path = response.profilepicpath + response.vendor.profile_pic_path;
                        }
                        window.localStorage.setItem("status", response.status.toString());
                        window.localStorage.setItem('vendorid', response.vendorid.toString());
                        window.localStorage.setItem('firstName', response.firstName);
                        window.localStorage.setItem('lastName', response.lastName);
                        window.localStorage.setItem('bussinessName', response.bussinessName);
                        window.localStorage.setItem('email', response.email);
                        window.localStorage.setItem('userid', response.userid.toString());
                        window.localStorage.setItem('userId', response.userid.toString());
                        window.localStorage.setItem('vendor', JSON.stringify(response.vendor));
                        window.localStorage.setItem('emailStatus', response.vendor.email_verification);
                        $scope.admin.emailStatus = (response.vendor.email_verification == "01") ? true : false
                        $scope.admin.venodorStatus = (response.vendor.vendor_category_count > 0 && response.vendor.vendor_locations_count > 0) ? true : false;
                        $scope.admin.venodorVStatus = response.vendor.validation_status;
                        $scope.admin.bankStatus = (response.vendor.bank_count > 0) ? true : false;
                        //window.localStorage.removeItem("Arevea_userToken");
                        //window.localStorage.removeItem("Arevea_userId");
                        //location.reload();
                        if (response.vendor.email_verification.toString() == "01" && $scope.admin.venodorVStatus == 4 && $scope.admin.bankStatus == true)
                            //window.location.hash = "#/Home"
                            var s = "";
                        else if (response.vendor.email_verification.toString() == "01")
                            window.location.hash = "#/Home"
                        else
                            window.location.hash = "#/Verification"

                        $scope.login = {};
                        $scope.loginToggle();
                    } else {
                        $scope.notification(response.message, 'danger');
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                        window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;
                    }
                });
            });
        } else {

            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;
        }
    }


    //    if (!$scope.admin.vendorid)
    //    {
    //        console.log("no vendor id");
    //        window.location.hash = "#/login";
    //    }

    $scope.verifyVendorStatus = function () {
        $scope.admin.emailStatus = (window.localStorage.getItem('emailStatus') == "true")
        $scope.admin.venodorStatus = (window.localStorage.getItem('venodorStatus') == "true")
        $scope.admin.venodorVStatus = parseInt(window.localStorage.getItem('venodorVStatus'))
        $scope.admin.bankStatus = (window.localStorage.getItem('bankStatus') == "true")
        $scope.admin.vendorid = window.localStorage.getItem('vendorid');
        $scope.admin.userId = window.localStorage.getItem('userid');
        $scope.getadminName();
        if (($state.current.name.indexOf("vendorSettings") == -1)) {
            if ($scope.admin.userId == null || $scope.admin.userId == undefined)
            {
                window.localStorage.clear();
                window.sessionStorage.clear();
                window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;
            } else if (window.localStorage.getItem('venodorStatus') == false || window.localStorage.getItem('venodorStatus') == "false") {
                window.location.hash = "#/Verification"
            } else {
                if (window.localStorage.getItem('venodorVStatus') == 1) {

                } else if (window.localStorage.getItem('venodorVStatus') != 4) {
                    window.location.hash = "#/Verification"
                } else if (window.localStorage.getItem('venodorVStatus') == 4 && (window.localStorage.getItem('bankStatus') == false || window.localStorage.getItem('bankStatus') == "false")) {
                    //$rootScope.myAccountTab = 1;
                    // window.location.hash = "#/Home"
                }

            }
        }

    }


    $scope.logout_model = function () {
        $('#logout1').modal('show');
    };


    $scope.logout = function (status) {
        /*        request.removeItem('status');
         request.removeItem("Arevea_userToken");
         request.removeItem("Arevea_userId");
         console.log("logout");
         */
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = request.setup.protocol + "://" + request.setup.host + request.setup.customer_portal;

        if (status) {


            var input = {
                text: 'Are you sure you want to',
                name: 'logout'
            };
            // $scope.confirmation(input, function() {
            //     localStorage.removeItem('user');

            //     location.reload();
            // });
        } else {
            request.removeItem('status');

            //location.reload();
        }
    }
    $scope.tabActive = function (tab, parentTab) {
        $scope.activeTab = {};
        $scope.activeTab[tab] = true;
        $scope.activeTab.tab = parentTab;
        if (!$scope.loginStatus)
            window.location.hash = "/login"
    }

    $scope.notification = function (text, type, title, delay) {
        var msg;
        if (!type)
            type = 'info';
        //if (!title) title = 'Notification';
        if (type == 'info')
            msg = "SUCCESS";

        if (type == 'error')
            msg = "FAILED";

        if (!delay)
            delay = 3000;
        /*$.bootstrapGrowl('<h4> ' + title + ' </h4> <p> ' + text + ' </p>', {
         type: type,
         delay: delay,
         allow_dismiss: true,
         width: 'auto',
         });*/
        $.bootstrapGrowl("<p>" + text + '</p>', {
            type: type,
            align: 'center',
            offset: {from: 'top', amount: ($(window).height() / 2) - 50},
            delay: delay,
            allow_dismiss: true,
            width: 'auto',
        });
    }

    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        var path = $location.path();
        /* if ($scope.loginStatus == true && path == "/login") {
         $location.path('/vendorSettings/My-Account')
         }*/
        $uibModalStack.dismissAll();
    })

    request.service('citiesList', 'get', '', function (response) {
        $scope.citiesList = response;
    })

    request.service('statesList', 'get', '', function (response) {
        $scope.statesList = response;
    })

    request.service('countriesList', 'get', '', function (response) {
        $scope.countriesList = response;
    })


    $scope.loader = function (status) {
        if (status) {
            $scope.NProgress = true;
            NProgress.start();
        } else {
            $scope.NProgress = false;
            NProgress.done();
            // document.getElementById('loader').style.display = none;
        }
    }

    $scope.loginStatus = false;
    $scope.changeLoginStatus = function (status) {
        $scope.loginStatus = status;
        if (status == true)
            $(".userdispsec").show();
        else
            $(".userdispsec").hide();
    };



    function checkAppSelection() {
        if (!$scope.admin.appId) {
            $scope.selApp = $scope.appMasterList[0];
            $scope.admin.appId = $scope.selApp.app_id;
            $scope.admin.appName = $scope.selApp.app_name;
            request.setObj('selectedApp', $scope.selApp);
        }
    }

    $scope.loadDashboard = function () {
        request.service('getDashboardDetails', 'post', $scope.admin, $scope.CONFIG, function (dResponse) {
            if (dResponse.statusCode == '200') {
                $scope.dObj = dResponse.Result[0];
            }
        })
    }


    var userAppChanged = function (app) {
        $scope.admin.appId = app.app_id;
        $scope.admin.appName = app.app_name;
        $scope.$broadcast('userAppChanged', app.appId);
        request.setObj('selectedApp', app);
    }
    $scope.askConfrimation = function (data, cb) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'templates/confirmBox.html',
            controller: 'saveConfirmCtrl',
            size: 'md',
            resolve: {
                data: function () {

                    return {
                        text: data.text,
                        name: data.name
                    };
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (cb)
                cb(data);
        }, function () {

        });
    }

    // var confirmation = function(input, cb) {
    //     if (cb) cb(status);
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'templates/confirmBox.html',
    //         controller: 'confirmBoxCtrl',
    //         size: 'md',
    //         resolve: {
    //             input: function() {
    //                 return { text: input.text, name: input.name };
    //             }
    //         }
    //     });
    //     modalInstance.result.then(function(status) {
    //         if (cb) cb(status);
    //     }, function() {
    //         console.log("Modal dismissed at: " + new Date());
    //         //$log.info('Modal dismissed at: ' + new Date());
    //     });
    // }

    $scope.loginToggle = function () {
        console.log("login toggle");
        var page;
        var url;
        if (window.location.hash.split('?')[1] && window.location.hash.split('?')[1].split('=')[0] != undefined) {
            url = window.location.hash;
            page = window.location.hash.split('?')[1].split('=')[0];
        }
        if (window.localStorage.getItem('status') || page == 'vendorid') {
            $scope.changeLoginStatus(true);

            $scope.admin.status = window.localStorage.getItem('status');
            $scope.admin.vendorid = window.localStorage.getItem('vendorid');
            $scope.admin.firstName = window.localStorage.getItem('firstName');
            $scope.admin.lastName = window.localStorage.getItem('lastName');
            $scope.admin.bussinessName = window.localStorage.getItem('bussinessName');
            $scope.admin.email = window.localStorage.getItem('email');
            $scope.admin.userId = window.localStorage.getItem('userid');
            console.log("response.vendor", JSON.parse(window.localStorage.getItem('vendor')));
            $scope.admin.vendor = JSON.parse(window.localStorage.getItem('vendor'));
            $scope.admin.emailStatus = ($scope.admin.vendor.email_verification == "01") ? true : false;
            $scope.admin.venodorStatus = ($scope.admin.vendor.vendor_category_count > 0 && $scope.admin.vendor.vendor_locations_count > 0) ? true : false;
            $scope.admin.venodorVStatus = $scope.admin.vendor.validation_status;
            $scope.admin.bankStatus = ($scope.admin.vendor.bank_count > 0) ? true : false;
            window.localStorage.setItem("emailStatus", $scope.admin.emailStatus);
            window.localStorage.setItem("venodorStatus", $scope.admin.venodorStatus);
            window.localStorage.setItem("venodorVStatus", $scope.admin.venodorVStatus);
            window.localStorage.setItem("bankStatus", $scope.admin.bankStatus);
            if (page == 'vendorid') {
                window.location.hash = url;
                $scope.segment = 2;
            }
            $scope.verifyVendorStatus();




        } else {
            $scope.loginStatus = false;
            window.location.hash = "/login"
        }
    }



    //$scope.loginToggle();

    $scope.userAppChanged = userAppChanged;
    //  $scope.confirmation = confirmation;

    $(".dropdown-menu > li > a.trigger").on("click", function (e) {
        var current = $(this).next();
        var grandparent = $(this).parent().parent();
        if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
            $(this).toggleClass('right-caret left-caret');
        grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
        grandparent.find(".sub-menu:visible").not(current).hide();
        current.slideToggle();
        e.stopPropagation();
    });
    $(".dropdown-menu > li > a:not(.trigger)").on("click", function () {
        var root = $(this).closest('.dropdown');
        root.find('.left-caret').toggleClass('right-caret left-caret');
        root.find('.sub-menu:visible').hide();
    });


    $scope.gotoHome = function () {
        window.location.hash = "/Home"
    };

    $scope.getadminName = function () {

        if (window.localStorage.getItem('firstName') != null) {
            $scope.adminName = window.localStorage.getItem('firstName') + " " + window.localStorage.getItem('lastName');
        } else {
            $scope.adminName = '';
        }
    };

    $scope.goToSample = function () {
        $state.go('myMessages');
    }


    $scope.gotoMyAccount = function () {
        window.location.hash = '/My-Account';
    }
    $scope.gotoProducts = function () {
        window.location.hash = '/Products'
    }
    $scope.gotoLocation = function () {
        window.location.hash = '/Location'
    }

    /*
     * Checking screen resolution to know in mobile / web
     */
    $scope.isWeb = false;
    $scope.$watch('screenWidth', function (n, o) {
        if (n > 768) {
            $scope.isWeb = true;
        } else {
            $scope.isWeb = false;
        }
    })
});



/*	    app.controller('mainCtrl', ['$scope', '$rootScope', 'request', 'ctrlComm', '$modal', 'TableConstants', '$http', '$filter', '$timeout','$state', mainCtrl]);*/
/*	}());*/
app.controller('saveConfirmCtrl', function ($scope, $uibModalInstance, data) {
    $scope.data = data;
    $scope.ok = function () {
        $uibModalInstance.close(data);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})