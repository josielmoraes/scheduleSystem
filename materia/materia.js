import Materia from "../imports/collections/materia";
import Tabular from 'meteor/aldeed:tabular';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs4';

Router.route('/Materia',{
	template: 'cadastroMateria'
})

new Tabular.Table({
  name: "Materia",
  collection: Materia,
  columns: [
    {data: "nomeMateria", title: "Matéria"},
    {data: "cargaHoraria", title: "C. Horaria"},
    {data: "aulaSemanal", title: "Aulas Semanal"}
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
	function campos(){
		$('#nomeMateria').val("");
		$('#cargaHorariaMateria').val("");
		$('#aulaSemanal').val("");
		$('#divisao').val(0);
		$('#Cadastrar').val("Cadastrar");
	     $('#Deletar').val("Voltar");
	}
	function validarDeletar(id){
		//futuro fazer validação de exclusao
		return true;
		var horarioSemanal= HorarioSemanal.find({idMateria:id}).fetch();
		if(horarioSemanal.length>0){
			$('#formCadastroMateria').validate().showErrors({
				erro:"Matéria relacionada com Horário Semanal"
			})
			return false
		}else{
			return true;
		}
		
	}
	Template.cadastroMateria.events({
		'click .input': function(event){
			event.preventDefault();
			var id=$(event.target).prop('id');	
			if(id=="Cadastrar"){
				var dadosMateria={
				   nomeMateria:$('#nomeMateria').val(),
				   cargaHoraria:$('#cargaHorariaMateria').val(),
				   aulaSemanal:$('#aulaSemanal').val()
				}
				var validar=$('#formCadastroMateria').valid();
				var evento=  $('#Cadastrar').val();
				if(evento=="Cadastrar" && validar==true){
					Meteor.call('criarMateria', dadosMateria);
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
					campos();
					Router.go('/');
				}else if(evento=="Deletar"){
					var id= Session.get('materia');
					if(validarDeletar(id._id)){
						Meteor.call('deletarMateria',id._id);
						campos();
					}
				}
			}else if(id=="limpar"){
				campos();
			}
			
		},

		'click tbody > tr': function (event,template) {
		    var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		    $('#nomeMateria').val(rowData.nomeMateria);
		    $('#cargaHorariaMateria').val(rowData.cargaHoraria);
		    $('#aulaSemanal').val(rowData.aulaSemanal)
		    $('#Cadastrar').val("Atualizar");
		    $('#Deletar').val("Deletar")
		    Session.set('materia',rowData);
		  }

	});
	
Template.cadastroMateria.onRendered(function(){
	$('#formCadastroMateria').validate({
		rules:{
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
		},
		messages:{
			nomeMateria:{
				required: " Campo obrigatório"
			},
			cargaHorariaMateria:{
				required: " Campo obrigatório",
				number: "Somente números"
			},
			aulaSemanal:{
				required: " Campo obrigatório",
				number: "Somente números"
			},
		}
	});
});

};

if(Meteor.isServer){
	Meteor.methods({
		'criarMateria': function(dadosMateria){
			Materia.insert({
				nomeMateria: dadosMateria.nomeMateria,
				cargaHoraria: dadosMateria.cargaHoraria,
				aulaSemanal:dadosMateria.aulaSemanal
			});
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
		}
	});
	

}

