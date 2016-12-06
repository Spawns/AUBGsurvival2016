Meteor.methods({
    totalKills: function() {
        var kills = Meteor.users.aggregate([
            {
                $group: {_id : null, totalKills: {$sum: "$profile.kills"} }
            }
        ]);

        return  kills[0].totalKills;

    },

    assignTarget: function(hunterId){

        var hunter = Meteor.users.findOne({_id:hunterId});
        var users = Meteor.users.find({}, {sort: {"_id": 1}}).fetch();


            var notHunted =  Meteor.users.findOne({
                $and:[
                    {_id: {$ne: hunterId} },
                    {"profile.alive": true},
                    {"profile.hunters.0": {$exists: 0}},
                    {"profile.target": {$ne: hunterId}}
                ]
            });


        if(notHunted){
            var victim = notHunted;
        }
        //step 2 - assign the target and the hunter
        if(victim) {
            var victimHunters = victim.profile.hunters;
            victimHunters.push(hunterId);
            Meteor.users.update({_id: hunterId} , {$set: {"profile.target": victim._id}});//assign a target for the hunter
            Meteor.users.update({_id: victim._id} , {$set: {"profile.hunters": victimHunters}});//set the array with the new hunter in it
        } else {
            return;
        }
    },

    //THE METHOD FOR KILLING A USER AND ASSIGNING HIS TARGETS
    killTarget: function(inputToken){
        console.log("Method killUser has been called");
        var numberAliveUsers = Meteor.users.find({"profile.alive":true}).count();
        var currentUser = Meteor.users.findOne({_id:this.userId});// we have the current user
        var targetId = currentUser.profile.target; // we obtain the profile target
        var targetUser = Meteor.users.findOne({_id:targetId}); //we find the _id of the target


        if ((inputToken == targetUser.profile.token) && (currentUser.profile.alive == true) && (numberAliveUsers > 1)) {// the user's input is correct
            console.log("A user is being killed");
            var kills = currentUser.profile.kills;
            if(!kills){
                kills = 0;
            }
            var date = new Date();
            Meteor.users.update({_id:this.userId}, {$set: {"profile.kills": kills + 1}});
            Meteor.users.update({_id:this.userId}, {$set: {"profile.lastKill": new Date()}});
            Meteor.users.update({_id:targetId}, {$set: {"profile.alive":false}}); //assign a value of killed to the user
            var nameKiller = currentUser.profile.firstName + " " + currentUser.profile.lastName;
            var nameTarget = targetUser.profile.firstName + " " + targetUser.profile.lastName;
            var stringForInsert = nameKiller + " has just killed " + nameTarget;
            Events.insert({
                "createdOn": new Date(),
                "event":  stringForInsert,
            });

            //Now go the array of his target and delete the entry with the killed user's name
            var nextTargetId = targetUser.profile.target;// we obtain the next target
            var nextTargetUser = Meteor.users.findOne({_id:nextTargetId});
            var numberUsers = Meteor.users.find({}).count();
            // End of deleting
            //the case with the killer is specific - so we handle it in a different way
            //he has the right on the target's target
            if ((nextTargetId != this.userId) && (this.userId != nextTargetUser.profile.target) || ((numberUsers > 2) && (numberAliveUsers == 2))) {//check if the next target is not the user himself
                console.log("We are assigning the next target");
                Meteor.users.update({_id:nextTargetId}, {$set:{"profile.hunters": this.userId} });
                //the killer has the right to obtain the target
                Meteor.users.update({_id:this.userId}, {$set: {"profile.target":nextTargetId}}); //assign a value of killed to the user
                return nextTargetUser.profile.lastName + " " + nextTargetUser.profile.firstName;
            }
            else{//NEVER REACH THIS POINT
                console.log("Things are going out of control in the algorithm!")
                Meteor.users.update({_id:userId}, {$set: {"profile.target":null}});
                Meteor.call("assignTarget", userId);
            }

        }
        else {//if it is not correct, throw an exception
            throw new Meteor.Error( 400, 'Bad request' );
        }// end of the block for the user's input

    },


    getInfo: function(targetId){
        var user = Meteor.users.findOne({_id:this.userId});
        if(user) {
            target = Meteor.users.findOne({_id: user.profile.target});
            if(target){
                var res = {target:target.profile.lastName + " " + target.profile.firstName , token: user.profile.token  };
                return  res;
            }
        }
    },

    toggleGameState: function() {
        var gameState = GameState.findOne({});
        gameState.state = !gameState.state;
        console.log(gameState.state);
        GameState.update({_id: gameState._id}, {$set: {state: gameState.state}});
    },

    startGame: function(){
        var allUsers = Meteor.users.find({}).fetch();
        for(var position = 1; position < allUsers.length; position += 1){
            if(position == allUsers.length - 1){
                var firstUserId = allUsers[1]._id;
                var lastUserId = allUsers[allUsers.length - 1]._id;
                Meteor.users.update({_id:lastUserId}, {$set: {"profile.target":firstUserId}});
                Meteor.users.update({_id:firstUserId}, {$set: {"profile.hunters":lastUserId}});
            }
            else{
                var currentUserId = allUsers[position]._id;
                var nextUserId = allUsers[position + 1]._id;

                Meteor.users.update({_id:currentUserId}, {$set: {"profile.target":nextUserId}});
                Meteor.users.update({_id:nextUserId}, {$set: {"profile.hunters":currentUserId}});
            }

        }
    },

    winner: function(){
        var topUsersArray = Meteor.users.find({}, {sort: {"profile.kills": -1, "profile.lastKill": 1}, limit: 3}).fetch();

        //we should obtain an array of three elements in order to return them to the ranking
        if(topUsersArray){
            return topUsersArray;
        }
        else{
            return;
        }


    },

    deleteUser: function(targetUser){
        if ((targetUser) && (Roles.userIsInRole(this.userId, ['admin']))) {
            Meteor.users.remove({_id:targetUser});
            Meteor.call('startGame');//reassign all users
        }
        else{
            return;
        }
        
    }

}); //end Methods
