import Materia from "../imports/collections/materia";
import Tabular from 'meteor/aldeed:tabular';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs4';
import SubMateria from '../imports/collections/submateria'
import OfertaMateria from "../imports/collections/ofertaMateria";

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
	
	
	
	

	Template.cadastroMateria.helpers({
		'habilitarSubMateria': function(){
			var evento= $('#Cadastrar').val();
			console.log("Habilitar sub materia");
			var index=$('#divisao').val()
				var array= new Array(index);
				for(x=0;x<index;x++){
					array[x]=x+1;
					console.log("ind "+index+" ar "+array[x]);
				}	
			if(evento=="Cadastrar"){
				return array;
			}else if(evento=="Atualizar"){
				
				return array;
			}

		},
		'condicional':function(){
			return Template.instance().variavelReac.get();
		},
		'preencher':function(){
			var rowData=Session.get('materia');
			    var sub;
				var carga;
				var aula;
				var result=SubMateria.find({codMateria:rowData.codMateria},{sort:{ordem:1}}).fetch();
				//const result=Meteor.subscribe('subMateriaBuscaCodigo',rowData.codMateria);
				console.log(result);
			    for(x=0;x<result.length;x++){
					sub='#subNome'+result[x].ordem;
					carga='#cargaHoraria'+result[x].ordem;
					aula='#aulasSemanal'+result[x].ordem;
					console.log(sub+" "+carga+" "+aula);
					console.log(result[x].subNome+" "+result[x].cargaHoraria+" "+result[x].aulasSemanal)
					$(sub).val(result[x].subNome);
					$(carga).val(result[x].cargaHoraria);
					$(aula).val(result[x].aulasSemanal);
				}
			},
		'setarSubmateriasCadastrar':function(){
			var materias;
			var mat=[];
			var sub;
			var carga;
			var aula;
			var cod=Session.get('codMateria');
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
		},
		'campos':function (){
			$('#codMateria').val("");
			$('#nomeMateria').val("");
			$('#cargaHorariaMateria').val("");
			$('#aulaSemanal').val("");
			$('#Cadastrar').val("Cadastrar");
		    $('#Deletar').val("Voltar");
		    $('#formCadastroMateria').validate().resetForm();
		    $('#erro').val("");
		},
		
		'permissao':function(valor){
			if(valor==0)
				return true;
		},
		validarDeletar:function(){
			var id=Session.get('materia');
			var a= OfertaMateria.find({Materia:id._id}).fetch();
			var sair;
			var v="";
			 $('#erro').val("");
			if(a.length>0){
				v="Matéria em oferta ";
				sair= false;
			}else{
				sair= true;
			}
			$('#formCadastroMateria').validate().showErrors({
					erro:v
			})
			return (sair && sair2)
		},
		validarCodigoAtualizar:function(){
			var c;
			var a;
			var cod=Session.get('materia');
			console.log('cod anti '+cod.codMateria);
			console.log('cod novo '+$('#codMateria').val());
			if(cod==$('#codMateria').val()){
				console.log("codAtualizar");
				return true;
			}else{
				cod=$('#codMateria').val();
				console.log(cod);
				a=Materia.find({codMateria:cod}).fetch();
				if(a.length>0){
					$('#formCadastroMateria').validate().showErrors({
					erro:"Código cadastrado"
					})

					return false;
				}else{
					$('#formCadastroMateria').valid()
					return true;
				}
			}

		},
		validarCodigoCadastro:function(){
			var cod=$('#codMateria').val();
			console.log(cod);
			var a=Materia.find({codMateria:cod}).fetch();
				if(a.length>0){
					$('#formCadastroMateria').validate().showErrors({
					erro:"Código cadastrado"
					})
					return false;
				}else{
					console.log("true");
					return true;
				}

		}

	})

	Template.cadastroMateria.onCreated(function(){
		Template.instance().variavelReac= new ReactiveVar(false);
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
				Session.set('codMateria',dadosMateria.codMateria);
				var validar=$('#formCadastroMateria').valid();

				var evento=  $('#Cadastrar').val();
				if(evento=="Cadastrar" && validar==true){
					if(Template.cadastroMateria.__helpers.get('validarCodigoCadastro').call()){
						Meteor.call('cadastrarMateria',dadosMateria);
						Template.cadastroMateria.__helpers.get('campos').call();
					}
				}else if(evento=="Atualizar" && validar==true){
					if(Template.cadastroMateria.__helpers.get('validarCodigoAtualizar').call()){
						var id= Session.get('materia');
						Meteor.call('atualizarMateria',id._id,dadosMateria);
						Template.cadastroMateria.__helpers.get('campos').call();
					}
				}
			}else if(id=="Deletar"){
				var evento=  $('#Deletar').val();
				console.log(evento);
				if(evento=="Voltar"){
					$('#formCadastroMateria').validate().resetForm();
					Template.cadastroMateria.__helpers.get('campos').call();
					Router.go('/');
				}else if(evento=="Deletar"){
					var id= Session.get('materia');
					if(Template.cadastroMateria.__helpers.get('validarDeletar').call()){
						Meteor.call('deletarMateria',id._id);
						Template.cadastroMateria.__helpers.get('campos').call();
					}
				}
			}else if(id=="limpar"){
				Template.cadastroMateria.__helpers.get('campos').call();
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
		    Session.set('materia',rowData)
			//Template.instance().variavelReac.set(true);
			

		  },

		  'change #divisao':function(event){
		  	var b=$(event.target ).val();
		  	if(b==0){
		  		//trigger.set(false);
		  		Template.instance().variavelReac.set(false);
		  	}else{
		  		//trigger.set(true);
		  		Template.instance().variavelReac.set(true);
		  	}
		  },


	});
	
	Template.cadastroMateria.onRendered(function(){
		console.log("redn")
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
				aulaSemanal:dadosMateria.aulaSemanal,
				codMateria:dadosMateria.codMateria,
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

