import Area from '../imports/collections/area'
import Tabular from 'meteor/aldeed:tabular';
Router.route('/Area',{
	template:'cadastroArea'
})

new Tabular.Table({
  name: "Area",
  collection: Area,
  columns: [
    {data: "nome", title: "Nome"},
    {data: "sigla", title: "Sigla"},
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
		$('#areaNome').val("");
		$('#areaSigla').val("");
		$('#cadastrar').val("Cadastrar");
		 $('#deletar').val("Voltar");
	}
	Template.cadastroArea.events({
		'click .input':function(event){
		event.preventDefault();
		var id=$(event.target).prop('id');
		console.log(id);
		if(id=="cadastrar"){
			var dadosArea={
				nome: $('#areaNome').val(),
		    	sigla:$('#areaSigla').val()
			}
			console.log(dadosArea)
			var cadastrar=$('#cadastrar').val();
			validar=$('#formCadastroArea').valid();
			console.log(validar);
			if(cadastrar=="Cadastrar" && validar){
				console.log("entrou");
				Meteor.call('cadastrarArea',dadosArea);
			}else if(cadastrar=="Atualizar" && validar) {
				var aux= Session.get("area");
				Meteor.call('atualizarArea',aux._id,dadosArea);
			}
			if(validar){
				campos();
			}
		}else if(id=="deletar"){
			var deletar=$('#deletar').val();
			if(deletar=="Voltar"){
				Router.go('/');
			}else if(deletar=="Deletar"){
				var aux= Session.get("area");
				Meteor.call('deletarArea',aux._id);
				campos();
			}
		}else if(id=="limpar"){
			campos();
		}
	},
	'click tbody > tr': function (event,template) {
		var dataTable = $(event.target).closest('table').DataTable();
		var rowData = dataTable.row(event.currentTarget).data();
		    $('#areaNome').val(rowData.nome);
		    $('#areaSigla').val(rowData.sigla);
		    $('#cadastrar').val("Atualizar");
		    $('#deletar').val("Deletar");
		    $('#formCadastroArea').valid();
		    Session.set("area",rowData);
	},

	})

	Template.cadastroArea.onRendered(function(){
		$('#formCadastroArea').validate({
			rules:{
				areaNome:{
					required: true,
					
				},
				areaSigla:{
					required: true,
					
				},
			},
			messages:{
				areaNome:{
					required: "Campo obrigatório",
					
				},
				areaSigla:{
					required: "Campo obrigatório",
					
				},
			}
		});

	})

}

if(Meteor.isServer){
Meteor.methods({
	'cadastrarArea':function(dadosArea){
		Area.insert({
			nome: dadosArea.nome,
			sigla: dadosArea.sigla,
		})
	},

	'atualizarArea':function(id,dadosArea){
		Area.update({_id:id},{
			nome: dadosArea.nome,
			sigla: dadosArea.sigla,
		})
	},
	'deletarArea':function(id){
		Area.remove({_id:id})
	}
})

}