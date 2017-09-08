/*(function() {*/
var app = angular.module('arevea');
app.controller('locationCtrl', function ($scope, request, ctrlComm, $filter, fileUpload, $window, $timeout, $http, $location, $state, $uibModal, NgMap) {
    $scope.verifyVendorStatus();
    console.log("in location controller")
    $scope.entryLimit = 10;
    $scope.maxSize = 5;
    var map;
    var geocoder = new google.maps.Geocoder();
    $scope.addLoc = {};
    $scope.err = {};
    $scope.page = {};
    console.log(window.location.hash)
    $scope.key = '';
    var autocomplete;

    $('input[type="file"]').change(function () {
        if ($(this).val() != "") {
            $(this).css('color', '#333');
        } else {
            $(this).css('color', 'transparent');
        }
    });

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
        appendTo: '.selectTimeZoneOptionsHolder'
    }).focus(function () {
        $(this).data("autocomplete").search($(this).val());
    });
    $scope.getLocation;
    //$scope.getLocation = [];
    var getVenderLocation = function () {
        console.log("in list")
        console.log($location.path())
        $scope.loader(true);
        request.service('vendorGetLocations', 'post', {
            'vendor_id': $scope.admin.vendorid,
            'user_id': $scope.admin.userId

        }, function (res) {
            $scope.loader(false);
            $scope.getLocation = res;

            var pageNo = ctrlComm.get('currentPage');
            console.log("page no.......", pageNo)
            $scope.currentPage = pageNo ? pageNo : 1;
        });
    }
    $scope.pageChanged = function (currentPage) {
//        alert(currentPage);
//        $scope.currentPage = currentPage;
        ctrlComm.put('currentPage', currentPage);
    }
    $scope.getVenderLocationById = function (id) {
        $scope.loader(true);
        request.service('vendorGetLocationById', 'post', {
            'id': id
        }, function (res) {
            $scope.loader(false);
            // checking phoen number has +
            if (res[0].phone_number != null) {
                res[0].phone_country_code = "+" + res[0].phone_number;
                res[0].phone_number = "+" + res[0].phone_number;
            }
            prePoppulateValues(res[0]);
        });
    }
    $scope.getLocationObject = function (data) {
        $scope.updateRecordArr = data;
        return data;
    }
//    debugger;
    console.log("State", $state);
    if ($location.path() == '/vendorSettings/Location') {
        console.log("44444444");
        ctrlComm.del('userObj');
        console.log(" ctrlComm.del('userObj');", ctrlComm.get('userObj'));
        getVenderLocation();
        $('#a').removeClass('active2');
        $('#b').removeClass('active2');
        $('#c').removeClass('active2');
    } else if ($location.path() == "/vendorSettings/addLocation") {
        getVenderLocation();
        $scope.page.type = 'post'
    } else if ($location.path() == "/vendorSettings/updateLocation/" + $state.params.id) {
        $scope.getVenderLocationById($state.params.id);
        $scope.page.type = 'put';
        prePoppulateValues(ctrlComm.get('userObj'));
    }





    var editLocation = function (obj) {
        ctrlComm.put('userObj', obj);
        console.log("@@@@@@@@", obj);
        $state.go('vendorSettings.updateLocation', {id: obj.id});
    }

    function prePoppulateValues(obj) {
        if (obj) {
            $scope.addLoc = obj;
            console.log("location id", obj.id);
            $scope.Location_id = obj.id;
            $scope.lat = $scope.addLoc.lattitude;
            $scope.lng = $scope.addLoc.longitude;
            $scope.addLoc.latitude = $scope.addLoc.lattitude;
            console.log("latitude longitude", $scope.lat, $scope.lng)
        } else {
            $state.go("vendorSettings.Location")
//            $location.path("/vendorSettings/Location");
        }
    }
    if ($location.path() == "/vendorSettings/updateLocation/" + $state.params.id) {
        $scope.getVenderLocationById($state.params.id);
        $scope.page.type = 'put';
        prePoppulateValues(ctrlComm.get('userObj'));
    }





    $scope.deleteLocation = function (getLoc) {
        var req = {};
        var params = {};
        params.id = getLoc.id;
        console.log("ppppppppp", getLoc)
        console.log('params....', params)
        req.params = params;
        request.service('vendorDeleteLocation', 'post', params, function (response) {
            $scope.loader(false);
            if (typeof response == 'string') {
                response = JSON.parse(response)
            }
            if (response.status == '0') {
            	ctrlComm.del('vendorLocations');
                getVenderLocation(function () {
                    $scope.notification("Location Deleted Successfully");
                    $state.go('vendorSettings.Location');
                })
            }
        })
    }
    var deleteLocationConfirm = function (getLoc) {
        console.log("getLoc" + getLoc.prodcount);
        console.log("getLoc" + getLoc.calount);
        console.log("getLoc" + getLoc.busicount);
        var product = getLoc.prodcount;
        var calender = getLoc.calount;
        var business = getLoc.busicount;
        var msg = "";
        var test = 0;
        if (product > 0) {
            test = 1;
            msg = " Products ";
        }
        if (calender > 0) {
            if (test == 1) {
                msg = msg + " & Availability Timings ";
            } else {
                msg = msg + " Availability Timings ";
            }
            test = 1;
        }
        if (business > 0) {
            if (test == 1) {
                msg = msg + " & Unavailable Timeslots ";
            } else {
                msg = msg + " Unavailable Timeslots ";
            }
            test = 1;
        }
        if (test = 1) {
            msg = msg + " are created with this location do you really want to delete";
        }
        if (product == 0 && calender == 0 && business == 0) {
            msg = 'Are you sure you want to delete';
        }
        var data = {
            /*text: 'Products & Business Times & Calender Events are created with this location do you really want to delete ',
             name: 'location'*/
            text: msg,
            name: 'location'

        }
        $scope.askConfrimation(data, function () {
            $scope.deleteLocation(getLoc);
        });
    }


    if ($location.path() == "/vendorSettings/addLocation" || $location.path() == "/vendorSettings/updateLocation/" + $state.params.id) {

        $scope.markers = [];
        var marker, map;
        $scope.locations = {};

        NgMap.getMap().then(function (map) {
            console.log(map.getBounds().toString());
        });

        //find current browser


        console.log(" ctrlComm.put('userObj')", ctrlComm.get('userObj'))

        if (ctrlComm.get('userObj') == undefined) {
            console.log(" add------ ")


            if (navigator.geolocation) {


                $scope.map = {
                    center: {
                        latitude: 37.352012458959216,
                        longitude: -122.03200764655764
                    },
                    zooms: 15
                };



                navigator.geolocation.getCurrentPosition(function (p) {
                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                    $scope.Lat = p.coords.latitude;
                    $scope.Lng = p.coords.longitude;

                    $scope.latitude = p.coords.latitude;
                    $scope.longitude = p.coords.longitude;
                    console.log($scope.latitude, $scope.longitude)
                    $scope.map = {
                        center: {
                            latitude: p.coords.latitude,
                            longitude: p.coords.longitude
                        },
                        zooms: 15
                    };

                    $scope.test = $scope.latitude + ", " + $scope.longitude;

                    console.log("test", $scope.test)


                    console.log("$scope.map", $scope.map)



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


                                        if (street[0] == 'Unnamed Road') {
                                            $scope.addLoc.address_line1 = street[1] /*+ ',' + street[2]*/;
                                        } else {
                                            $scope.addLoc.address_line1 = street[0] /*+ ',' + street[1] + ',' + street[2]*/;
                                        }





                                        console.log("responses[0]", $scope.street1);

                                        var address = responses[0].address_components

                                        for (i = 0; i < address.length; i++) {


                                            console.log(address[i])

                                            // Madhapur
                                            if (address[i].types[0] == 'political') {
                                                $scope.addLoc.address_line2 = address[i].long_name;

                                            } else {
                                                $scope.locations.adress2 = "";
                                            }

                                            // Hyderabad
                                            if (address[i].types[0] == 'locality') {
                                                $scope.addLoc.city = address[i].long_name;

                                            }
                                            // "Ranga Reddy"
                                            if (address[i].types[0] == 'administrative_area_level_2') {
                                                $scope.locations.district = address[i].long_name;

                                            }
                                            // Telangana
                                            if (address[i].types[0] == 'administrative_area_level_1') {
                                                $scope.addLoc.state = address[i].long_name;

                                            }
                                            // India
                                            if (address[i].types[0] == 'country') {
                                                $scope.addLoc.country = address[i].long_name;

                                            }
                                            // postal_code
                                            if (address[i].types[0] == 'postal_code') {
                                                $scope.addLoc.zip = address[i].long_name;

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

        } else {
            console.log("update ------ ")
            $scope.updatemap = ctrlComm.get('userObj');

            /*$scope.addLoc.address_line1 = $scope.updatemap.address_line1;
             $scope.addLoc.address_line2 = $scope.updatemap.address_line2;
             $scope.addLoc.city = $scope.updatemap.city;
             $scope.addLoc.state = $scope.updatemap.state;
             $scope.addLoc.country = $scope.updatemap.country;
             $scope.addLoc.zip = $scope.updatemap.zip;
             */
            console.log("$scope.updatemap", $scope.updatemap);

            $scope.latitude = $scope.updatemap.lattitude;
            $scope.longitude = $scope.updatemap.longitude;

            $scope.map = {
                center: {
                    latitude: $scope.updatemap.lattitude,
                    longitude: $scope.updatemap.longitude
                },
                zooms: 15
            };

            $scope.test = $scope.updatemap.lattitude + ", " + $scope.updatemap.longitude;

            console.log("$scope.map", $scope.map)


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
                                $scope.addLoc.address_line2 = "";
                                $scope.addLoc.city = "";
                                $scope.addLoc.state = "";
                                $scope.addLoc.country = "";
                                $scope.addLoc.zip = "";
                                $scope.addLoc.address_line1 = "";


                                var address = responses[0].address_components

                                for (i = 0; i < address.length; i++) {


                                    console.log(address[i])


                                    //street =============



                                    // Madhapur
                                    if (address[i].types[0] == 'political') {
                                        $scope.addLoc.address_line2 = address[i].long_name;

                                    } else {
                                        $scope.addLoc.address_line2 = "";
                                    }

                                    // Hyderabad
                                    if (address[i].types[0] == 'locality') {
                                        $scope.addLoc.city = address[i].long_name;

                                    }
                                    // "Ranga Reddy"
                                    if (address[i].types[0] == 'administrative_area_level_2') {
                                        $scope.locations.district = address[i].long_name;

                                    }
                                    // Telangana
                                    if (address[i].types[0] == 'administrative_area_level_1') {
                                        $scope.addLoc.state = address[i].long_name;

                                    }
                                    // India
                                    if (address[i].types[0] == 'country') {
                                        $scope.addLoc.country = address[i].long_name;

                                    }
                                    // postal_code
                                    if (address[i].types[0] == 'postal_code') {
                                        $scope.addLoc.zip = address[i].long_name;

                                    }




                                    console.log("responses[0]", responses[0].address_components);
                                    console.log("responses[0]", responses[0]);


                                    var street = responses[0].formatted_address.split(',')
                                    console.log("responses[0]", street);




                                    if (street[0] == 'Unnamed Road') {

                                        if (street[1] == $scope.addLoc.city) {
                                            $scope.addLoc.address_line1 = street[2] /*+ '' + street[2]*/;
                                        } else {
                                            $scope.addLoc.address_line1 = street[1] /*+ '' + street[2]*/;
                                        }


                                    } else {
                                        $scope.addLoc.address_line1 = street[0] /*+'' + street[1] + '' + street[2]*/;
                                    }

                                    console.log("responses[0]", $scope.street1);


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

        function initialize() {
            // Create the autocomplete object, restricting the search
            // to geographical location types.
            autocomplete = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */
                            (document.getElementById('autocomplete1')), {
                        types: ['geocode']
                    });

            console.log("AutoComplete", autocomplete);
            // When the user selects an address from the dropdown,
            // populate the address fields in the form.
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                fillInAddress();
            });
        }

        // [START region_fillform]
        function fillInAddress() {
            debugger;
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();

            console.log("GetPlace AutoComplete", place);

            // document.getElementById("latitude").value = place.geometry.location.lat();
            //document.getElementById("longitude").value = place.geometry.location.lng();

            $scope.addLoc.address_line2 = "";
            $scope.addLoc.city = "";
            $scope.addLoc.state = "";
            $scope.addLoc.country = "";
            $scope.addLoc.zip = "";
            //$scope.addLoc.address_line1 = "";
            $scope.address_1 = "";
            var exist = 0;
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
                zooms: 15
            };
            $scope.test = $scope.latitude + ", " + $scope.longitude;

            console.log("$scope.map", $scope.map)
            $scope.$apply();



            for (var i = 0; i < place.address_components.length; i++) {
                console.log("addressType", place.address_components[i])

                /* $scope.addLoc.address_line1 */


                /* if (place.address_components[i].types[0] == 'street_number') {
                 $scope.address_11 = place.address_components[i].long_name;
                 console.log("is nulllllllll", $scope.address_11);
                 }
                 
                 if (place.address_components[i].types[0] == 'route') {
                 $scope.address_12 = place.address_components[i].long_name;
                 console.log("is nulllllllll", $scope.address_12);
                 }*/





                if (place.address_components[i].types[0] == 'administrative_area_level_2') {
                    $scope.locations.district = place.address_components[i].long_name;

                }

                // "Ranga Reddy"

                console.log("place.address_components[i].types[0]", place.address_components[i].types[0])
                if (place.address_components[i].types[0] == 'sublocality_level_1') {
                    console.log("place.address_components[i].types[0]", place.address_components[i].long_name)
                    $scope.addLoc.address_line2 = place.address_components[i].long_name;

                }


                // Hyderabad
                if (place.address_components[i].types[0] == 'locality') {
                    $scope.addLoc.city = place.address_components[i].long_name;

                }
                // Telangana
                if (place.address_components[i].types[0] == 'administrative_area_level_1') {
                    $scope.addLoc.state = place.address_components[i].long_name;

                }
                // India
                if (place.address_components[i].types[0] == 'country') {
                    $scope.addLoc.country = place.address_components[i].long_name;

                }
                // postal_code
                if (place.address_components[i].types[0] == 'postal_code') {
                    $scope.addLoc.zip = place.address_components[i].long_name;

                }

                /* if (place.address_components[i].types[0] == 'street_number') {
                 $scope.address_1 = $scope.address_1+" "+place.address_components[i].long_name;
                 exist=1;
                 }
                 if (place.address_components[i].types[0] == 'route') {
                 $scope.address_1 = $scope.address_1+" "+place.address_components[i].short_name;
                 exist=1;
                 }
                 if (place.address_components[i].types[0] == 'administrative_area_level_2'&&exist==0) {
                 $scope.address_1 = $scope.address_1+" "+place.address_components[i].long_name;
                 
                 }
                 */



                console.log("$scope.homeLocation1", $scope.addLoc.city);

                $scope.homeLocation = $("#autocomplete1").val().split(',');
                console.log("$scope.homeLocation", $scope.homeLocation);

                //$scope.addLoc.address_line1 = $scope.homeLocation[0];



                if ($scope.homeLocation[0] == $scope.addLoc.city) {
                    console.log("not same ----", $scope.address_1)
                    $scope.addLoc.address_line1 = $scope.address_1;
                } else {
                    console.log("same ----", $scope.homeLocation[0])
                    $scope.addLoc.address_line1 = $scope.homeLocation[0];
                }





                $scope.$apply();

            }





        }

        // function for auto complete
        initialize();

    }
    $scope.isResponse = false;

    $scope.addLocationDetail = function () {
        validateLocationForm(function () {
            $scope.loader(true);
            console.log("latitude", $scope.latitude, $scope.longitude)

            $scope.addLoc.vendor_id = $scope.admin.vendorid;

            $scope.addLoc.latitude = $scope.latitude;
            $scope.addLoc.longitude = $scope.longitude;
            $scope.addLoc.timezone = $('#tags').val();
            $scope.addLoc.phone_country_code = $scope.addLoc.phone_country_code;
            $scope.addLoc.phone_number = $scope.addLoc.phone_country_code;
            console.log("$scope.addLoc", $scope.addLoc);

            $scope.isResponse = true;
            request.service('vendorAddLocation', 'post', $scope.addLoc, function (res) {
                $scope.loader(false);
                $scope.isResponse = false;
                if (res.status == 0) {
                	ctrlComm.del('vendorLocations');
                    $scope.notification(res.message);
                    $state.go('vendorSettings.Location');
                } else {
                    $scope.notification(res.message);
                }
            });
        });
    };
    $scope.validateaddress = function () {

        if ($scope.addLoc.address_line1 != undefined)
        {
            $scope.err.country = false;
            $scope.err.state = false;
            $scope.err.city = false;
            $scope.err.zip = false;
        }
    }
    $scope.updateLocation = function (addLoc) {
//        if (addLoc.phone_country_code != null && addLoc.phone_country_code.indexOf('+') > -1) {
//            var phoneArr = addLoc.phone_country_code.split('+');
//            addLoc.phone_number = phoneArr[1];
//            addLoc.phone_country_code = phoneArr[1];
//            addLoc.phone_number_cdn = true;
//        } else {
//            addLoc.phone_number = "";
//            addLoc.phone_country_code = "";
//            addLoc.phone_number_cdn = true;
//        }
        validateLocationForm(function () {
            debugger;
            $scope.addLoc.vendor_id = $scope.admin.vendorid
            $scope.addLoc.id = $scope.Location_id;
            $scope.addLoc.phone_country_code = $scope.addLoc.phone_country_code;
            $scope.addLoc.phone_number = $scope.addLoc.phone_country_code;
            var params = {};
            params = angular.copy($scope.addLoc);
            params.latitude = $scope.latitude;
            params.longitude = $scope.longitude;
            params.timezone = $('#tags').val();

            console.log("params", params)


            $scope.isResponse = true;
            request.service('vendorUpdateLocation', 'post', params, function (response) {
                $scope.isResponse = false;
                if (response.status == 0) {
                	ctrlComm.del('vendorLocations');
                    $scope.notification('Location Updated Successfully');
//                    $state.go('vendorSettings.Location');
                    $location.path("/vendorSettings/Location");
//                    $window.location.href = "#/vendorSettings/Location";
                } else {
                    $scope.notification(response.message, "danger")
                }
            })
        })
    }
    $scope.cancelUpdateLocation = function () {
        $window.location.href = "#/vendorSettings/Location";
//        $state.go('vendorSettings.Location');
//        $scope.$apply();
    }





    var validateLocationForm = function (cb) {

        if (!$scope.addLoc.address_line1) {
            $scope.err.address_line1 = true;
        } else {
            delete $scope.err.address_line1;
        }
        if (!$scope.addLoc.country) {
            $scope.err.country = true;
        } else {
            delete $scope.err.country;
        }
        if (!$scope.addLoc.state) {
            $scope.err.state = true;
        } else {
            delete $scope.err.state;
        }
        if (!$scope.addLoc.city) {
            $scope.err.city = true;
        } else {
            delete $scope.err.city;
        }
        if (!$scope.addLoc.zip) {
            $scope.err.zip = true;
        } else {
            delete $scope.err.zip;
        }
        if (!$scope.addLoc.location_description) {
            $scope.err.location_description = true;
        } else {
            delete $scope.err.location_description;
        }
        if (!$scope.addLoc.location_name) {
            $scope.err.location_name = true;
        } else {
            delete $scope.err.location_name;
        }

        if ($scope.addLoc.phone_country_code === null || $scope.addLoc.phone_country_code === undefined) {
            $scope.err.phone_country_code = true;
        } else {
            if (!$scope.addLoc.phone_country_code && $scope.addLoc.phone_country_code.length !== 10) {
                $scope.err.phone_country_code = true;
            } else {
                delete $scope.err.phone_country_code;
            }
        }

//        delete $scope.err.phone_area_code;
//        if ($scope.addLoc.phone_number && $scope.addLoc.phone_number.toString().length != 11) {
//            $scope.err.phone_number_cdn = true;
//        } else {
//            delete $scope.err.phone_number_cdn;
//        }
        console.log("lengthy::", Object.keys($scope.err).length);
        console.log("err", $scope.err);
        if (Object.keys($scope.err).length == 0) {

            if (cb)
                cb();

        }
    }

    var ph_country_code = '';
    $scope.$watch('addLoc.phone_country_code', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_country_code = '';
         }*/
        if (val) {
            if (!val.toString().match(/^\d*$/) || val.toString().length > 10) {
                if (val.toString().length != 1) {
//                    $scope.addLoc.phone_country_code = $scope.displayPhoneNumber(ph_country_code);
                    $scope.addLoc.phone_country_code = ph_country_code;
                } else {
                    $scope.addLoc.phone_country_code = '';
                }
            } else {
                ph_country_code = val;
            }
        }
    });
    var ph_area_code = '';
    $scope.$watch('addLoc.phone_area_code', function (val) {
        /*if (val == 0) {
         $scope.vendor.phone_area_code = '';
         }*/
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
                if (val.toString().length != 1) {
                    $scope.addLoc.phone_area_code = ph_area_code;
                } else {
                    $scope.addLoc.phone_area_code = '';
                }
            } else {
                ph_area_code = val;
            }
        }
    });


    var phoneNumber = '';
    $scope.$watch('addLoc.phone_number', function (val) {
        if (val == 0) {
            $scope.addLoc.phone_number = '';
        }
        if (val) {
            if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 7) {
                if (val.toString().length != 1) {
                    $scope.addLoc.phone_number = phoneNumber;
                } else {
                    $scope.addLoc.phone_number = '';
                }
            } else {
                phoneNumber = val;
            }
        }
    });
    $scope.editLocation = editLocation;
    $scope.deleteLocationConfirm = deleteLocationConfirm;

    $("#page-container").scroll(function () {
        //if ($state.current.name == "vendorSettings.My-Account.tab1") {
        //$(".xdsoft_datetimepicker").hide();
        angular.element(".ui-autocomplete").hide();
        angular.element("#tags").blur();
        //}
    });
});