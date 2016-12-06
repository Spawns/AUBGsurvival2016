if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
  Meteor.setTimeout(function(){ Router.go('reset-password'); }, 450) ;
}
Template.passwordRecovery.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  },

  notification: function() {
    return Session.get('passResetNotif');
  }
});

Template.passwordRecovery.events({

    'submit #recovery-form' : function(e, t) {
      e.preventDefault()
      var email = t.find('#recovery-email').value;

      if (email) {
        Session.set('loading', true);
        Accounts.forgotPassword({email: email}, function(err){
        if (err)
          Session.set('passResetNotif', 'Password Reset Error')
        else {
          Session.set('passResetNotif', 'Email Sent. Please check your email.')
        }
        Session.set('loading', false);
      });
      }
      return false;
    },

    'submit #new-password' : function(e, t) {
      e.preventDefault();
      var pw = t.find('#new-password-password').value;
      if (pw) {
        Session.set('loading', true);
        Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
          if (err)
            Session.set('passResetNotif', 'Password Reset Error Sorry');
          else {
            Router.go('signin');
            Session.set('resetPassword', null);
          }
          Session.set('loading', false);
        });
      }
    return false;
    }
});
