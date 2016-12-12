/**
 * Created by Nikhil-PC on 12/10/2016.
 */

var registerApp = angular.module("registerApp", []);


registerApp.controller('registerController', function($scope, $http, $window){
    $scope.signInFlag = false;
    $scope.registerFlag = true;
    $scope.invaliduser = true;
    $scope.someerror = true;
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        $scope.user = res.user;
        $scope.lastLogin = res.lastLogin;
    }).error(function(res){
        
    });
    $scope.signInClicked = function(){
        $scope.registerFlag = false;
    };

    $scope.registerClicked = function () {
        $scope.signInFlag = false;
        $scope.registerFlag = true;
    };
    
    $scope.register = function () {
        var obj = {};
        obj.fname = $scope.fname;
        obj.lname = $scope.lname;
        obj.registeremail = $scope.registeremail;
        obj.pass = $scope.pass;

        $http({
            method: "POST",
            url: "/register",
            data: obj
        }).success(function (data) {
            if(data.statusCode === 200){
                $window.location.href= '/signinPage';
            }else if(data.statusCode === 401){
                $scope.someerror = false;
            }else if(data.statusCode === 402){
                $scope.invaliduser = false;
            }
        }).error(function (err) {

        })
    }
});
