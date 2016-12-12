/**
 * Created by Nikhil-PC on 10/08/2016.
 */
var cartApp = angular.module('cartApp', []);

cartApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});

cartApp.controller('cartController', function ($scope, $http, $window) {
    $scope.productArr = [];
    var sum = 0;
    $http({
        method:"GET",
        url:"/getCart"
    }).success(function (response) {
            // alert(JSON.stringify(response));
            if(response.statusCode === 200) {
                $scope.productArr = response.cart;
                var sum = 0;
                var i = 0;
                for(i=0; i<response.cart; i++){
                    sum = sum+ (response.cart[i].itemprice * response.cart[i].selectedquantity);
                }
                $scope.cartTotal = response.cart.sum;
            }else if(response.statusCode === 401){
                console.log("Shopping cart is empty");
            }

    }).error(function (err) {
        
    });
    
    $scope.removeProduct = function (productId, selectedQuantity) {
        var obj = new Object();
        obj.productId = productId;
        obj.selectedQuantity = selectedQuantity;
        $http({
            method : "POST",
            url : "/deleteFromCart",
            headers : {
                'content-type' : 'application/json'
            },
            data : obj
        }).success(function (response) {
            alert(JSON.stringify(response));
            if(response.statusCode === 200) {
                $scope.productArr = response.cart;
                var sum = 0;
                var i = 0;
                for(i=0; i<response.cart; i++){
                    sum = sum+ (response.cart[i].itemprice * response.cart[i].selectedQuantity);
                }
                $scope.cartTotal = response.cart.sum;
            }else if(response.statusCode === 401){
                console.log("Shopping cart is empty");
            }
        }).error( function (err) {

        });
    };

    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        
        $scope.user = res.user;
    }).error(function(err){

    });
    
    
});

