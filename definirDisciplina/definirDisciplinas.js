import Semestre from "../imports/collections/semestre";

Router.route('/definirDisciplina',{
	template:'definirDisciplina'
})

if(Meteor.isClient){
	Template.definirDisciplina.helpers({
		'buscaTodosSemestres':function(){
			return Semestre.find();
			
		}
	})


}