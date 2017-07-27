var app = angular.module('arevea');
app.controller('customRequestsCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $interval, $http, $window,
        $state, NgMap) {
    //console.log("in customRequestsCtrl ctrl");
    //$(".custom-req-item").click(function(){
    /*$(document).on("mouseover", ".custom-req-item-wrapper", function(){
     $(this).find(".custom-req-details").show(100);
     });
     
     $(document).on("mouseleave", ".custom-req-item-wrapper", function(){
     $(this).find(".custom-req-details").hide(100);
     });*/
    //    $(document).on("click", ".custom-req-item .glyphicon-menu-down", function () {
    //        $(this).parent().parent().parent().parent().find(".custom-req-details").show();
    //        $(this).parent().parent().parent().parent().find(".glyphicon-menu-down").addClass("glyphicon-menu-up").removeClass("glyphicon-menu-down");
    //    });
    //
    //    $(document).on("click", ".custom-req-item .glyphicon-menu-up", function () {
    //        $(this).parent().parent().parent().parent().find(".custom-req-details").hide();
    //        $(this).parent().parent().parent().parent().find(".glyphicon-menu-up").addClass("glyphicon-menu-down").removeClass("glyphicon-menu-up");
    //    });

    $scope.getFileDetails = function (e) {
        console.log("eeee" + e);
        $scope.$apply(function () {
            if ($scope.customRequestFiles == null) {
                $scope.customRequestFiles = [];
            }
            console.log("$('#Upload')[0].files" + $('#Upload')[0].files);
            for (var i = 0; i < $('#Upload')[0].files.length; i++) {
                console.log("$('#Upload')[0].files" + $('#Upload')[0].files[i]);
                $scope.customRequestFiles.push($('#Upload')[0].files[i])
            }
            $("#Upload").val("");
        });
    };

    $scope.removeImage = function (index, img) {
        $scope.imgList.splice(index, 1)
    };
    $scope.$watch('$state.current.url', function (n, o) {
        $scope.init();
    });


    $scope.init = function () {
        $scope.customRequestFiles = [];

        //        var $crStatus = ($location.path()).split('/')[($location.path()).split('/').length - 1];
        var $crStatus = $state.current.name;
        //        debugger;
        //alert($crStatus);
        if ($crStatus == "customRequests.all") {
            $scope.crStatus = '0';
        } else if ($crStatus == "customRequests.pending") {
            $scope.crStatus = '1';
        } else if ($crStatus == "customRequests.completed") {
            $scope.crStatus = '2';
        }

        $scope.vendorId = window.localStorage.vendorid;

        $rootScope.argsCr = {
            'vendor_id': $scope.vendorId,
            'crStatus': $scope.crStatus
        };

        $scope.getAllEventsList();

    };

    $scope.stopQuotation = function () {
        if ($('.cr-warning').css('display') == 'none') {
            $(".cr-warning").slideDown(100);
        } else {
            $("#sendQuotation").modal("hide");
        }
    };

    $scope.closeQuotation = function () {
        $(".cr-warning").slideUp(100, function () {
            $("#sendQuotation").modal("hide");
        });
    };

    $interval(function () {
        $interval.cancel($scope.timerInterval);
        $scope.getAllEventsList();
    }, 600000);

    $scope.getAllEventsList = function () {
        $scope.eventNameIdsObj = {};
        request.service(
                'eventsList',
                'get', {},
                function (response) {
                    $scope.eventsList = response;
                    for (i = 0; i < response.length; i++) {
                        $scope.eventNameIdsObj[response[i].id] = response[i].event_type;
                    }
                    $scope.getAllCategoriesList();
                });
    };

    $scope.getAllCategoriesList = function () {
        $scope.catNameIdObj = {};
        request.service('categoriesList', 'get', {}, function (
                response) {
            for (i = 0; i < response.length; i++) {
                $scope.catNameIdObj[response[i].id] = response[i].category_name;
            }
            $scope.myCustomRequests($rootScope.argsCr);
        });
    };

    $scope.hideWarning = function () {
        $(".cr-warning").slideUp(100);
    };

    $scope.showQuotationPopup = function (vid, cid, cdes, event_summary_id, event_type, category, fdate, ftime, tdate, ttime, cmedia, displayformat, eventdate, eventtime) {
        $("#quotationDescription").val("");
        $("#quotationPrice").val("");
        $("#deliveryPrice").val("");
        $(".cr-warning").hide();
        $scope.vid = vid;
        $scope.qCid = cid;
        $scope.qDes = cdes;
        $scope.event_summary_id = event_summary_id;

        $scope.quoEventType = event_type;
        $scope.quoCategory = category;
        $scope.quoFdate = fdate;
        $scope.quoFtime = ftime;
        $scope.quoTdate = tdate;
        $scope.quoTtime = ttime;
        $scope.quoCmedia = cmedia;

        $scope.displayformat = displayformat;
        $scope.eventdate = eventdate;
        $scope.eventtime = eventtime;

        //$scope.quotationPrice = "";
        //$scope.deliveryPrice = "";
        //$scope.quotationDescription = "";

        $("#sendQuotation").modal("show");
        $scope.customRequestFiles = [];
    };

    $scope.changedInputText = function (ele) {
        if ($(ele.currentTarget).val().trim != "") {
            $(ele.currentTarget).closest("div").find(".cr-err").html("");
        }
    };
    $scope.checkKeyPattern = function (evt, data) {
        //   console.log("Key Pressed", evt.charCode, evt);
        if (evt.charCode >= 48 && evt.charCode <= 57) {
            // console.log("Match Found", data);
            return;
        } else if (evt.charCode == 46) {
            // console.log("Match Found Dot", data);
            return;
        } else {

            //  console.log("Match Not Found", data);
            evt.preventDefault();
        }
    }

    $scope.removeImage = function (index, img) {
        console.log($scope.customRequestFiles);
        $scope.customRequestFiles.splice(index, 1);
    };
    $scope.isQuoteSubmited = false;
    $scope.submitQuotation = function () {
        var quotationDescription = $("#quotationDescription").val();
        quotationDescription = quotationDescription.split("\n").join("<br>");
        var quotationPrice = $("#quotationPrice").val();
        var deliveryPrice = $("#deliveryPrice").val();
        var errorStr = "";

        if (quotationDescription.trim() == "") {
            errorStr += "please enter quote description";
            $("#quotationDescriptionErr").html("Enter quote description");
        } else {
            $scope.isQuoteSubmited = false;
            $("#quotationDescriptionErr").html("");
        }

        if (quotationPrice.trim() == "") {
            errorStr += "please enter quotation price";
            $("#quotationPriceErr").html("Enter quote price");
        } else {
            $scope.isQuoteSubmited = false;
            $("#quotationPriceErr").html("");
        }

        if (deliveryPrice.trim() == "") {
            errorStr += "please enter quotation description";
            $("#deliveryPriceErr").html("Enter delivery price (enter 0 if not applicable)");
        } else {
            $scope.isQuoteSubmited = false;
            $("#deliveryPriceErr").html("");
        }

        if (errorStr != "") {
            return false;
        }

        $scope.isQuoteSubmited = true;

        var media = {};
        media.image = [];
        var fd = new FormData();

        angular.forEach($scope.customRequestFiles, function (obj) {
            var temp = {};
            temp.name = obj.name;
            media.image.push(temp);
            fd.append('crvimages', obj);
        });

        $scope.quotationData = {
            "customRequestId": $scope.qCid,
            "vid": $scope.vid,
            "quotationDescription": quotationDescription,
            "delivery_fee": $scope.deliveryPrice,
            "quotationPrice": $scope.quotationPrice,
            "event_summary_id": $scope.event_summary_id,
            "media": media
        };
        //console.log($scope.quotationData);
        fd.append('jsondata', JSON.stringify($scope.quotationData))
        //request.service('quotationSent', 'post', fd, 

        var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
        var url = "/quotationSent";

        $http.post(serviceURL + url, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
                .success(function (response) {
                    $scope.isQuoteSubmited = false;
                    $scope.myCustomRequests($rootScope.argsCr);
                    $("#sendQuotation").modal("hide");
                })
                .error(function (response) {
                    $scope.isQuoteSubmited = false;
                    $scope.notification(response.message);
                });
    };

    $scope.formatPrice = function (price) {
        price = Number(price);
        return parseFloat(price).toFixed(2);
    };

    $scope.myCustomRequests = function (args) {
        $scope.todaysDate = new Date();
        request.service('getCustomRequestVendors', 'post', args, function (response) {
            if (response.status == 0) {
                for (var i = 0; i < response.requests.length; i++) {
                    response.requests[i].product_text = JSON.parse(response.requests[i].product_text);

                    response.requests[i].start_time = $scope.formatDBDate(response.requests[i].start_time);
                    response.requests[i].end_time = $scope.formatDBDate(response.requests[i].end_time);

                    response.requests[i].formattedFromDate = $scope.formatDate(response.requests[i].start_time);
                    response.requests[i].formattedToDate = $scope.formatDate(response.requests[i].end_time);

                    response.requests[i].new_start_time = $scope.getHoursMinutes(response.requests[i].start_time);
                    response.requests[i].new_end_time = $scope.getHoursMinutes(response.requests[i].end_time);

                    response.requests[i].formattedFromTime = $scope.formatTime(response.requests[i].new_start_time);
                    response.requests[i].formattedToTime = $scope.formatTime(response.requests[i].new_end_time);

                    response.requests[i].eventTypeName = $scope.eventNameIdsObj[response.requests[i].event_type_id];
                    response.requests[i].categoryName = $scope.catNameIdObj[response.requests[i].category_id];

                    response.requests[i].customerMedia = [];
                    response.requests[i].vendorMedia = [];
                    $scope.cvimagepath = response.requests[i].cvimagepath;
                    $scope.imagepath = response.requests[i].imagepath;

                    for (var j = 0; j < response.requests[i].media.length; j++) {
                        if (response.requests[i].media[j].upload_from == "customer") {
                            var original = response.requests[i].media[j].media_original_name;
                            var disp = response.requests[i].media[j].media_name;
                            var m = {};
                            m['media'] = disp;
                            m['original'] = original;

                            response.requests[i].customerMedia.push(m);
                        } else if (response.requests[i].media[j].upload_from == "vendor") {
                            var original = response.requests[i].media[j].media_original_name;
                            var disp = response.requests[i].media[j].media_name;
                            var m = {};
                            m['media'] = disp;
                            m['original'] = original;
                            response.requests[i].vendorMedia.push(m);
                        }
                    }

                    response.requests[i].responseEndTime = new Date(response.requests[i].req_end_time);
                    response.requests[i].responseCurrentTime = new Date(response.requests[i].response_start_time);
                    if (response.requests[i].vreq_status == 'Quote Submitted') {
                        response.requests[i].responseEndTime = new Date(response.requests[i].req_end_time);
                    }
                    console.log("response.requests[i].responseEndTime ", response.requests[i].req_end_time);
                    response.requests[i].diff = response.requests[i].responseEndTime.valueOf() - response.requests[i].responseCurrentTime.valueOf();
                    console.log("response.requests[i].diff ", response.requests[i].diff);
                    response.requests[i].secondsRemaining = Math.floor(response.requests[i].diff / 1000);
                    console.log("response.requests[i].diff ", response.requests[i].secondsRemaining);
                    if (response.requests[i].diff < 0) {
                        response.requests[i].timer = "Expired";
                    }

                }
                console.log(JSON.stringify(response));

                $scope.customRequests = response.requests;
                $scope.runTimers();

                for (var k = 0; k < $scope.customRequests.length; k++) {
                    /*Date formats*/
                    $scope.customRequests[k].event_start_date

                    var stDate = new Date($scope.customRequests[k].event_start_date);
                    $scope.customRequests[k].formattedFromDate = stDate;
                    var edDate = new Date($scope.customRequests[k].event_end_date);
                    $scope.customRequests[k].formattedToDate = edDate;

                    var start = moment(stDate);
                    var end = moment(edDate);
                    var dayDiff = moment.duration(end.diff(start));
                    $scope.diffDays = dayDiff.asDays();
                    console.log("$scope.diffDays:", $scope.diffDays);
                    $scope.customRequests[k].diffDays = $scope.diffDays;

                }

            } else {
                $scope.customRequests = [];
            }
        });
    };

    $scope.changeStatus = function (st) {
        $interval.cancel($scope.timerInterval);
        $scope.crStatus = st;
        $rootScope.argsCr = {
            'vendor_id': $scope.vendorId,
            'crStatus': $scope.crStatus
        };
        $scope.myCustomRequests($rootScope.argsCr);
    };

    $scope.runTimers = function () {
        if ($scope.timerInterval) {
            $interval.cancel($scope.timerInterval);
        }

        for (var i = 0; i < $scope.customRequests.length; i++) {
            $scope.customRequests[i].diff = $scope.customRequests[i].responseEndTime.valueOf() - $scope.customRequests[i].responseCurrentTime.valueOf();
            /*if($scope.customRequests[i].diff>86400000)
             {
             $scope.customRequests[i].diff=86400000;
             }*/
            $scope.customRequests[i].secondsRemaining = ($scope.customRequests[i].diff / 1000);
            var totalSeconds = Math.floor($scope.customRequests[i].secondsRemaining);
            console.log("totalSeconds", totalSeconds);
            var hours = Math.floor(totalSeconds / 3600);

            totalSeconds %= 3600;
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = Math.floor(totalSeconds % 60);

            if (hours < 10) {
                hours = "0" + hours;
            }

            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            $scope.customRequests[i].timer = hours + ":" + minutes + ":" + seconds;
            //
            $rootScope.$$phase || $rootScope.$apply();
        }

        $scope.timerInterval = $interval(function () {
            $scope.todaysDate = new Date();
            for (var i = 0; i < $scope.customRequests.length; i++) {
                /*$scope.customRequests[i].diff = $scope.customRequests[i].responseEndTime.valueOf() - $scope.todaysDate.valueOf(); 
                 if($scope.customRequests[i].diff>86400000)
                 {
                 $scope.customRequests[i].diff=86400000;
                 }*/
                $scope.customRequests[i].diff = $scope.customRequests[i].diff - 1000;

                $scope.customRequests[i].secondsRemaining = ($scope.customRequests[i].diff / 1000);
                var totalSeconds = $scope.customRequests[i].secondsRemaining;
                var hours = Math.floor(totalSeconds / 3600);

                totalSeconds %= 3600;
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = Math.floor(totalSeconds % 60);

                if (hours < 10) {
                    hours = "0" + hours;
                }

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                if (seconds < 10) {
                    seconds = "0" + seconds;
                }

                $scope.customRequests[i].timer = hours + ":" + minutes + ":" + seconds;
                //
                $rootScope.$$phase || $rootScope.$apply();
            }

        }, 1000);

    };

    $scope.getWeekDay = function (day) {
        var weekday = [];
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        return weekday[day];
    };

    $scope.getMonthName = function (monthNumber) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[monthNumber];
    };

    $scope.formatDate = function (date) {
        var onlyDate = date.split(" ")[0];
        var onlyTime = date.split(" ")[1];
        var onlyDateArray = onlyDate.split("-");
        var a = date.split(/[^0-9]/);
        var dateJs = new Date(a[2], a[0] - 1, a[1], a[3], a[4]);
        var weekDay = $scope.getWeekDay(dateJs.getDay());
        var dateh = dateJs.getDate();
        var month = $scope.getMonthName(dateJs.getMonth());
        var year = dateJs.getFullYear();
        return weekDay + ", " + dateh + " " + month + " " + year;
    };

    $scope.addZero = function (value) {
        return value = value < 10 ? "0" + value : value;
    };

    $scope.formatDBDate = function (date) {
        var a = date.split(/[^0-9]/);
        var dateJs = new Date(a[2], a[0] - 1, a[1], a[3], a[4], a[5]);
        var hours = $scope.addZero(dateJs.getHours());
        var minutes = $scope.addZero(dateJs.getMinutes());
        var dateh = $scope.addZero(dateJs.getDate());
        var month = a[0];
        var year = $scope.addZero(dateJs.getFullYear());
        return month + "-" + dateh + "-" + year + " " + hours + ":" + minutes;
    };

    $scope.formatTime = function (time) {
        var timeArray = time.split(":");
        var hour = timeArray[0];
        var minute = timeArray[1];
        var ap = "AM";
        if (hour > 11) {
            ap = "PM";
        }
        if (hour > 12) {
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }

        if (hour < 10) {
            hour = "0" + hour;
        }

        if (minute < 10) {
            minute = "0" + minute;
        }

        return hour + ':' + minute + " " + ap;
    };

    $scope.getHoursMinutes = function (date) {
        var onlyDate = date.split(" ")[0];
        var onlyTime = date.split(" ")[1];
        var onlyDateArray = onlyDate.split("-");
        /*
         * var temp = onlyDateArray[1]; onlyDateArray[1] = onlyDateArray[0];
         * onlyDateArray[0] = onlyDateArray[2]; onlyDateArray[2] =
         * onlyDateArray[1];
         */
        date = onlyDateArray[2] + "-" + onlyDateArray[0] + "-" + onlyDateArray[1] + " " + onlyTime;
        var dateJs = new Date(date);
        var hours = dateJs.getHours();
        var minutes = dateJs.getMinutes();
        return hours + ":" + minutes;
    };
    /*$(document).on("click", ".custom-file-input", function(){
     $(".customized").click();
     });*/
    if ($state.params.id !== "") {
        $scope.showProductClass = "glyphicon-menu-up";
        $scope.showDetailsById = $state.params.id;
    } else {
        $scope.showProductClass = "glyphicon-menu-down";
        $scope.showDetailsById = 0;
    }
    $scope.showProductId = function (data) {
//        debugger;
        if ($state.current.name == 'customRequests.all') {
            $state.go("customRequests.all", {id: data});
        } else if ($state.current.name == 'customRequests.pending') {
            $state.go("customRequests.pending", {id: data});
        } else if ($state.current.name == 'customRequests.completed') {
            $state.go("customRequests.completed", {id: data});
        }
        /*$timeout(function() {
         $('.mainContainer').animate({scrollTop: $('#' + data).position().top + 100}, 500);
         },10);*/
        console.log("id:", data)
        $scope.showDetailsById = data;
        $scope.showProductClass = "glyphicon-menu-down";
    }
    $scope.hideProductId = function (data) {
//        debugger;
        if ($state.current.name == 'customRequests.all') {
            $state.go("customRequests.all", {id: ""});
        } else if ($state.current.name == 'customRequests.pending') {
            $state.go("customRequests.pending", {id: ""});
        } else if ($state.current.name == 'customRequests.completed') {
            $state.go("customRequests.completed", {id: ""});
        }
        $scope.showDetailsById = 0;
        $scope.showProductClass = "glyphicon-menu-up";
    }
    //
    //    $scope.$watch('$state.params.id', function (n, o) {
    //        if (n != "") {
    //            $scope.showDetailsById = true;
    //        } else {
    //            $scope.showDetailsById = false;
    //        }
    //    });

});
