
var sideNav = angular.module('colors', []);

sideNav.controller('sideNavCtrl', function($scope, $http) {

    $scope.activeOrNot = function(page_name){

        if (page_name == "ExamAnalysis"){
            return true;
        }
        else
            return false
    }

});