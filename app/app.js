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
    'angularResizable',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: ["$state", "Auth", function($state, Auth) {
            return Auth.$requireAuth()
              .then(
                function(auth) {
                  $state.go("channels");
                },
                function(error) {
                  return;
                }
              )
          }]
        }
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
                  $state.go("channels");
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
                  $state.go("channels");
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
      })

      .state("channels", {
        url: "/channels",
        controller: "ChannelsCtrl as channelsCtrl",
        templateUrl: "channels/channels.html",
        resolve: {
          channels: ["Channels", function(Channels) {
            return Channels.$loaded();
          }],
          profile: ["$state", "Auth", "Users", function($state, Auth, Users) {
            return Auth.$requireAuth()
              .then(
                function(auth) {
                  return Users.getProfile(auth.uid).$loaded()
                    .then(
                      function(profile) {
                        if (profile.displayName) {
                          return profile;
                        }
                        $state.go("profile");
                      }
                    );
                },
                function(error) {
                  $state.go("$home");
                }
              );
          }]
        }
      })

      .state("channels.new", {
        url: "/create",
        controller: "ChannelsCtrl as channelsCtrl",
        templateUrl: "channels/new.html"
      })

      .state("channels.messages", {
        url: "/{channelId}/messages",
        controller: "MessagesCtrl as messagesCtrl",
        templateUrl: "channels/messages.html",
        resolve: {
          messages: ["$stateParams", "Messages", function($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          }],
          channelName: ["$stateParams", "channels", function($stateParams, channels) {
            return "#" + channels.$getRecord($stateParams.channelId).name;
          }]
        }
      })

      .state("channels.direct", {
        url: "/{uid}/messages/direct",
        templateUrl: "channels/messages.html",
        controller: "MessagesCtrl as messagesCtrl",
        resolve: {
          messages: ["$stateParams", "Messages", "profile", function($stateParams, Messages, profile) {
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          }],
          channelName: ["$stateParams", "Users", function($stateParams, Users) {
            return Users.all.$loaded()
              .then(function() {
                return "@" + Users.getDisplayName($stateParams.uid);
              });
          }]
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://des-ngslack.firebaseio.com/');
