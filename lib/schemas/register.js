UserSchema = {};

 UserSchema.UserProfile = new SimpleSchema({
     firstName: {
         type: String,
         regEx: /^[a-zA-Z-]{2,25}$/
     },
     lastName: {
         type: String,
         regEx: /^[a-zA-Z]{2,25}$/
     }
 });

 UserSchema.User = new SimpleSchema({
   email: {
     type: String,
     regEx: SimpleSchema.RegEx.Email
   },
   password: {
     type: String,
     label: "Password",
     min: 6
   },
   passwordConfirmation: {
     type: String,
     min: 6,
     label: "Password Confirmation",
     custom: function() {
       if (this.value !== this.field('password').value) {
         return "passwordMissmatch";
       }
     }
   },
   profile: {
       type: UserSchema.UserProfile,
   },
 });
