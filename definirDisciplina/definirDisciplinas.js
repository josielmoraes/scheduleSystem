import Semestre from "../imports/collections/semestre";
import Materia from "../imports/collections/materia";
import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Area from '../imports/collections/area';
import Processo from "../imports/collections/processo";

Router.route('/definirDisciplina',{
	template:'definirDisciplina'
})
new Tabular.Table({
  name: "Oferta",
  collection: OfertaMateria,
  columns: [
  	{data:"nomeProcesso()", title:"Processo"},
  	{data:"nomeMateria()", title:"Materia"},
  	{data:"nomeArea()", title:"Area"},
    ],
    extraFields:[
    	'Processo','Materia','Area',
    ],
   	responsive: true,
	autoWidth: false,
	language:{
			"decimal":        "",
		    "emptyTable":     "Nao há dados disponível",
		    "info":           "Mostrando de _START_ a _END_ de _TOTAL_ registros",
		    "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
		    "infoFiltered":   "(filtrado um total de  _MAX_  registros)",
		    "infoPostFix":    "",
		    "thousands":      ",",
		    "lengthMenu":     "Exibindo _MENU_ registros por página",
		    "loadingRecords": "Carregando...",
		    "processing":     "Processando...",
		    "search":         "Procurar:",
		    "zeroRecords":    "Não encontrado nenhum registro",
		    "paginate": {
		        "first":      "Primeira",
		        "last":       "Última",
		        "next":       "Próxima",
		        "previous":   "Anterior"
		    },
	}
  })
OfertaMateria.helpers({
	nomeMateria:function(){
		var a=Materia.findOne({_id:this.Materia})
		return a.nomeMateria;
	},
	nomeProcesso:function(){
		var b= Processo.findOne({_id:this.Processo})
		return "";
	},
	nomeArea:function(){
		var c= Area.findOne({_id:this.Area})
		return c.nome;
	}

})
if(Meteor.isClient){
	Template.cadastroOfertaDisciplina.onCreated(function(){
		Session.set('mostrar',false);
	})

	Template.cadastroOfertaDisciplina.helpers({
		
		 settings: function() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Materia,
		          field: 'nomeMateria',
		          template: Template.materiaAuto
		        }
		      ],

		    }
  		},
  		settings2() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Area,
		          field: 'nome',
		          template: Template.areaAuto
		        }
		      ],
		      
		    }
  		},
  		select:function(){
  			console.log("entrou");
  			var processo= $('#processoSelecionado').val()
  			console.log(processo)
  			return {Processo:processo}
  		},
  		mostrar(){
  			return Session.get('mostrar');
  		}
  		
	})
	Template.cadastroOfertaDisciplina.events({
		'submit form':function(event){
			event.preventDefault();
			console.log("entrou");
			var mat= Session.get('materiaSelecionada');
			var processo= $('#processoSelecionado').val();
			var area=Session.get('areaSelecionada');
			console.log(mat._id+" "+processo);
			Meteor.call('cadastrarOfertaMateria',mat._id,processo,area._id);
		},
		"autocompleteselect #materia": function(event, template, doc) {
		    Session.set('materiaSelecionada',doc)
		    console.log(doc);
		  },
		  "autocompleteselect #area": function(event, template, doc) {
		    Session.set('areaSelecionada',doc)
		    console.log(doc);
		  },
	});
	Template.buscaSemestre.helpers({
		'buscaTodosSemestres':function(){
			return Semestre.find();
		},
	})
	Template.buscaProcesso.helpers({
		'buscaTodosProcessos':function(){
			return Processo.find({etapas:0});
		},
	})
	Template.buscaProcesso.events({
		'change #processoSelecionado':function(event){
			var sem=event.target.value;	
			if(sem==""){
				//$('#cadastrar').attr('disabled',true);
				Session.set('mostrar',false);
			}else{			
				Session.set('processo', event.target.value);
				//$('#cadastrar').attr('disabled',false);
				Session.set('mostrar',true);
			}
		},
		
	})

}
if(Meteor.isServer){
	Meteor.methods({
		'cadastrarOfertaMateria':function(Materia, Processo, Area){
			OfertaMateria.insert({
				Materia:Materia,
				Processo:Processo,
				Area:Area
			})
		},
		'oferta':function(idM){
		}
	})

	
}