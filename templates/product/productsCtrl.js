var app = angular.module('arevea');
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress mousedown", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});
app.controller('productsCtrl', function ($scope, $rootScope, request, ctrlComm, $filter, fileUpload, $interval, $http, $location, $state) {
    $scope.verifyVendorStatus();
    console.log("in productsCtrl");
    $scope.loader(true);
    $scope.product = {};
    $scope.tax = {};
    $scope.block1 = [{}];
    $scope.block2 = [{}];
    $scope.block3 = [{}];
    $scope.imgList = [];
    $scope.page = {};
    $scope.err = {};
    $scope.block1[0].cost = $filter('currency')($scope.block1[0].cost, "USD$");
    $scope.multiSelBlocks = [{}];
    $scope.multiSelBlocksedit = [{}];
    $scope.flag = false;
    $scope.checkattrname = false;
    $scope.currentPath = $location.path();
    console.log("$scope.currentPath", $scope.currentPath)

    $scope.incrementBlock1 = function () {
        //$scope.block1.push({ 'location_id': '','tax_class_id':'' })
        $scope.block1.push({})
    }

    $scope.searchFilterByProduct = function (searchProd, e, ele) {
        console.log("searchProd", searchProd)
    }
    $scope.block11 = [];
    $scope.decrementBlock1 = function (index, block1) {
        console.log(block1);
        $scope.block11.push(block1);
        $scope.block1.splice(index, 1)

    }

    $scope.data112 = [];
    $scope.incrementBlock2 = function (select, key) {
        $scope.multiSelBlocks.push({})
    }
    $scope.closeFilter = function () {
        if (!$scope.shoProd) {
            $scope.showProd = true;
            $(".evtProd1").removeClass("open");
        }
    }

    $(document).ready(function () {
        $(".dropdown-toggle").dropdown();
        $('.dropdown-toggle').on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('.dropInput').focus();
            $(".dropdown-toggle>span").removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
        });
    });

    $('body').on("click", function () {
        $(".dropdown-toggle>span").removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
        if ($(".evtProd1").hasClass("open")) {
            if ($scope.searchProd != null && $scope.searchProd != "") {
                $scope.showProd = true;
                //$scope.filterMyBookings();
                $scope.$apply();
            }
        }
    });
    $scope.multiSelBlocks_mul = [];
    $scope.decrementBlock2 = function (index, multiSelBlocks) {
        console.log("%multiSelBlocks%", index, multiSelBlocks)
        console.log("%multiSelBlocks%", $scope.sinvalue112)
        console.log("decrementBlock2==========", multiSelBlocks.attr_id)

        $scope.multiSelBlocks_mul.push(multiSelBlocks);
        /*if (multiSelBlocks.attr_id) {
         if (multiSelBlocks.attr_mode = 'multiple' && multiSelBlocks.attr_id.length != undefined) {
         for (var i = 0; i < multiSelBlocks.attr_id.length; i++) {
         request.service('deleteProductAttributeByID', 'post', {
         'id': multiSelBlocks.attr_id[i],
         'product_id': $scope.product.product_id
         }, function(response) {
         console.log(response)
         if (response.status == 0) {
         $scope.multiSelBlocks.splice(index, 1)
         }
         })
         }
         } else {
         request.service('deleteProductAttributeByID', 'post', {
         'id': multiSelBlocks.attr_id,
         'product_id': $scope.product.product_id
         }, function(response) {
         console.log(response)
         if (response.status == 0) {
         $scope.multiSelBlocks.splice(index, 1)
         }
         })
         }
         } else {*/
        console.log("in else")
        $scope.multiSelBlocks.splice(index, 1);
        /* }*/
    }

    $scope.incrementBlock3 = function () {
        //$scope.block1.push({ 'location_id': '','tax_class_id':'' })
        $scope.block3.push({});
    }

    $scope.block31 = [];
    $scope.decrementBlock3 = function (index, block3) {
        console.log(block3);
        $scope.block31.push(block3);
        $scope.block3.splice(index, 1);
    }

    request.service('vendorGetLocations', 'post', {
        'vendor_id': $scope.admin.vendorid
    }, function (response) {
        console.log(response)
        $scope.locationsList = response;
    })
    request.service('vendorCategories', 'post', {
        'vendor_id': $scope.admin.vendorid
    }, function (response) {
        $scope.loader(false);
        $scope.categoriesList = response;
    })

    /*$(document).on('keydown',function(e){
     var $target = $(e.target||e.srcElement);
     if(e.keyCode == 8 && !$target.is('input,[contenteditable="true"],textarea'))
     {
     e.preventDefault();
     }
     })*/
    console.log("out", $scope.product.long_description)
    $(document).on('keydown', function (e) {
        if (e.which === 8) { // you can add others here inside brackets.
            //e.preventDefault();
            console.log("a", $scope.product.long_description)
            if ($("#textAngular").hasClass("focussed") && $scope.product.long_description == "") {
                e.preventDefault();
            }

        }
    });
    $scope.numchanged = function (entryLimit) {
        ctrlComm.put('entryLimit', entryLimit);
    };
    request.service('productStatus', 'get', {}, function (response) {

        $scope.productStatusList = response;
        console.log("productStatusList........................", response)
        var pageNo = ctrlComm.get('currentPage');
        console.log("page no.......", pageNo)
        $scope.currentPage = pageNo ? pageNo : 1;
        var value = ctrlComm.get('entryLimit');
        $scope.entryLimit = 10;
        $scope.maxSize = 4;
        $scope.maxSize = 10;
    })

    request.service('taxsList', 'get', {}, function (response) {

        $scope.taxsList = response;
        console.log("taxid", response)
    })
    request.service('measuresList', 'get', {}, function (response) {
        $scope.measuresList = response;
        console.log("measuresList", response)
    })
    request.service('currencyList', 'get', {}, function (response) {
        $scope.currencyList = response;
        console.log("currencyList", response)
    })

    function getTaxList() {
        request.service('taxsList', 'get', {}, function (response) {

            $scope.taxsList = response;
            console.log("taxid", response)
        })
    }

    if ($location.path() == '/product_service_catalog/Products') {

    } else if ($location.path() == "/product_service_catalog/addProduct") {

        $scope.page.type = 'post'
        $scope.product.status_id = '5';
    } else if ($location.path() == "/product_service_catalog/updateProduct") {

        $scope.page.type = 'put';
        prePoppulateValues(ctrlComm.get('userObj'));
    }
    var editProductCatalog = function (obj) {
        ctrlComm.put('userObj', obj);
        $location.path("/product_service_catalog/updateProduct");
    }

    function prePoppulateValues(obj) {
        if (obj) {
            console.log("*******************", obj)
            var attrArray1 = [];
            var attrArray2 = []
            var aa;
            var arr = [];
            var ddd = [];
            var oid = "";
            var ovalue = "";
            var hide = 0;
            var params = {};
            params.product_id = obj.id;
            $scope.pro_id = obj.id;
            request.service('getProduct', 'post', params, function (response) {
                console.log("^^^^^^^^^^^^^^^", response);
                $scope.product = response;

                if ($scope.product.short_description != undefined && $scope.product.short_description != null) {
                    if ($scope.product.short_description !== undefined) {
                        var sdArr = $scope.product.short_description.split('<br>');
                        $scope.product.short_description = sdArr.join("\n");
                    }
                }



                // $scope.attributesList=response.attributes;
                $scope.ccategory_id = response.category_id;
                getAttributes(response.category_id);
                $scope.block1 = response.locations;
                angular.forEach($scope.block1, function (obj) {
                    /*  obj.id = obj.location_id.toString();
                     obj.id = obj.tax_class_id.toString();*/
                })
                $scope.imgList = response.images;
                $scope.videoList = (response.videos == null) ? [{'name': ''}] : response.videos;
                console.log("response.attributes", response.attributes)

                console.log("length" + response.attributes.length)
                var tagexist = 0;
                var tagvalueexist = 0;
                for (var k = 0; k < response.attributes.length; k++) {
                    console.log("vvvvvvvv", response.attributes[k].attribute_value)
                    console.log("qqqqqqqq", response.attributes[k].id)
                    if (response.category_id == 1) {
                        if (response.attributes[k].attribute_name == 'Tags' && tagexist == 0) {
                            tagexist = 1;
                            $scope.cattribute_name = response.attributes[k].attribute_name == 'Tags' ? response.attributes[k].attribute_name : undefined;
                            if (response.attributes[k].attribute_value == 'Catering') {
                                tagvalueexist = 1;
                                $scope.cattribute_value = response.attributes[k].attribute_value == 'Catering' ? response.attributes[k].attribute_value : undefined;
                            }
                        }
                    }
                    if (response.category_id == 2) {

                        if (response.attributes[k].attribute_name == 'Tags' && tagexist == 0) {
                            tagexist = 1;
                            $scope.cattribute_name = response.attributes[k].attribute_name == 'Tags' ? response.attributes[k].attribute_name : undefined;
                            if (response.attributes[k].attribute_value == 'Venue') {
                                tagvalueexist = 1;
                                $scope.cattribute_value = response.attributes[k].attribute_value == 'Venue' ? response.attributes[k].attribute_value : undefined;
                            }
                        }

                    }

                    console.log("response.attributes[k].other_value", response.attributes[k].other_value)
                    if (response.attributes[k].other_value != '') {
                        $scope.multiSelBlocks.hiddenIndicator = 1;
                    } else {
                        $scope.multiSelBlocks.hiddenIndicator = 0;
                    }
                    //var hide=$scope.multiSelBlocks.hiddenIndicator;
                    if (response.attributes[k].attribute_mode == 'multiple') {
                        /* var aa = response.attributes[k].id;
                         var bb = response.attributes[k].value;
                         var cc = response.attributes[k].other_value;
                         arr.push(bb);*/
                        console.log("response.attributes[k].value---" + response.attributes[k].value);
                        var aa = response.attributes[k].id;
                        var bb = response.attributes[k].value;
                        var cc = response.attributes[k].other_value;
                        var dd = response.attributes[k].attr_id;
                        console.log("dd", dd)
                        if (response.attributes[k].other_value != null && response.attributes[k].other_value != '') {
                            ovalue = response.attributes[k].other_value;
                            oid = response.attributes[k].value;
                            hide = 1;
                        }


                        ddd.push(dd);
                        arr.push(bb);
                        console.log("arrarr---" + arr);
                        console.log("kkkk---" + k);
                        if (response.attributes.length >= 1) {
                            if (k == response.attributes.length - 1) {
                                var c = {"id": aa, "mulvalue": arr, "attr_mode": response.attributes[k].attribute_mode, "text": ovalue, "attri_value": oid, "attr_id": ddd, "hide": hide};
                                console.log("cccccccc", c)
                                var e = {"eid": aa, "emulvalue": arr, "eattr_mode": response.attributes[k].attribute_mode, "etext": ovalue, "eattri_value": oid, "eattr_id": ddd, "ehide": hide};
                                attrArray1.push(c)
                                attrArray2.push(e)
                                arr = [];
                                ddd = [];
                                ovalue = "";
                                oid = "";
                                hide = 0;
                                console.log("attrArray1---", attrArray1);
                            } else
                            if (response.attributes[k].id != response.attributes[k + 1].id) {
                                var c = {"id": aa, "mulvalue": arr, "attr_mode": response.attributes[k].attribute_mode, "text": ovalue, "attri_value": oid, "attr_id": ddd, "hide": hide};
                                console.log("cccccccc+1", c)
                                var e = {"eid": aa, "emulvalue": arr, "eattr_mode": response.attributes[k].attribute_mode, "etext": ovalue, "eattri_value": oid, "eattr_id": ddd, "ehide": hide};
                                attrArray1.push(c)
                                attrArray2.push(e)
                                console.log("attrArray1---", attrArray1);
                                arr = [];
                                ddd = [];
                                ovalue = "";
                                oid = "";
                                hide = 0;
                                //attrArray1=[];
                            }


                        } else if (k == response.attributes.length - 1) {
                            var c = {"id": aa, "mulvalue": arr, "attr_mode": response.attributes[k].attribute_mode, "text": ovalue, "attri_value": oid, "attr_id": ddd, "hide": hide};
                            console.log("cccccccc-1", c)
                            var e = {"eid": aa, "emulvalue": arr, "eattr_mode": response.attributes[k].attribute_mode, "etext": ovalue, "eattri_value": oid, "eattr_id": ddd, "ehide": hide};
                            attrArray1.push(c)
                            attrArray12.push(e)
                            arr = [];
                            ddd = [];
                            ovalue = "";
                            oid = "";
                            hide = 0;
                            console.log("attrArray1---", attrArray1);
                        }
                    } else {
                        if (response.attributes[k].other_value != null && response.attributes[k].other_value != '') {

                            hide = 1;
                        }


                        if (response.attributes[k].other_value != null && response.attributes[k].other_value != '') {
                            ovalue = response.attributes[k].other_value;
                            oid = response.attributes[k].value;
                            hide = 1;
                        }
                        var d = {"id": response.attributes[k].id, "attr_mode": response.attributes[k].attribute_mode, "sinvalue": response.attributes[k].value, "text": ovalue, "attri_value": oid, "attr_id": response.attributes[k].attr_id, "hide": hide}
                        var e = {"eid": response.attributes[k].id, "eattr_mode": response.attributes[k].attribute_mode, "esinvalue": response.attributes[k].value, "etext": ovalue, "eattri_value": oid, "eattr_id": response.attributes[k].attr_id, "ehide": hide}
                        hide = 0;
                        ovalue = "";
                        oid = "";
                        attrArray1.push(d)
                        attrArray2.push(e)
                    }

                }


                console.log("pushed values are", attrArray1)



                $scope.multiSelBlocks = attrArray1;
                $scope.multiSelBlocksedit = attrArray2
                var i = 0;
                angular.forEach($scope.multiSelBlocks, function (obj) {
                    i = i + 1;
                    getAttributeValue(obj, obj.id, $scope.product.category_id, i);
                })

            })

        } else {
            $location.path('/product_service_catalog/Products')
        }
    }

    function getAttributes(category_id) {

        console.log("");
        var params = {};
        params.category_id = category_id;
        console.log("params", params)
        request.service('attributesByCategory', 'post', params, function (response) {
            $scope.attributesList = response;
            console.log($scope.attributesList)
        })

    }
    ;
    function getAttributeValue(selectt, attribute_id, category_id, i) {
        var params = {};
        params.attribute_id = attribute_id;
        params.category_id = category_id;
        request.service('attrValuesByAttribute', 'post', params, function (response) {
            selectt.attributesValuesList = response;
        });
    }
    //added post


    $scope.generateboxpost = function (er, selectt, key) {
        console.log("in generatebox ppost");
        console.log("sessss", selectt)
        /*
         $scope.sinvalue112.push(sinvalue);
         
         console.log("$scope.sinvalue112", $scope.sinvalue112)*/

        console.log("calling post ng-change", selectt.attributesValuesList)
        var select_ids = [];
        /* if (selectt.attributesValuesList[key].attribute_value == 'All') {
         
         $scope.all=true
         console.log("true")
         //code for all
         //  $.each($("#myselect option:selected"), function(){ 
         for(i in selectt.attributesValuesList)
         {
         
         select_ids.push(selectt.attributesValuesList[i].attribute_value);
         $('select#myselect > option').prop('selected', 'selected');
         
         }
         
         
         //    });
         
         
         
         console.log("select_ids",select_ids)
         //   $('select#myselect > option').prop('selected', 'selected');
         //   $('select#myselect').val(select_ids);
         //  select_ids.selected = true;
         }*/







        for (var i = 0; i < selectt.attributesValuesList.length; i++) {

            if (selectt.attributesValuesList[i].id == er) {
                console.log("value", selectt.attributesValuesList[i].attribute_value)
                console.log("value", selectt.attributesValuesList[i].attribute_id)

                $scope.cattribute_value = selectt.attributesValuesList[i].attribute_value;
                //code for all
                if (selectt.attributesValuesList[i].attribute_value == 'All') {
                    // $('select#myselect > option').prop('selected', 'selected');
                    for (i in selectt.attributesValuesList)
                    {
                        // $('select#myselect').val(select_ids);
                        if (selectt.attributesValuesList[i].attribute_value == 'Other')
                        {
                            selectt.attri_value = selectt.attributesValuesList[i].id;
                            selectt.hide = 1;
                        } else
                        {
                            selectt.hide = 0;
                        }
                        select_ids.push(selectt.attributesValuesList[i].id);
                    }
                    console.log("select_ids", select_ids)
                    selectt.mulvalue = select_ids ? select_ids : selectt.mulvalue;
                }





                if (selectt.attributesValuesList[i].attribute_value == 'Other') {
                    selectt.attri_value = selectt.attributesValuesList[i].id;
                    selectt.hide = 1;
                    // $('#color').show();
                    console.log("aaaaaa", selectt.attri_value)
                } else {
                    selectt.hide = 0;
                    console.log(" not showing")
                }

            }
        }


    }




    //  var delarray = [];
    $scope.delarray = [];
    $scope.delarray1 = [];
    $scope.generatebox = function (er, selectt, key) {
        console.log("in generateboxput")
        console.log("sessss", selectt)
        if (selectt.attr_id != '') {

            delarray = selectt.attr_id
            /* if (delarray != null) {
             console.log("delarrayyyy length", delarray.length)
             if (delarray.length > 1) {
             delarray = selectt.attr_id
             } else {
             delarray = [];
             console.log("in elsee", selectt.attr_id)
             delarray.push(selectt.attr_id)
             }
             }*/

            if ($scope.delarray != null && selectt.attr_id != undefined) {
                console.log("delarrayyyy ", $scope.delarray)
                console.log("selectt.attr_id", selectt.attr_id)
                if (selectt.attr_mode == "multiple")
                {
                    var newArray = (selectt.attr_id).concat($scope.delarray);
                    $scope.delarray = newArray;
                } else {
                    $scope.delarray.push(selectt.attr_id);
                }
                $scope.delarray1 = $scope.delarray
            }



            console.log("delarray", $scope.delarray1)

            selectt.attr_id = '';
            $scope.attr_id = selectt.attr_id
        }
        var select_ids = [];
        for (var i = 0; i < selectt.attributesValuesList.length; i++) {


            if (selectt.attributesValuesList[i].id == er) {
                console.log("value", selectt.attributesValuesList[i].attribute_value)
                $scope.cattribute_value = selectt.attributesValuesList[i].attribute_value;
                //code for all
                if (selectt.attributesValuesList[i].attribute_value == 'All') {
                    // $('select#myselect > option').prop('selected', 'selected');
                    for (i in selectt.attributesValuesList)
                    {
                        // $('select#myselect').val(select_ids);
                        if (selectt.attributesValuesList[i].attribute_value == 'Other')
                        {
                            selectt.attri_value = selectt.attributesValuesList[i].id;
                            selectt.hide = 1;
                        } else
                        {
                            selectt.hide = 0;
                        }
                        select_ids.push(selectt.attributesValuesList[i].id);
                    }
                    console.log("select_ids", select_ids)
                    selectt.mulvalue = select_ids ? select_ids : selectt.mulvalue;
                }
                //code for other
                if (selectt.attributesValuesList[i].attribute_value == 'Other') {
                    selectt.attri_value = selectt.attributesValuesList[i].id;
                    // $('#color').show();
                    selectt.hide = 1;
                    console.log("aaaaaaput", selectt.attri_value)
                } else {
                    selectt.hide = 0;
                    selectt.text = "";
                    console.log(" not showing")

                }
            }
        }
    }

    $scope.getAttributes = function (category_id) {

        console.log("category_id", category_id)
        $scope.ccategory_id = category_id;
        console.log("category_id", $scope.categoriesList)
        $scope.multiSelBlocks = [{}];
        var params = {};
        params.category_id = category_id;
        request.service('attributesByCategory', 'post', params, function (response) {
            $scope.attributesList = response;
        })
    }

    //addproduct
    $scope.warningmessage = false;
    $scope.isResponse = false;
    $scope.addProduct = function (product, block1, multiSelBlocks, q) {
        console.log("in add product")
        //$scope.multiSelBlocks_mul



        validateProductCatalog(function () {
            console.log("after validations");

            /* Short Desicription converting \n to <br>*/
            if (product.short_description !== undefined) {
                var sdArr = product.short_description.split('\n');
                product.short_description = sdArr.join("<br>");
            }

            if ($scope.ccategory_id == 2 && $scope.cattribute_name == 'Tags' && $scope.cattribute_value == 'Venue') {
                $scope.catattrvalue = '%Catering%';
                $scope.catid = 1;
            }
            if ($scope.ccategory_id == 1 && $scope.cattribute_name == 'Tags' && $scope.cattribute_value == 'Catering') {
                $scope.catattrvalue = '%Venue%';
                $scope.catid = 2;
            }
            var s = [];
            for (var i = 0; i < block1.length; i++) {
                console.log("b", block1[i].location_id)
                s.push(block1[i].location_id)
            }
            //start of tag validation
            if ($scope.catid != undefined) {
                request.service('checkTagsProductExists', 'post', {
                    'vendor_id': $scope.admin.vendorid,
                    'category_id': $scope.catid,
                    'attribute_name': $scope.cattribute_name,
                    'attribute_value': $scope.catattrvalue,
                }, function (response) {
                    console.log("response1", response)
                    if (response.status == 0) {

                        for (var i = 0; i < response.tagsList.length; i++) {

                            for (var j = 0; j < s.length; j++) {
                                //checking same location & status
                                if (response.tagsList[i].location_id == s[j] && $scope.product.status_id == 7) {
                                    console.log("a", response.tagsList[i].location_id, "b", s[j])
                                    for (var k = 0; k < $scope.block1.length; k++) {
                                        console.log("cost", $scope.block1[k].cost)
                                        if ($scope.block1[k].cost > 0 && response.tagsList[i].cost > 0) {
                                            $scope.flag = true;
                                            /*   console.log("cost in", $scope.block1[i].cost)
                                             $scope.notification("please select another attribute name")*/
                                        }
                                    }
                                }
                            }
                        }
                        if ($scope.flag == true) {
                            console.log("q value is", q)
                            console.log("$scope.ccategory_id", $scope.ccategory_id)
                            if ($scope.ccategory_id == 2) {

                                if (q == 0) {
                                    $scope.notification("Product updated successfully.Please check if Venue price should be changed to zero");
                                    $scope.warningmessage = true;
                                } else
                                {
                                    $scope.notification("Product added successfully.Please check if Venue price should be changed to zero");
                                    $scope.warningmessage = true;
                                }
                            } else if ($scope.ccategory_id == 1) {
                                if (q == 0) {
                                    $scope.notification("Product updated successfully.Please check if Venue price to be changed to zero or not");
                                    $scope.warningmessage = true;
                                } else {
                                    $scope.notification("Product added successfully.Please check if Venue price to be changed to zero or not");
                                    $scope.warningmessage = true;
                                }
                            }
                        } else {
                            console.log("else case")
                        }

                    }
                    addorEdit(product, block1, multiSelBlocks, q);
                });
            } else {
                addorEdit(product, block1, multiSelBlocks, q);
            }

        })
    }
    function addorEdit(product, block1, multiSelBlocks, q) {
        product.tax = block1;
        console.log("multiSelBlocks", multiSelBlocks)


        var attrArray = [];
        var count;
        for (var j = 0; j < multiSelBlocks.length; j++) {
            console.log("length", multiSelBlocks[j].mulvalue)
            if (multiSelBlocks[j].mulvalue != undefined && multiSelBlocks[j].mulvalue.length > 0) {
                for (var i = 0; i < multiSelBlocks[j].mulvalue.length; i++) {
                    console.log("a" + multiSelBlocks[j].attri_value)
                    console.log("b" + multiSelBlocks[j].mulvalue[i])
                    //console.log("c"+ typeof(multiSelBlocks[j].attr_id[i]) )
                    var attr_id = "";
                    if (multiSelBlocks[j].attr_id != undefined) {
                        attr_id = multiSelBlocks[j].attr_id[i];
                    }
                    if (multiSelBlocks[j].attri_value == multiSelBlocks[j].mulvalue[i]) {

                        var a = {"id": multiSelBlocks[j].id, "value": multiSelBlocks[j].mulvalue[i], "other_value": multiSelBlocks[j].text, "attr_id": attr_id};
                        console.log("id at which text value is there", a);
                        attrArray.push(a);
                    } else {
                        var b = {"id": multiSelBlocks[j].id, "value": multiSelBlocks[j].mulvalue[i], "other_value": "", "attr_id": attr_id};
                        console.log("bbb", b);
                        attrArray.push(b);
                    }
                }
            } else if (multiSelBlocks[j].attr_mode == "single") {
                console.log("multiSelBlocks[j].attr_id", multiSelBlocks[j].attr_id)

                if (multiSelBlocks[j].attr_id != undefined) {
                    attr_id = multiSelBlocks[j].attr_id;
                }

                console.log("after", attr_id)
                var c = {"id": multiSelBlocks[j].id, "value": multiSelBlocks[j].sinvalue, "other_value": multiSelBlocks[j].text, "attr_id": attr_id};
                console.log("cccc", c)
                attrArray.push(c);
            }


        }

        console.log("attrArray", attrArray);
        console.log("deleted array", $scope.delarray1)

        product.deletedarray = $scope.delarray1;
        product.product_attr = attrArray;
        product.vendor_id = $scope.admin.vendorid
        product.user_id = $scope.admin.userId;
        var media = {};
        media.image = [];
        media.video = [];
        console.log($scope.imgList)
        var fd = new FormData();
        angular.forEach($scope.imgList, function (obj) {
            var temp = {};
            temp.name = obj.name;
            temp.id = obj.id;
            media.image.push(temp)
            fd.append('photo', obj);
        })
        angular.forEach($scope.videoList, function (obj) {
            media.video.push(obj)
        })
        console.log(media)
        product.media = media;
        console.log(angular.toJson(product))

        fd.append('jsondata', JSON.stringify(product))
        console.log(angular.toJson(product));
        var serviceURL = "//" + request.setup.servicehost + request.setup.port_seperator + request.setup.port + "/" + request.setup.prefix;
        var url = "/addProductCatalog";
        if (q == 0) {

            url = "/editProduct";
        }

        $scope.isResponse = true;
        $http.post(serviceURL + url, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (response) {
            console.log("response2", response)
            if ($scope.warningmessage == false) {
                console.log("q value is", q)
                console.log("$scope.warningmessage is false");
                $scope.isResponse = false;
                $scope.notification(response.message);
                $location.path('/product_service_catalog/Products');
            } else if ($scope.warningmessage == true) {
                console.log("in else q value is", q);
                $scope.isResponse = false;
                $location.path('/product_service_catalog/Products');
            }

        }).error(function (response) {
            $scope.isResponse = false;
            $scope.notification(response.message);
        });
    }
    var getProductList = function () {
        $scope.loader(true);
        request.service('productsList', 'post', {
            'vendor_id': $scope.admin.vendorid
        }, function (response) {
            $scope.loader(false);
            $scope.productsList = response;
            console.log("productlist", response)
        })
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
                getProductList(function () {
                    $scope.notification("Product deleted successfully");
                    $state.go('product_service_catalog.Products');
                });
            }
        })
    }
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

    /*$scope.status=undefined;
     console.log("aaaa",window.location.hash.split('?')[1])
     if (window.location.hash.split('?')[1]) {
     var params = window.location.hash.split('?')[1].split('=');
     console.log("same",params)
     console.log("same1",params[0])
     var request1 = {};
     request1[params[0]] = params[1];
     console.log("same2",request1[params[0]] );
     
     $scope.status= request1[params[0]] ;
     }*/
    // $scope.abc = "hello";
    $scope.removeStatus = function () {
        console.log("all");
        $rootScope.status = undefined
        $location.path('/product_service_catalog/Products')

    }

    /* if($rootScope.status)
     {
     $scope.status=$rootScope.status
     }
     else
     {
     $scope.status=undefined
     }
     */

    request.service('productsList', 'post', {
        'vendor_id': $scope.admin.vendorid
    }, function (response) {

        $scope.productsList = response;
        console.log("productlist", response)
    })

    $scope.getFileDetails = function (e) {
        console.log("eeee" + e);
        $scope.$apply(function () {
            if ($scope.imgList == null) {
                $scope.imgList = [];
            }
            console.log("$('#image')[0].files" + $('#image')[0].files);
            for (var i = 0; i < $('#image')[0].files.length; i++) {
                console.log("$('#image')[0].files" + $('#image')[0].files[i]);
                $scope.imgList.push($('#image')[0].files[i])
            }
            $('#image').val("");
            //$scope.imgList.push($('#image')[0].files[0])
        })
    }

    $scope.goToList = function () {
        $location.path('/product_service_catalog/Products');
    }
    $scope.editProduct = function (product, block1, multiSelBlocks) {
        $scope.addProduct(product, block1, multiSelBlocks, 0);
        $location.path("/product_service_catalog/updateProduct");
    }



    $scope.removeImage = function (index, img) {
        console.log(img);
        if (img.id) {
            request.service('deleteFromProductMediaById', 'post', {
                'id': img.id,
                'product_id': $scope.product.product_id
            }, function (response) {
                console.log(response)
                if (response.status == 0) {
                    $scope.imgList.splice(index, 1)
                }
            })
        } else {
            $scope.imgList.splice(index, 1)
        }
    }

    $scope.removeVideo = function (index, video) {
        console.log(video);
        if (video.id) {
            request.service('deleteFromProductMediaById', 'post', {
                'id': video.id,
                'product_id': $scope.product.product_id
            }, function (response) {
                console.log(response)
                if (response.status == 0) {
                    $scope.videoList.splice(index, 1)
                }
            })
        } else {
            $scope.videoList.splice(index, 1)
        }
    }

    $scope.getAttributeValueput = function (select, attribute_id, category_id, key) {
        console.log("in put method")
        console.log("attribute_id", select)
        console.log("category_id", category_id)
        console.log("in edit+++++++", attribute_id, $scope.data112)


        //test for same attribute value

        for (var i = 0; i < $scope.multiSelBlocks.length; i++) {

            $scope.checkattrname = false;
            var exist = 0
            if (attribute_id == $scope.multiSelBlocks[i].id) {
                if (i == key)
                {
                    exist = exist + 1;
                }
                if (exist == 0)
                {
                    console.log("a", attribute_id)
                    console.log("b", $scope.multiSelBlocks[i].id)
                    $scope.checkattrname = true;
                    break;
                }

            }

        }

        console.log("value", $scope.checkattrname)



        if (select.mulvalue) {
            select.mulvalue = "";
        }
        if (select.sinvalue) {
            select.sinvalue = "";
        }

        select.text = "";
        console.log("$scope.multiSelBlocksedit success", $scope.multiSelBlocksedit[key])

        if ($scope.multiSelBlocksedit[key] != undefined) {

            if ($scope.multiSelBlocksedit[key].eid == attribute_id) {
                console.log("now to show values", $scope.multiSelBlocksedit[key].emulvalue)
                select.mulvalue = $scope.multiSelBlocksedit[key].emulvalue;
                select.text = $scope.multiSelBlocksedit[key].etext;
                select.sinvalue = $scope.multiSelBlocksedit[key].esinvalue;
                select.hide = $scope.multiSelBlocksedit[key].ehide;
            } else {
                select.hide = 0;
            }
        }

        //console.log("address",address)
        // console.log("attribute_mode",attribute_mode)

        // console.log("comparing id in edit file is",$scope.comparing_id)
        var attribute_mode;
        for (var i in $scope.attributesList) {
            if (attribute_id == $scope.attributesList[i].id) {
                attribute_mode = $scope.attributesList[i].attribute_mode;
                $scope.cattribute_name = $scope.attributesList[i].attribute_name == 'Tags' ? $scope.attributesList[i].attribute_name : undefined;
            }
        }

        var params = {};
        params.attribute_id = attribute_id;
        params.category_id = category_id;
        console.log("parammms", params)
        if ($scope.checkattrname == false) {
            request.service('attrValuesByAttribute', 'post', params, function (response) {


                //$scope.attributesValuesList[key+1] = response;
                select.attributesValuesList = response;
                var attrrrr_value;
                $scope.multiSelBlocks[key].attr_mode = attribute_mode;
                $scope.multiSelBlocks[key].attr_value = "";
                if (attribute_mode == 'single') {
                    $scope.multiSelBlocks[key].indicator = 0;
                } else {
                    $scope.multiSelBlocks[key].indicator = 1;
                }

                //  }

            })
        } else {
            $(".select_attr_" + key).val("");
            $scope.notification("This attribute is already selected,Please select another attribute");
            $scope.multiSelBlocks[key].id = undefined;
            select.attributesValuesList = [];
            //  getAttributeValue(select, attribute_id, $scope.product.category_id, key);
        }
    }
    $scope.attributesValuesList = {}
    $scope.getAttributeValue = function (select, attribute_id, category_id, key) {
        //test for same attribute value
//        debugger;
        for (var i = 0; i < $scope.multiSelBlocks.length; i++) {
            $scope.checkattrname = false;
            var exist = 0;
            if (attribute_id == $scope.multiSelBlocks[i].id) {
                /* if(i<$scope.multiSelBlocks.length)
                 {
                 $scope.multiSelBlocks.splice(index, 1)
                 
                 }*/
                if (i == key) {
                    exist = exist + 1;
                }

                if (exist == 0) {
                    $scope.multiSelBlocks[key].attribute_id = "";
                    console.log("a", attribute_id)
                    console.log("b", $scope.multiSelBlocks[i].id)
                    $scope.checkattrname = true;
                    break;
                }
            }
        }

        select.text = "";
        var attribute_mode;
        for (var i in $scope.attributesList) {
            if (attribute_id == $scope.attributesList[i].id) {
                attribute_mode = $scope.attributesList[i].attribute_mode;
                $scope.cattribute_name = $scope.attributesList[i].attribute_name == 'Tags' ? $scope.attributesList[i].attribute_name : undefined;
            }
        }

        var params = {};
        params.attribute_id = attribute_id;
        params.category_id = category_id;
        if ($scope.checkattrname == false) {
            request.service('attrValuesByAttribute', 'post', params, function (response) {
                select.attributesValuesList = response;
                var attrrrr_value;
                $scope.multiSelBlocks[key].attr_mode = attribute_mode;
                $scope.multiSelBlocks[key].attr_value = "";
                if (attribute_mode == 'single') {
                    $scope.multiSelBlocks[key].indicator = 0;
                } else {
                    $scope.multiSelBlocks[key].indicator = 1;
                }
            });
        } else {
            $(".select_attr_" + key).val("");
            $scope.notification("This attribute is already selected,Please select another attribute ");
            console.log("multiSelBlocks.id........", $scope.multiSelBlocks[key].id)
            $scope.multiSelBlocks[key].id = undefined;
            select.attributesValuesList = [];
            //  getAttributeValue(select, attribute_id, $scope.product.category_id, key);
        }
    }
    $scope.videoList = [{'name': ''}];
    $scope.addVideo = function () {
        if ($scope.videoList == null) {
            $scope.videoList = [];
        }
        $scope.videoList.push({
            'name': ''
        })
    }
    var pag_index;
    $scope.pageChanged = function (currentPage) {
        ctrlComm.put('currentPage', currentPage);
        // console.log('Page changed to: ' ,currentPage);
    };
    var validateProductCatalog = function (cb) {

        if ($scope.multiSelBlocks_mul.length != 0) {
            angular.forEach($scope.multiSelBlocks_mul, function (obj) {
                console.log(obj)
                if (obj.attr_mode == 'multiple') {
                    angular.forEach(obj.attr_id, function (obj1) {
                        request.service('deleteProductAttributeByID', 'post', {'id': obj1, 'product_id': $scope.product.product_id}, function (response) {
                            if (response.status == 0) {
                                console.log(response)
                            }
                        })
                    })
                }
                if (obj.attr_mode == 'single') {
                    request.service('deleteProductAttributeByID', 'post', {'id': obj.attr_id, 'product_id': $scope.product.product_id}, function (response) {
                        if (response.status == 0) {
                            console.log(response)
                        }
                    })
                }
            })



        }


        if ($scope.block11.length != 0) {

            angular.forEach($scope.block11, function (obj2) {
                request.service('deleteFromProductLocationsById', 'post', {
                    'id': obj2.id
                }, function (response) {
                    console.log(response)
                    if (response.status == 0) {
                        //$scope.block1.splice(index, 1)
                    }
                })

            })


        }
        /*$scope.block11 =[]; if (block1.id) {
         
         request.service('deleteFromProductLocationsById', 'post', {
         'id': block1.id
         }, function(response) {
         console.log(response)
         if (response.status == 0) {
         $scope.block1.splice(index, 1)
         }
         })
         
         } else {
         $scope.block1.splice(index, 1)
         }*/











        if (!$scope.product.category_id) {
            $scope.err.category_id = true;
        } else {
            delete $scope.err.category_id;
        }
        if (!$scope.product.product_name) {
            $scope.err.product_name = true;
        } else {
            delete $scope.err.product_name;
        }
        if (!$scope.product.status_id) {
            $scope.err.status_id = true;
        } else {
            delete $scope.err.status_id;
        }
        if (!$scope.product.short_description) {
            $scope.err.short_description = true;
        } else {
            delete $scope.err.short_description;
        }
        if (!$scope.product.long_description) {
            $scope.err.long_description = true;
        } else {
            delete $scope.err.long_description;
        }
//validation for block1
        var a = 0;
        b = 0;
        c = 0;
        d = 0;
        e = 0;
        for (var i = 0; i < $scope.block1.length; i++) {


            if (!$scope.block1[i].location_id) {
                a = a + 1;
                $scope.block1[i].location_idv = true;
            } else {
                $scope.block1[i].location_idv = false;
            }
            if (!$scope.block1[i].tax_class_id) {
                b = b + 1;
                $scope.block1[i].tax_class_idv = true;
            } else {
                $scope.block1[i].tax_class_idv = false;
            }

            if (!$scope.block1[i].measure_id) {
                c = c + 1;
                $scope.block1[i].measure_idv = true;
            } else {
                $scope.block1[i].measure_idv = false;
            }
            if (!$scope.block1[i].currency_id) {
                d = d + 1;
                $scope.block1[i].currency_idv = true;
            } else {
                $scope.block1[i].currency_idv = false;
            }

            if ($scope.block1[i].cost == undefined) {
                e = e + 1;
                $scope.block1[i].costv = true;
            } else {
                $scope.block1[i].costv = false;
            }
            if (a > 0) {
                $scope.err.a = true;
            } else {
                delete $scope.err.a;
            }
            if (b > 0) {
                $scope.err.b = true;
            } else {
                delete $scope.err.b;
            }
            if (c > 0) {
                $scope.err.c = true;
            } else {
                delete $scope.err.c;
            }
            if (d > 0) {
                $scope.err.d = true;
            } else {
                delete $scope.err.d;
            }
            if (e > 0) {
                $scope.err.e = true;
            } else {
                delete $scope.err.e;
            }



        }
        //validation for multiselect block
        var unchecattr = 0;
        var unchecattr1 = 0;
        var unchecattr2 = 0;
        for (var i = 0; i < $scope.multiSelBlocks.length; i++) {
            console.log('$scope.multiSelBlocks[i].id' + $scope.multiSelBlocks[i].id);
            console.log($scope.multiSelBlocks[i].id)
            if ($scope.multiSelBlocks[i].id == undefined) {
                unchecattr = unchecattr + 1;
                $scope.multiSelBlocks[i].idval = true;
            } else {
                $scope.multiSelBlocks[i].idval = false;
            }

            if (!$scope.multiSelBlocks[i].sinvalue && !$scope.multiSelBlocks[i].mulvalue) {
                unchecattr1 = unchecattr1 + 1;
                $scope.multiSelBlocks[i].err = true;
            } else {

                $scope.multiSelBlocks[i].err = false;
            }
            if ($scope.multiSelBlocks[i].text == null || $scope.multiSelBlocks[i].text == "" && $scope.multiSelBlocks[i].hide == 1)
            {
                unchecattr2 = unchecattr2 + 1;
                $scope.multiSelBlocks[i].other_text = true;
            } else
            {
                $scope.multiSelBlocks[i].other_text = false;
            }




        }
        if (unchecattr > 0) {
            $scope.err.attributecheck = true;
        } else {
            delete $scope.err.attributecheck;
        }
        if (unchecattr1 > 0) {
            $scope.err.valuecheck = true;
        } else {
            delete $scope.err.valuecheck;
        }
        if (unchecattr2 > 0) {
            $scope.err.othercheck = true;
        } else {
            delete $scope.err.othercheck;
        }
        if (!$scope.product.long_description) {
            $scope.err.long_description = true;
        } else {
            delete $scope.err.long_description;
        }
        console.log("lengthy::", Object.keys($scope.err).length);
        console.log("err", $scope.err);
        if (Object.keys($scope.err).length == 0) {

            if (cb)
                cb();
        }
    }

    /* var cost = '';
     $scope.$watch('block1[0].cost', function (val) {
     
     if (val) {
     if (!val.toString().match(/^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/)) {
     if (val.toString().length != 1) {
     $scope.block1[0].cost = cost;
     } else {
     $scope.block1[0].cost = '';
     }
     } else {
     cost = val;
     }
     }
     });*/
    var cost = '';
    $scope.checkcost = function (val, i) {


        if (val) {
            if (!val.toString().match(/^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/) || val.toString().length > 10) {
                if (val.toString().length != 1) {
                    $scope.block1[i].cost = cost;
                } else {
                    $scope.block1[i].cost = '';
                }
            } else {
                cost = val;
            }
        }
    }
    var product_upc_ean_code = '';
    $scope.$watch('product.product_upc_ean_code', function (val) {
        if (val) {
            if (!val.toString().match(/^([a-zA-Z0-9]+)$/)) {
                if (val.toString().length != 1) {
                    $scope.product.product_upc_ean_code = product_upc_ean_code;
                } else {
                    $scope.product.product_upc_ean_code = '';
                }
            } else {
                product_upc_ean_code = val;
            }
        }
    });
    $scope.getReviews = function () {

        console.log("$scope.product.product_id", $scope.pro_id)
        var reviewsRequest =
                {
                    "userId": $scope.admin.userId,
                    "vendor_id": $scope.admin.vendorid,
                    "product_id": $scope.pro_id

                }
        console.log("reviewsRequest++++++++++", reviewsRequest)

        request.service('getReviewById', 'post', reviewsRequest, function (response) {
            console.log("reviewsResponse is", response);
            $scope.ReviewResponse = response;
            console.log("index++++++++++", $scope.subindex)


            //$scope.AverageRating = Math.round(response.AvgRating);
            $scope.AverageRating = response.AvgRating;
            console.log("AverageRating is", $scope.AverageRating);
            $scope.AverageRatingList = response.AvgRating;
            $scope.ReviewList = response.ReviewList;
            $scope.ReviewList_count = [];
            for (var i = 0; i < $scope.ReviewList.length; i++) {
                console.log("$scope.ReviewList", $scope.ReviewList[i].review);
                if ($scope.ReviewList[i].review != "") {
                    console.log("$scope.ReviewList", $scope.ReviewList[i].review);
                    $scope.ReviewList_count.push($scope.ReviewList[i]);
                }
                console.log("$scope.ReviewList", $scope.ReviewList_count);
            }
            ;
            $scope.review_length = response.ReviewList.length;
            $scope.reviewListCounts0 = response.reviewListCount[4];
            $scope.reviewListCounts1 = response.reviewListCount[3];
            $scope.reviewListCounts2 = response.reviewListCount[2];
            $scope.reviewListCounts3 = response.reviewListCount[1];
            $scope.reviewListCounts4 = response.reviewListCount[0];
            console.log("reviewListCounts", $scope.reviewListCounts0);
            $scope.reviewprofilePath = response.reviewprofilePath;
            console.log("ReviewList is", $scope.ReviewList);
            $scope.reviewprofilePath = response.reviewprofilePath;
        });
        $scope.changeDateFormat = function (date) {
            var formatDate = new Date(date);
            var formattedMonth = formatDate.getMonth() + 1;
            if (formattedMonth < 10) {
                formattedMonth = "0" + formattedMonth;
            }
            var formattedDate = formatDate.getDate();
            if (formattedDate < 10) {
                formattedDate = "0" + formattedDate;
            }
            var formattedYear = formatDate.getFullYear();
            var formattedHours = formatDate.getHours();
            if (formattedHours < 10) {
                formattedHours = "0" + formattedHours;
            }
            var formattedMinutes = formatDate.getMinutes();
            if (formattedMinutes < 10) {
                formattedMinutes = "0" + formattedMinutes;
            }
            return ((formattedMonth) + '-' + (formattedDate) + '-' + (formattedYear) + " " + (formattedHours) + ":" + (formattedMinutes));
        };
    };
    $scope.getAvgRating = function (avg) {
        var avgCeil, avgFloor, remain;
        if (avg === undefined)
            avg = 0;
        if (avg !== undefined) {
            var newAvg = avg.toString();
            if (newAvg.indexOf('.') > -1) {
                avgCeil = Math.ceil(avg);
            }
            if (newAvg.indexOf('.') > -1) {
                avgFloor = Math.floor(avg);
            }
            $scope.AverageRatingRemain = avg - avgFloor;
            $scope.AverageRatingIndex = avgCeil - $scope.AverageRatingRemain;
        }


        return new Array(avgCeil);
    };
    if ($location.path() == '/product_service_catalog/updateProduct') {

        $scope.getReviews();
    }


    $scope.formatPrice = function (price) {
        return parseFloat(price).toFixed(0);
    };
    $scope.removeRate = function () {
        console.log("remove_rate(popover640331)")
        $("#myModal").show();
        $(".model_revie").hide();
    }


    $scope.editProductCatalog = editProductCatalog;
    $scope.getProductList = getProductList;
});
// app.directive('currencyInput', function() {
//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link: function(scope, element, attrs, ctrl) {

//             return ctrl.$parsers.push(function(inputValue) {
//                 var inputVal = element.val();

//                 //clearing left side zeros
//                 while (inputVal.charAt(0) == '0') {
//                     inputVal = inputVal.substr(1);
//                 }

//                 inputVal = inputVal.replace(/[^\d.\',']/g, '');

//                 var point = inputVal.indexOf(".");
//                 if (point >= 0) {
//                     inputVal = inputVal.slice(0, point + 3);
//                 }

//                 var decimalSplit = inputVal.split(".");
//                 var intPart = decimalSplit[0];
//                 var decPart = decimalSplit[1];

//                 intPart = intPart.replace(/[^\d]/g, '');
//                 if (intPart.length > 3) {
//                     var intDiv = Math.floor(intPart.length / 3);
//                     while (intDiv > 0) {
//                         var lastComma = intPart.indexOf(",");
//                         if (lastComma < 0) {
//                             lastComma = intPart.length;
//                         }

//                         if (lastComma - 3 > 0) {
//                             intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
//                         }
//                         intDiv--;
//                     }
//                 }

//                 if (decPart === undefined) {
//                     decPart = "";
//                 } else {
//                     decPart = "." + decPart;
//                 }
//                 var res = intPart + decPart;

//                 if (res != inputValue) {
//                     ctrl.$setViewValue(res);
//                     ctrl.$render();
//                 }

//             });

//         }
//     };
//// });=======
//});
