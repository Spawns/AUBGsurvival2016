Router.configure({
    layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function(){
  this.name = 'home';
	this.render("navbar", {to: "navbar"});
    this.render("home", {to: "main"});

});
Router.route("/dashboard", function(){
    this.name = 'dashboard';
    this.render("navbar", {to: "navbar"});
    this.render("userDashboard", {to: "main"});

});

Router.route("/signup", function(){
    this.name = 'signup';
    this.render("navbar", {to: "navbar"});
    this.render("register", {to: "main"});

});

Router.route("/signin", function(){
    this.name = 'signin';
    this.render("navbar", {to: "navbar"});
    this.render("signin", {to: "main"});

});

Router.route("/admin", function(){
    this.name = 'admin';
    this.render("navbar", {to: "navbar"});
    this.render("adminDashboard", {to: "main"});

});

Router.route("/ranking", function(){
    this.name = 'ranking';
    this.render("navbar", {to: "navbar"});
    this.render("ranking", {to: "main"});

});

Router.route("rules", function() {
  this.name = 'rules';
  this.render("navbar", {to: "navbar"});
  this.render('rules' , {to: 'main'})

});

Router.route("reset-password", function(){
  this.name = 'reset-password';
  this.render("navbar", {to: "navbar"});
  this.render('passwordRecovery' , {to: 'main'})
});



//authentication hooks
var mustBeAdmin = function() {
    if(!Meteor.user() || !Roles.userIsInRole(Meteor.userId() , ['admin'])) {
        Router.go('/');
    }else{
        this.next();
    }
};

var mustBeSignedIn = function() {
  if (!Meteor.userId()) {
    Router.go('/');
  } else {
    this.next();
  }
};

var mustNotBeSignedIn = function() {
  if(Meteor.user()) {
      Router.go('/');
  } else {
      this.next();
  }
};





Router.onBeforeAction(mustBeSignedIn, {only: ['dashboard']});
Router.onBeforeAction(mustNotBeSignedIn, {only: ['signin', 'signup']});
Router.onBeforeAction(mustBeAdmin, {only: ['admin']});
