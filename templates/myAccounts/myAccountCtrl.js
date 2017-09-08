/*(function() {
 */
var app = angular.module('arevea');
app.controller('myAccountCtrl', function ($scope, $rootScope, $location, request, ctrlComm, $filter, fileUpload, $timeout, $http, $window, $state, NgMap) {
    console.log("in my accounts ctrl");
    console.log("accountsController - $scope.admin", $scope.admin);
    $scope.verifyVendorStatus();
    $scope.user = {};
    $scope.vendor = {};
    $scope.bank = {};
    $scope.err = {};
    $scope.err1 = {};
    $scope.err2 = {};
    $scope.fieldDisabledes = {};
    $scope.tab = 1;
    $scope.catList = [];
    $scope.categoriesList = [];
    var availableTimeZones = [
        "(GMT-12:00) International Date Line West",
        "(GMT-11:00) Midway Island, Samoa",
        "(GMT-10:00) Hawaii",
        "(GMT-09:00) Alaska",
        "(GMT-08:00) Pacific Time (US & Canada)",
        "(GMT-08:00) Tijuana, Baja California",
        "(GMT-07:00) Arizona",
        "(GMT-07:00) Chihuahua, La Paz, Mazatlan",
        "(GMT-07:00) Mountain Time (US & Canada)",
        "(GMT-06:00) Central America",
        "(GMT-06:00) Central Time (US & Canada)",
        "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
        "(GMT-06:00) Saskatchewan",
        "(GMT-05:00) Bogota, Lima, Quito, Rio Branco",
        "(GMT-05:00) Eastern Time (US & Canada)",
        "(GMT-05:00) Indiana (East)",
        "(GMT-04:00) Atlantic Time (Canada)",
        "(GMT-04:00) Caracas, La Paz",
        "(GMT-04:00) Manaus",
        "(GMT-04:00) Santiago",
        "(GMT-03:30) Newfoundland",
        "(GMT-03:00) Brasilia",
        "(GMT-03:00) Buenos Aires, Georgetown",
        "(GMT-03:00) Greenland",
        "(GMT-03:00) Montevideo",
        "(GMT-02:00) Mid-Atlantic",
        "(GMT-01:00) Cape Verde Is.",
        "(GMT-01:00) Azores",
        "(GMT+00:00) Casablanca, Monrovia, Reykjavik",
        "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
        "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
        "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
        "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",
        "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
        "(GMT+01:00) West Central Africa",
        "(GMT+02:00) Amman",
        "(GMT+02:00) Athens, Bucharest, Istanbul",
        "(GMT+02:00) Beirut",
        "(GMT+02:00) Cairo",
        "(GMT+02:00) Harare, Pretoria",
        "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
        "(GMT+02:00) Jerusalem",
        "(GMT+02:00) Minsk",
        "(GMT+02:00) Windhoek",
        "(GMT+03:00) Kuwait, Riyadh, Baghdad",
        "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
        "(GMT+03:00) Nairobi",
        "(GMT+03:00) Tbilisi",
        "(GMT+03:30) Tehran",
        "(GMT+04:00) Abu Dhabi, Muscat",
        "(GMT+04:00) Baku",
        "(GMT+04:00) Yerevan",
        "(GMT+04:30) Kabul",
        "(GMT+05:00) Yekaterinburg",
        "(GMT+05:00) Islamabad, Karachi, Tashkent",
        "(GMT+05:00) Islamabad, Karachi, Tashkent",
        "(GMT+05:30) Sri Jayawardenapura",
        "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "(GMT+05:45) Kathmandu",
        "(GMT+06:00) Almaty, Novosibirsk",
        "(GMT+06:00) Astana, Dhaka",
        "(GMT+06:30) Yangon (Rangoon)",
        "(GMT+07:00) Bangkok, Hanoi, Jakarta",
        "(GMT+07:00) Krasnoyarsk",
        "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
        "(GMT+08:00) Kuala Lumpur, Singapore",
        "(GMT+08:00) Irkutsk, Ulaan Bataar",
        "(GMT+08:00) Perth",
        "(GMT+08:00) Taipei",
        "(GMT+09:00) Osaka, Sapporo, Tokyo",
        "(GMT+09:00) Seoul",
        "(GMT+09:00) Yakutsk",
        "(GMT+09:30) Adelaide",
        "(GMT+09:30) Darwin",
        "(GMT+10:00) Brisbane",
        "(GMT+10:00) Canberra, Melbourne, Sydney",
        "(GMT+10:00) Hobart",
        "(GMT+10:00) Guam, Port Moresby",
        "(GMT+10:00) Vladivostok",
        "(GMT+11:00) Magadan, Solomon Is., New Caledonia",
        "(GMT+12:00) Auckland, Wellington",
        "(GMT+12:00) Fiji, Kamchatka, Marshall Is.",
        "(GMT+13:00) Nuku'alofa",
    ];
    $("#tags").autocomplete({
        source: availableTimeZones,
        minLength: 0,
        appendTo: ".timeZoneHolder",
        change: function (event, ui) {
//            console.log("Changed", ui);
            if (ui.item != undefined) {
                $scope.user.timezone = ui.item.value;
            } else {
                $scope.user.timezone = "";
            }
        }
    }).focus(function () {
        $(this).data("autocomplete").search($(this).val());
    });
    $scope.change = {
        newPassword: '',
        retypePassword: ''
    };
    /*$scope.disableTimezone = true;
     $scope.changeTimeZone = function () {
     $scope.disableTimezone = false;
     };*/
    $scope.disablePassword = true;
    $scope.changePassword = function () {
        $('#vednorChangePwd').show();
        $('#vendorPwd').hide();
    };
    $scope.cancelChangePwd = function () {
        $scope.changePass = {};
        $scope.passwordError = {pass1: {status: false, message: ""}, pass2: {status: false, message: ""}, pass3: {status: false, message: ""}, status: false};
        $('#vednorChangePwd').hide();
        $('#vendorPwd').show();
    };
    $('input[type="file"]').change(function () {
        if ($(this).val() != "") {
            $(this).css('color', '#333');
        } else {
            $(this).css('color', 'transparent');
        }
    });
    $scope.passwordError = {pass1: {status: false, message: ""}, pass2: {status: false, message: ""}, pass3: {status: false, message: ""}, status: false};
    $scope.checkCharacterEntry = function (e, data, key) {
        console.log("password ", data, key);
        var dta = {data1: data.newPassword, data2: data.retypePassword,data3:data.currentPassword};
        if(dta["data" + key] == undefined)
        {
        	 $scope.passwordError["pass" + key].status = true;
             $scope.passwordError["pass" + key].message = 'Password cannot contain whitespace!';
             $scope.passwordError.status = false;
             return false;
        }
        else if (!(/^\S{1,}$/.test(dta["data" + key]))) {
            $scope.passwordError["pass" + key].status = true;
            $scope.passwordError["pass" + key].message = 'Password cannot contain whitespace!';
            $scope.passwordError.status = false;
            return false;
        } else if (dta["data" + key] != undefined && dta["data" + key].length < 5 && dta["data" + key].length > 0) {
            $scope.passwordError["pass" + key].status = true;
            $scope.passwordError["pass" + key].message = "Please enter password with at least 5 letters";
            $scope.passwordError.status = false;
            return false;
        } else if (data != undefined && key == 2 && dta.data2 != dta.data1) {
            $scope.passwordError["pass" + key].status = true;
            $scope.passwordError["pass" + key].message = "Password does not match!";
            $scope.passwordError.status = false;
        } else {
            $scope.passwordError["pass" + key].status = false;
            $scope.passwordError["pass" + key].message = '';
            $scope.passwordError.status = true;
            return undefined;
        }
    }
    $scope.updatePassword = function (data) {
        //    debugger;
        if ($scope.passwordError.status) {
            request.service('vendorChangePassword', 'post', {
                userid: $scope.admin.userId,
                newpassword: data.newPassword,
                currentPassword:data.currentPassword
            }, function (response) {
                if (response != undefined && response.status == 0) {
                    $scope.notification(response.message, 'success');
                    $scope.cancelChangePwd();
                } else if (response != undefined && response.status == 1) {
                    $scope.notification(response.message, 'danger');
                }
            });
        } else if (data == undefined) {
        	$scope.passwordError.pass3.status=true;
        	$scope.passwordError.pass3.message='Please fill required field';;
            $scope.passwordError.pass1.status = true;
            $scope.passwordError.pass2.status = true;
            $scope.passwordError.pass1.message = 'Please fill required field';
            $scope.passwordError.pass2.message = 'Please fill required field';

            return false;
        } else {
            $scope.passwordError.pass1.status = true;
            $scope.passwordError.pass2.status = true;
            $scope.passwordError.pass3.status = true;
            $scope.passwordError.pass3.message='Password should be of min. 5 characters and no spaces';
            $scope.passwordError.pass1.message = 'Password should be of min. 5 characters and no spaces';
            $scope.passwordError.pass2.message = 'Password should be of min. 5 characters and no spaces';

            return false;
        }
    }
    console.log("in myAccountCtrl" + angular.toJson($scope.admin))
    $scope.user = $scope.admin;
    $scope.goToAccount = function () {
        console.log("clicked goToAccount");
        $state.go("vendorSettings.My-Account.tab3");
        getVendorBankById();
    }
    if ($rootScope.myAccountTab == 3) {
        $scope.goToAccount();
        //delete $rootScope.myAccountTab;
    }
    console.log($scope.user)
    var map;
    var geocoder;
    var category = [];
    var savecat = [];
    $scope.vendor.bYear = new Date().getFullYear();
    $scope.yearsList = [];
    for (var i = 0; i <= 50; i++) {
        var params = {};
        params.value = new Date().getFullYear() - i;
        $scope.yearsList.push(params)
    }
    $timeout(function () {
        $('#businessDate').flatpickr({
            enableTime: false,
            dateFormat: 'm-d-Y',
            onClose: function (selectedDates, dateStr, instance) {
                // Set the minDate of 'to' as the selectedDate of 'from'
//                $("#businessDate").flatpickr({minDate: selectedDates});
            }
        });
    }, 400);

//    $('body').on('click', "#businessDate", function () {

//        $("#businessDate").focus();
//            $('#businessDate').datetimepicker({
//                minDate: '0',
//                timepicker: false,
//                format: 'm-d-Y',
//                onClose: function (selectedDate) {
//                    // Set the minDate of 'to' as the selectedDate of 'from'
//                    $("#businessDate").datetimepicker("option", "minDate", selectedDate);
//                },
//                onChangeDateTime: function (dp, $input) {
//                    $("#businessDate").datetimepicker('hide');
//                }
//            });

//    });
    $scope.goToBasic = function () {
        $state.go("vendorSettings.My-Account.tab1");
        console.log("clicked goToBasic");
        getVendorBasicInfo();
    }

    $scope.goToBusiness = function () {
        //$scope.tab = 2;
        $state.go("vendorSettings.My-Account.tab2");
        console.log("clicked goToBusiness");
        getVendorBusiness();
    }




    if ($location.path() == '/vendorSettings/My-Account/basicInfo') {
        console.log("basicInfo")
        $('#aa').addClass('tab_active');
        $('#bb').removeClass('tab_active');
        $('#cc').removeClass('tab_active');
        $('#liner').addClass('liner1');
    } else if ($location.path() == '/vendorSettings/My-Account/businessInfo') {
        console.log("businessInfo")

        getVendorBusiness();
        $('#bb').addClass('tab_active');
        $('#aa').removeClass('tab_active');
        $('#cc').removeClass('tab_active');
        $('#liner').addClass('liner1');
    } else if ($location.path() == '/vendorSettings/My-Account/bankInfotab') {
        console.log("bankInfotab")
        getVendorBankById();
        $('#cc').addClass('tab_active');
        $('#bb').removeClass('tab_active');
        $('#aa').removeClass('tab_active');
        $('#liner').addClass('liner1');
    }
    $rootScope.$on('setTitle', function (event, title) {

        console.log(event);
        console.log(title);
        if (title == '1') {
            $timeout(function () {
                $rootScope.title = title;
                console.log(title);
                $scope.goToBasic()

            }, 100);
        } else if (title == '2') {
            $timeout(function () {
                $rootScope.title = title;
                console.log(title);
                $scope.goToBusiness();
            }, 100);
        } else if (title == '3') {
            $timeout(function () {
                $rootScope.title = title;
                console.log(title);
                $scope.goToAccount();
            }, 100);
        }


    });
    $scope.sidemenu = function (result) {

        console.log(result);
        if (result == '1') {
            $timeout(function () {
                $rootScope.title = result;
                console.log(result);
                $scope.goToBasic()
            }, 100);
        } else if (result == '2') {
            $timeout(function () {
                $rootScope.title = result;
                console.log(result);
                $scope.goToBusiness();
            }, 100);
        } else if (result == '3') {
            $timeout(function () {
                $rootScope.title = result;
                console.log(result);
                $scope.goToAccount();
            }, 100);
        }

    }



//request.service('vendorCategories', 'post', { 'vendor_id': $scope.admin.vendorid }, function(response) {

//})

    request.service('categoriesList', 'get', '', function (response) {
        $scope.categoriesList = response;
        angular.forEach($scope.catList, function (obj) {
            angular.forEach($scope.categoriesList, function (obj1) {
                if (Number(obj) == obj1.id) {
                    obj1['status'] = true;
                }
            })
        })
    })



    getVendorBasicInfo();
    $scope.getPicDetail = function (ele) {
        console.log("eeee", ele);
        if (ele.files && ele.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#profpic').attr('src', e.target.result);
            }
            reader.readAsDataURL(ele.files[0]);
            $scope.vendorImage = $('#propic')[0].files[0];
        }
        console.log("$scope.vendorImage", $scope.vendorImage, $scope.admin.userId);
        var fd = new FormData();
        fd.append('file', $scope.vendorImage);
        fd.append('userId', $scope.admin.userId);
        var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
        $http.post(serviceURL + "/updateProfilePicture", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
                .success(function (response) {
                    console.log(response);
                    $scope.admin.vendor.profile_pic_path = request.setup.protocol + "://" + request.setup.host + "/uploads/profileImages/" + response.profileImage;
                    //$scope.notification(response.message);
                    location.reload();
                })
    };
    $scope.Vendor = localStorage.vendor;
    $scope.markers = [];
    var marker, map;
    function getVendorBusiness() {
        request.service('categoriesList', 'get', '', function (response) {
            $scope.categoriesList = response;
            angular.forEach($scope.catList, function (obj) {
                angular.forEach($scope.categoriesList, function (obj1) {
                    if (Number(obj) == obj1.id) {
                        obj1['status'] = true;
                    }
                })
            })
        })

        console.log("$scope.admin from getVendorBusiness", $scope.admin);
        request.service('vendorById', 'post', {
            'vendor_id': $scope.admin.vendorid
        }, function (response) {
//            debugger;
            ctrlComm.put('userObj1', response);
            if (response.logo1 != null && response.logo != '')
            {
                $scope.admin.vendor.logo = response.logo;
            }
            $scope.vendor = response;
            $scope.vendor.phone_number = $scope.vendor.phone_number;
            $scope.categori_display = response.category;
            console.log("mmmmmm", $scope.categori_display)

            if ($scope.categori_display != null) {
                var cat_display = $scope.categori_display.split(',');
            } else {
                var cat_display = $scope.categori_display;
            }
            console.log("cat_display", cat_display)

            if (cat_display !== null) {
                for (k = 0; k < cat_display.length; k++) {
                    console.log("cat_display", cat_display[k])
                    if (cat_display[k] == "2" || cat_display[k] == "3" || cat_display[k] == "11" || cat_display[k] == "12") {
                        console.log("yessssssssssss")
                        $scope.Category_price = true
                    } else {
                        console.log("noooooooooooo")
                        $scope.Category_price1 = false
                    }
                }
            }

            if ($scope.vendor.delivery_slabs) {
                console.log("inside ");
                $scope.schedulelines = JSON.parse($scope.vendor.delivery_slabs);
            }
            console.log("999999", typeof $scope.schedulelines)


            if ($scope.vendor.longitude == undefined && $scope.vendor.latitude == undefined) {
                $scope.map_call(response);
            }


            console.log("ttttttt", response)
            console.log("ttttttt", ctrlComm.get('userObj1'))

            console.log("$scope.vendor", $scope.vendor)
            $scope.lat = $scope.vendor.latitude;
            $scope.lng = $scope.vendor.longitude;
            $scope.map = {
                center: {
                    latitude: $scope.lat,
                    longitude: $scope.lng
                },
                zoom: 15
            };
            $scope.test_map = $scope.lat + ", " + $scope.lng;

            console.log("$scope.categoriesList", $scope.categoriesList);
            if (response.category !== null && response.category.split(',') != undefined) {
                var categorylist = (response.category == null) ? [] : response.category.split(',');
                $scope.catList = categorylist;
                angular.forEach(categorylist, function (obj) {
                    angular.forEach($scope.categoriesList, function (obj1) {
                        if (Number(obj) == obj1.id) {
                            obj1['status'] = true;
                        }
                    })
                })
            }
//            debugger;
            if ($scope.vendor.logo.split('/')[6] == "" || $scope.vendor.logo.split('/')[6] == 'null') {
                $scope.vendor.logo = undefined;
            }
            if ($scope.vendor.licence_document.split('/')[6] == "" || $scope.vendor.licence_document.split('/')[6] == 'null') {
                $scope.vendor.licence_document = undefined
            }
            if ($scope.vendor.w9form.split('/')[6] == "" || $scope.vendor.w9form.split('/')[6] == 'null') {
                $scope.vendor.w9form = undefined;
            }
            $scope.vendor.expDate = $filter('date')($scope.vendor.expDate, "MM-dd-yyyy");

            if ($scope.vendor.address.split(',')[0] == null) {
                $scope.vendor.address = '';
            }
            $scope.vendor.address = $scope.vendor.address.replace(/,\s*$/, "");
            console.log(" $scope.vendor.address", $scope.vendor.address)
            $scope.cat = $scope.vendor.category;
//            category = [];
//            $scope.catList = [];
//            angular.forEach($scope.categoriesList, function (obj) {
//                if (obj.status == true) {
//                    if (category.indexOf(obj.id) == -1) {
//                        category.push(obj.id);
//                        $scope.catList.push(obj.id);
//                    }
//                }
//            })
            $scope.fieldDisabledes.licenseNo = false;
            $scope.fieldDisabledes.issuerName = false;
            $scope.fieldDisabledes.expDate = false;
            if ($scope.admin.venodorVStatus == 4) {
                console.log($scope.vendor.licenseNo)
                if ($scope.vendor.licenseNo != undefined) {
                    $scope.fieldDisabledes.licenseNo = true;
                }
                console.log($scope.vendor.issuerName)
                if ($scope.vendor.issuerName != undefined) {
                    $scope.fieldDisabledes.issuerName = true;
                }
                console.log($scope.vendor.expDate)
                if ($scope.vendor.expDate != undefined) {
                    $scope.fieldDisabledes.expDate = true;
                }
            }
        })

    }


/////////////////////////delivery slabs ////////////////////////

    var squnum = ''
    $scope.demo = function (val, i) {

        /* if (val == 0) {
         $scope.schedulelines[i].from = '';
         }*/
        if (val) {
            if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.schedulelines[i].from = squnum;
                } else {
                    $scope.schedulelines[i].from = '';
                }
            } else {
                squnum = val;
            }
        }
    }


    var squnum1 = ''
    $scope.demo1 = function (val, i) {

        /*if (val == 0) {
         $scope.schedulelines[i].to = '';
         }*/
        if (val) {
            if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.schedulelines[i].to = squnum1;
                } else {
                    $scope.schedulelines[i].to = '';
                }
            } else {
                squnum1 = val;
            }
        }
    }



    var squnum2 = ''
    $scope.demo2 = function (val, i) {

        /*if (val == 0) {
         $scope.schedulelines[i].cost = '';
         }*/
        if (val) {
            if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.schedulelines[i].cost = squnum2;
                } else {
                    $scope.schedulelines[i].cost = '';
                }
            } else {
                squnum2 = val;
            }
        }
    }




/////////////////////////delivery slabs ////////////////////////






////////////////////////////////open ng-map////////////////////////////////////////////////////////////





    NgMap.getMap().then(function (map) {
        console.log(map.getBounds().toString());
        console.log(map.getBounds());
        $scope.loc = map.getBounds();
        //ctrlComm.put('userObj11', $scope.loc);

        console.log($scope.loc.f.f)




    });
//find current browser


    /* request.service('vendorById', 'post', {
     'vendor_id': $scope.admin.vendorid
     }, function (response) {
     ctrlComm.put('userObj1', response);
     $scope.vendor = response;
     $scope.categori_display = response.category;
     console.log("mmmmmm", $scope.categori_display)
     
     var cat_display = $scope.categori_display.split(',')
     console.log("cat_display", cat_display)
     
     
     for (k = 0; k < cat_display.length; k++) {
     console.log("cat_display", cat_display[k])
     
     if (cat_display[k] == "2" || cat_display[k] == "3" || cat_display[k] == "11" || cat_display[k] == "12") {
     
     console.log("yessssssssssss")
     
     $scope.Category_price = true
     } else {
     console.log("noooooooooooo")
     $scope.Category_price1 = false
     }
     
     
     }
     
     })*/


    console.log("ctrlComm.put('userObj1')", $scope.lat, $scope.lng)


    console.log(" add------ ")

    $scope.map_call = function (resmap) {

        console.log("resmap", resmap)

        if (resmap.latitude == undefined && resmap.longitude == undefined) {


            if (navigator.geolocation) {


                $scope.map = {
                    center: {
                        latitude: 37.352012458959216,
                        longitude: -122.03200764655764
                    },
                    zoom: 15
                };
                console.log("$scope.map", $scope.map)



                navigator.geolocation.getCurrentPosition(function (p) {
                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                    $scope.Lat = p.coords.latitude;
                    $scope.Lng = p.coords.longitude;
                    $scope.latitude = p.coords.latitude;
                    $scope.longitude = p.coords.longitude;
                    console.log($scope.latitude, $scope.longitude);
                    $scope.map = {
                        center: {
                            latitude: p.coords.latitude,
                            longitude: p.coords.longitude
                        },
                        zoom: 15
                    };
                    $scope.test_map = $scope.latitude + ", " + $scope.longitude;
                    console.log("$scope.map", $scope.map, $scope.test_map)

                    $scope.$apply();
                    var geocoder = new google.maps.Geocoder();
                    var latitude = p.coords.latitude;
                    var longitude = p.coords.longitude
                    var latLng = new google.maps.LatLng(latitude, longitude);
                    $scope.$apply();
                    geocoder.geocode({
                        latLng: latLng
                    },
                            function (responses) {
                                if (responses && responses.length > 0) {
                                    if (responses[0].address_components) {
                                        console.log("responses[0]", responses[0].address_components);
                                        console.log("responses[0]", responses[0]);
                                        var street = responses[0].formatted_address.split(',')
                                        console.log("responses[0]", street);
                                        //  debugger;
                                        if (street[0] == 'Unnamed Road') {
                                            $scope.vendor.address = street[1] /*+ ',' + street[2]*/;
                                        } else {
                                            $scope.vendor.address = street[0] /*+ ',' + street[1] + ',' + street[2]*/;
                                        }





                                        console.log("responses[0]", $scope.street1);
                                        var address = responses[0].address_components

                                        for (i = 0; i < address.length; i++) {


                                            console.log(address[i])

                                            // Madhapur
                                            /*if (address[i].types[0] == 'political') {
                                             $scope.addLoc.address_line2 = address[i].long_name;
                                             
                                             } else {
                                             $scope.locations.adress2 = "";
                                             }*/

                                            // Hyderabad
                                            if (address[i].types[0] == 'locality') {
                                                $scope.vendor.city = address[i].long_name;
                                            }
                                            // "Ranga Reddy"
                                            /* if (address[i].types[0] == 'administrative_area_level_2') {
                                             $scope.vendor.district = address[i].long_name;
                                             
                                             }*/
                                            // Telangana
                                            if (address[i].types[0] == 'administrative_area_level_1') {
                                                $scope.vendor.state = address[i].long_name;
                                            }
                                            // India
                                            if (address[i].types[0] == 'country') {
                                                $scope.vendor.country = address[i].long_name;
                                            }
                                            // postal_code
                                            if (address[i].types[0] == 'postal_code') {
                                                $scope.vendor.zip = address[i].long_name;
                                            }

                                            //street1 adress2 city
                                            $scope.$apply();
                                        }


                                    }
                                } else {
                                    alert('Not getting Any address for given latitude and longitude.');
                                }
                            }
                    );
                });
            } else {
                alert('Geo Location feature is not supported in this browser.');
            }

        }
    }

//drag and drop


    $scope.getCurrentLocation = function () {
        console.log("drag---");
        $scope.pos = this.getPosition();
        /////////////////
        var latitude = $scope.pos.lat()
        var longitude = $scope.pos.lng()

        $scope.latitude = $scope.pos.lat();
        $scope.longitude = $scope.pos.lng();
        console.log(latitude, longitude);
        var geocoder = new google.maps.Geocoder();
        var latitude = latitude;
        var longitude = longitude;
        var latLng = new google.maps.LatLng(latitude, longitude);
        $scope.$apply();
        geocoder.geocode({
            latLng: latLng
        },
                function (responses) {
                    if (responses && responses.length > 0) {
                        if (responses[0].address_components) {
                            console.log("responses[0]", responses[0].address_components);
                            console.log("responses[0]", responses[0]);
                            /*  if (place.address_components[i].types[0] == 'administrative_area_level_2') {
                             $scope.address_1 = place.address_components[i].long_name;
                             
                             }
                             
                             
                             
                             */
                            $scope.vendor.address = "";
                            $scope.vendor.city = "";
                            $scope.vendor.state = "";
                            $scope.vendor.country = "";
                            $scope.vendor.zip = "";
                            console.log("responses[0]", $scope.street1);
                            var address = responses[0].address_components

                            for (i = 0; i < address.length; i++) {


                                console.log(address[i])


                                //street =============


                                // Madhapur
                                /* 
                                 
                                 
                                 if (place.address_components[i].types[0] == 'administrative_area_level_2') {
                                 $scope.address_1 = place.address_components[i].long_name;
                                 
                                 }
                                 
                                 
                                 $rootScope.location = $scope.homeLocation = $("#city_country").val().split(',');
                                 console.log("$scope.homeLocation", $scope.homeLocation);
                                 console.log("$scope.homeLocation", $scope.address_1);
                                 
                                 
                                 if ($scope.vendor.city != $scope.homeLocation) {
                                 $scope.vendor.address = $scope.homeLocation[0];
                                 } else {
                                 
                                 $scope.vendor.address = $scope.address_1;
                                 
                                 
                                 
                                 }
                                 
                                 
                                 if (address[i].types[0] == 'political') {
                                 $scope.addLoc.address_line2 = address[i].long_name;
                                 
                                 } else {
                                 $scope.addLoc.address_line2 = "";
                                 }*/

                                // Hyderabad
                                if (address[i].types[0] == 'locality') {
                                    $scope.vendor.city = address[i].long_name;
                                }
                                // "Ranga Reddy"
                                if (address[i].types[0] == 'administrative_area_level_2') {
                                    $scope.vendor.district = address[i].long_name;
                                }
                                // Telangana
                                if (address[i].types[0] == 'administrative_area_level_1') {
                                    $scope.vendor.state = address[i].long_name;
                                }
                                // India
                                if (address[i].types[0] == 'country') {
                                    $scope.vendor.country = address[i].long_name;
                                }
                                // postal_code
                                if (address[i].types[0] == 'postal_code') {
                                    $scope.vendor.zip = address[i].long_name;
                                }


                                var street = responses[0].formatted_address.split(',')
                                console.log("responses[0]", street);
                                if (street[0] == 'Unnamed Road') {
                                    //     debugger;

                                    if (street[1] == $scope.vendor.city) {
                                        $scope.vendor.address = street[2] /*+ '' + street[2]*/;
                                    } else {
                                        $scope.vendor.address = street[1] /*+ '' + street[2]*/;
                                    }

                                } else {

                                    //          debugger;
                                    if (street[0] == $scope.vendor.city) {
                                        $scope.vendor.address = street[2] /*+ '' + street[2]*/;
                                    } else {
                                        $scope.vendor.address = street[0] /*+ '' + street[2]*/;
                                    }


                                }





                                //street1 adress2 city

                                $scope.$apply();
                            }


                        }
                    } else {
                        alert('Not getting Any address for given latitude and longitude.');
                    }
                }
        );
        /////////////////

    }

//auto complete ========================

    var autocomplete;
    function initialize() {
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        autocomplete = new google.maps.places.Autocomplete(
                /** @type {HTMLInputElement} */
                        (document.getElementById('city_country')), {
                    types: ['geocode']
                });
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            fillInAddress();
        });
    }

// [START region_fillform]
    function fillInAddress() {
        // Get the place details from the autocomplete object.

        var place = autocomplete.getPlace();
        console.log("place1", place)

        // document.getElementById("latitude").value = place.geometry.location.lat();
        //document.getElementById("longitude").value = place.geometry.location.lng();


        var geocoder = new google.maps.Geocoder();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        $scope.latitude = place.geometry.location.lat();
        $scope.longitude = place.geometry.location.lng();
        $scope.map = {
            center: {
                latitude: $scope.latitude,
                longitude: $scope.longitude
            },
            zoom: 15
        };
        $scope.test_map = $scope.latitude + ", " + $scope.longitude;
        console.log("$scope.map", $scope.map)
        $scope.$apply();
        $scope.vendor.address = "";
        $scope.vendor.city = "";
        $scope.vendor.state = "";
        $scope.vendor.country = "";
        $scope.vendor.zip = "";
        for (var i = 0; i < place.address_components.length; i++) {
            console.log("addressType", place.address_components[i])

            /* $scope.addLoc.address_line1 */



            // Hyderabad
            if (place.address_components[i].types[0] == 'locality') {
                $scope.vendor.city = place.address_components[i].long_name;
                delete $scope.err2.city;
            }
            // "Ranga Reddy"
            /* if (place.address_components[i].types[0] == 'administrative_area_level_2') {
             $scope.vendor.district = place.address_components[i].long_name;
             
             }*/
            // Telangana
            if (place.address_components[i].types[0] == 'administrative_area_level_1') {
                $scope.vendor.state = place.address_components[i].long_name;
                delete $scope.err2.state;
            }
            // India
            if (place.address_components[i].types[0] == 'country') {
                $scope.vendor.country = place.address_components[i].long_name;
                delete $scope.err2.country;
            }
            // postal_code
            if (place.address_components[i].types[0] == 'postal_code') {
                $scope.vendor.zip = place.address_components[i].long_name;
                delete $scope.err2.zip;
            }

            if (place.address_components[i].types[0] == 'administrative_area_level_2') {
                $scope.address_1 = place.address_components[i].long_name;
            }


            $rootScope.location = $scope.homeLocation = $("#city_country").val().split(',');
            console.log("$scope.homeLocation", $scope.homeLocation);
            console.log("$scope.homeLocation", $scope.address_1);
            //    debugger;
            if ($scope.vendor.city != $scope.homeLocation) {
                $scope.vendor.address = $scope.homeLocation[0];
            } else {

                $scope.vendor.address = $scope.address_1;
            }





            $scope.$apply();
        }





    }

// function for auto complete
    initialize();
    if ($location.path() == '/vendorSettings/My-Account/bankInfotab') {



        function initialize1() {
            // Create the autocomplete object, restricting the search
            // to geographical location types.
            autocomplete = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */
                            (document.getElementById('hashtag1')), {
                        types: ['geocode']
                    });
            // When the user selects an address from the dropdown,
            // populate the address fields in the form.
            google.maps.event.addListener(autocomplete, 'place_changed', function () {

                fillInAddress1();
            });
        }



        // [START region_fillform]
        function fillInAddress1() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
            $scope.bank.address_line1 = '';
            $scope.bank.address_line2 = '';
            $scope.bank.city = '';
            $scope.bank.state = '';
            $scope.bank.country = '';
            $scope.bank.zip = '';
            // document.getElementById("latitude").value = place.geometry.location.lat();
            //document.getElementById("longitude").value = place.geometry.location.lng();

            var geocoder = new google.maps.Geocoder();
            var latitude = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();
            $scope.latitude = place.geometry.location.lat();
            $scope.longitude = place.geometry.location.lng();
            for (var i = 0; i < place.address_components.length; i++) {
                var place_pl = place.address_components[i];
                console.log("addressType", place_pl)

                /* $scope.addLoc.address_line1 */




                $scope.$apply(function () {

                    $rootScope.location = $scope.homeLocation1 = $("#hashtag1").val().split(',');
                    console.log("$scope.homeLocation", $scope.homeLocation1);
                    if ($scope.homeLocation != '') {
                        $scope.bank.address_line1 = $scope.homeLocation1[0];
                        console.log("$scope.homeLocation", $scope.bank.address_line1);
                        delete     $scope.err.address_line1;
                    }

                })

                // postal_code

                if (place_pl.types[0] == 'postal_code') {
                    $scope.bank.zip = place.address_components[i].long_name;
                    delete     $scope.err.zip;
                }





                if (place_pl.types[0] == 'sublocality_level_2') {

                    $scope.bank.address_line2 = place.address_components[i].long_name;
                }




                // Hyderabad
                if (place_pl.types[0] == 'locality') {
                    $scope.bank.city = place.address_components[i].long_name;
                    delete     $scope.err.city;
                }



                // "Ranga Reddy"
                if (place_pl.types[0] == 'administrative_area_level_2') {
                    $scope.vendor.district = place.address_components[i].long_name;
                }



                // Telangana

                if (place_pl.types[0] == 'administrative_area_level_1') {
                    $scope.bank.state = place.address_components[i].long_name;
                    delete     $scope.err.state;
                }




                // India

                if (place_pl.types[0] == 'country') {
                    $scope.bank.country = place.address_components[i].long_name;
                    delete     $scope.err.country;
                }


                $scope.$apply();
            }









        }

        // function for auto complete
        initialize1();
    }






////////////////////////////////colose ng-map//////////////////////////////////////////////////////////




    console.log("admine", $scope.admin)

    function getVendorBasicInfo() {
        $scope.err1 = {};
        request.service('getVendorBasicInfo', 'post', {
            'userid': $scope.admin.userId
        }, function (response) {
            console.log(angular.toJson(response), "UmaMahesh");
            console.log("userId", $scope.admin.userId)


            if (status == 0) {
                $scope.user.basic_phone_number = response.phone_number;
                $scope.user.firstName = response.firstName;
                $scope.user.lastName = response.lastName;
                $scope.user.basic_phone_area_code = "+" + response.phone_area_code;
                $scope.user.basic_phone_country_code = response.phone_country_code;
                $scope.user.phone_number = response.phone_number;
                $scope.user.timezone = response.timezone;
                console.log("User Info for Basic Info++++===========", $scope.user)
            }
        })
    }
    /*}*/



    /*request.service('grossList', 'get', '', function(response) {
     $scope.grossList = response;
     })*/

    function getVendorBankById() {

        console.log("");
        request.service('vendorBankById', 'post', {
            'vendor_id': $scope.admin.vendorid
        }, function (response) {
            console.log(response.length)
            if (response.length > 0) {
                $scope.bank = response[0];
            } else {
                $scope.bank = {};
            }

            $scope.fieldDisabled = false;
            console.log($scope.bank.name_of_bank)
            if ($scope.bank.name_of_bank != undefined) {
                $scope.fieldDisabled = true;
            }
            console.log($scope.bank)
            if ($scope.bank != undefined) {
                $scope.bank.city = $scope.bank['city'];
                $scope.bank.state = $scope.bank['state'];
                $scope.bank.country = $scope.bank['country'];
                if (!$scope.bank.country)
                    $scope.bank.country = '';
                //$scope.bank.country = 231;
                $scope.bank.zipsList = [];
                $scope.changeCountry($scope.bank.country);
            }
            $scope.fieldDisabledes.city = false;
            $scope.fieldDisabledes.state = false;
            $scope.fieldDisabledes.country = false;
            $scope.fieldDisabledes.zip = false;
            $scope.fieldDisabledes.account_type = false;
            $scope.fieldDisabledes.address_line1 = false;
            $scope.fieldDisabledes.address_line2 = false;
            $scope.fieldDisabledes.account_number = false;
            $scope.fieldDisabledes.account_number2 = false;
            $scope.fieldDisabledes.account_name = false;
            $scope.fieldDisabledes.routing_number = false;
            if ($scope.admin.venodorVStatus == 4) {

                /* 
                 if ($scope.bank.account_number != undefined) {
                 $scope.fieldDisabledes.account_number2 = true;
                 }
                 if ($scope.bank.city != undefined) {
                 $scope.fieldDisabledes.city = true;
                 }
                 if ($scope.bank.state != undefined) {
                 $scope.fieldDisabledes.state = true;
                 }
                 if ($scope.bank.country != undefined) {
                 $scope.fieldDisabledes.country = true;
                 }
                 if ($scope.bank.zip != undefined) {
                 $scope.fieldDisabledes.zip = true;
                 }
                 if ($scope.bank.account_type != undefined) {
                 $scope.fieldDisabledes.account_type = true;
                 }
                 if ($scope.bank.address_line1 != undefined) {
                 $scope.fieldDisabledes.address_line1 = true;
                 }
                 if ($scope.bank.address_line2 != undefined) {
                 $scope.fieldDisabledes.address_line2 = true;
                 }
                 if ($scope.bank.account_number != undefined) {
                 $scope.fieldDisabledes.account_number = true;
                 $scope.fieldDisabledes.account_number2 = true;
                 }
                 if ($scope.bank.account_name != undefined) {
                 $scope.fieldDisabledes.account_name = true;
                 }
                 if ($scope.bank.routing_number != undefined) {
                 $scope.fieldDisabledes.routing_number = true;
                 }*/
            }

        })
    }

    /*$scope.catchUploadedFile = function() {
     var f = document.getElementById('logo').files[0];
     console.log(f.type)
     if(f.type == 'image/png' || f.type == 'images/jpg'){
     
     }else{
     console.log("invalid file")
     }
     }*/

    /* $scope.navigate = function (tab) {
     $scope.loader(true);
     $scope.tab = tab;
     if (tab == 1) {
     $scope.loader(false);
     } else {
     $timeout(function () {
     $scope.loader(false);
     console.log("sdf")
     
     }, 2000);
     }
     }*/
    console.log("request outside", request);
    $scope.saveBasicInfo = function () {
        console.log("in saveBasicInfo")
        validateBasicInfo(function () {
            $scope.loader(true);
            console.log("after validations")
            console.log($scope.admin)
            console.log("$scope.vendor***", $scope.vendor)
            $scope.lat = $scope.vendor.latitude;
            $scope.lng = $scope.vendor.longitude;
            console.log("longitude latitude", $scope.vendor.latitude, $scope.vendor.longitude)
            var params = $scope.user;
            //delete params['userId'];
            var params = {}
            params.userid = $scope.admin.userId;
            params.phone_country_code = $scope.user.basic_phone_country_code;
            params.phone_area_code = $scope.user.basic_phone_area_code;
            params.firstName = $scope.user.firstName;
            params.lastName = $scope.user.lastName;
//            params.phone_number = $scope.user.basic_phone_number;
            params.phone_number = $scope.user.basic_phone_number;
            params.timezone = $scope.user.timezone;
            console.log("saveBasicInfo params ", params)
            request.service('vendorBasicInfo', 'post', params, function (response) {
                $scope.loader(false);
                if (response.status == 0) {
                    var statuscheck = $scope.admin.venodorVStatus;
                    var vendorvstatus = $scope.admin.venodorStatus;
                    var bankstatus = $scope.admin.bankStatus;
                    if (statuscheck == 4 && vendorvstatus == true && bankstatus == true) {
                        $scope.notification(response.message);
                    } else {
                        $state.go("vendorSettings.My-Account.tab2");
                        $scope.notification(response.message);
                        getVendorBusiness();
                    }

                } else {
                    $scope.notification(response.message);
                }

            })
            /*$timeout(function() {
             
             }, 1000);
             $scope.loader(false);
             })*/
        })
    }

    $scope.change = function (obj) {
        $scope.loader(true);
        console.log(obj)

        //        console.log("$scope.bank.state before ", $scope.bank.state);
        //      console.log("$scope.bank.country before ", $scope.bank.country);

        for (var i = 0; i < $scope.citiesList.length; i++) {

            if ($scope.citiesList[i].id == obj) {
                console.log("$scope.citiesList[" + i + "] ", $scope.citiesList[i]);
                $scope.bank.state = $scope.citiesList[i].state_id;
            }
        }
        for (var i = 0; i < $scope.statesList.length; i++) {
            if ($scope.statesList[i].id == $scope.bank.state) {
                console.log("$scope.statesList[" + i + "] ", $scope.statesList[i]);
                $scope.bank.country = $scope.statesList[i].country_id;
            }
        }


        $scope.loader(false);
        console.log("$scope.bank.zipsList", $scope.bank.zipsList)
        console.log("$scope.bank.state after ", $scope.bank.state);
        console.log("$scope.bank.country after ", $scope.bank.country);
    };
    $scope.changeCountry = function (obj) {
        var params = {};
        params.country_id = obj;
        console.log("params", params);
        $scope.loader(true);
        request.service('statesListByCountry', 'post', params, function (response) {
            //$scope.loader(false);
            $scope.statesList = response;
        });
        request.service('citiesListByCountry', 'post', params, function (response) {
            $scope.loader(false);
            $scope.citiesList = response;
        })
        //$scope.bank.country = $scope.statesList[i].country_id;

    };
    $scope.changeState = function (obj) {
        var params = {};
        params.state_id = obj;
        console.log("params", params);
        $scope.loader(true);
        request.service('citiesListByState', 'post', params, function (response) {

            $scope.citiesList = response;
        });
        for (var i = 0; i < $scope.statesList.length; i++) {
            if ($scope.statesList[i].id == obj) {
                console.log("$scope.statesList[" + i + "] ", $scope.statesList[i]);
                $scope.bank.country = $scope.statesList[i].country_id;
            }
        }
        $scope.loader(false);
        console.log("$scope.bank.state after ", obj);
        console.log("$scope.bank.country after ", $scope.bank.country);
    };
    var validateBasicInfo = function (cb) {
        console.log("in validateBasicInfo")
        if (!$scope.user.firstName) {
            $scope.err1.firstName = true;
        } else {
            delete $scope.err1.firstName;
        }
        if (!$scope.user.lastName) {
            $scope.err1.lastName = true;
        } else {
            delete $scope.err1.lastName;
        }
        if (!$scope.user.email) {
            $scope.err1.email = true;
        } else {
            delete $scope.err1.email;
        }

        /*if ($scope.user.basic_phone_country_code && 
         $scope.user.basic_phone_country_code.toString().length != 3) {
         $scope.err1.basic_phone_country_code_cdn= true;
         } else {
         delete $scope.err1.basic_phone_country_code_cdn;
         }
         
         if ($scope.user.basic_phone_area_code && 
         $scope.user.basic_phone_area_code.toString().length != 3) {
         $scope.err1.basic_phone_area_code_cdn= true;
         } else {
         delete $scope.err1.basic_phone_area_code_cdn;
         }*/
        delete $scope.err1.basic_phone_country_code_cdn;
        delete $scope.err1.basic_phone_area_code_cdn;
        if ($scope.user.basic_phone_number &&
                $scope.user.basic_phone_number.toString().length != 10) {
            $scope.err1.basic_phone_number_cdn = true;
        } else {
            delete $scope.err1.basic_phone_number_cdn;
        }

        console.log("$scope.err1", $scope.err1)
        console.log("checked all the validations")
        if (Object.keys($scope.err1).length == 0) {

            if (cb)
                cb();
        }
    }

    function checkUSRoutingNumber(s) {

        var i, n, t;
        // First, remove any non-numeric characters.

        t = "";
        for (i = 0; i < s.length; i++) {
            c = parseInt(s.charAt(i), 10);
            if (c >= 0 && c <= 9)
                t = t + c;
        }

        // Check the length, it should be nine digits.

        if (t.length != 9)
            return false;
        // Now run through each digit and calculate the total.

        n = 0;
        for (i = 0; i < t.length; i += 3) {
            n += parseInt(t.charAt(i), 10) * 3 + parseInt(t.charAt(i + 1), 10) * 7 + parseInt(t.charAt(i + 2), 10);
        }

        // If the resulting sum is an even multiple of ten (but not zero),
        // the aba routing number is good.

        if (n != 0 && n % 10 == 0)
            return true;
        else
            return false;
    }

    var validateBankDetails = function (cb) {
        console.log($scope.bank)
        if (!$scope.bank.name_of_bank) {
            $scope.err.name_of_bank = true;
        } else {
            delete $scope.err.name_of_bank;
        }
        if (!$scope.bank.country) {
            $scope.err.country = true;
        } else {
            delete $scope.err.country;
        }
        if (!$scope.bank.city) {
            $scope.err.city = true;
        } else {
            delete $scope.err.city;
        }
        if (!$scope.bank.state) {
            $scope.err.state = true;
        } else {
            delete $scope.err.state;
        }
        if (!$scope.bank.address_line1) {
            $scope.err.address_line1 = true;
        } else {
            delete $scope.err.address_line1;
        }
        if (!$scope.bank.account_type) {
            $scope.err.account_type = true;
        } else {
            delete $scope.err.account_type;
        }
        if (!$scope.bank.account_name) {
            $scope.err.account_name = true;
        } else {
            delete $scope.err.account_name;
        }
        if (!$scope.bank.account_number) {
            $scope.err.account_number = true;
        } else {
            delete $scope.err.account_number;
        }
        if (!$scope.bank.account_number2) {
            $scope.err.account_number2 = true;
        } else {
            delete $scope.err.account_number2;
        }
        if ($scope.bank.id != '' && $scope.bank.id != null && $scope.bank.id != undefined) {
            console.log('$scope.bank.account_number2', $scope.bank.account_number2);
            if ($scope.bank.verifyaccount_number != '' && $scope.bank.verifyaccount_number != null && $scope.bank.verifyaccount_number != $scope.bank.account_number && $scope.bank.account_number2 == undefined) {
                $scope.err.account_number2 = true;
            } else {
                delete $scope.err.account_number2;
            }
        }
        if ($scope.bank.account_number2 && $scope.bank.account_number && $scope.bank.account_number2 !== $scope.bank.account_number) {
            $scope.err.account_number2_match = true;
        } else {
            delete $scope.err.account_number2_match;
        }
        if (!$scope.bank.routing_number) {
            $scope.err.routing_number = true;
        } else if ($scope.bank.routing_number != "") {
            delete $scope.err.routing_number;
            var ifsc_in_pattern = new RegExp("^[A-Z]{4}[0-9]{7}$");
            console.log($scope.bank.country, $scope.bank.routing_number);
            console.log(ifsc_in_pattern.test($scope.bank.routing_number));
            //if (!checkUSRoutingNumber($scope.bank.routing_number) && ($scope.bank.country === 231 || $scope.bank.country === 232)) {
            if (!checkUSRoutingNumber($scope.bank.routing_number) && ($scope.bank.country === "United States")) {

                $scope.err.routing_number_check = true;
                //} else if ($scope.bank.country === 101 && !ifsc_in_pattern.test($scope.bank.routing_number)) {
            } else if ($scope.bank.country === "India" && !ifsc_in_pattern.test($scope.bank.routing_number)) {
                $scope.err.routing_number_check = true;
            } else {
                delete $scope.err.routing_number_check;
            }
        } else {
            delete $scope.err.routing_number;
            delete $scope.err.routing_number_check;
        }
        if (!$scope.bank.zip || $scope.bank.zip == 0 || $scope.bank.zip.length < 3 || $scope.bank.zip.length > 10) {
            $scope.err.zip = true;
        } else {
            delete $scope.err.zip;
        }
        console.log("lengthy::", Object.keys($scope.err).length);
        console.log("err", $scope.err);
        if (Object.keys($scope.err).length == 0) {

            if (cb)
                cb();
        }
    }


    $scope.getFileDetails = function (e) {
        console.log("eeee" + e);
        $scope.$apply(function () {
            if ($scope.customRequestFiles == null) {
                $scope.customRequestFiles;
            }
            console.log("#######" + $('#Upload')[0].files[0]);
            $rootScope.customRequestFiles = $scope.customRequestFiles = $('#Upload')[0].files[0];
            $scope.customRequestFile = $('#Upload')[0].files[0].name;
            //  debugger;
            $scope.customRequestFiles11 = $('#Upload')[0].files[0].type;
            $("#Upload").val("");
            console.log($scope.customRequestFiles)
        });
    };
    $scope.getlogo = function (e) {
        debugger;
        console.log("eeee" + e);
        $scope.$apply(function () {
            if ($scope.customRequestFiles1 == null) {
                $scope.customRequestFiles1;
            }
            console.log("#######" + $('#Upload1')[0].files[0]);
            $rootScope.customRequestFiles1 = $scope.customRequestFiles1 = $('#Upload1')[0].files[0];
            $scope.customRequestFile1 = $('#Upload1')[0].files[0].name;
            $scope.customRequestFiles12 = $('#Upload1')[0].files[0].type;
            $("#Upload").val("");
            console.log($scope.customRequestFiles1)
        });
    };
    $scope.getw9form = function (e) {
        console.log("eeee" + e);
        $scope.$apply(function () {
            if ($scope.customRequestFiles2 == null) {
                $scope.customRequestFiles2;
            }
            console.log("#######" + $('#Upload2')[0].files[0]);
            $rootScope.customRequestFiles2 = $scope.customRequestFiles2 = $('#Upload2')[0].files[0];
            $scope.customRequestFile2 = $('#Upload2')[0].files[0].name;
            $scope.customRequestFiles13 = $('#Upload2')[0].files[0].type;
            $("#Upload").val("");
            console.log($scope.customRequestFiles2)
        });
    };
    var validate = function (cb) {
        console.log("in validate bussiness");
        //   debugger;
        $scope.license = $scope.customRequestFiles;
        $scope.logo = $scope.customRequestFiles1;
        $scope.w9form = $scope.customRequestFiles2;
        if (!$scope.vendor.locationName) {
            $scope.err2.locationName = true;
        } else {
            delete $scope.err2.locationName;
        }

        if (!$scope.vendor.bussinessName) {
            $scope.err2.bussinessName = true;
        } else {
            delete $scope.err2.bussinessName;
        }
        if (!$scope.vendor.bussinessAsName) {
            $scope.err2.bussinessAsName = true;
        } else {
            delete $scope.err2.bussinessAsName;
        }
        if (!$scope.vendor.contactName) {
            $scope.err2.contactName = true;
        } else {
            delete $scope.err2.contactName;
        }
        if (!$scope.vendor.contactLName) {
            $scope.err2.contactLName = true;
        } else {
            delete $scope.err2.contactLName;
        }
        if (!$scope.vendor.bEmail) {
            $scope.err2.bEmail = true;
        } else {
            delete $scope.err2.bEmail;
            if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test($scope.vendor.bEmail)) {
                $scope.err2.valid_email = true;
            } else {
                delete $scope.err2.valid_email;
            }
        }
        /*  if ($scope.user.basic_phone_country_code && 
         $scope.user.basic_phone_country_code.toString().length != 3) {
         $scope.err1.basic_phone_country_code_cdn= true;
         } else {
         delete $scope.err1.basic_phone_country_code_cdn;
         }*/
        console.log("phone country", $scope.vendor.phone_country_code)
        /*if($scope.vendor.phone_country_code&& $scope.vendor.phone_country_code.toString().length != 3)
         {
         $scope.err2.phone_country_code_cdn = true;
         }
         else{
         delete $scope.err2.phone_country_code_cdn;
         }   
         if($scope.vendor.phone_area_code&& $scope.vendor.phone_area_code.toString().length != 3)
         {
         $scope.err2.phone_area_code_cdn = true;
         }
         else{
         delete $scope.err2.phone_area_code_cdn;
         }*/
        delete $scope.err2.phone_country_code_cdn;
        delete $scope.err2.phone_area_code_cdn;
        if ($scope.vendor.phone_number && $scope.vendor.phone_number.toString().length != 10) {
            $scope.err2.phone_number_cdn = true;
        } else {
            delete $scope.err2.phone_number_cdn;
        }
        /*if($scope.vendor.fax_country_code&& $scope.vendor.fax_country_code.toString().length != 3)
         {
         $scope.err2.fax_country_code = true;
         }
         else{
         delete $scope.err2.fax_country_code;
         }
         if($scope.vendor.fax_area_code&& $scope.vendor.fax_area_code.toString().length != 3)
         {
         $scope.err2.fax_area_code = true;
         }
         else{
         delete $scope.err2.fax_area_code;
         }*/
        delete $scope.err2.fax_country_code;
        delete $scope.err2.fax_area_code;
        if ($scope.vendor.fax_number && $scope.vendor.fax_number.toString().length != 10) {
            $scope.err2.fax_number = true;
        } else {
            delete $scope.err2.fax_number;
        }
        /* if (!$scope.vendor.phone_country_code) {
         $scope.err2.phone_country_code = true;
         } else {
         delete $scope.err2.phone_country_code;
         }
         if (!$scope.vendor.phone_number) {
         $scope.err2.phone_number = true;
         } else {
         delete $scope.err2.phone_number;
         }
         if (!$scope.vendor.phone_area_code) {true
         $scope.err2.phone_area_code = true;
         } else {
         delete $scope.err2.phone_area_code;
         }
         if (!$scope.vendor.phone_area_code)
         {
         $scope.err2.phone_area_code=true; 
         
         }else{
         delete $scope.err2.phone_area_code; 
         }
         
         if ($scope.vendor.phone_area_code!=undefined && $scope.vendor.phone_area_code.toString().length != 3)
         { 
         $scope.err2.phone_area_code_cdn = true; 
         }
         else 
         { 
         delete $scope.err2.phone_area_code_cdn; 
         
         }
         if (!$scope.vendor.phone_number)
         {
         $scope.err2.phone_number=true; 
         }else{
         delete $scope.err2.phone_number; 
         }
         if ($scope.vendor.phone_number!=undefined && $scope.vendor.phone_number.toString().length != 7)
         { 
         $scope.err2.phone_number_cdn = true; 
         }
         else 
         { 
         delete $scope.err2.phone_number_cdn; 
         
         }
         if (!$scope.vendor.fax_country_code) {
         $scope.err2.fax_country_code = true;
         } else {
         delete $scope.err2.fax_country_code;
         }
         if (!$scope.vendor.fax_area_code) {
         $scope.err2.fax_area_code = true;
         } else {
         delete $scope.err2.fax_area_code;
         }
         if (!$scope.vendor.fax_number) {
         $scope.err2.fax_number = true;
         } else {
         delete $scope.err2.fax_number;
         }*/

        if (!$scope.vendor.address) {
            $scope.err2.address = true;
        } else {
            delete $scope.err2.address;
        }
        if (!$scope.vendor.bYear) {
            $scope.err2.bYear = true;
        } else {
            delete $scope.err2.bYear;
        }
        if (!$scope.vendor.locationName) {
            $scope.err2.locationName = true;
        } else {
            delete $scope.err2.locationName;
        }
        if (!$scope.vendor.country) {
            $scope.err2.country = true;
        } else {
            delete $scope.err2.country;
        }
        if (!$scope.vendor.state) {
            $scope.err2.state = true;
        } else {
            delete $scope.err2.state;
        }
        if (!$scope.vendor.city) {
            $scope.err2.city = true;
        } else {
            delete $scope.err2.city;
        }
        if (!$scope.vendor.zip) {
            $scope.err2.zip = true;
        } else {
            delete $scope.err2.zip;
        }
        if (!$scope.vendor.licenseNo) {
            //     debugger;
            $scope.err2.licenseNo = true;
        } else {
//            debugger;
            delete $scope.err2.licenseNo;
        }
        if (!$scope.vendor.issuerName) {
            $scope.err2.issuerName = true;
        } else {
            delete $scope.err2.issuerName;
        }
        if (!$scope.vendor.expDate) {
            $scope.err2.expDate = true;
        } else {
            delete $scope.err2.expDate;
        }
        delete $scope.err2.licenseNo;
        delete $scope.err2.issuerName;
        delete $scope.err2.expDate;

        if (!$scope.vendor.online_vendor) {
            $scope.err2.online_vendor = true;
        } else {
            delete $scope.err2.online_vendor;
        }
        console.log("before", $scope.vendor.website);
        if ($scope.vendor.website) {
            console.log("b1", $scope.vendor.website);
            //var website_pattern = new RegExp("^(http(s?):\/\/)(www.)?(\w|-)+(\.(\w|-)+)*((\.[a-zA-Z]{2,3})|\.(aero|coop|info|museum|name|com|in|org|edu|co.in|us|co.us))+(\/)?$");
            var website_pattern = new RegExp("^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$");
            console.log("a", $scope.vendor);
            console.log("b", $scope.vendor.website);
            // delete $scope.err2.website;
            console.log("result", website_pattern.test($scope.vendor.website));
            if (!website_pattern.test($scope.vendor.website)) {
                $scope.err2.websitepattern = true;
                console.log("website error");
            } else {
                console.log("website no error");
                delete $scope.err2.website;
                delete  $scope.err2.websitepattern;
            }
        } else {
            console.log("getting null")
            $scope.err2.website = true;
            delete $scope.err2.website;
            delete  $scope.err2.websitepattern;
        }

//console.log("$scope.license.type",$scope.license.type)
        //  debugger;
        if ($scope.license == undefined || $scope.customRequestFiles11 == 'image/jpeg' || $scope.customRequestFiles11 == 'image/png' || $scope.customRequestFiles11 == 'image/jpg' || $scope.customRequestFiles11 == 'application/pdf' || $scope.customRequestFiles11 == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            delete $scope.err2.license;
        } else {
            $scope.err2.license = true;
        }
        console.log($scope.logo)
        if ($scope.logo == undefined || $scope.customRequestFiles12 == 'image/png' || $scope.customRequestFiles12 == 'image/jpg' || $scope.customRequestFiles12 == 'image/jpeg' || $scope.customRequestFiles12 == 'image/gif') {
            delete $scope.err2.logo;
        } else {
            $scope.err2.logo = true;
        }
        if ($scope.w9form == undefined || $scope.customRequestFiles13 == 'application/pdf') {
            delete $scope.err2.w9form;
        } else {
            $scope.err2.w9form = true;
        }
//        alert(category.length);

//        if (category.length == 0) {
//            alert(category.length);
//            $scope.err2.categorySelect = true;
//        } else {
//            delete $scope.err2.categorySelect;
//        }
        if ($scope.catList.length == 0) {
            $scope.err2.categorySelect = true;
        } else {
            delete $scope.err2.categorySelect;
        }





        console.log("lengthy::", Object.keys($scope.err2).length);
        console.log("err2", $scope.err2);
        if (Object.keys($scope.err2).length == 0) {

            if (cb)
                cb();
        }
    }
    $scope.addToCategoryList = function (data) {
        console.log("adding list", data);
    }

    $scope.getCategory = function (id, flag) {
        if (flag == true) {
            category.push(id);
            $scope.catList.push(id);
        } else {
            category.splice(category.indexOf(id), 1)
            $scope.catList.splice($scope.catList.indexOf(id.toString()), 1);
        }

        if ($scope.catList.length == 0) {
            $scope.err2.categorySelect = true;
        } else {
            delete $scope.err2.categorySelect;
        }
    }





    $scope.schedulelines = [{
            id: undefined,
            from: undefined,
            to: undefined,
            cost: undefined

        }];
    $scope.addschedulelines = function (index) {

        $scope.schedulelines.push({
            id: index,
            from: undefined,
            to: undefined,
            cost: undefined
        });
    }

    console.log("$scope.schedulelines", $scope.schedulelines)

    $scope.removeschedulelines = function (index) {
        $scope.schedulelines.splice(index, 1);
    }

    $scope.displayPhoneNumber = function (phone) {
        phone = "+" + phone;
        return phone;
    }
//    vendor.phone_number
    $scope.resetPhoneNumberDisplay = function (phone) {
        var num;
        if (phone.indexOf("+") >= 0) {
            var arr = phone.split("+");
            num = arr[1];
        } else {
            num = phone;
        }
        console.log("is + Available", phone.indexOf("+") >= 0);
        return num;
    }



    $scope.saveBusinessInfo = function (vendor) {
        savecat = [];
        $scope.customRequestFiles = undefined;
        console.log("$scope.categoriesList", $scope.categoriesList);
        angular.forEach($scope.categoriesList, function (cat) {
            if (cat.status == true)
                savecat.push(cat.id);
        })


        /* for (r = 0; r < $scope.categoriesList.length; r++) {
         
         console.log("$scope.categoriesList[r", $scope.categoriesList[r])
         
         
         
         }*/



        vendor.category = savecat.join();
        validate(function () {
            //vendor.category = category.join();


            console.log("$scope.schedulelines", $scope.schedulelines)

            vendor.userId = $scope.admin.userId;
            console.log("8888888", ctrlComm.get('userObj1'))
            console.log("8888888", $scope.latitude, $scope.longitude)

            if ($scope.latitude != null || $scope.longitude != null) {
                vendor.latitude = $scope.latitude;
                vendor.longitude = $scope.longitude;
            } else {
                vendor.latitude = ctrlComm.get('userObj1').latitude;
                vendor.longitude = ctrlComm.get('userObj1').longitude;
            }


            /* vendor.latitude = $scope.latitude;
             vendor.longitude = $scope.longitude;*/


            vendor.delivery_slabs = $scope.schedulelines;
            console.log(angular.toJson(vendor))
            console.log("request inside", request);
            var fd = new FormData();
            console.log("$scope.customRequestFiles1", $rootScope.customRequestFiles);
            fd.append('logo', $rootScope.customRequestFiles1)
            fd.append('lics', $rootScope.customRequestFiles)
            fd.append('w9form', $rootScope.customRequestFiles2)
            fd.append('jsondata', JSON.stringify(vendor));
            console.log(JSON.stringify(vendor));
            // $http.post("http://192.168.2.185:8000/arevea/vendorBusiness", fd, {
            //$http.post("http://192.168.0.234:8000/arevea/vendorBusiness", fd, {
            //  $http.post("http://qa.arevea.com/arevea/arevea/vendorBusiness", fd, {


            var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
            $http.post(serviceURL + "/vendorBusiness", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                    .success(function (response) {
                        $timeout(function () {
                            var statuscheck = $scope.admin.bankStatus;
                            console.log('statuscheck' + statuscheck);
                            $scope.notification('Business Details Updated Successfully');
                            $rootScope.customRequestFiles1 = $scope.customRequestFiles1 = undefined;
                            getVendorBusiness();
                            ctrlComm.del('vendorCategories');
                            ctrlComm.del('vendorLocations');
                            if (statuscheck == true) {
                                $scope.admin.venodorStatus = true;
                                $scope.admin.venodorVStatus = response.vendor_status;
                                window.localStorage.setItem("venodorStatus", $scope.admin.venodorStatus);
                                window.localStorage.setItem("venodorVStatus", $scope.admin.venodorVStatus);
                            } else {
                                console.log("success!!");
                                $scope.admin.venodorStatus = true;
                                $scope.admin.venodorVStatus = response.vendor_status;
                                window.localStorage.setItem("venodorStatus", $scope.admin.venodorStatus);
                                window.localStorage.setItem("venodorVStatus", $scope.admin.venodorVStatus);
                                $state.go("vendorSettings.My-Account.tab3");
                                getVendorBankById();
                                console.log($scope.tab)

                            }
                        }, 1000);
                    })
                    .error(function () {
                        console.log("error!!");
                    });
        })

    }



    /* $scope.address2 = function(evt){
     
     console.log("evt 555",evt.keyCode);
     
     if (evt.keyCode == 9) {
     console.log("tab press -----");
     $("#citieslist").focus().select();
     
     
     
     }
     
     
     }
     
     $scope.state22 = function(evt){
     
     console.log("evt 555",evt.keyCode);
     
     if (evt.keyCode == 9) {
     console.log("tab press -----");
     $("#countrys").focus();
     
     }
     
     
     }*/



    $scope.saveBankInfo = function (bank) {

        console.log("bank before validating", bank);
        validateBankDetails(function () {
            $scope.loader(true);
            var bank = {};
            bank.account_name = $scope.bank['account_name'];
            bank.account_number = $scope.bank['account_number'];
            bank.account_type = $scope.bank['account_type'];
            bank.address_line1 = $scope.bank['address_line1'];
            bank.address_line2 = $scope.bank['address_line2'];
            bank.city = $scope.bank['city'].toString();
            bank.state = $scope.bank['state'].toString();
            bank.country = $scope.bank['country'].toString();
            bank.name_of_bank = $scope.bank['name_of_bank'];
            bank.routing_number = $scope.bank['routing_number'];
            bank.zip = $scope.bank['zip']
            bank.vendor_id = $scope.admin.vendorid
            bank.userId = $scope.admin.userId;
            // console.log(bank)

            console.log("bank after validating", bank);
            request.service('vendorBank', 'post', bank, function (response) {
                console.log(response)
                if (response.status == 4) {
                    $scope.admin.bankStatus = true;
                    window.localStorage.setItem("bankStatus", $scope.admin.bankStatus);
                    $scope.notification(response.message);
                    $state.go("vendorSettings.Location");
                } else if (response.status == 5) {
                    $scope.admin.bankStatus = true;
                    window.localStorage.setItem("bankStatus", $scope.admin.bankStatus);
                    $scope.notification(response.message);
                    // $state.go('Home')

                } else {
                    $scope.notification(response.message, "danger")
                }
                $scope.loader(false);
            })
            $scope.loader(false);
        })
    }

    $scope.checkPhonePattern = function (phone) {
//        if (phone.length == 7) {
        $scope.user.basic_phone_number = "+" + phone;
//        }
    }
    $scope.displayPhoneNumber = function (phone) {
        phone = "+" + phone;
        return phone;
    }
    $scope.resetPhoneNumberDisplay = function (phone) {
        var num;
        if (phone.indexOf("+") >= 0) {
            var arr = phone.split("+");
            num = arr[1];
        } else {
            num = phone;
        }
        console.log("is + Available", phone.indexOf("+") >= 0);
        return num;
    }





    var ph_country_code = '';
    $scope.$watch('vendor.phone_country_code', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_country_code = '';
         }*/
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.vendor.phone_country_code = ph_country_code;
                } else {
                    $scope.vendor.phone_country_code = '';
                }
            } else {
                ph_country_code = val;
            }
        }
    });
    var ph_area_code = '';
    $scope.$watch('vendor.phone_area_code', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_area_code = '';
         }*/
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.vendor.phone_area_code = ph_area_code;
                } else {
                    $scope.vendor.phone_area_code = '';
                }
            } else {
                ph_area_code = val;
            }
        }
    });
    $scope.checkPhonePattern = function (phone) {
        $scope.vendor.phone_number = "+" + phone;
    }

    var phoneNumber = '';
    $scope.$watch('vendor.phone_number', function (val) {
        if (val == 0) {
            $scope.vendor.phone_number = '';
        }
        if (val) {
//            if (!val.toString().match(/^\+?\d*$/) || val.toString().length > 11) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                if (val.toString().length != 1) {
//                    $scope.checkPhonePattern(phoneNumber);
                    $scope.vendor.phone_number = phoneNumber;
                } else {
                    $scope.vendor.phone_number = '';
                }
            } else {
                phoneNumber = val;
            }
        }
    });
    var accountNo = '';
    $scope.$watch('bank.account_number', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_number = '';
         }*/
        if (val) {
            if (!val.toString().match(/^[0-9]*$/)) {
                if (val.toString().length != 1) {
                    $scope.bank.account_number = accountNo;
                } else {
                    $scope.bank.account_number = '';
                }
            } else {
                accountNo = val;
            }
        }
    });
//   /^[0-9]*$/
    var basic_phone = '';
    $scope.$watch('user.basic_phone_number', function (val) {
        if (val) {
//            if (!val.toString().match(/^\+?\d*$/) || val.toString().length > 11) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.user.basic_phone_number = basic_phone;
                } else {
                    $scope.user.basic_phone_number = '';
                }
            } else {
                basic_phone = val;
            }
        }
    });
    var basic_phone1 = '';
    $scope.$watch('user.basic_phone_country_code', function (val) {
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.user.basic_phone_country_code = basic_phone1;
                } else {
                    $scope.user.basic_phone_country_code = '';
                }
            } else {
                basic_phone1 = val;
            }
        }
    });
    var basic_ph_area_code = '';
    $scope.$watch('user.basic_phone_area_code', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_area_code = '';
         }*/
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.user.basic_phone_area_code = basic_ph_area_code;
                } else {
                    $scope.user.basic_phone_area_code = '';
                }
            } else {
                basic_ph_area_code = val;
            }
        }
    });
    var bMobile = '';
    $scope.$watch('vendor.fax_country_code', function (val) {
        if (val == 0) {
            $scope.vendor.fax_country_code = '';
        }
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.vendor.fax_country_code = bMobile;
                } else {
                    $scope.vendor.fax_country_code = '';
                }
            } else {
                bMobile = val;
            }
        }
    });
    var faxareacode = '';
    $scope.$watch('vendor.fax_area_code', function (val) {
        if (val == 0) {
            $scope.vendor.fax_area_code = '';
        }
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.vendor.fax_area_code = faxareacode;
                } else {
                    $scope.vendor.fax_area_code = '';
                }
            } else {
                faxareacode = val;
            }
        }
    });
    var FaxNumber = '';
    $scope.$watch('vendor.fax_number', function (val) {
        if (val == 0) {
            $scope.vendor.fax_number = '';
        }
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.vendor.fax_number = FaxNumber;
                } else {
                    $scope.vendor.fax_number = '';
                }
            } else {
                FaxNumber = val;
            }
        }
    });
    var BGross = '';
    $scope.$watch('vendor.bGross', function (val) {
        if (val == 0) {
            $scope.vendor.bGross = '';
        }
        if (val) {
            //if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
            if (!val.toString().match(/^[0-9]*$/)) {
                if (val.toString().length != 1) {
                    $scope.vendor.bGross = BGross;
                } else {
                    $scope.vendor.bGross = '';
                }
            } else {
                BGross = val;
            }
        }
    });
    var Bzip = '';
    $scope.$watch('vendor.zip', function (val) {
        if (val == 0) {
            $scope.vendor.zip = '';
        }


        if ($scope.vendor.country == 'India') {
            console.log("$vendor.country == 'India'", $scope.vendor.country)
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
                    if (val.toString().length != 1) {
                        $scope.vendor.zip = Bzip;
                    } else {
                        $scope.vendor.zip = '';
                    }
                } else {
                    Bzip = val;
                }
            }
        } else if ($scope.vendor.country == 'United States') {
            console.log("$vendor.country == 'United States'", $scope.vendor.country)
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 5 || val.toString().length > 9) {
                    if (val.toString().length != 1) {
                        $scope.vendor.zip = Bzip;
                    } else {
                        $scope.vendor.zip = '';
                    }
                } else {
                    Bzip = val;
                }
            }
        } else if (val != '' && val != undefined) {
            request.service('countriesListByName', 'post', {
                "countryname": $scope.vendor.country
            }, function (response) {
                $http.get("http://api.geonames.org/postalCodeLookupJSON?&country=" + response[0].sortname + "&postalcode=" + val + "&username=srinivas_tv")
                        .success(function (response) {
                            console.log(response, response.postalcodes.length);
                            var result = [];
                            response.postalcodes.forEach(function (o) {
                                if (o.postalcode == val)
                                    result.push(o);
                            });
                            console.log("result", result);
                            if (result.length <= 0) {
                                $scope.err2.zip = true;
                                //$scope.vendor.zip = '';
                            }
                        });
            });
            //            $http.get("http://api.geonames.org/countryCode?lat=" + $scope.vendor.latitude + "&lng=" + $scope.vendor.longitude + "&username=srinivas_tv")
            //                .success(function (response) {
            //                    
            //                });
        }


    });
    var bankzip = '';
    $scope.$watch('$state.current.name', function (val) {
        if (val == "vendorSettings.My-Account.tab3") {
            // handeling the page scroll on load
            document.body.scrollTop = 0;
        }
    });
    $scope.$watch('bank.zip', function (val) {
        if (val == 0) {
            $scope.bank.zip = '';
        }
        /* if (val) {
         if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
         if (val.toString().length != 1) {
         $scope.bank.zip = bankzip;
         } else {
         $scope.bank.zip = '';
         }
         } else {
         bankzip = val;
         }
         }*/
        if ($scope.bank.country == 'India') {
            console.log("$vendor.country == 'India'", $scope.bank.country)
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
                    if (val.toString().length != 1) {
                        $scope.bank.zip = bankzip;
                    } else {
                        $scope.bank.zip = '';
                    }
                } else {
                    Bzip = val;
                }
            }
        } else if ($scope.bank.country == 'United States') {
            console.log("$vendor.country == 'India'", $scope.bank.country)
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 5 || val.toString().length > 9) {
                    if (val.toString().length != 1) {
                        $scope.bank.zip = bankzip;
                    } else {
                        $scope.bank.zip = '';
                    }
                } else {
                    bankzip = val;
                }
            }
        } else if (val != '' && val != undefined) {
            request.service('countriesListByName', 'post', {
                "countryname": $scope.bank.country
            }, function (response) {
                $http.get("http://api.geonames.org/postalCodeLookupJSON?&country=" + response[0].sortname + "&postalcode=" + val + "&username=srinivas_tv")
                        .success(function (response) {
                            console.log(response, response.postalcodes.length);
                            var result = [];
                            response.postalcodes.forEach(function (o) {
                                if (o.postalcode == val)
                                    result.push(o);
                            });
                            console.log("result", result);
                            if (result.length <= 0) {
                                $scope.err.zip = true;
                                //$scope.vendor.zip = '';
                            }
                        });
            });
        }
    });

    $scope.change1 = function (res, res1) {
        if (res != undefined) {
            $timeout(function () {
                console.log("res", res);
                console.log("res1", res1);
                var re = /\s*-\s*/;
                var nameList = res1.split(re);
                console.log("nameList", nameList)

                $scope.bank.address_line1 = '';
                $scope.bank.address_line2 = '';
                $scope.bank.city = '';
                $scope.bank.state = '';
                $scope.bank.country = '';
                $scope.bank.zip = '';
                for (i = 0; i < res.length; i++) {
                    if (res[i].types[0] == "sublocality_level_1") {
                        $scope.bank.address_line12 = res[i].long_name;
                    }

                    if (res[i].types[0] == "locality")
                        $scope.bank.city = res[i].long_name;
                    if (res[i].types[0] == "administrative_area_level_1")
                        $scope.bank.state = res[i].long_name;
                    if (res[i].types[0] == "country")
                        $scope.bank.country = res[i].long_name;
                    if (res[i].types[0] == "route") {
                        $scope.bank.route = res[i].long_name;
                    }

                    if (res[i].types[0] == "sublocality_level_2")
                        $scope.bank.route1 = res[i].long_name;
                    console.log("res ***", res);
                }

                var str1 = nameList[0].trim();
                var str2 = $scope.bank.city.trim();
                console.log(str1);
                console.log(str2);
                if (str1 != str2) {
                    var re1 = /\s* \s*/;
                    var nameList1 = str1.split(re1);
                    console.log("nameList", nameList1)
                    var str3 = nameList1[0];
                    var str4 = nameList1[1];
                    if (str3 == str4) {
                        $scope.bank.address_line1 = str3;
                        console.log("**1")

                    } else {

                        $scope.bank.address_line1 = str3 + " " + nameList[1];
                        ;
                        console.log("**2")
                    }
                    /*  $scope.bank.address_line1 = str1;
                     if(nameList.length>5 && nameList[1]!="") $scope.bank.address_line1 += ", "+nameList[1]
                     console.log("1")*/

                } else if ($scope.bank.route != undefined) {
                    $scope.bank.address_line1 = $scope.bank.route;
                    console.log("2", $scope.bank.route)
                } else {
                    $scope.bank.address_line1 = $scope.bank.route1;
                    console.log("3", $scope.bank.route1)
                }

                if ($scope.bank.address_line12 == $scope.bank.address_line1) {
                    $scope.bank.address_line2 = '';
                } else {
                    $scope.bank.address_line2 = $scope.bank.address_line12;
                }



                if (res.length - 1) {
                    var zip = res.length - 1

                    console.log(res[zip].long_name)
                    console.log($scope.bank.city)

                    if (res[zip].types[0] == "postal_code") {
                        $scope.bank.zip = res[zip].long_name
                    } else {
                        request.service('zipCodeByCityName', 'post', {
                            'city_name': $scope.bank.city
                        }, function (response) {
                            console.log(response);
                            $scope.bank.zip = response;
                        })
                    }
                }
            }, 0)
        }




    };
    console.log("$state:", $state, "    ", $state.current.name)
    $("#page-container").scroll(function () {
        if ($state.current.name == "vendorSettings.My-Account.tab1") {
//$(".xdsoft_datetimepicker").hide();
            /*$('#attractionID').focus();*/
            angular.element(".ui-autocomplete").hide();
//            angular.element("#tags").blur();
        }
    });
}
)