var app = angular.module('arevea');
app.controller('profileSettingsCtrl', ['$scope', 'request', '$rootScope', function ($scope, request, $rootScope) {
        $scope.VendorPwdToggle = function () {
            $(document).on("click", "#displayVendor", function () {
                $(".vendor-profile-chngPwd-btn").hide(500);
                $("#vednorMainBlock").show(500);
            });
        };
        $scope.showChangePwd = function () {
            $(document).on("click", "#showPswdBtn", function () {
                $(".vendor-profile-chngPwd-btn").show(500);
                $("#vednorMainBlock").hide(500);
            });
        };
        $scope.VendorChngPlanToggle = function () {
            $(document).on("click", "#displanPlan", function () {
                $(".vendor-change-plan").hide(500);
                $("#vendorChgPlan").show(500);
            });
        };
        $scope.showChangePlan = function () {
            $(document).on("click", "#showPswdPlan", function () {
                $(".vendor-change-plan").show(500);
                $("#vendorChgPlan").hide(500);
            });
        };
        function init() {
            request.service('getSubScriptionInfo', 'get', {}, function (response) {
                if (response.status == 0) {
                    console.log(response);
                    $scope.free = response.subscriptionTypes[0];
                    $scope.premium = response.subscriptionTypes[1];
                    $scope.prestige = response.subscriptionTypes[2];
                }
            });
            request.service('getBTClientToken', 'get', {}, function (response) {
                $scope.CLIENT_TOKEN = response;
            });
            subScriptionInfoDetails();
        }
        init();
        $scope.d = new Date();
        $rootScope.n = $scope.d.getFullYear();
        function subScriptionInfoDetails() {
            var data = {
                vendor_id: window.localStorage.vendorid
            };
            request.service('getSubScriptionInfoDetailsByVendor', 'post', data, function (response) {
                console.log(response)
                if (response.status == 0) {
                    $scope.currentSubscription = response.currentSubscriptions[0];
                    console.log($scope.currentSubscription);
                    if (response.subscriptionForPayment.length !== 0) {
                        $scope.subscribeData = response.subscriptionForPayment[0];
                        if ($scope.subscribeData.subscription_name == 'Prestige') {
                            $scope.subscribe.prestige = $scope.subscribeData.subscription_mode_id;
                        } else if ($scope.subscribeData.subscription_name == 'Premium') {
                            $scope.subscribe.premium = $scope.subscribeData.subscription_mode_id;
                        } else {
                            $scope.subscribe.free = $scope.subscribeData.subscription_mode_id;
                        }
                    }
                }
            });
        }
        ;
        $scope.subscribe = {
            free: '',
            premium: '',
            prestige: '',
            subscriptionPlans: true,
            subscriptionDetails: false,
            cardNumber: '',
            cardMonth: '',
            cardYear: '',
            cardCVV: ''
        };
        $scope.checkSubscription = function (plan, id) {
            if (plan == 'premium') {
                $scope.subscribe.premium = id;
                $scope.subscribe.prestige = '';
                $scope.subscribe.free = '';
            } else if (plan == 'prestige') {
                $scope.subscribe.free = '';
                $scope.subscribe.premium = '';
                $scope.subscribe.prestige = id;
            } else {
                $scope.subscribe.free = id;
                $scope.subscribe.premium = '';
                $scope.subscribe.prestige = '';
            }
        }
        $scope.subscribePlan = function (plan, sub_id) {
            var data = {
                vendor_id: window.localStorage.vendorid,
                userId: window.localStorage.userId,
                subscription_id: sub_id
            };
            if (plan == 'premium') {
                data.subscription_mode = $scope.subscribe.premium;
            } else if (plan == 'prestige') {
                data.subscription_mode = $scope.subscribe.prestige;
            } else {
                data.subscription_mode = $scope.subscribe.free;
            }
            request.service('addNewSubscribtion', 'post', data, function (response) {
                console.log(response);
                subScriptionInfoDetails();
                $scope.userSelectedPlan = plan;
                $scope.subscribe.subscriptionDetails = true;
                $scope.subscribe.subscriptionPlans = false;
            });
        };
        $scope.changeCurrentPlan = function () {
            $scope.subscribe.subscriptionDetails = false;
            $scope.subscribe.subscriptionPlans = true;
        };
        $scope.formatMonth = function () {
            if ($scope.cardMonth == undefined || $scope.cardMonth == 0 ||
                    $scope.cardMonth == "0") {
                $scope.cardMonth = "";
            } else if ($scope.cardMonth < 10) {
                $scope.cardMonth = "0" + Number($scope.cardMonth);
            }
        };
        $scope.formatYear = function () {
            if ($scope.cardYear < $rootScope.n) {
                $scope.cardYear = "";
            }
        };
        $scope.checkEmpty = function (ele) {

            if (ele == 'shippingZip' || ele == 'billingZip') {
                $scope.validateZipCode($("#" + ele).val().trim());
            }

            if ($("#" + ele).val().trim() != "") {
                $("#" + ele + "Error").text("");
            }
        };
        $scope.makePayment = function () {
            var validated = $scope.validateFields();
            if (validated == true) {

                NProgress.start();
                $("#page-content").css({
                    "opacity": "0.5",
                    "pointer-events": "none"
                });
                $scope.fieldErrors = [];
                $scope.errorMessages = [];
                braintree.client.create({
                    authorization: $scope.CLIENT_TOKEN
                }, function (err, clientInstance) {
                    var data = {
                        creditCard: {
                            number: $scope.subscribe.cardNumber,
                            cvv: $scope.subscribe.cardCVV,
                            expirationMonth: $scope.subscribe.cardMonth,
                            expirationYear: $scope.subscribe.cardYear
                        }
                    };
                    console.log(data)

                    clientInstance.request({
                        endpoint: 'payment_methods/credit_cards',
                        method: 'post',
                        data: data
                    }, function (requestErr, response) {
                        if (requestErr) {
                            console.log('Got error:', requestErr);
                            console.log(requestErr.details);
                            $scope.fieldErrors = requestErr.details.originalError.fieldErrors;

                            for (var i = 0; i < $scope.fieldErrors.length; i++) {
                                if ($scope.fieldErrors[i].fieldErrors.length > 0) {
                                    for (var j = 0; j < $scope.fieldErrors[i].fieldErrors.length; j++) {
                                        if ($scope.fieldErrors[i].fieldErrors[j].message &&
                                                $scope.fieldErrors[i].fieldErrors[j].field != "base") {
                                            $scope.errorMessages
                                                    .push($scope.fieldErrors[i].fieldErrors[j].message);
                                        }
                                        if ($scope.fieldErrors[i].fieldErrors[j].fieldErrors) {
                                            if ($scope.fieldErrors[i].fieldErrors[j].fieldErrors.length > 0) {
                                                for (var k = 0; k < $scope.fieldErrors[i].fieldErrors[j].fieldErrors.length; k++) {
                                                    if ($scope.fieldErrors[i].fieldErrors[j].fieldErrors[k].message) {
                                                        $scope.errorMessages
                                                                .push($scope.fieldErrors[i].fieldErrors[j].fieldErrors[k].message);
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                            NProgress.done();
                            $("#page-content").css({
                                "opacity": "1",
                                "pointer-events": "all"
                            });
                            angular.forEach($scope.errorMessages, function (val, key) {
                                console.log(val);
                                $scope.notification(val);
                            })
                            console.log($scope.errorMessages);
                            $scope.$apply();
                        } else {
                            NProgress.done();
                            $("#page-content").css({
                                "opacity": "1",
                                "pointer-events": "all"
                            });
                            console.log('Got nonce:', response.creditCards[0].nonce);
                            var paymentInfo = {
                                "nonce": response.creditCards[0].nonce,
                                "amount": parseFloat($scope.subscribeData.total_amount_per_plan).toFixed(2),
                                "user_id": window.localStorage.userId,
                                "vendor_id": window.localStorage.vendorid,
                                "vendor_subscription_id": $scope.subscribeData.vendor_subscription_id,
                                'totalPrice': parseFloat($scope.subscribeData.total_amount_per_plan).toFixed(2),
                                'totalPriceAfterTax': parseFloat($scope.subscribeData.total_amount_per_plan).toFixed(2)
                            };
                            console.log(JSON.stringify(paymentInfo));
                            NProgress.start();
                            $("#page-content").css({
                                "opacity": "0.5",
                                "pointer-events": "none"
                            });
                            request.service('processSubscriptionBTPayment', 'post', paymentInfo, function (response) {
                                $("#page-content").css({
                                    "opacity": "1",
                                    "pointer-events": "all"
                                });
                                if (response.status == 0) {
                                    $scope.notification(response.message);
                                    $scope.subscribe.cardCVV = '';
                                    $scope.subscribe.cardMonth = ''
                                    $scope.subscribe.cardNumber = '';
                                    $scope.subscribe.cardYear = '';
                                    $scope.subscribe.subscriptionDetails = false;
                                    $scope.subscribe.subscriptionPlans = true;
                                    subScriptionInfoDetails();
                                }
                                console.log('Got response:', response);
                                NProgress.done();
                            });
                        }
                    });
                });
            }
        };
        $scope.validateFields = function () {
            var valid = "";
            var ccNumber = $("#ccNumber").val();
            var ccMonth = $("#ccMonth").val();
            var ccYear = $("#ccYear").val();
            var ccCvv = $("#ccCvv").val();
            if (ccNumber.trim() == "") {
                valid += "Enter credit card number";
                $("#ccNumberError").text("Enter credit card number");
            } else {
                $("#ccNumberError").text("");
            }
            if (ccMonth.trim() == "") {
                valid += "Enter expiry month";
                $("#ccMonthError").text("Enter expiry month");
            } else {
                $("#ccMonthError").text("");
            }
            if (ccYear.trim() == "") {
                valid += "Enter expiry year";
                $("#ccYearError").text("Enter expiry year");
            } else {
                $("#ccYearError").text("");
            }
            if (ccCvv.trim() == "") {
                valid += "Enter cvv code";
                $("#ccCvvError").text("Enter cvv code");
            } else {
                $("#ccCvvError").text("");
            }
            if (valid == "") {
                return true;
            } else {
                return false;
            }
        };
    }]);
app.directive('myLength', [function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attr, ctrl) {
                var maxlength = -1;
                attr.$observe('myLength', function (value) {
                    maxlength = value;
                });
                elm.bind('keypress', function (event) {
                    if (event.charCode) {
                        if (event.charCode < 48 || event.charCode > 57) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        if (elm[0].value.length > maxlength - 1) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                })
            }
        };
    }]);
