angular.module("angularfireSlackApp")
  .controller(
    "MessagesCtrl",
    ["$firebaseArray", "profile", "channelName", "channelId", "messages",
    function($firebaseArray, profile, channelName, channelId, messages) {
      var messagesCtrl = this;
      messagesCtrl.messages = messages;
      messagesCtrl.channelName = channelName;
      messagesCtrl.channelId = channelId;

      messagesCtrl.message = "";

      messagesCtrl.markAsRead = function($index, $inview, $inviewpart, $event) {
        var domId = $event.inViewTarget.id
        var messageId = domId.substr(domId.indexOf("_") + 1);
        var timestamp = messages.$getRecord(messageId).timestamp;
        messagesCtrl.updateLastReadTimestamp(timestamp);
      };

      messagesCtrl.updateLastReadTimestamp = function(timestamp) {
        if (!profile.channels) {
          profile.channels = {};
        }

        if (!profile.channels[messagesCtrl.channelId] || profile.channels[messagesCtrl.channelId].lastReadTimestamp < timestamp) {
          profile.channels[messagesCtrl.channelId] = { lastReadTimestamp: timestamp };
          profile.$save();
        }
      };

      messagesCtrl.sendMessage = function() {
        if (messagesCtrl.message.length > 0) {
          messagesCtrl.messages.$add({
            uid: profile.$id,
            body: messagesCtrl.message,
            timestamp: Firebase.ServerValue.TIMESTAMP
          }).then(function(result) {
            var messageData = messagesCtrl.messages.$getRecord(result.key());
            messagesCtrl.updateLastReadTimestamp(messageData.timestamp);
            messagesCtrl.message = "";
          });
        }
      };
    }]);
