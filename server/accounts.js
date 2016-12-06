Accounts.config({restrictCreationByEmailDomain:'aubg.edu'});

Accounts.onCreateUser(function(options, user) {
    //registration is forbidden when the game is running
    var gameState = GameState.findOne({});
    if(gameState) {
        if(gameState.state) {
            throw new Meteor.Error( 403, 'Forbidden' );
        }
    }

    if (options.profile) {
      user.profile = options.profile;
    }

    //Assign attributes
    if(Meteor.users.find().count() == 0) {//check if the user is admin
         // the first user will be an admin by default
    } else {
        user.roles = ['user'];
        user.profile.alive = true;
        user.profile.token = Random.secret(5);
        user.profile.hunters = [];
        user.profile.target = null;
        user.profile.kills = 0;
        user.profile.isAdmin = false;
        Roles.addUsersToRoles(user._id, ['user']);
    }


    return user;
});
