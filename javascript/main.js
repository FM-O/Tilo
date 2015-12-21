/**
 * Created by Flo on 14/12/2015.
 */

Parse.initialize("9EmkHNqIHCenABISKjzBN1dH5T4qqpPK2lmJj3A6", "o7MjTIKFCEuLCSngoJuqMll4W5NxCxuow1xb57yX");

var FavoriteList = Parse.Object.extend("FavoriteList");
var favoriteList = new FavoriteList();


var tilo = angular.module("tilo", ['http-post-fix', 'ngDraggable']);

tilo.controller("tiloController", ["$scope", "$http", function($scope, $http) {

    $scope.droppedObjects = [];

    $scope.addToCollection = function (data, evt) {


        if (window.innerWidth < 769) {
            var index = $scope.droppedObjects.indexOf(data);

            var duplicate = false;

            var error = document.getElementById("error");

            if (index != -1) {

                error.className = "displayed";

                setTimeout(function() {
                    error.className = "hidden";
                }, 1500);
            }

            if (index == -1) {
                for (var i = 0 ; i < $scope.droppedObjects.length ; i++) {
                    if ($scope.droppedObjects[i].title == data.title)
                        duplicate = true;
                }

                if (!duplicate) {
                    var notif = document.getElementById("notif");

                    notif.className = "displayed";

                    setTimeout(function() {
                        notif.className = "hidden";
                    }, 1500);

                    $scope.droppedObjects.push(data);
                } else {

                    error.className = "displayed";

                    setTimeout(function() {
                        error.className = "hidden";
                    }, 1500);
                }
            }

            for (var n = 0 ; n < $scope.droppedObjects.length ; n++) {
                favoriteList.addUnique("film", $scope.droppedObjects[n].title);
            }

            favoriteList.addUnique("film", data.title);
            favoriteList.save();
        }
    };

    $scope.onDragSuccess=function(data, evt) {
        var index = $scope.droppedObjects.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects.splice(index, 1);
        }
    };

    $scope.onDropComplete=function(data, evt) {

        var index = $scope.droppedObjects.indexOf(data);

        var duplicate = false;

        var error = document.getElementById("error");

        if (index != -1) {

            error.className = "displayed";

            setTimeout(function() {
                error.className = "hidden";
            }, 1500);
        }

        if (index == -1) {
            for (var i = 0 ; i < $scope.droppedObjects.length ; i++) {
                if ($scope.droppedObjects[i].title == data.title)
                    duplicate = true;
            }

            if (!duplicate) {
                $scope.droppedObjects.push(data);

                var notif = document.getElementById("notif");
                var updated = document.getElementById("updated-list");

                if (!evt.element[0].classList.contains("favorite-movie")) {
                    notif.className = "displayed";

                    setTimeout(function() {
                        notif.className = "hidden";
                    }, 1500);
                } else {
                    updated.className = "displayed";

                    setTimeout(function() {
                        updated.className = "hidden";
                    }, 1500);
                }
            } else {

                error.className = "displayed";

                setTimeout(function() {
                    error.className = "hidden";
                }, 1500);
            }
        }

        for (var n = 0 ; n < $scope.droppedObjects.length ; n++) {
            favoriteList.addUnique("film", $scope.droppedObjects[n].title);
        }

        favoriteList.addUnique("film", data.title);
        favoriteList.save();

            //console.log($scope.droppedObjects);
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

        if (window.innerWidth > 768) {
            var article = $event.currentTarget;

            article.lastElementChild.style.display = "block";

            article.style.zIndex = "99";
        }
    };

    $scope.hideTips = function($event) {

        var article = $event.currentTarget;

        article.lastElementChild.style.display = "none";

        article.style.zIndex = "1";
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
                //console.log("Successfully retrieved " + results.length + " titles.");
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    //console.log(object.id + ' - ' + object.get('film'));

                    if (i < results.length - 1) { object.destroy(); }

                    datas.push(object.get("film"));
                }

                if (datas.length > 0) {
                    $scope.favorites = datas[datas.length-1];
                    for (var j = 0 ; j < $scope.favorites.length ; j++) {
                        $scope.droppedObjects.push({title : $scope.favorites[j]});
                    }
                }

                //console.log($scope.droppedObjects);
            },
            error: function(error) {
                console.error("Error: " + error.code + " " + error.message);
            }
        });

    }();

    $scope.createNewList = function () {
        var deleteNotif = document.getElementById("list-deleted");

        deleteNotif.className = "displayed";

        setTimeout(function() {
            deleteNotif.className = "hidden";
        }, 1500);

        $scope.droppedObjects = [];

        var query = new Parse.Query(FavoriteList);

        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    //console.log(object.id + ' - ' + object.get('film'));

                    object.destroy();
                }
            }
        });
        favoriteList = new FavoriteList();
    };

    var hideAllTips = function() {
        var allTips = document.getElementsByClassName("movie-tips");

        for (var i = 0; i < allTips.length; i++) {
            allTips[i].style.display = "none";
        }
    };
}]);