/**
 * Created by test most on 4/2/2016.
 */
Template.adminDashboard.helpers({
    usersStats: function(){
        var users = Meteor.users.find({"roles":{ $nin: ['admin'] }});
        if(users){

            return users;

        }
        else{
            return;
        }
    },

    currentHunter: function(id){
        var userId = id;
        var user = Meteor.users.findOne({_id:userId});
        if(user){
            var currentHunter = user.profile.lastName + ", " + user.profile.firstName;
            return currentHunter;
        }
    },
});

Template.userInfo.helpers({
  currentTarget: function(){
      var user = Meteor.users.findOne({_id: this.profile.target});
      if(user){
          var currentTarget = user.profile.lastName + "  " + user.profile.firstName;
          return currentTarget;
      }
  },
  currentHunter: function() {
    var hunter = Meteor.users.findOne({_id: this.profile.hunters});
    if(hunter) {
          return hunter.profile.firstName + ' ' + hunter.profile.lastName;
    }
  }
});

Template.adminDashboard.events({
    'click .js-btn-start-game': function(event, template) {
        Meteor.call('toggleGameState');

    },
    'click .js-btn-stop-game': function(event, template) {
        Meteor.call('toggleGameState');
    },

    'click .js-btn-assignUsers': function(event, template) {
        if(confirm('USE THIS ONLY WHEN THE REGISTRATION PERIOD IS OVER!!! ARE YOU SURE YOU WANT TO PROCEED?')) {
              Meteor.call('startGame');
        }

    }

});

Template.userInfo.events({
    'click .js-btn-delete-user': function(event, template) {
        if(confirm('Are you sure you want to delete this user?')) {
            Meteor.call('deleteUser', this._id);
        }
    }
});