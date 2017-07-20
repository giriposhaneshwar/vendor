var app = angular.module('arevea');
app.controller('SecuritysettingsCtrl', function ($scope, request, ctrlComm, $filter, $window, fileUpload, $timeout, $http, $state, $uibModal, NgMap, $location) {


    $scope.markers = [];
    var marker, map;
    $scope.locations = {};

    NgMap.getMap().then(function (map) {
        console.log(map.getBounds().toString());
    });

    //find current browser

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
            $scope.Lat = p.coords.latitude;
            $scope.Lng = p.coords.longitude;

            $scope.map = {
                center: {
                    latitude: p.coords.latitude,
                    longitude: p.coords.longitude
                },
            };

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
                                    $scope.locations.street1 = street[1] + ',' + street[2];
                                } else {
                                    $scope.locations.street1 = street[0] + ',' + street[1] + ',' + street[2];
                                }





                                console.log("responses[0]", $scope.street1);

                                var address = responses[0].address_components

                                for (i = 0; i < address.length; i++) {


                                    console.log(address[i])

                                    // Madhapur
                                    if (address[i].types[0] == 'political') {
                                        $scope.locations.adress2 = address[i].long_name;

                                    } else {
                                        $scope.locations.adress2 = "";
                                    }

                                    // Hyderabad
                                    if (address[i].types[0] == 'locality') {
                                        $scope.locations.city = address[i].long_name;

                                    }
                                    // "Ranga Reddy"
                                    if (address[i].types[0] == 'administrative_area_level_2') {
                                        $scope.locations.district = address[i].long_name;

                                    }
                                    // Telangana
                                    if (address[i].types[0] == 'administrative_area_level_1') {
                                        $scope.locations.state = address[i].long_name;

                                    }
                                    // India
                                    if (address[i].types[0] == 'country') {
                                        $scope.locations.country = address[i].long_name;

                                    }
                                    // postal_code
                                    if (address[i].types[0] == 'postal_code') {
                                        $scope.locations.zip = address[i].long_name;

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





    //drag and drop


    $scope.getCurrentLocation = function () {
        console.log("drag---");
        $scope.pos = this.getPosition();

        /////////////////
        var latitude = $scope.pos.lat()
        var longitude = $scope.pos.lng()

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


                            var street = responses[0].formatted_address.split(',')
                            console.log("responses[0]", street);






                            if (street[0] == 'Unnamed Road') {
                                $scope.locations.street1 = street[1] + ',' + street[2];
                            } else {
                                $scope.locations.street1 = street[0] + ',' + street[1] + ',' + street[2];
                            }

                            console.log("responses[0]", $scope.street1);

                            var address = responses[0].address_components

                            for (i = 0; i < address.length; i++) {


                                console.log(address[i])


                                //street =============



                                // Madhapur
                                if (address[i].types[0] == 'political') {
                                    $scope.locations.adress2 = address[i].long_name;

                                } else {
                                    $scope.locations.adress2 = "";
                                }

                                // Hyderabad
                                if (address[i].types[0] == 'locality') {
                                    $scope.locations.city = address[i].long_name;

                                }
                                // "Ranga Reddy"
                                if (address[i].types[0] == 'administrative_area_level_2') {
                                    $scope.locations.district = address[i].long_name;

                                }
                                // Telangana
                                if (address[i].types[0] == 'administrative_area_level_1') {
                                    $scope.locations.state = address[i].long_name;

                                }
                                // India
                                if (address[i].types[0] == 'country') {
                                    $scope.locations.country = address[i].long_name;

                                }
                                // postal_code
                                if (address[i].types[0] == 'postal_code') {
                                    $scope.locations.zip = address[i].long_name;

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
                        (document.getElementById('autocomplete')), {
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

        // document.getElementById("latitude").value = place.geometry.location.lat();
        //document.getElementById("longitude").value = place.geometry.location.lng();

        var geocoder = new google.maps.Geocoder();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();

        $scope.map = {
            center: {
                latitude: latitude,
                longitude: longitude
            },
        };

        console.log("$scope.map", $scope.map)
        $scope.$apply();


        for (var i = 0; i < place.address_components.length; i++) {
            console.log("addressType", place.address_components[i])


            if (place.address_components[i].types[0] == 'political') {
                $scope.locations.adress2 = place.address_components[i].long_name;

            } else {
                $scope.locations.adress2 = "";
            }

            // Hyderabad
            if (place.address_components[i].types[0] == 'locality') {
                $scope.locations.city = place.address_components[i].long_name;

            }
            // "Ranga Reddy"
            if (place.address_components[i].types[0] == 'administrative_area_level_2') {
                $scope.locations.district = place.address_components[i].long_name;

            }
            // Telangana
            if (place.address_components[i].types[0] == 'administrative_area_level_1') {
                $scope.locations.state = place.address_components[i].long_name;

            }
            // India
            if (place.address_components[i].types[0] == 'country') {
                $scope.locations.country = place.address_components[i].long_name;

            }
            // postal_code
            if (place.address_components[i].types[0] == 'postal_code') {
                $scope.locations.zip = place.address_components[i].long_name;

            }

            $scope.$apply();

        }





    }

    // function for auto complete
    initialize();








})