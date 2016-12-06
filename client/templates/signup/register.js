Template.register.helpers({
   errors: function() {
     return Session.get('signUpErrors');
   }
});

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

//hooks
AutoForm.hooks({
  "signupForm": {
    onSubmit: function (doc) {
       Accounts.createUser({
        email: doc.email,
        password: doc.password,
        profile: doc.profile
      }, function(error) {
        if(error) {
          $('.reg-btn').prop("disabled", false);
          Session.set('signUpErrors', error.reason)
        } else {

          Router.go('/dashboard')
        }
      });

     return true;

     }//onSubmit
   }//signUpForm
 });

