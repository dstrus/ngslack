angular.module("angularfireSlackApp")
  .controller(
    "ChannelsCtrl",
    ["$state", "Auth", "Users", "profile", "channels",
    function($state, Auth, Users, profile, channels) {
      var channelsCtrl = this;
      channelsCtrl.profile = profile;
      channelsCtrl.channels = channels;
      channelsCtrl.users = Users.all;
      channelsCtrl.getDisplayName = Users.getDisplayName;
      channelsCtrl.getGravatar = Users.getGravatar;

      Users.setOnline(profile.$id);

      channelsCtrl.newChannel = {
        name: ""
      };

      channelsCtrl.logout = function() {
        channelsCtrl.profile.online = null;
        channelsCtrl.profile.$save()
          .then(function() {
            Auth.$unauth();
            $state.go("home");
          });
      };

      channelsCtrl.createChannel = function() {
        channelsCtrl.channels.$add(channelsCtrl.newChannel)
          .then(function(ref) {
            $state.go("channels.messages", { channelId: ref.key() });
          });
      };
    }]
  );
