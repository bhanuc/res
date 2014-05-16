$(document).ready(function(){
	$("#createProjForm").submit(function(event) {
		event.preventDefault();
		var $form = $(this);
		var url = $form.attr( "action" );
		var term = $(this).serialize();
		var posting = $.post( url, term);
		posting.done(function( data ) {
			var content = $( data ).find( "#content" );
			if(content.prevObject.get(0)!=null){
	    		$("#result").empty().append("Project "+content.prevObject.get(0).name+ " has been created.");
	    		console.log(content.prevObject.get(0));
	    	}
	    	else {
	    		$("#result").empty().append(content.selector);
	    	}
	  });
	});
});