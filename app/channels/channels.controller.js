angular.module("angularfireSlackApp")
  .controller(
    "ChannelsCtrl",
    ["$state", "Auth", "Users", "Messages", "profile", "channels",
    function($state, Auth, Users, Messages, profile, channels) {
      var channelsCtrl = this;
      channelsCtrl.profile = profile;
      channelsCtrl.channels = channels;
      channelsCtrl.users = Users.all;
      channelsCtrl.getDisplayName = Users.getDisplayName;
      channelsCtrl.getGravatar = Users.getGravatar;

      channels.forEach(function(channel) {
        var timestamp = (profile.channels && profile.channels[channel.$id] && profile.channels[channel.$id].lastReadTimestamp) || 1;
        var offset = (-1);
        if (timestamp == 1) {
          offset = 0;
        }

        if (!profile.channels) {
          profile.channels = {};
        }
        if (!profile.channels[channel.$id]) {
          profile.channels[channel.$id] = { lastReadTimestamp: timestamp };
        }

        Messages.forChannelFromTimestamp(channel.$id, timestamp)
          .$loaded().then(function(messages) {
            profile.channels[channel.$id].unreadCount = Math.max(messages.length + offset, 0);
          });
      });

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
