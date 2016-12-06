Template.navbar.events({
    "click .js-logout": function(event){
        if (Meteor.userId()) {
            Meteor.logout(function() {
                Session.set("userTarget" , null);
                Session.set("personalToken" , null);
            });
        }
    }
})
