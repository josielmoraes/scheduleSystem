import Semestre from "../imports/collections/semestre";
import Materia from "../imports/collections/materia";
import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Area from '../imports/collections/area'


var array=[];

Router.route('/definirDisciplina',{
	template:'definirDisciplina'
})
new Tabular.Table({
  name: "Oferta",
  collection: array,
  columns: [
  	{data:"semestre.anoLetivo", title:"Semestre"},
  	{data:"Materia", title:"Matéria"},
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


if(Meteor.isClient){
	

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
		          //matchAll: true,
		          template: Template.materiaAuto
		        }
		      ],

		    }
  		},
  		settings2: function() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Area,
		          field: 'nome',
		          //matchAll: true,
		          template: Template.areaAuto
		        }
		      ],
		      
		    }
  		},
  		
		reactiveDataFunction:function(){
			dataTableData = function () {
			    var t= OfertaMateria.find().fetch();
				var a;
				for(x=0;x<t.length;x++){
					var mat= Materia.findOne({_id:t[x].Materia});
					a=mat._id;
					var sem=Semestre.findOne({_id:t[x].Semestre});
					var area=Area.findOne({_id:t[x].Area});
					aux={
						materia:mat,
						semestre:sem,
						area:area,
						}
				//console.log(aux);
				array[x]=aux;
			}
			console.log(array);
			    return array; // or .map()
			}	
			
			return dataTableData;
		},
		optionsObject:{
			 columns: [{
			        title: 'Semestre',
			        data:'semestre.anoLetivo',
			    }, 
			    {
			        title: 'Materia',
			        data:'materia.nomeMateria'
			    },
			     {
			        title: 'Area',
			        data:'area.nome'
			    }
			    ],
			    
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
		}
	})
	Template.cadastroOfertaDisciplina.events({
		'submit form':function(event){
			event.preventDefault();
			console.log("entrou");
			var mat= Session.get('materiaSelecionada');
			var semes= Session.get('semestreSelecionado');
			semes=Semestre.findOne({_id:semes});
			var area=Session.get('areaSelecionada');
			console.log(mat._id+" "+semes.anoLetivo);
			Meteor.call('cadastrarOfertaMateria',mat._id,semes._id,area._id);
		


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
	Template.buscaSemestre.events({
		'change #semestreSelecionado':function(event){
			var sem=event.target.value;
			if(sem==""){
				$('#cadastrar').attr('disabled',true);
			}else{			
				console.log(sem);
				Session.set('semestreSelecionado', event.target.value);
				$('#cadastrar').attr('disabled',false);
			}
		},
		
	})

}
if(Meteor.isServer){
	Meteor.methods({
		'cadastrarOfertaMateria':function(Materia, Semestre, Area){
			OfertaMateria.insert({
				Materia:Materia,
				Semestre:Semestre,
				Area:Area
			})
		},
		'oferta':function(idM){
			var t=OfertaMateria.agreggate({
				$match:{Materia:idM},
				$group:{nomeMate:'$nomeMateria'}
			})
			console.log(t);
		}
	})

	
}