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
    'angular-inview',
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
            return Messages.forChannelFromTimestamp($stateParams.channelId, 1462935700935).$loaded();
          }],
          channelName: ["$stateParams", "channels", function($stateParams, channels) {
            return "#" + channels.$getRecord($stateParams.channelId).name;
          }],
          channelId: ["$stateParams", "channels", function($stateParams, channels) {
            return $stateParams.channelId;
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
          }],
          channelId: ["$stateParams", "channels", function($stateParams, channels) {
            return $stateParams.uid;
          }]
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://des-ngslack.firebaseio.com/')
  .directive('scrollBottom', ['$timeout', function ($timeout) {
    // See http://stackoverflow.com/a/32482823
    return {
      scope: {
        scrollBottom: "="
      },
      link: function ($scope, $element) {
        $scope.$watchCollection('scrollBottom', function (newValue) {
          if (newValue) {
            $timeout(function(){
              $element.scrollTop($element[0].scrollHeight);
            }, 0);
          }
        });
      }
    }
  }]);
