/**
 * Created by Nikhil-PC on 12/08/2016.
 */

var loginApp = angular.module("loginApp", []);

loginApp.controller('loginController', function($scope, $http, $window){
    $scope.registerFlag = false;
    $scope.signInFlag = true;
    $scope.invalidlogin = true;
    // $http({
    //     method: "GET",
    //     url: "/getUsername"
    // }).success(function(res){
    //     console.log(JSON.stringify(res));
    //     $scope.user = res.user;
    //     $scope.lastLogin = res.lastLogin;
    // }).error(function(res){
    //
    // });
    $scope.signInClicked = function(){
        $scope.registerFlag = false;
        $scope.signInFlag = true;
    };

    $scope.registerClicked = function () {
        $scope.signInFlag = false;
    };

    $scope.login = function () {
        var obj = {};
        obj.userEmail = $scope.userEmail;
        obj.userPassword = $scope.userPassword;
        $http({
            method: "POST",
            url: "/signin",
            data: obj
        }).success(function (data) {
            console.log(JSON.stringify(data));
            if(data.code === 200){
                $window.location.href= '/';
            }else if(data.code === 401){
                $scope.invalidlogin = false;
            }
        }).error(function (err) {

        })
    }

});
