'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html'
      })
      .state('login', {
        url: '/login',
        controller: "AuthCtrl as authCtrl",
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth) {
            return Auth.$requireAuth()
              .then(
                function(auth) {
                  $state.go("home");
                },
                function(error) {
                  return;
                }
              );
          }]
        }
      })
      .state('register', {
        url: '/register',
        controller: "AuthCtrl as authCtrl",
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth) {
            return Auth.$requireAuth()
              .then(
                function(auth) {
                  $state.go("home");
                },
                function(error) {
                  return;
                }
              );
          }]
        }
      })
      .state("profile", {
        url: "/profile",
        controller: "ProfileCtrl as profileCtrl",
        templateUrl: "users/profile.html",
        resolve: {
          auth: ["$state", "Users", "Auth", function($state, Users, Auth) {
            return Auth.$requireAuth()
              .catch(function() {
                $state.go("home");
              });
          }],
          profile: ["Users", "Auth", function(Users, Auth) {
            return Auth.$requireAuth()
              .then(function(auth) {
                return Users.getProfile(auth.uid).$loaded();
              });
          }]
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://des-ngslack.firebaseio.com/');
