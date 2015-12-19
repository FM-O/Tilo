/**
 * Created by Flo on 14/12/2015.
 */

Parse.initialize("9EmkHNqIHCenABISKjzBN1dH5T4qqpPK2lmJj3A6", "o7MjTIKFCEuLCSngoJuqMll4W5NxCxuow1xb57yX");

var FavoriteList = Parse.Object.extend("FavoriteList");
var favoriteList = new FavoriteList();


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

        if (index == -1) {
            $scope.droppedObjects.push(data);
        }

        for (var n = 0 ; n < $scope.droppedObjects.length ; n++) {
            favoriteList.addUnique("film", $scope.droppedObjects[n].title);
        }

        favoriteList.addUnique("film", data.title);
        favoriteList.save();

        console.log($scope.droppedObjects);

        var query = new Parse.Query(FavoriteList);

        query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " titles.");
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get('film'));
                    //object.destroy();
                }
            },
            error: function(error) {
                console.error("Error: " + error.code + " " + error.message);
            }
        });
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
            });

    }();

    $scope.loadFavorites = function() {

        var datas = [];

        var query = new Parse.Query(FavoriteList);

        query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " titles.");
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    console.log(object.id + ' - ' + object.get('film'));

                    if (i < results.length - 1) { object.destroy(); }

                    datas.push(object.get("film"));
                }

                $scope.favorites = datas[datas.length-1];
                for (var j = 0 ; j < $scope.favorites.length ; j++) {
                    $scope.droppedObjects.push({title : $scope.favorites[j]});
                }

                console.log($scope.droppedObjects);
            },
            error: function(error) {
                console.error("Error: " + error.code + " " + error.message);
            }
        });

    }();
}]);