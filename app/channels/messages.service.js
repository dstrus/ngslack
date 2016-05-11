angular.module("angularfireSlackApp")
  .factory(
    "Messages",
    ["$firebase", "$firebaseArray", "FirebaseUrl",
    function($firebase, $firebaseArray, FirebaseUrl) {
      var channelMessagesRef = new Firebase(FirebaseUrl + "channelMessages");
      var userMessagesRef = new Firebase(FirebaseUrl + "userMessages");

      return {
        forChannel: function(channelId) {
          return $firebaseArray(channelMessagesRef.child(channelId));
        },
        forChannelFromTimestamp: function(channelId, timestamp) {
          var subsetRef = $firebaseArray(channelMessagesRef.child(channelId).orderByChild("timestamp").startAt(timestamp));
          return subsetRef;
        },
        forUsers: function(uid1, uid2) {
          var path = uid1 < uid2 ? uid1 + "/" + uid2 : uid2 + "/" + uid1;
          return $firebaseArray(userMessagesRef.child(path));
        },
        forUsersFromTimestamp: function(uid1, uid2, timestamp) {
          var path = uid1 < uid2 ? uid1 + "/" + uid2 : uid2 + "/" + uid1;
          var subsetRef = $firebase(userMessagesRef.child(path).orderByChild(timestamp).startAt(timestamp));
        }
      };
    }]);
