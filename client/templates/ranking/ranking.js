Template.ranking.helpers({
      rankings:function(){
        var users = Meteor.users.find({"profile.kills":{ $gt: 0 } }, {sort: {"profile.kills": -1, "profile.lastKill": 1 , "profile.firstName": -1 }});
        if(users){
            return users;
        }
    }


});
//When pub-sub is implemented
// Template.ranking.onCreated( function() {
//    this.subscribe( 'rank-users' );
// });
