 $(document).ready(function() {
   
   //left-side clicks
   $(".state a").click(function(){
   
	var parentTr = $(this).parentsUntil('tr').parent();
   
	//Change state mode
	if(parentTr.hasClass('deleted')) {
	
		//Change state to "unread"
		parentTr.removeClass('unread read deleted');
	}	
	
	parentTr.toggleClass('unread');
   
	return false;
   });
   
   //right-side clicks
   $(".trash a").click(function(){
   
   var parentTr = $(this).parentsUntil('tr').parent();
   
   //Change state mode
   if(parentTr.hasClass('deleted')) {
	
	//Change state to "read"
	parentTr.removeClass('deleted unread read'); 
   
   //TODO: llamadas a backend
   
   } else {
		parentTr.removeClass('unread').addClass('deleted');
	}
	
	return false;
   });

   $('#addRow').click(function(){

    var msg = getServerData();
   	console.log(msg);
   	$('#inbox tbody').append('<tr class="unread"><td><input type="checkbox"/></td>' +
        '<td class="state"><span></span><a href="#">Click</a></td>' + 
        '<td class="subject"><a href="#" title="Pulse para cambiar de estado">'+ msg.subject +'</a></td>' +
        '<td class="date">06-07-2012</td>'+
        '<td class="trash"><a href="#">Del</a></td></tr>');
   		
   		//Se añade al DOM pero no tiene comportamiento, tendríamos que añadir los eventos a mano.

   	return false;
   });
   
 });

 //Simulate ajax call:
function getServerData() {
	return {'subject': 'Click my icons! See, no events :( [' + Math.random() + ']' };
}