var bingo = angular.module('bingo', ['ngRoute']);

bingo.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '../pages/home.html',
        })
        .when('/new/cardset', {
        	templateUrl : '../pages/addCardSet.html',
        	controller : 'addCardSetController'
        })
        .when('/new/game', {
        	templateUrl : '../pages/newGame.html',
        	controller : 'addGameController'
        });
});

bingo.controller('addCardSetController', function($scope, $http) {
	$scope.formData = {};
	$scope.msg = "";

	// Submit new page 
	$scope.addCardSet = function () {
		$http.post('/api/new/cardset', $scope.formData)
			.success(function(data){
				$scope.formData = {};
				$scope.msg = "Congratulations! You have successfully added your card set!";
			})
			.error(function(data) {
			console.log("Error: " + data);
		});
	};

});

bingo.controller('addGameController', function($scope, $http) {
	$scope.formData = {};
	$scope.formData.card_set = "default";
	$scope.msg = "";
	$scope.formText = {};


	$http.get('/api/user/cardsets')
		.success(function(data) {
			$scope.formText = data;
		})
		.error(function(data) {
			console.log("Error: " + data); 
		});

	$scope.addGame = function () {
		console.log($scope.formData);
		$http.post('/api/new/game', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.msg = "Congratulations! You have successfully created a game!";
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};
});

