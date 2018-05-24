

Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');
}
})