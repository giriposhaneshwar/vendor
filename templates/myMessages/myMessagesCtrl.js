var app = angular.module('arevea');
app.controller('myMessagesCtrl', function ($scope, $rootScope, $location,
        request, ctrlComm, $filter, fileUpload, $timeout, $http, $window,
        $state, NgMap, $stateParams) {

    $scope.err1 = {};
    $scope.support = {};
    $scope.data = {};
    $scope.replay_user1 = [];
    $scope.readArchive = false;
    $scope.showFilter = false;


    $scope.entryLimit = 10;
    var pageNo = ctrlComm.get('currentPage');
    $scope.currentPage = pageNo ? pageNo : 1;

    $scope.pageChanged = function (currentPage) {
        ctrlComm.put('currentPage', currentPage);
        $scope.currentPage = currentPage;
//        console.info('Page changed to: ', currentPage);
    };



    $('.hide-conv-btn').hide();
    $(".reply-conv-btn").hide();
    $(".reply-form-data").hide();
    $('input[type="file"]').change(function () {
        if ($(this).val() != "") {
            $(this).css('color', '#333');
        } else {
            $(this).css('color', 'transparent');
        }
    });
    $scope.messageCategories1 = [];
    $scope.filterSearch = {
        category: '',
        msgType: '',
        categoryType: '',
        messageType: ''
    };
    $scope.getMessageRequestData = function () {
        $scope.err1 = {};
        $('.tool').tooltip();
        $(".hide-conv-btn").hide();
        $(".reply-conv-btn").hide();
        $(".reply-form-data").hide();
        var currentMenu = window.location.hash;
        $('.Message_data').val("");
        $scope.activeTab = 'All';
        $scope.loading = true;
        $scope.inquirySentMsg = '';
        $scope.supportSentMsg = '';
        $scope.accountSentMsg = '';
        console.log("getMessageRequestData", currentMenu, window.localStorage.userId);
        var options = {"userId": window.localStorage.userId};
        if (currentMenu == "#/myMessages") {
            options.message_type = "inquiry";
        }
        if (currentMenu == "#/mySupport") {
            options.message_type = "support";
        }
        if (currentMenu == "#/myAccount") {
            options.message_type = "account";
        }
        request.service('getMessageFeaturesByMessageCategory', 'post', {"messageType": options.message_type, 'request_from': 'vendor'}, function (response) {
            console.log("$$$$ response $$$$$", response);
            $scope.loading = false;
            if (response.status == "0") {
//                debugger;
                $scope.messageCategories = response.result;
                $scope.getMsgTypeByFeature('filter', $scope.messageCategories[0]);
            }
            console.log(currentMenu + " == getMessageFeaturesByMessageCategory -> response", response);
        });

        //        $("#messagecategory").autocomplete({
        //            source: $scope.messageCategories1,
        //            minLength: 0,
        //            select: function (event, ui) {
        //                $scope.homeCategoryType = ui.item.label;
        //                $("#errs1").hide();
        //                $("#searchClear1").css("display", "block");
        //                for (i = 0; i < $scope.messageCategories.length; i++) {
        //                    if ($scope.messageCategories[i].message_feature == $scope.homeCategoryType) {
        //                        $scope.num_id = $scope.messageCategories[i].message_feature_id;
        //                        $scope.messageTypes1 = [];
        //                        $scope.getMessageTypeByFeature($scope.num_id, $scope.homeCategoryType);
        //                    }
        //                }
        //                $("#messagecategory").show();
        //                $("#messagecategory").css("border", "1px solid #CCC");
        //            }
        //        }).focus(function () {
        //            //Use the below line instead of triggering keydown
        //            $(this).data("autocomplete").search($(this).val());
        //        });
        //        $("#messagecategory1").autocomplete({
        //            source: $scope.messageCategories1,
        //            minLength: 0,
        //            select: function (event, ui) {
        //                $scope.homeCategoryType = ui.item.label;
        //                $("#errs1").hide();
        //                $("#searchClear1").css("display", "block");
        //                for (i = 0; i < $scope.messageCategories.length; i++) {
        //                    if ($scope.messageCategories[i].message_feature == $scope.homeCategoryType) {
        //                        $scope.num_id = $scope.messageCategories[i].message_feature_id;
        //                        $scope.messageTypes1 = [];
        //                        $scope.getMessageTypeByFeature($scope.num_id, $scope.homeCategoryType);
        //                    }
        //                }
        //                $("#messagecategory1").show();
        //                $("#messagecategory1").css("border", "1px solid #CCC");
        //            }
        //        }).focus(function () {
        //            //Use the below line instead of triggering keydown
        //            $(this).data("autocomplete").search($(this).val());
        //        });
        //
        //        console.log("$$$$ response options", options);

        request.service('getMessagesByType', 'post', {userId: window.localStorage.userId, message_type: options.message_type}, function (response) {
            console.log("$$$$ response %%%%%", response);
            if (response.status == "0") {
                console.log("message type", response.result);
                $scope.listByType = response.result;

                angular.forEach(response.result, function (val, key) {
                    val.messages_archived = 'false';
                    val.customerProfile = response.customer_image_path + val.profile_pic_path;

                    val.viewDetails = false;
                    console.log("listi is ", key, val);
                })
                if (currentMenu == "#/myMessages")
                    $scope.inquiries = response.result;
                
                window.localStorage.setItem("inquiries", JSON.stringify(response));
                $rootScope.readStatus = response.readstatus;
                $rootScope.messages_starred = response.messages_starred;
                
                if (currentMenu == "#/mySupport")
                    $scope.supports = response.result;
                
                window.localStorage.setItem("supports", JSON.stringify(response));
                $rootScope.readStatus = response.readstatus;
                $rootScope.messages_starred = response.messages_starred;

                if (currentMenu == "#/myAccount")
                    $scope.accounts = response.result;
                window.localStorage.setItem("accounts", JSON.stringify(response));
                $rootScope.readStatus = response.readstatus;
                $rootScope.messages_starred = response.messages_starred;

                console.log(" $scope.inquiries-----------------", $scope.inquiries);
                console.log("$scope.supports", $rootScope.supports);
                console.log("$scope.accounts", $rootScope.accounts);
            } else {
                //alert(response.message);
            }
            console.log(currentMenu + " == getMessagesByType -> response", response);
        });
    };


    $scope.conversationData = [];
    $scope.show_msg = function (index, id) {
        $timeout(function () {
            $('#showConversion' + index).show('slow');
        }, 100);
        var options = {"userId": window.localStorage.userId, "messageId": id};
        request.service('getMessageDetailsByMessageId', 'post', options, function (response) {
            if (response.status == "0") {
                if ($state.current.name == 'myMessages') {
                    $scope.inquiries[index].conversationData = response.result;
                } else if ($state.current.name == 'mySupport') {
                    $scope.supports[index].conversationData = response.result;
                } else {
                    $scope.accounts[index].conversationData = response.result;
                }

                //                $scope.aturl=$scope.replay_user1[0].attachment.replace('["',"");
                //                $scope.url=$scope.aturl.replace('"]',"");
                //                $scope.imgurl=response.attachmentUrl+""+$scope.url;

            } else {
                //alert(response.message);
            }
        });

    }

    $scope.getConvesationData = function (index, id) {
        $timeout(function () {
            $('.message-full-details').hide('slow');
            $(".show-conv-btn").show();
            $(".hide-conv-btn").hide();
            $(".reply-conv-btn").hide();
            $(".reply-form-data").hide();
            $("#buttons_" + index).find(".show-conv-btn").hide();
            $("#buttons_" + index).find(".hide-conv-btn").show();
            $('#msg' + index).show("slow");
            $('#reply-btn' + index).show("slow");
        }, 100);
        $timeout(function () {
            $('#showConversion' + index).slideDown('slow');
        }, 100);
        var options = {
            "userId": window.localStorage.userId,
            "messageId": id
        };
        request.service('getMessageDetailsByMessageId', 'post', options, function (response) {
            console.log(response);
            angular.forEach(response.result, function (val, key) {
                val.attachmentUrl = response.attachmentUrl;
                if (val.attachment !== '') {
                    val.imgUrlData = JSON.parse(val.attachment);
                }
            });
            if (response.status == "0") {
                $scope.conversationData = [];
                if ($state.current.name == 'myMessages') {
                    // $scope.inquiries[index].conversationData = response.result;
                    $scope.conversationData = response.result;
                    $('#myinquires-tab' + index).removeClass('msgUnread')
                } else if ($state.current.name == 'mySupport') {
                    // $scope.supports[index].conversationData = response.result;
                    $scope.conversationData = response.result;
                    $('#myinquires-tab' + index).removeClass('msgUnread')
                } else {
                    // $scope.accounts[index].conversationData = response.result;
                    $scope.conversationData = response.result;
                    $('#myinquires-tab' + index).removeClass('msgUnread')
                }
            } else {
                // alert(response.message);
            }
        });
    };
    $scope.hideMessageInfo = function (index) {
        $timeout(function () {
            $('#msg' + index).slideUp("slow");
            //                $('#reply-btn' + index).hide("slow");
            $('#showConversion' + index).slideUp("slow");
            $('#replyData' + index).slideUp('slow');
            $("#buttons_" + index).find(".show-conv-btn").show();
            $("#buttons_" + index).find(".hide-conv-btn").hide();
            $("#buttons_" + index).find(".reply-conv-btn").hide();
            $('.reply-form-data').slideUp('slow');
        }, 10);
    };
    $scope.getReplyMessage = function (index, id) {
        $timeout(function () {
            $scope.customRequestFiles = [];
            $('#replyMsgData' + index).slideToggle();
            $scope.reply_m_id = id;
        }, 100);
    };
    $scope.showMsgType = false;
    $scope.showMsgCategory = false;
    if (window.location.hash == "#/myMessages") {
        $('body').on("click", function () {
            //alert(1)
            /*if($(".msgType1").hasClass("open")){*/
            if (angular.element(".openList1").is(":visible")) {
                if ($scope.filterSearch.msgType != null && $scope.filterSearch.msgType != "") {
                    $scope.showMsgType = true;
                    $scope.$apply();
                    /*$scope.getMsgTypeByFeature('filter');
                     $scope.getMessagesByType();*/
                } else {
                    $scope.showMsgSelect = false;
                    $scope.$apply();
                }
            }
            /*if($(".msgCategory").hasClass("open")){*/
            /*if($scope.filterSearch.category != "" && $scope.filterSearch.category.message_feature != null && $scope.filterSearch.category.message_feature != ""){
             $scope.showMsgCategory = true;
             $scope.showUiSelect = false;
             $scope.$apply();
             }else{
             $scope.showUiSelect = false;
             }else{
             $scope.showUiSelect = false;
             $scope.$apply();
             }*/
            /*}*/
        });
        angular.element('.openList').hide();
        /*$scope.dropOpen = function(parentId){
         var id = parentId;
         if(id == 'msgCat'){
         $scope.showUiSelect = true;
         }else if(id == 'msgType'){
         $scope.showMsgSelect = true;
         }
         
         }*/
    }
    $scope.getMsgTypeByFeature = function (type, item) {
//        debugger;
        console.log('control', "item:", item);
        var data = {};
        if (type == 'create') {
            data.message_feature_id = $scope.filterSearch.categoryType.message_feature_id;
            if (item != undefined) {
                data.message_feature_id = item.message_feature_id;
            }
        } else {
            data.message_feature_id = item.message_feature_id;
            if (item != undefined) {
                data.message_feature_id = item.message_feature_id;
            }
        }
        data.request_from = "vendor";
        request.service('getMessageTypeByMessageFeatureId', 'post', data, function (response) {
            console.log("$$$$ response $$$$$", response);
            if (response.status == "0") {
                $scope.messageTypes = response.result;
//                $scope.safeApply($scope);
                //                $scope.enableSubmit();
            }
            console.log(" ==++++++++++++++ getMessageTypeByMessageFeatureId -> response", response);
        });
    }
    $scope.safeApply = function (scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }
    $scope.clearFilter = function ($event, type) {
        $event.stopPropagation();
        if (type == 'type') {
            $scope.filterSearch.msgType = '';
            $scope.filterSearch.messageType = '';
        } else {
            $scope.filterSearch.category = '';
            $scope.filterSearch.categoryType = '';
        }
    };


    $scope.getMessageStatus = function (data) {
        var options = {};
        options.userId = localStorage.getItem('userId');
        options.message_feature_id = data.message_feature_id;
        options.message_type_id = data.message_type_id;
        options.readstatus = data.readstatus;
        options.messages_archived = data.messages_archived;
        options.messages_starred = data.messages_starred;
        $scope.err1.readActive = data.readActive;
        $scope.err1.archivedActive = data.archivedActive;
        $scope.err1.starredActive = data.starredActive;
        console.log("dat", $scope.err1);
        $('.Message_data').val("");
        if (window.location.hash == "#/myMessages")
            options.message_type = "inquiry";
        if (window.location.hash == "#/mySupport")
            options.message_type = "support";
        if (window.location.hash == "#/myAccount")
            options.message_type = "account";

        //options.message_type=window.location.hash;
        console.log("options------------------------", options);
        request.service('getMessagesByType', 'post', options, function (response) {
            // debugger;
            console.log("$$$$ response $$$$$", response);
            if (response.status == "0") {
                //                  console.log("message type", response.result)
                $scope.imagePath = response.customer_image_path;

                angular.forEach(response.result, function (n, i) {
                    console.log("each record is ", i, n);
                    n.viewDetails = false;
                });
                if (options.message_type == "#/myMessages")
                    $scope.inquiries = response.result;
                console.log("message type", $scope.inquiries);
                if (options.message_type == "#/mySupport")
                    $scope.supports = response.result;
                console.log("message type", $scope.supports);
                if (options.message_type == "#/myAccount")
                    $scope.accounts = response.result;
                console.log("message type", $scope.accounts);

                console.log(" $scope.inquiries", $scope.inquiries);
                console.log("$scope.supports", $scope.supports);
                console.log("$scope.accounts", $scope.accounts);
            } else {
                alert(response.message);
            }
            console.log(" == getMessagesByType22222 -> response", response);
        });
    }

    $scope.getInboxMsgStatus = function (type) {
        $scope.readType = type;
        $("#MessageForm1").hide();
        var data = {};
        data.userId = localStorage.getItem('userId');
        data.message_type_id = '';
        data.message_feature_id = '';
        if ($state.current.name == 'myAccount') {
            data.message_type = 'account';
        } else if ($state.current.name == 'mySupport') {
            data.message_type = 'support';
        } else {
            data.message_type = 'inquiry';
        }
        if (type == 'unread') {
            data.readstatus = 'false';
            data.messages_starred = '';
            data.messages_archived = '';
            $scope.activeTab = 'unread';
        } else if (type == 'starred') {
            data.readstatus = '';
            data.messages_starred = 'true';
            data.messages_archived = '';
            $scope.activeTab = 'starred';
        } else if (type == 'archive') {
            data.readstatus = '';
            data.messages_starred = '';
            data.messages_archived = 'true';
            $scope.activeTab = 'archive';
        } else {
            data.message_sent = 'true';
            $scope.activeTab = 'sent';
        }

        $rootScope.readStatus = data.readstatus;
        $rootScope.messages_starred = data.messages_starred;
        $rootScope.messages_archived = data.messages_archived;
        $scope.loading = true;
        request.service('getMessagesByType', 'post', data, function (response) {
            //   debugger;
            console.log(response);
            $scope.loading = false;
            if (response.status == 0) {
                if (type == 'sent') {
                    angular.forEach(response.result, function (val, key) {
                        val.attachmentUrl = response.attachmentUrl;
                        if (val.attachment !== '') {
                            val.imgUrlData = JSON.parse(val.attachment);
                        }
                    });
                }
                angular.forEach(response.result, function (val, key) {
                    val.messages_archived = response.messages_archived;
                });
                if ($state.current.name == 'myAccount') {
                    if (type == 'sent') {
                        $scope.accountSentMsg = response.result;
                        $scope.accounts = '';
                    } else {
                        $scope.accounts = response.result;
                        $scope.accountSentMsg = '';
                    }
                } else if ($state.current.name == 'mySupport') {
                    if (type == 'sent') {
                        $scope.supportSentMsg = response.result;
                        $scope.supports = '';
                    } else {
                        $scope.supports = response.result;
                        $scope.supportSentMsg = '';
                    }
                } else {
                    if (type == 'sent') {
                        $scope.inquirySentMsg = response.result;
                        $scope.inquiries = '';
                    } else {
                        $scope.inquiries = response.result;
                        $scope.inquirySentMsg = '';
                    }
                }
            }
        });
    };

    $scope.improtinquiries = function (ele) {
        if (ele.files && ele.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(ele.files[0]);
            $rootScope.logo = $('#ex_inqu')[0].files[0];

        }
    }

    $scope.customRequestFiles = [];
    $scope.getFileDetails = function (e) {
        $scope.$apply(function () {
            if ($scope.customRequestFiles == null) {
                $scope.customRequestFiles = [];
            }
            for (var i = 0; i < e.files.length; i++) {
                $scope.customRequestFiles.push(e.files[i])
            }
            $(".customized").val("");
            console.log($scope.customRequestFiles)
        });
    };
    $scope.deleteUploadImage = function (file) {
        var index = $scope.customRequestFiles.indexOf(file);
        $scope.customRequestFiles.splice(index, 1);
    };
    $scope.getstarredStatus = function (val, id) {
        console.log("value,data", val, id);
        var options = {};
        options.userId = localStorage.getItem('userId');
        options.message_feature_id = val.message_feature_id;
        options.message_type_id = val.message_type_id;
        options.message_read_status = val.readstatus;
        options.message_m_id = id;
        options.messages_archived = val.messages_archived;
        options.messages_starred = val.messages_starred;
        console.log("$rootScope.messagedata", $scope.messagedata);
        if (window.location.hash == "#/myMessages")
            options.message_type = "inquiry";
        if (window.location.hash == "#/mySupport")
            options.message_type = "support";
        if (window.location.hash == "#/myAccount")
            options.message_type = "account";
        request.service('updateMessageStatus', 'post', options, function (response) {
            console.log("$$$$ response $$$$$", response);
            if (response.status == "0") {
                //                  console.log("message type", response.result)
                if (options.message_type == "#/myMessages")
                    console.log("message type", $scope.inquiries);
                $scope.inquiries = response.result;
                $scope.getMessageRequestData();
                if (options.message_type == "#/mySupport")
                    console.log("message type", $scope.supports);
                $scope.supports = response.result;
                $scope.getMessageRequestData();
                if (options.message_type == "#/myAccount")
                    console.log("message type", $scope.accounts);
                $scope.accounts = response.result;
                $scope.getMessageRequestData();

                console.log(" $scope.inquiries-----------", $scope.inquiries);
                console.log("$scope.supports-------------", $scope.supports);
                console.log("$scope.accounts-------------", $scope.accounts);
            } else {
                alert(response.message);
            }
            console.log(" == getMessagesByType22222 -> response", response);
        });
    }
    $scope.getAchiveStarStatus = function (type, val) {
        console.log(type, val);
        var data = {};
        data.userId = window.localStorage.getItem('userId');
        data.message_m_id = val.message_m_id;
        if (type == 'archive') {
            data.messages_starred = '';
            data.messages_archived = 'true';
        } else if (type == 'unarchive') {
            data.messages_starred = '';
            data.messages_archived = 'false';
        } else if (type == 'starred') {
            data.messages_starred = 'false';
            data.messages_archived = '';
        } else if (type == 'unstarred') {
            data.messages_starred = 'true';
            data.messages_archived = '';
        }
        console.log(data);
        request.service('updateMessageStatus', 'post', data, function (response) {
            console.log(response);
            if (response.status == 0) {
                $scope.getMessageRequestData();
            }
        });
    };

    $scope.submit_inquiries = function (data, val) {
        if (window.location.hash == "#/myMessages")
            $scope.messagedata = JSON.parse(window.localStorage.getItem('inquiries'));
        if (window.location.hash == "#/mySupport")
            $scope.messagedata = JSON.parse(window.localStorage.getItem('supports'));
        if (window.location.hash == "#/myAccount")
            $scope.messagedata = JSON.parse(window.localStorage.getItem('accounts'));

        for (var i in $scope.messagedata.result) {
            if (i == val) {
                if ($scope.messagedata.result[i].message_created_by != "vendor") {
                    $scope.message_to = $scope.messagedata.result[i].message_created_by;
                    $scope.message_to_id = $scope.messagedata.result[i].message_created_by_id;
                } else {
                    $scope.message_to = $scope.messagedata.result[i].message_created_for;
                    $scope.message_to_id = $scope.messagedata.result[i].message_created_for_id;
                }
                $rootScope.message_m_id = $scope.messagedata.result[i].message_m_id
            }
        }
        console.log('data', data);
        var msgData = data.your_message.split("\n").join("<br>");
        $scope.userid = window.localStorage.userId;
        var fd = new FormData();
        if ($state.current.name == 'myMessages') {
            fd.append('inquiry', val);
            fd.append('message_type', 'inquiry');
        } else if ($state.current.name == 'mySupport') {
            fd.append('support', val);
            fd.append('message_type', 'support');
        } else {
            fd.append('account', val);
            fd.append('message_type', 'account');
        }
        angular.forEach($scope.customRequestFiles, function (val, key) {
            if ($state.current.name == 'myMessages') {
                fd.append('inquiry', val);
            } else if ($state.current.name == 'mySupport') {
                fd.append('support', val);
            } else {
                fd.append('account', val);
            }
        });
        fd.append('userId', $scope.userid);
        fd.append('message', msgData);
        fd.append('message_m_id', $scope.reply_m_id);
        fd.append('message_to_id', $scope.message_to_id);
        fd.append('message_to', $scope.message_to);
        var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
        $http.post(serviceURL + "/updateMessage", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
                .success(function (response) {
                    console.info('response', response);
                    $scope.notification(response.message);
                    $scope.customRequestFiles = [];
                    $('#txt_msg').val("");
                    $('#ex_inqu').val("");
                    $('.myinquiries-full-msg').hide();
                    $scope.getMessageRequestData();
                    $scope.customRequestFiles = [];
                })
                .error(function () {
                    console.log("error!!");
                    $('#txt_msg').val("");
                    $('#ex_inqu').val("");
                });
    };

    function validate_request(cb) {
        // if($scope.data.message_feature_id != "undefined"){
        if (!$scope.data.message_feature_id) {
            $scope.err1.filter_messageCategory = true;
        } else {
            delete $scope.err1.filter_messageCategory;
        }

        // }     
        if (!$scope.support.filter_messageType) {
            $scope.err1.filter_messageType = true;
        } else {
            delete $scope.err1.filter_messageType;
        }
        if (!$scope.support.description) {
            $scope.err1.description = true;
        } else {
            delete $scope.err1.description;
        }
        if (!$scope.support.your_message) {
            $scope.err1.your_message = true;
        } else {
            delete $scope.err1.your_message;
        }
        //        if (!$rootScope.logo) {
        //            $scope.err1.your_file = true;
        //        } else {
        //            delete $scope.err1.your_file;
        //        }
        console.log("$scope.err1 :: ", $scope.err1);
        if (Object.keys($scope.err1).length == 0) {
            if (cb)
                cb();
        } else if (Object.keys($scope.err1).length != 0 && $scope.err1.readActive == true || $scope.err1.readActive == undefined ||
                $scope.err1.archivedActive == true || $scope.err1.archivedActive == undefined ||
                $scope.err1.starredActive == true || $scope.err1.starredActive == undefined) {
            if (cb)
                cb();
        }
    }
    $scope.disabledCreateMsg = false;
    $scope.createNewMessage = function () {
        $("#MessageForm1").show('slow');
        $('.msg_cat').val("");
        $('.msg_type').val("");
        $scope.disabledCreateMsg = true;
        $scope.customRequestFiles = [];
        $scope.messageCategories1 = [];
        $scope.support.description = '';
        $scope.support.your_message = '';
        $scope.filterSearch.categoryType = '';
        $scope.filterSearch.messageType = '';
    }


    $scope.cancelRequest = function (ele, index) {
        console.log('hello user');
        if (ele == "send") {
            $scope.disabledCreateMsg = false;
            $("#MessageForm1").hide('slow');
        } else {
            $scope.customRequestFiles = [];
            $('#replyMsgData' + index).slideToggle();
        }


    };
    $scope.submit_request = function () {
        var msgData = $scope.support.your_message.split("\n").join("<br>");
        validate_request(function () {
            var fd = new FormData();
            fd.append('userId', window.localStorage.userId);
            if ($state.current.name == 'myMessages') {
                fd.append('message_type', 'inquiry');
            } else if ($state.current.name == 'mySupport') {
                fd.append('message_type', 'support');
            } else {
                fd.append('message_type', 'account');
            }
            angular.forEach($scope.customRequestFiles, function (val, key) {
                if ($state.current.name == 'myMessages') {
                    fd.append('inquiry', val);
                } else if ($state.current.name == 'mySupport') {
                    fd.append('support', val);
                } else {
                    fd.append('account', val);
                }
            });
            fd.append('message_feature_id', $scope.filterSearch.categoryType.message_feature_id);
            fd.append('message_type_id', $scope.filterSearch.messageType.message_type_id);
            fd.append('message_to_id', 00);
            fd.append('message_to', "admin");
            fd.append('message', msgData);
            fd.append('message_tittle', $scope.support.description);
            fd.append('reference', "event");
            fd.append('reference_id', 0);
            var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
            $http.post(serviceURL + "/createMessage", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                    .success(function (response) {
                        console.info('response', response);
                        $scope.getMessageRequestData();
                        $scope.notification(response.message);
                        $('.msg_cat').val("");
                        $('.msg_type').val("");
                        $('#req_number').val("");
                        $('#txt_msg').val("");
                        $('#ex_inqu').val("");
                        $scope.filterSearch.categoryType = '';
                        $scope.filterSearch.messageType = '';
                        $('#MessageForm1').hide('slow');
                        $scope.customRequestFiles = [];
                        $scope.messageCategories1 = [];
                        $scope.disabledCreateMsg = false;
                    })
                    .error(function () {
                        console.log("error!!");
                    });
        });

    }

    $scope.filter_group = false;
    $scope.filter_TYPE = false;


    /*$scope.showUiSelect8 = function(msg_cat) {
     console.log("hiiiiiii", msg_cat);
     
     if (msg_cat == 'filter_group') {
     $scope.filter_group = true;
     $scope.filter_TYPE = false;
     }
     
     
     }
     
     $scope.showUievent = function(msg_cat) {
     console.log("hiiiiiii", msg_cat);
     
     if (msg_cat == 'filter_TYPE') {
     $scope.filter_TYPE = true;
     $scope.filter_group = false;
     }
     
     
     }*/


    $scope.filterMyType = function (item) {
        /*//console.log("item", item); */
        $scope.filter_group = false;

        if (item != undefined) {
            $scope.evrnttype_show = item.message_feature;
        } else {
            $scope.evrnttype_show = "";
            $scope.messageTypes = [];
        }

        if (item != undefined) {
            $rootScope.message_feature_id = item.message_feature_id;
        }
        $rootScope.message_type_id = '';
        //$scope.getMessagesByType()
        //alert(item);
        if (item == undefined) {
            $scope.inquire = $scope.messageCategories;
        }
    }

    $scope.filterMyEvents = function (item) {
        //alert(item);
        //console.log("item", item);
        $scope.filter_TYPE = false;
        if (item != undefined) {
            $scope.evrnttype_12 = item.message_type;
        } else {
            $scope.evrnttype_12 = '';
            /*$scope.messageTypes = [];*/
        }
        $rootScope.message_feature_id = $rootScope.message_feature_id;
        if (item != undefined) {
            $rootScope.message_type_id = item.message_type_id;
        }
        //$scope.getMessagesByType()
        if (item == undefined) {
            $scope.inquire = $scope.listByType;
        }
    }


    $('html').click(function (e) {
        //console.log(e.target.localName,"e.target:",e.target);
        $scope.event_date = false;
        if (!$(e.target).closest('.doNotClose').length) {
            if ($scope.filter_TYPE == true) {
                $timeout(function () {
                    $scope.filter_TYPE = false;
                }, 100);
            }

            if ($scope.filter_group == true) {
                $timeout(function () {
                    $scope.filter_group = false;
                }, 100);

            }
        }
    });



    $scope.getMessagesByType = function () {
        console.log('submit_request');
        var options = {};
        options.userId = localStorage.getItem('userId');
        options.message_feature_id = $rootScope.message_feature_id;
        options.message_type_id = $rootScope.message_type_id;
        options.readstatus = $rootScope.readStatus;
        options.messages_starred = $rootScope.messages_starred;
        options.messages_archived = $rootScope.messages_archived;
        if (window.location.hash == "#/myMessages")
            options.message_type = "inquiry";
        if (window.location.hash == "#/mySupport")
            options.message_type = "support";
        if (window.location.hash == "#/myAccount")
            options.message_type = "account";

        console.log("options", options);

        request.service('getMessagesByType', 'post', options, function (response) {
            //  debugger;
            console.log("$$$$ response $$$$$", response);
            if (response.status == "0") {
                angular.forEach(response.result, function (val, key) {
                    val.messages_archived = 'false';
                })
                console.log("message type", response.result)
                if (options.message_type == "#/myMessages")
                    console.log("message type", $scope.inquiries);
                $scope.inquiries = response.result;
                if (options.message_type == "#/mySupport")
                    console.log("message type", $scope.supports);
                $scope.supports = response.result;
                if (options.message_type == "#/myAccount")
                    console.log("message type", $scope.accounts);
                $scope.accounts = response.result;

                console.log(" $scope.inquiries", $scope.inquiries);
                console.log("$scope.supports", $scope.supports);
                console.log("$scope.accounts", $scope.accounts);
            }
            console.log(" == getMessagesByType22222 -> response", response);
        });
    }




    $scope.init = function () {
        $scope.getMessageRequestData();
    }
    app.filter('dividedate', function () {
        return function (input, sindex, eindex) {
            console.log("input", input);
            return input.substr(sindex, eindex);
        }
    })

    $scope.toggleIcons = function (e) {
        //console.log("e:",e);
        if ((angular.element("#" + e).css('display')) != 'none') {
            angular.element(".startArchieve").hide();
            angular.element("#" + e).hide();
        } else {
            angular.element(".startArchieve").hide();
            angular.element("#" + e).show();
        }
    }

});
