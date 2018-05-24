import Materia from "../imports/collections/materia";
import Tabular from 'meteor/aldeed:tabular';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs4';
import SubMateria from '../imports/collections/submateria'


Router.route('/Materia',{
	template: 'cadastroMateria'
})

new Tabular.Table({
  name: "Materia",
  collection: Materia,
  columns: [
 	{data: "codMateria", title: "Código"},
    {data: "nomeMateria", title: "Matéria"},
    {data: "cargaHoraria", title: "C. Horaria"},
    {data: "aulaSemanal", title: "Aulas Semanal"},
    {data: "dividirMateria", title: "Qtde de submateria"}
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
	$('input').attr('autocomplete','off');
	const trigger = new ReactiveVar(false);
	const idMateria = new ReactiveVar();
	function campos(){
		$('#codMateria').val("");
		$('#nomeMateria').val("");
		$('#cargaHorariaMateria').val("");
		$('#aulaSemanal').val("");
		$('#divisao').val(0);
		trigger.set(false);
		$('#Cadastrar').val("Cadastrar");
	    $('#Deletar').val("Voltar");
	    $('#formCadastroMateria').validate().resetForm();
	}
	function validarCodigo(cod){
		//futuro fazer validação de exclusao
		console.log(cod);
		var materiaCodigo= Materia.find({codMateria:cod}).fetch();
		if(materiaCodigo.length>0){
			$('#formCadastroMateria').validate().showErrors({
				codMateria:"Código cadastrado"
			})
			return false
		}else{
			return true;
		}
		
	}
	function teste(){
		trigger.set(true);
	}
	function setarSubmateriasCadastrar(cod){
		var materias;
		var mat=[];
		var sub;
		var carga;
		var aula;
		console.log("Entrou");
		var a=$('#divisao').val();
		for(x=1;x<=a;x++){
			sub='#subNome'+x;
			carga='#cargaHoraria'+x;
			aula='#aulasSemanal'+x;
			console.log(sub+" "+carga+" "+aula);
			mat[x-1]={
				codMateria:cod,
				subNome:$(sub).val(),
				cargaHoraria:$(carga).val(),
				aulasSemanal:$(aula).val(),
				ordem:x
			}
		}
		for(x=0;x<mat.length;x++){
			console.log(mat[x]);
			Meteor.call('cadastrarSubMateria',mat[x]);
		}
		
	}
	Template.cadastroMateria.onCreated(function(){

	})

	
	Template.cadastroMateria.events({
		'click .input': function(event){
			event.preventDefault();
			var id=$(event.target).prop('id');	
			if(id=="Cadastrar"){
				var dadosMateria={
					codMateria:$('#codMateria').val(),
				    nomeMateria:$('#nomeMateria').val(),
				    cargaHoraria:$('#cargaHorariaMateria').val(),
				    aulaSemanal:$('#aulaSemanal').val(),
				    dividirMateria:$('#divisao').val()
				}
				//var validar=true;
				var validar=$('#formCadastroMateria').valid();
				validar=validarCodigo(dadosMateria.codMateria);
				var evento=  $('#Cadastrar').val();
				if(evento=="Cadastrar" && validar==true){
					Meteor.call('cadastrarMateria',dadosMateria);
					setarSubmateriasCadastrar(dadosMateria.codMateria);
					campos()
				}else if(evento=="Atualizar" && validar==true){
					var id= Session.get('materia');
					Meteor.call('atualizarMateria',id._id,dadosMateria);
					campos();
				}
			}else if(id=="Deletar"){
				var evento=  $('#Deletar').val();
				console.log(evento);
				if(evento=="Voltar"){
					$('#formCadastroMateria').validate().resetForm();
					campos();
					Router.go('/');
				}else if(evento=="Deletar"){
					var id= Session.get('materia');
					Meteor.call('deletarMateria',id._id);
					campos();
				}
			}else if(id=="limpar"){
				campos();
			}
			
		},

		'click tbody > tr': function (event,template) {
		    var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		    $('#codMateria').val(rowData.codMateria);
		    $('#nomeMateria').val(rowData.nomeMateria);
		    $('#cargaHorariaMateria').val(rowData.cargaHoraria);
		    $('#aulaSemanal').val(rowData.aulaSemanal);
		    $('#divisao').val(rowData.dividirMateria);
		    $('#Cadastrar').val("Atualizar");
		    $('#Deletar').val("Deletar")
		    Session.set('materia',rowData);
		    var sub;;
			var carga;
			var aula;
			var result=SubMateria.find({codMateria:rowData.codMateria},{sort:{ordem:1}}).fetch();
			//const result=Meteor.subscribe('subMateriaBuscaCodigo',rowData.codMateria);
			console.log(result);
			
		    for(x=0;x<result.length;x++){
				sub='#subNome'+result[x].ordem;
				carga='#cargaHoraria'+result[x].ordem;
				aula='#aulasSemanal'+result[x].ordem;
				$(sub).val(result[x].subNome);
				$(carga).val(result[x].cargaHoraria);
				$(aula).val(result[x].aulasSemanal);
			}
			//teste();
			Template.subMateria.__helpers.get('habilitarSubMateria').call();
			console.log(trigger.get());
		  },
		  'change #divisao':function(event){
		  	console.log("change combo")
		  	var b=$(event.target ).val();
		  	if(b==0){
		  		//trigger.set(false);
		  		Session.set('t',false);
		  	}else{
		  		//trigger.set(true);
		  		Session.set('t',true);
		  	}
		  },


	});
	
	Template.cadastroMateria.onRendered(function(){
			$('#formCadastroMateria').validate({
				rules:{
					codMateria:{
						required: true
					},
					nomeMateria:{
						required: true
					},
					
					cargaHorariaMateria:{
						required: true,
						number:true
					},
					aulaSemanal:{
						required: true,
						number:true
					},

					subNome1:{
							required: true,
						},
					cargaHoraria1:{
						required: true,
						number:true
					},
					aulasSemanal1:{
						required: true,
						number:true
					},

					subNome2:{
							required: true,
					},
					aulasSemanal2:{
						required: true,
						number:true
					},
					cargaHoraria2:{
						required: true,
						number:true
					},

					subNome3:{
							required: true,
					},
					cargaHoraria3:{
						required: true,
						number:true
					},
					aulasSemanal3:{
						required: true,
						number:true
					},

					subNome4:{
							required: true,
					},
					cargaHoraria4:{
						required: true,
						number:true
					},
					aulasSemanal4:{
						required: true,
						number:true
					},
				},
				messages:{
					codMateria:{
						required: "Campo obrigatório"
					},
					nomeMateria:{
						required: "Campo obrigatório"
					},
					cargaHorariaMateria:{
						required: "Campo obrigatório",
						number: "Somente números"
					},
					aulaSemanal:{
						required: "Campo obrigatório",
						number: "Somente números"
					},

					subNome1:{
							required: "Campo obrigatório",
						},
					cargaHoraria1:{
						required: "Campo obrigatório",
						number:"Somente números"
					},
					aulasSemanal1:{
						required: "Campo obrigatório",
						number:"Somente números"
					},

					subNome2:{
						required: "Campo obrigatório",
					},
					aulasSemanal2:{
						required:"Campo obrigatório",
						number:"Somente números"
					},
					cargaHoraria2:{
						required: "Campo obrigatório",
						number:"Somente números"
					},

					subNome3:{
						required: "Campo obrigatório",
					},
					cargaHoraria3:{
						required: "Campo obrigatório",
						number:"Somente números"
					},
					aulasSemanal3:{
						required:"Campo obrigatório",
						number:"Somente números"
					},

					subNome4:{
						required: "Campo obrigatório",
					},
					cargaHoraria4:{
						required:"Campo obrigatório",
						number:"Somente números"
					},
					aulasSemanal4:{
						required:"Campo obrigatório",
						number:"Somente números"
					},
				}
			});
			Template.subMateria.__helpers.get('habilitarSubMateria').call();
	});
	Template.subMateria.onCreated(function(){
		//trigger.set(false);
		//console.log(trigger.get());
		Session.set('t',false);
		console.log('Created '+Session.get('t'));
	})
	Template.subMateria.onRendered(function(){
		var a=$('#divisao').val()
		if(a!=0){
			Session.set('t',false);
			console.log('Renderer '+Session.get('t'));
		}
	})

	Template.subMateria.helpers({
		'habilitarSubMateria': function(){
			var evento= $('#Cadastrar').val();
			console.log(evento);
			if(evento=="Cadastrar"){
				var index=$('#divisao').val()
				var array= new Array(index);
				for(x=0;x<index;x++){
					array[x]=x+1;
					console.log("ind "+index+" ar "+array[x]);
				}
				
				return array;
			}

		},
		'condicional':function(){
			//console.log(trigger.get());
			//return trigger.get();
			console.log('condicional '+Session.get('t'));
			return Session.get('t');
		},
		'aux':function(){
			//Session.set('t',false);
			console.log('aux '+Session.get('t'));
		},
		
	});

};

if(Meteor.isServer){
	Meteor.methods({
		'cadastrarMateria': function(dadosMateria){
			 Materia.insert({
			 	codMateria:dadosMateria.codMateria,
				nomeMateria: dadosMateria.nomeMateria,
				cargaHoraria: dadosMateria.cargaHoraria,
				aulaSemanal:dadosMateria.aulaSemanal,
				dividirMateria:dadosMateria.dividirMateria
			},function(e,r){
				if(e){
					console.log(e)
				}else{
					console.log(r);
				}
			});
			
		},
		'main':async function(dados){
			console.log("entrou");
			let res = await criarMateria(dados);
			console.log(res);
		},
		'atualizarMateria': function(id,dadosMateria){
			Materia.update({_id:id},{
				nomeMateria: dadosMateria.nomeMateria,
				cargaHoraria: dadosMateria.cargaHoraria,
				aulaSemanal:dadosMateria.aulaSemanal
			});
		},
		'deletarMateria': function(id){
			Materia.remove({_id:id});
		},
		'cadastrarSubMateria':function(dados){
			SubMateria.insert({
				codMateria:dados.codMateria,
				subNome:dados.subNome,
				cargaHoraria:dados.cargaHoraria,
				aulasSemanal:dados.aulasSemanal,
				ordem:dados.ordem
			})
		},
		'buscarSubMateria':function(cod){
			return SubMateria.find({codMateria:cod},{sort:{ordem:1}});
		}
	});
	Meteor.publish('subMateriaBuscaCodigo',function(cod){
		var t=SubMateria.find({codMateria:cod},{sort:{ordem:1}});;
		console.log(t);
		return t;
	})
	

}

