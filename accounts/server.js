import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'




Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');
	console.log("inicio");
	//Meteor.logout();
	Meteor.loginWithPassword('root','root1234', function(e,r){
		if(e){
			console.log(e);
		}else{
			console.log(r);
			console.log('teste')
		}
	})
}

if(Meteor.isServer){
	//Meteor.users.remove("oTGN6duJhHA3MNE9G");
	var us=Meteor.users.find().fetch();
		console.log(us);
	var r={
		username:'root',
		email:'josielloureirodemoraes@gmail.com',
		password:'root1234',
		profile:{
			permission:0
		}
	}
	if(!Meteor.users.findOne({username:r.username})){
		Accounts.createUser({
			username:r.username,
			email:r.email,
			password:r.password,
			
		}, function(e,r){
			if(e){

			}else{
				Console.log('certo');
			}
		});
	}else{
		//Meteor.users.remove({_id:'PbstQoaKfpPEhzrwz'})
		
		var us=Meteor.users.findOne({username:r.username});
		console.log(r);
		console.log(us._id);
		Meteor.users.update({_id : us._id},{$set:{
			profile:r.profile
		}
		},function(e,r){
			if(e){
				console.log(e);
			}else{
				console.log(r);
				console.log('teste')
			}
		})
		
		
	}
	

}

})
