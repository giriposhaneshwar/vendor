
    var app = angular.module('arevea');
    app.controller('productsCtrl',function($scope, request, ctrlComm, $filter, fileUpload, $interval, $http, $location, $state){
        console.log("in productsCtrl");
        $scope.loader(true);
        $scope.product = {};
        $scope.block1 = [{}];
        $scope.block2 = [{}];
        $scope.imgList = [];
        $scope.page={};
        $scope.incrementBlock1 = function() {
            $scope.block1.push({})
        }

        $scope.decrementBlock1 = function(index) {
            $scope.block1.splice(index, 1)
        }
        $scope.incrementBlock2 = function() {
            $scope.block2.push({})
        }

        $scope.decrementBlock2 = function(index) {
            $scope.block2.splice(index, 1)
        }

        request.service('vendorGetLocations', 'post', { 'vendor_id': $scope.admin.vendorid }, function(response) {
            console.log(response)
            $scope.locationsList = response;
        })
        request.service('vendorCategories', 'post', {'vendor_id':$scope.admin.vendorid}, function(response) {
            $scope.loader(false);
            $scope.categoriesList = response;
        })

        request.service('productStatus', 'get', {}, function(response) {
            $scope.productStatusList = response;
            console.log(response)
        })

        request.service('taxsList', 'get', {}, function(response) {

            $scope.taxsList = response;
        })


      if ($location.path() == '/product_service_catalog/Products') {
     
    } else if ($location.path() == "/product_service_catalog/addProduct") {
     
        $scope.page.type = 'post'
    } else if ($location.path() == "/product_service_catalog/updateProduct") {
        
       $scope.page.type = 'put';
        prePoppulateValues(ctrlComm.get('userObj'));
    }
    var editProductCatalog= function(obj) {
        ctrlComm.put('userObj', obj);
        console.log("@@@@@@@@", obj)
        $location.path("/product_service_catalog/updateProduct");
    }

    function prePoppulateValues(obj) {
        if (obj) {
            $scope.product = obj;
            
        } else {
              $location.path('/product_service_catalog/Products') 
        }
    }
    if ($location.path() == "/product_service_catalog/updateProduct") {
        prePoppulateValues(ctrlComm.get('userObj'));
    }
        $scope.addProduct = function(product, block1, block2) {
            product.tax = block1;
            product.product_attr = block2;
            product.vendor_id = $scope.admin.vendorid
            var media = {};
            media.image = [];
            media.video = [];
            console.log($scope.imgList)
            var fd = new FormData();
            var i=0;
            angular.forEach($scope.imgList,function(obj){
                var temp = {};
                temp.name = obj.name;
                media.image.push(temp)
                fd.append('photo', obj);
                i=i+1;
            })

            angular.forEach($scope.videoList,function(obj){
                media.video.push(obj)
            })

            console.log(media)
            product.media = media;
            console.log(angular.toJson(product))
            //var fd = new FormData();
            //fd.append('photos',$scope.imgList)
            fd.append('jsondata',JSON.stringify(product))


            console.log(angular.toJson(product));
            
             //$http.post("http://192.168.2.185:8000/arevea/addProductCatalog", fd, {
             $http.post("http://192.168.0.234:8000/arevea/addProductCatalog", fd, {
     //$http.post("http://qa.arevea.com/arevea/arevea/addProductCatalog", fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .success(function(response) {
                        $scope.notification(response.message);
                        $location.path('/product_service_catalog/Products') 
                        
                    })
                    .error(function() {
                        $scope.notification(response.message);
                    });
        }

        request.service('productsList','post',{'vendor_id': $scope.admin.vendorid},function(response){
            $scope.productsList = response;
            console.log("productlist",response)
        })

        $scope.getFileDetails = function(e){
            $scope.$apply(function(){
            $scope.imgList.push($('#image')[0].files[0])
            })
        }

        $scope.goToList = function(){
            $location.path('/product_service_catalog/Products');
        }


        

        $scope.removeImage = function(index) {
            $scope.imgList.splice(index, 1)
        }

        $scope.getAttributes = function(category_id) {
            var params = {};
            params.category_id = category_id;
            request.service('attributesByCategory', 'post', params, function(response) {
                $scope.attributesList = response;
            })
        }

        $scope.getAttributeValue = function(attribute_id) {
            var params = {};
            params.attribute_id = attribute_id;
            request.service('attrValuesByAttribute', 'post', params, function(response) {
                $scope.attributesValuesList = response;
            })
        }
        $scope.videoList = [];
        $scope.addVideo = function() {
            $scope.videoList.push({'url':''})
        }

$scope.editProductCatalog=editProductCatalog;

    });
   
