

Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');
	console.log("inicio");
	Meteor.loginWithPassword('root','root123', function(e,r){
		if(e){
			console.log(e);
		}else{
			console.log(r);
			console.log('teste')
		}
	})
}

if(Meteor.isServer){
	//Meteor.users.remove("dybL6cvvwNpTNtPNM");
	var r={
		username:'root',
		permission:'0',
		email:'root@root.com.br',
		password:'root123',
	}
	if(!Meteor.users.findOne({username:r.username})){
		Accounts.createUser({
			username:r.username,
			email:r.email,
			password:r.password,
		});
	}else{
		var us=Meteor.users.findOne({username:r.username});
		console.log(r);
		console.log(us._id);
		Meteor.users.update({_id : us._id},{$set:{
			username:r.username,
			permission:r.permission,
			email:r.email,
			password:r.password,
		}},function(e,r){
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

