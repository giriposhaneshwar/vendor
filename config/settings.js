(function () {
    var app = angular.module('arevea');

    var request = function ($http, secure) {
        var setup = {
            'protocol': 'http',
            // 'host': '192.168.0.172', // local url
            // 'host' : 'localhost',
            // 'host':'192.168.0.108',

            // Local server settings
            // 'host' : '192.168.0.234',
            // //'host' : 'localhost',
            // 'servicehost' : '192.168.0.234',
            // 'port': '8000',
            // 'port_seperator':':',
            // 'vendor_portal':"/arevea/Arevea/branches/Web/Vendor",
            // 'customer_portal':"/arevea/Arevea/branches/Web/Customer",

            // DEV server Settings
            // 'host': '192.168.2.185',
            // 'servicehost' : '192.168.2.185',
            // 'port': '8000',
             
            // 'host': '192.168.3.118:8080', //local - Giri Office
//            'host': '192.168.1.105:8080', //local - Giri Home
            // 'host' : '192.168.1.104:8080',  		//local - Siri
//            'host': '192.168.0.211',
            
            'host': '192.168.2.158:8080', //local - Giri Office Wifi
            'vendor_portal': "/VendorV2",
            'customer_portal': "/customerV2/dist/",

//            'host': '111.93.0.178:8881', //active
//            'vendor_portal': "/Arevea/VendorV2",
//            'customer_portal': "/Arevea/customerV2",


            'servicehost': '111.93.0.178',
            'port': '8721',
            'port_seperator': ':',

            // QA Server settings
            /*
             * 'host': 'qa.arevea.com', 'servicehost' : 'qa.arevea.com',
             * 'vendor_portal':"/Vendor", 'customer_portal':"/Customer", 'port' :
             * 'arevea', 'port_seperator':'/',
             */

            'prefix': 'arevea',
            'paths': {
                login: '/vendorLogin',
                verifyToken: '/vendorVerifyToken',
                vendorResendVerification: '/vendorResendVerification',
                categoriesList: '/categoriesList',
                vendorBusiness: '/vendorBusiness',
                vendorChangePassword: '/vendorChangePassword',
                vendorGetLocationById: '/vendorGetLocationById',
                verifymail: '/verifymail',
                citiesList: '/citiesList',
                grossList: '/grossList',
                statesList: '/statesList',
                zipsList: '/zipsList',
                countriesList: '/countriesList',
                countriesListByName: '/countriesListByName',
                vendorBank: '/vendorBank',
                vendorMailconfirm: '/vendorMailconfirm',
                vendorGetLocations: '/vendorGetLocations',
                getTeamsByCategory: '/getTeamsByCategory',
                vendorAddLocation: '/vendorAddLocation',
                vendorUpdateLocation: '/vendorUpdateLocation',
                vendorDeleteLocation: '/vendorDeleteLocation',
                attributesByCategory: '/attributesByCategory',
                productStatus: '/productStatus',
                attrValuesByAttribute: '/attrValuesByAttribute',
                vendorById: '/vendorById',
                vendorBankById: '/vendorBankById',
                vendorCategories: '/vendorCategories',
                addProductCatalog: '/addProductCatalog',
                productsList: '/productsList',
                taxsList: '/taxsList',
                measuresList: '/measuresList',
                currencyList: '/currencyList',
                statesListByCountry: '/statesListByCountry',
                citiesListByCountry: '/citiesListByCountry',
                citiesListByState: '/citiesListByState',
                zipCodeByCity: '/zipCodeByCity',
                zipCodeByCityName: '/zipCodeByCityName',
                vendorBasicInfo: '/vendorBasicInfo',
                getVendorBasicInfo: '/getVendorBasicInfo',
                vendorAddCalendarEvent: '/vendorAddCalendarEvent',
                vendorAddCalendarEventProdNdLoc: '/vendorAddCalendarEventProdNdLoc',
                vendorGetCalendarEvent: '/vendorGetCalendarEvent',
                vendorUpdateCalendarEvent: '/vendorUpdateCalendarEvent',
                vendorDeleteCalendarEvent: '/vendorDeleteCalendarEvent',
                vendorAddBusinessTimes: '/vendorAddBusinessTimes',
                vendorGetBusinessTimes: '/vendorGetBusinessTimes',
                vendorUpdateBusinessTimes: '/vendorUpdateBusinessTimes',
                vendorDeleteBusinessTimes: '/vendorDeleteBusinessTimes',
                getProduct: '/getProduct',
                deleteProduct: '/deleteProduct',
                deleteFromProductLocationsById: '/deleteProductLocation',
                deleteProductAttributeByID: '/deleteProductAttribute',
                deleteFromProductMediaById: '/deleteProductMedia',
                dashBoardCounts: '/dashBoardCounts',
                myBookings: '/myBookings',
                eventsList: '/eventsList',
                getCustomRequestVendors: '/getCustomRequestVendors',
                quotationSent: '/quotationSent',
                checkTagsProductExists: '/checkTagsProductExists',
                uponExpirationChangeStatus: '/uponExpirationChangeStatus',
                getMessagesByType: '/getMessagesByType',
                getMessageDetailsByMessageId: '/getMessageDetailsByMessageId',
                getMessageFeaturesByMessageCategory: '/getMessageFeaturesByMessageCategory',
                getMessageTypeByMessageFeatureId: '/getMessageTypeByMessageFeatureId',
                createMessage: '/createMessage',
                updateMessage: '/updateMessage',
                updateMessageStatus: '/updateMessageStatus',
                getProductsByCatLocVend: '/getProductsByCatLocVend',
                getReviewById: '/getReviewById',
                vendorAddBusinessTimesProdNdLoc: '/vendorAddBusinessTimesProdNdLoc',
                vendorUpdateCalendarEventProdNdLoc: '/vendorUpdateCalendarEventProdNdLoc',
                vendorUpdateBusinessTimesProdNdLoc: '/vendorUpdateBusinessTimesProdNdLoc',
                getSubScriptionInfo: '/getSubScriptionInfo',
                checkVendorBussinessTimes: '/checkVendorBussinessTimes',
                addNewSubscribtion: '/addNewSubscribtion',
                getSubScriptionInfoDetailsByVendor: '/getSubScriptionInfoDetailsByVendor',
                getBTClientToken: '/getBTClientToken',
                processSubscriptionBTPayment: '/processSubscriptionBTPayment',
                checkVendorCalendar: '/checkVendorCalendar',
                vendorGetLocationById: '/vendorGetLocationById',
                vendorChangePassword: '/vendorChangePassword',
                vendorPaymentsByEventID: '/vendorPaymentsByEventID',
                getTeams: '/getTeams',
                deleteTeam: '/deleteTeam',
                createTeam: '/createTeam',
                updateTeam: '/updateTeam',
                vendorGetLocations: '/vendorGetLocations',
                vendorCategories: '/vendorCategories',
                vendorServiceCategories: '/vendorServiceCategories',
                deleteUserFromTeam: '/deleteUserFromTeam',
                assignTeamToUser: '/assignTeamToUser',
                assignUserToTeam: '/assignUserToTeam',
                getUsersToAssignTeam: '/getUsersToAssignTeam',
                getTeamMembers: '/getTeamMembers',
                updateTeamMember: '/updateTeamMember',
                createTeamMember: '/createTeamMember',
                deleteTeamMember: '/deleteTeamMember',
                getTeamUsersByTeamID: '/getTeamUsersByTeamID',
                downloadTeamMemberTemplate: '/downloadTeamMemberTemplate',
                importTeamMemberTemplate: '/importTeamMemberTemplate',
                getTeamsByCatAndLoc: '/getTeamsByCatAndLoc',
                getAvailableUsersByTeamID: '/getAvailableUsersByTeamID',
                assignUsersToBooking: '/assignUsersToBooking',
                getAssignedTeamUsersForBooking: '/getAssignedTeamUsersForBooking',
                removeFromVendorAssignment: '/removeFromVendorAssignment',
                getUserAssignments: '/getUserAssignments',
                getTeamMembersByID: '/getTeamMembersByID'
            },
            'url': function (key) {
                if (setup.paths.hasOwnProperty(key)) {
                    return setup.protocol + '://' + setup.servicehost
                            + setup.port_seperator + setup.port + '/'
                            + setup.prefix + setup.paths[key]
                } else {
                    return 'invalid service';
                }
            }
        }

        // Making a service call
        var serviceCall = function (key, type, input, cb) {
            // if (type == 'delete') {
            // console.log("Type : ", type, ' :: ', setup.url(key), ' :: ',
            // input);
            // input = JSON.stringify(input);
            // $.ajax({
            // url: setup.url(key),
            // type: 'DELETE',
            // dataType: 'text json',
            // data: input,
            // contentType: 'application/json; charset=utf-8',
            // cache: false,
            // success: function (data) {
            // console.log("DELETE SUCCESS :: ", data);
            // cb(data);
            // },
            // error: function (err) {
            // console.log("ERROR DELETE EVENT :: ", err)
            // var data = {statusMessage: 'Server is down. Please try after some
            // time.'}
            // cb(data);
            // }
            // });
            //
            // } else {

            $http[type]
                    (setup.url(key), input)
                    .success(function (data) {
                        if (cb) {
                            cb(data);
                        }

                    })
                    .error(
                            function (err) {
                                console.log('ERROR :: ', err);
                                var data = {
                                    statusMessage: 'Server is down. Please try after some time.'
                                }
                                cb(data);
                            });
            // }
        }

        var setObj = function (key, data) {
            window.sessionStorage.setItem(secure.encode(key), secure
                    .encode(JSON.stringify(data)))
        }
        var getObj = function (key) {
            var obj = window.sessionStorage.getItem(secure.encode(key));
            if (obj) {
                var obj = secure.decode(obj);
                try {
                    return JSON.parse(obj);
                } catch (e) {
                    return {
                        distrub: true
                    }
                }
            } else {
                return null;
            }
        }

        var setItem = function (key, data) {
            window.sessionStorage.setItem(secure.encode(key), secure
                    .encode(data));
        }
        var getItem = function (key) {
            var item = window.sessionStorage.getItem(secure.encode(key));
            if (item) {
                return secure.decode(item);
            } else {
                return null;
            }
        }

        var removeItem = function (key) {
            window.sessionStorage.removeItem(secure.encode(key));
        }

        var sortNumber = function (a, b) {
            return a - b;
        }

        var parse = function (data) {
            if (typeof data == 'string') {
                try {
                    data = JSON.parse(data)
                    if (data.length >= 0) {
                        data = {data: data};
                    }
                } catch (err) {
                }
                return data;
            } else {
                return data;
            }
        }

        return {
            'service': serviceCall,
            'setObj': setObj,
            'getObj': getObj,
            'setItem': setItem,
            'getItem': getItem,
            'removeItem': removeItem,
            'setup': setup,
            'sort': sortNumber,
            'parse': parse
        }
    }
    app.factory('request', ['$http', 'secure', request]);

    app.directive('ckEditor', [function () {
            return {
                require: '?ngModel',
                link: function ($scope, elm, attr, ngModel) {
                    var ck = CKEDITOR.replace(elm[0]);

                    ck.on('pasteState', function () {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(ck.getData());
                        });
                    });

                    ngModel.$render = function (value) {
                        ck.setData(ngModel.$modelValue);
                    };
                }
            };
        }]);

    app.service('ctrlComm', function () {
        var ctrlPocket = {};
        var put = function (key, value) {
            ctrlPocket[key] = value;
        };
        var get = function (key) {
            return ctrlPocket[key];
        };
        var del = function (key) {
            delete ctrlPocket[key];
        };
        return {
            put: put,
            get: get,
            del: del
        };
    });

    // app.controller('confirmBoxCtrl', ['$scope', '$modalInstance', 'input',
    // function ($scope, $modalInstance, input) {
    // $scope.input = input;
    // $scope.ok = function () {
    // $modalInstance.close(true);
    // };

    // $scope.cancel = function () {
    // $modalInstance.dismiss('cancel');
    // };
    // }]);

    app.directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        scope.$apply(function () {
                            console.log(element[0].files[0])
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);

    app.directive('callDate', function ($timeout, $parse) {
        return {
            // scope: true, // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.callDate);
                scope.$watch(model, function (value) {
                    console.log("scope" + value)
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });

    app.service('fileUpload', ['$http', 'request', function ($http, request) {
            this.uploadFileToUrl = function (file, key, obj, url, config, cb) {
                var fd = new FormData();
                console.log(file)
                fd.append(key, file);
                fd.append('jsondata', JSON.stringify(obj))

                $http.post(request.setup.url(url), fd, {
                    transformRequest: angular.identity,
                }).success(function (data) {
                    if (cb)
                        cb(data);
                    console.log("-------- success ", data);
                }).error(function (err) {
                    if (cb)
                        cb(err);
                    console.log("-------- error ", err);
                });
            }
        }]);

    app
            .directive(
                    'autoComplete',
                    function (ctrlComm) {
                        return {
                            restrict: 'A',
                            link: function (scope, ele, attrs, request) {

                                var autocomplete = new google.maps.places.Autocomplete(
                                        $("#hashtag")[0], {});

                                google.maps.event
                                        .addListener(
                                                autocomplete,
                                                'place_changed',
                                                function () {
                                                    var place = autocomplete
                                                            .getPlace();
                                                    var o = place.address_components;
                                                    // console.log("location
                                                    // =================================
                                                    // ", place)
                                                    console.log("location ================================= ", o)

                                                    var loc = o;

                                                    if (typeof o == 'object') {
                                                        var l = Object.keys(o).length
                                                        console.log(l);
                                                        var location = '';
                                                        for (var i in o) {
                                                            i = parseInt(i);
                                                            console
                                                                    .log(i
                                                                            + '--'
                                                                            + o[i].types[0]
                                                                            + "--"
                                                                            + o[i].long_name
                                                                            + "***"
                                                                            + location);
                                                            if (o[i].types[0] == "sublocality_level_1")
                                                                location += ' '
                                                                        + o[i].long_name
                                                            if (o[i].types[0] == "sublocality_level_2")
                                                                location += ' '
                                                                        + o[i].long_name

                                                            if ((i + 1) != l) {
                                                                if (i == 0) {
                                                                    location += ' '
                                                                            + o[i].long_name
                                                                } else {
                                                                    location += ' - '
                                                                            + o[i].long_name
                                                                }
                                                            } else {
                                                                if (o[i].long_name.length == 6) {
                                                                    if (i == 0) {
                                                                        location += ' '
                                                                                + o[i].long_name
                                                                    } else {
                                                                        location += ' - '
                                                                                + o[i].long_name
                                                                    }
                                                                    location += ', '
                                                                            + o[i].long_name
                                                                }
                                                                // else if (o[i
                                                                // - 1] && o[i -
                                                                // 1].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 1].long_name
                                                                // } else if
                                                                // (o[i - 2] &&
                                                                // o[i -
                                                                // 2].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 2].long_name
                                                                // } else if
                                                                // (o[i - 3] &&
                                                                // o[i -
                                                                // 3].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 3].long_name
                                                                // } else if
                                                                // (o[i - 4] &&
                                                                // o[i -
                                                                // 4].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 4].long_name
                                                                // } else if
                                                                // (o[i - 5] &&
                                                                // o[i -
                                                                // 5].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 5].long_name
                                                                // } else if
                                                                // (o[i - 6] &&
                                                                // o[i -
                                                                // 6].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 6].long_name
                                                                // } else if
                                                                // (o[i - 7] &&
                                                                // o[i -
                                                                // 7].long_name.length
                                                                // > 2) {
                                                                // location +=
                                                                // ', ' + o[i -
                                                                // 7].long_name
                                                                // }
                                                                else {
                                                                    location += ', '
                                                                }

                                                            }

                                                            console
                                                                    .log(
                                                                            i
                                                                            + "++",
                                                                            o[i],
                                                                            "++"
                                                                            + "++"
                                                                            + location);
                                                        }

                                                        console
                                                                .log(
                                                                        "location ================================= ",
                                                                        location)

                                                        scope.change1(loc,
                                                                location);

                                                        ctrlComm.put(
                                                                'location',
                                                                location);
                                                    }
                                                });
                            }
                        }
                    });
    app.directive('format', ['$filter', function ($filter) {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    if (!ctrl)
                        return;

                    ctrl.$formatters.unshift(function (a) {
                        return $filter(attrs.format)(ctrl.$modelValue)
                    });

                    ctrl.$parsers.unshift(function (viewValue) {
                        var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                        elem.val($filter(attrs.format)(plainNumber));
                        return plainNumber;
                    });
                }
            };
        }]);
    /*
     * app.directive('realTimeCurrency', function ($filter, $locale) { var
     * decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP; var toNumberRegex = new
     * RegExp('[^0-9\\' + decimalSep + ']', 'g'); var trailingZerosRegex = new
     * RegExp('\\' + decimalSep + '0+$'); var filterFunc = function (value) {
     * return $filter('currency')(value).split('$')[1]; //return
     * $filter('currency')(value, '', '').split('.')[0]; };
     * 
     * function getCaretPosition(input){ if (!input) return 0; if
     * (input.selectionStart !== undefined) { return input.selectionStart; }
     * else if (document.selection) { // Curse you IE input.focus(); var
     * selection = document.selection.createRange();
     * selection.moveStart('character', input.value ? -input.value.length : 0);
     * return selection.text.length; } return 0; }
     * 
     * function setCaretPosition(input, pos){ if (!input) return 0; if
     * (input.offsetWidth === 0 || input.offsetHeight === 0) { return; //
     * Input's hidden } if (input.setSelectionRange) { input.focus();
     * input.setSelectionRange(pos, pos); } else if (input.createTextRange) { //
     * Curse you IE var range = input.createTextRange(); range.collapse(true);
     * range.moveEnd('character', pos); range.moveStart('character', pos);
     * range.select(); } }
     * 
     * function toNumber(currencyStr) { return
     * parseFloat(currencyStr.replace(toNumberRegex, ''), 10); }
     * 
     * return { restrict: 'A', require: 'ngModel', link: function
     * postLink(scope, elem, attrs, modelCtrl) {
     * modelCtrl.$formatters.push(filterFunc); modelCtrl.$parsers.push(function
     * (newViewValue) { var oldModelValue = modelCtrl.$modelValue; var
     * newModelValue = toNumber(newViewValue); modelCtrl.$viewValue =
     * filterFunc(newModelValue); var pos = getCaretPosition(elem[0]);
     * elem.val(modelCtrl.$viewValue); var newPos = pos +
     * modelCtrl.$viewValue.length - newViewValue.length; if ((oldModelValue ===
     * undefined) || isNaN(oldModelValue)) { newPos -= 3; }
     * setCaretPosition(elem[0], newPos); return newModelValue; }); } };// });
     */
    // app.filter('timeInShort',function(){
    // return function (input){
    // if(typeof input != 'string'){
    // var d = new Date(input);
    // var w = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // var m =
    // ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    // if(d.getDate() < 10){ var day = '0'+parseInt(d.getDate());
    // }else{ var day = d.getDate();
    // }
    // var yy = d.getFullYear().toString().substr(2,4);
    // return yy+"'"+m[d.getMonth()]+'-'+day+' '+w[d.getDay()];;
    // }else{
    // return input;
    // }
    // }
    // });
})();
