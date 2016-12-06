Template.home.helpers({
  playersKilled: function() {

      return ReactiveMethod.call("totalKills");


  }
});