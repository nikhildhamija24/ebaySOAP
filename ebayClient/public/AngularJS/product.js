/**
 * Created by Nikhil-PC on 10/06/2016.
 */

var productApp = angular.module('productApp', []);

productApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});

productApp.controller('productController', function ($scope, $http, $window) {
    
    $scope.submitData = function () {
        var obj = new Object();
        obj.title = $scope.title;
        obj.description = $scope.description;
        obj.quantity = $scope.quantity;
        obj.price = $scope.price;
        obj.bidding = $scope.bidding;

        $http({
            method : "POST",
            url : "/product",
            data : obj,
            headers : {
                'Content-Type' : 'application/json'
            }
        }).success( function (response) {
            if(response.statusCode === 200) {
                $window.location.href = '/allProds';
            }else if(response.statusCode === 401){
                console.log("Error in inserting into the database");
            }

        }).error( function (err) {

        });
    }
});



productApp.controller('allProductController', function ($scope, $http) {
    $scope.productArr = [];

    $http({
        method : "GET",
        url : "/getAllProducts"
    }).success(function (data) {

            alert(JSON.stringify(data));
            //$scope.productArr.push(response.data);
        if(data.statusCode === 200) {
            $scope.productArr = data.products;
        }
        }).error(function (err) {

        }
    );
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        $scope.user = res.user;
    }).error(function(res){

    });

    // $scope.showsearch = function () {
    //     var obj = new Object();
    //     obj.searchx = $scope.searchbox;
    //     $scope.search = !$scope.search;
    //     $http({
    //         method : "POST",
    //         url : "/searchProduct",
    //         headers : {
    //             "content-type" : 'application/json'
    //         },
    //         data : obj
    //
    //     }).then(function (response) {
    //         //alert(JSON.stringify(response));
    //         $scope.searchProductArr = response.data;
    //     }, function (response) {
    //
    //     });
    // };

});
