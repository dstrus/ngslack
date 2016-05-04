angular.module("angularfireSlackApp")
  .factory(
    "Channels",
    ["$firebaseArray", "FirebaseUrl",
    function($firebaseArray, FirebaseUrl) {
      var ref = new Firebase(FirebaseUrl + "channels");
      var channels = $firebaseArray(ref);

      return channels;
    }]);
