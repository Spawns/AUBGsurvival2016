Template.signin.helpers({
   errors: function() {
     return Session.get('loginErrors');
   }
});



Template.signin.events({
    'submit form': function(event){
        event.preventDefault();
        var email = event.target.loginEmail.value;
        var password = event.target.loginPassword.value;
        Meteor.loginWithPassword(email, password , function(error) {
                if (error) {
                    Session.set('loginErrors', error.reason);
                } else {
                    Session.set('loginErrors', "");
                }
        });
    }
});


Accounts.onLogin(function(){
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        Router.go('/admin');
    } else {
        Router.go('/dashboard');
    }
   //get user info that is not included in the pub
   Meteor.call('getInfo' ,  function(error, response) {
       Session.set('userTarget' , response.target);
       Session.set('personalToken', response.token);

   })

});
