/**
 * Created by Nikhil-PC on 10/04/2016.
 */

var fetchdata = angular.module('fetchdata', []);

fetchdata.controller('userController', function ($scope, $http, $window) {

    var obj = new Object();
    $scope.productArr = [];

    $scope.editform = false;

    $scope.editInfo = function () {
        $scope.editform = true;
    };

    $http({
        method : "GET",
        url : "/userProfile"
    }).success(function (data) {
        // alert(JSON.stringify(response));
        $scope.userbday = data.userProfile[0].userbday;
        $scope.ebayhandle = data.userProfile[0].ebayhandle;
        $scope.location = data.userProfile[0].location;
        $scope.contact = data.userProfile[0].contact;
        // $scope.user = response;
        // window.location.assign('/userProfile');
    }).error(function (err) {
        
    });
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        $scope.user = res.user;
    }).error(function(res){

    });
    
    $http({
        method : "GET",
        url : "/soldProducts"
    }).success(function (response) {
        $scope.productArr = response.data;
    }). error(function (err) {

    });

    $http({
        method:"GET",
        url:"/userBoughtProducts"
    }).success(function (response) {
        // alert(JSON.stringify(response));
        $scope.historyArr = response.data;
    }).error(function (response) {

    });
    
    $scope.userUpdate = function () {
        var obj = new Object();
        obj.userbday = $scope.userbday;
        obj.ebayhandle = $scope.ebayhandle;
        obj.location = $scope.location;
        obj.contact = $scope.contact;

        $http({
            method : "POST",
            url : "/userUpdate",
            data : obj,
            headers : {
                'Content-Type' : 'application/json'
            }
        }).success( function (response) {
            //alert(JSON.stringify(response));
            $window.location.href = '/userHome';

        }).error(function (err) {
            
        });
    }


});