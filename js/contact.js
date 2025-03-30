$(function () {
	var form = $('#contact-form');
	form.submit(function(event){
			event.preventDefault();
			var form_status = $('<div class="form_status"></div>');
			var name = $("#name").val(),
			phone = $("#phone").val(),
			email = $("#email").val(),
			msg = $("#msg").val(),
			datos = {"name":name, "phone":phone,"email":email,"msg":msg};
			$.ajax({
				url: "mail_handler.php",
				type: "POST",
				data: datos,
				beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
			}).done(function(respuesta){
				if (respuesta.state === "ok") {
					form_status.html('<p class="text-success">Mensaje enviado! Gracias . Pronto nos pondremos en Contacto con Usted!</p>').delay(3000).fadeOut();
					$('#name').val('');
					$('#phone').val('');
					$('#email').val('');
					$('#msg').val('');					
				}
		});
});
});