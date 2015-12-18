/**
 * Created by Flo on 14/12/2015.
 */

var tilo = angular.module("tilo", ['http-post-fix', 'ngDraggable']);

tilo.controller("tiloController", ["$scope", "$http", function($scope, $http) {

    $scope.droppedObjects = [];

    $scope.onDragSuccess=function(data, evt) {
        var index = $scope.droppedObjects.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects.splice(index, 1);
        }
    };

    $scope.onDropComplete=function(data, evt) {

        var index = $scope.droppedObjects.indexOf(data);

        if (index == -1)
            $scope.droppedObjects.push(data);

        console.log($scope.droppedObjects);
    };

    $scope.onDragStart = function(data, evt) {

        var draggingArticle = document.getElementById(data.title);

        draggingArticle.style.cssText = "cursor: -webkit-grabbing; cursor: -moz-grabbing; cursor: grabbing;";

        hideAllTips();

        var dropArea = document.getElementById("drop-area");

        dropArea.className = "dragging";
    };

    $scope.onDragStop = function(data, evt) {
        var dropArea = document.getElementById("drop-area");
        var draggingArticle = document.getElementById(data.title);

        draggingArticle.removeAttribute("style");

        dropArea.className = "dragging-stop";
    };

    $scope.route = "views/movies.html";


    $scope.showTips = function($event) {

        var article = $event.currentTarget;

        article.lastElementChild.style.display = "block";

        article.style.zIndex = "99";

    };

    $scope.hideTips = function($event) {

        var article = $event.currentTarget;

        article.lastElementChild.style.display = "none";

        article.style.zIndex = "1";
    };

    var hideAllTips = function() {
        var allTips = document.getElementsByClassName("movie-tips");

        for (var i = 0; i < allTips.length; i++) {
            allTips[i].style.display = "none";
        }
    };

    $scope.moveTipsBox = function($event) {

        var article = $event.currentTarget;

        var position = {x : $event.pageX, y : $event.pageY};

        var articlePosition = {x : article.offsetLeft, y : article.offsetTop};

        article.lastElementChild.style.left = position.x - articlePosition.x + 20 +"px";
        article.lastElementChild.style.top = position.y - articlePosition.y - 200 +"px";
    };

    $scope.loadMovies = function() {

        $http.get("movies.json")
            .success(function(data) {
                $scope.movies = data;
                console.log($scope.movies);
            });

    }();


}]);