Meteor.startup(function () {
	process.env.MAIL_URL = 'smtp://kaizeras:centroidaspaces16@smtp.sendgrid.net:587';
  //seed data
	if(Meteor.users.find({}).count() == 0) {


    var adminPassEnv = process.env.ADMIN_PASSWORD;





		var admin = Accounts.createUser({
			email: "admin@aubg.edu",
			password: adminPassEnv,
			profile: { first_name: "Admin" , last_name: "Adminov", isAdmin: true},
			roles: ['admin']
		});

		Roles.addUsersToRoles(admin, ['admin']);

	}
    if(GameState.find({}).count() == 0) {
        GameState.insert({state: false}); //the game will be stopped
    }



});
