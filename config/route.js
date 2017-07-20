/*(function() {*/
var app = angular.module('arevea', ["ui.router", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap", "ngMap", "textAngular", 'angularUtils.directives.dirPagination', 'ui.select', 'angular-flatpickr']);

app.run(function ($rootScope, $location, $state, $document, $stateParams, $anchorScroll, $timeout, commonService) {
    $rootScope.$state = $state;
    $rootScope.loadderUrl = 'img/loader-old.gif';
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if ($state.params.id == '' || $state.params.id == undefined) {
            $('.mainContainer').animate({scrollTop: 0}, 500);
        }
        $rootScope.state_change($location.path());
    });
});
app.config(function ($stateProvider, $urlRouterProvider, uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('datePicker', {
                url: '/datePicker',
                templateUrl: 'templates/datePicker/datePickerView.html',
                controller: 'datePickerCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard/dashboard.html',
                controller: 'dashboardCtrl',
                data: {pageTitle: 'Dashboard'}
            })
            .state('My-Account', {
                url: '/My-Account',
                templateUrl: 'templates/myAccount.html',
                controller: 'myAccountCtrl',
                data: {pageTitle: 'My Account'}
            })
            .state('myBookings', {
                url: '/myBookings',
                templateUrl: 'templates/myBookings/myBookings.html',
                controller: 'myBookingsCtrl', //mybookings controller
                data: {pageTitle: 'My Bookings'}
            })
            .state('myBookings.all', {
                url: '/all/:id',
                templateUrl: 'templates/myBookings/myBookings.html',
                controller: 'myBookingsCtrl', //mybookings controller
                data: {pageTitle: 'My Bookings'}
            })
            .state('myBookings.scheduled', {
                url: '/scheduled/:id',
                templateUrl: 'templates/myBookings/myBookings.html',
                controller: 'myBookingsCtrl', //mybookings controller
                data: {pageTitle: 'My Bookings'}
            })
            .state('myBookings.completed', {
                url: '/completed/:id',
                templateUrl: 'templates/myBookings/myBookings.html',
                controller: 'myBookingsCtrl', //mybookings controller
                data: {pageTitle: 'My Bookings'}
            })
            .state('myPayments', {
                url: '/myPayments',
                templateUrl: 'templates/myPayments/myPayments.html',
                controller: 'myPaymentsCtrl', //mybookings controller
                data: {pageTitle: 'My Payments'}
            })
            .state('customRequests', {
                url: '/customRequests',
                templateUrl: 'templates/customRequests/customRequests.html',
                controller: 'customRequestsCtrl',
                data: {pageTitle: 'My Bookings'}
            })
            .state('customRequests.all', {
                url: '/all/:id',
                templateUrl: 'templates/customRequests/customRequests.html',
                controller: 'customRequestsCtrl',
                data: {pageTitle: 'My Custom Requests'}
            })
            .state('customRequests.completed', {
                url: '/completed/:id',
                templateUrl: 'templates/customRequests/customRequests.html',
                controller: 'customRequestsCtrl',
                data: {pageTitle: 'My Custom Requests'}
            })
            .state('customRequests.pending', {
                url: '/pending/:id',
                templateUrl: 'templates/customRequests/customRequests.html',
                controller: 'customRequestsCtrl',
                data: {pageTitle: 'My Custom Requests'}
            })

            .state('/Verification', {
                url: '/Verification',
                templateUrl: 'templates/Verification.html',
                controller: 'verificationCtrl',
                data: {pageTitle: 'Verification'}
            })
            .state('product_service_catalog', {
                url: '/product_service_catalog',
                templateUrl: 'templates/product/product_service_catalog.html',
                data: {pageTitle: 'My Products & Services'}
            })
            .state('product_service_catalog.Products', {
                url: '/Products',
                templateUrl: 'templates/product/Products.html',
                controller: 'productsCtrl',
                data: {pageTitle: 'My Products & Services'}
            })
            .state('product_service_catalog.addProduct', {
                url: '/addProduct',
                templateUrl: 'templates/product/productForm.html',
                controller: 'productsCtrl',
                data: {pageTitle: 'My Products & Services'}
            })
            .state('product_service_catalog.updateProduct', {
                url: '/updateProduct',
                templateUrl: 'templates/product/productForm.html',
                controller: 'productsCtrl',
                data: {pageTitle: 'My Products & Services'}
            })
            .state('Products.paragraph', {
                url: '/addProduct',
                templateUrl: 'templates/test2.html',
                controller: 'productsCtrl',
                data: {pageTitle: 'My Products & Services'}
            })
            .state('Sample', {
                url: '/Sample',
                templateUrl: 'templates/sampleTest.html',
                controller: 'homeCtrl'
            })


            .state('vendorSettings', {
                url: '/vendorSettings',
                templateUrl: 'templates/vendorSettings.html',
                controller: 'vendorSettingCtrl',
                data: {pageTitle: 'Vendor Settings'}
            })
            .state('vendorSettings.My-Account', {
                url: '/My-Account',
                templateUrl: 'templates/myAccount.html',
                controller: 'myAccountCtrl',
                data: {pageTitle: 'My Account'}
            })
            .state('vendorSettings.subscription', {
                url: '/subscription',
                templateUrl: 'templates/location/profileSettings.html',
                controller: 'profileSettingsCtrl',
                data: {pageTitle: 'Subscription'}
            })


            .state('vendorSettings.My-Account.tab1', {
                url: '/basicInfo',
                templateUrl: 'templates/myAccounts/basicInfo.html',
                controller: 'myAccountCtrl',
                data: {pageTitle: 'My Account'}
            })

            .state('vendorSettings.My-Account.tab2', {
                url: '/businessInfo',
                templateUrl: 'templates/myAccounts/businessInfo.html',
                controller: 'myAccountCtrl',
                data: {pageTitle: 'Business Information'}
            })

            .state('vendorSettings.My-Account.tab3', {
                url: '/bankInfotab',
                templateUrl: 'templates/myAccounts/bankInfotab.html',
                controller: 'myAccountCtrl',
                data: {pageTitle: 'Payment Settings'}
            })


            /* .state('vendorSettings.My-Account.tab2', {
             url: '/My-Account',
             templateUrl: 'templates/myAccount.html',
             controller: 'myAccountCtrl'
             })*/

            .state('vendorSettings.Securitysettings', {
                url: '/Securitysettings',
                templateUrl: 'templates/location/Securitysettings.html',
                controller: 'SecuritysettingsCtrl',
                data: {pageTitle: 'Security Settings'}
            })

            .state('vendorSettings.Location', {
                url: '/Location',
                templateUrl: 'templates/location/Location.html',
                controller: 'locationCtrl',
                data: {pageTitle: 'Location'}
            })
            .state('vendorSettings.addLocation', {
                url: '/addLocation',
                templateUrl: 'templates/location/locationForm.html',
                controller: 'locationCtrl',
                data: {pageTitle: 'Location'}
            })
            .state('vendorSettings.updateLocation', {
                url: '/updateLocation/:id',
                templateUrl: 'templates/location/locationForm.html',
                controller: 'locationCtrl',
                data: {pageTitle: 'Location'}
            })
            .state('calendar', {
                url: '/calendar',
                templateUrl: 'templates/calendarBusinessTime/calendar.html',
                controller: 'businessTimeCtrl',
                data: {pageTitle: 'Calendar'}
            })
            .state('calendar.availability2', {
                url: '/AvailabilityTiming2',
                templateUrl: 'templates/calendarBusinessTime/calendar_availability.html',
                controller: 'businessTimeCtrl',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.availability', {
                url: '/AvailabilityTiming',
                templateUrl: 'templates/calendarBusinessTime/calendar_availability2.html',
                controller: 'BusinessTimeController',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.availabilitycalendar', {
                url: '/AvailabilityCalendar',
                templateUrl: 'templates/calendarBusinessTime/availabelTimingCalendar.html',
                controller: 'BusinessTimeController',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.available_time_list', {
                url: '/available_time_list',
                templateUrl: 'templates/calendarBusinessTime/calendarAvlbTimeList.html',
                controller: 'businessTimeCtrl',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.update_available_time', {
                url: '/update_available_time/:id',
                templateUrl: 'templates/calendarBusinessTime/calendar_availability2.html',
                controller: 'BusinessTimeController',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.addcalendarEvent', {
                url: '/addcalendarEvent',
                templateUrl: 'templates/calendarEvent/calendarEventForm.html',
                controller: 'calendarEventCtrl',
                data: {pageTitle: 'My Calendar'}
            })
            .state('calendar.updatecalendarEvent', {
                url: '/updatecalendarEvent/:id',
                templateUrl: 'templates/calendarEvent/calendarEventForm.html',
                controller: 'calendarEventCtrl',
                data: {pageTitle: 'My Calendar'}
            })

            .state('calendar.calendarEventList', {
                url: '/calendarEventList',
                templateUrl: 'templates/calendarEvent/calendarEventList.html',
                controller: 'calendarEventCtrl',
                data: {pageTitle: 'My Calendar'}
            })
            .state('myMessages', {
                url: '/myMessages',
                templateUrl: 'templates/myMessages/myInquiries.html',
                controller: 'myMessagesCtrl',
                data: {pageTitle: 'My Messages'}
            })
            .state('mySupport', {
                url: '/mySupport',
                templateUrl: 'templates/myMessages/mySupport.html',
                controller: 'myMessagesCtrl',
                data: {pageTitle: 'My Support'}
            })
            .state('myAccount', {
                url: '/myAccount',
                templateUrl: 'templates/myMessages/myAccount.html',
                controller: 'myMessagesCtrl',
                data: {pageTitle: 'My Account'}
            });
//    $anchorScrollProvider.disableAutoScrolling();
});
//app.config(function ($provide) {
//    $provide.decorator('$uiViewScroll', function ($delegate) {
//        return function (uiViewElement) {
//            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
//            // Or some other custom behaviour...
//        };
//    });
//});

app.constant('Arevea_Constant', {
    week_days: [
        {name: "Sunday", id: 1},
        {name: "Monday", id: 2},
        {name: "Tuesday", id: 3},
        {name: "Wednesday", id: 4},
        {name: "Thursday", id: 5},
        {name: "Friday", id: 6},
        {name: "Saturday", id: 7}
    ]
});
