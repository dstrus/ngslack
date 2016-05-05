angular.module("angularfireSlackApp")
  .controller(
    "ChannelsCtrl",
    ["$state", "Auth", "Users", "profile", "channels",
    function($state, Auth, Users, profile, channels) {
      var channelsCtrl = this;
      channelsCtrl.profile = profile;
      channelsCtrl.channels = channels;
      channelsCtrl.getDisplayName = Users.getDisplayName;
      channelsCtrl.getGravatar = Users.getGravatar;

      channelsCtrl.newChannel = {
        name: ""
      };

      channelsCtrl.logout = function() {
        Auth.$unauth();
        $state.go("home");
      };

      channelsCtrl.createChannel = function() {
        channelsCtrl.channels.$add(channelsCtrl.newChannel)
          .then(function() {
            channelsCtrl.newChannel = {
              name: ""
            };
          });
      };
    }]
  );
