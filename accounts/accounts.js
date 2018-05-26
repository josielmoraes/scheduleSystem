Router.route('/Usuario',{
	template:'usuario'
})

if(Meteor.isClient){
	

	Template.cadastroUsuario.helpers({
		'logado':function(l){
			Session.set('user',l)
		}
	})

	Template.cadastroUsuario.events({
		'submit form':function(event){
			console.log(Session.get('user'))
			Meteor.call('sendConfirmation', Session.get('user'));
		}
	})

}

if(Meteor.isServer){
	Meteor.methods({
		'sendConfirmation':function(user){
			Accounts.emailTemplates.siteName = "Sistem Horario";
			Accounts.emailTemplates.from     = "josielloureirodemoraes@gmail.com";

			Accounts.emailTemplates.verifyEmail = {
			  subject() {
			    return "[Sistem Horario] Email de verificacao";
			  },
			  text( user, url ) {
			    let emailAddress   = user.emails[0].address,
			        urlWithoutHash = url.replace( '#/', '' ),
			        supportEmail   = "support@godunk.com",
			        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

			    return emailBody;
			  }

			}
		}
	})
	
}