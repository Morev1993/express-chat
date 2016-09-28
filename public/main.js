$(document).ready(function() {

	(function() {
		$('.login-form').on('submit', function() {
			var form = $(this);

			$.ajax({
				url: '/login',
				method: 'POST',
				data: form.serialize(),
				complete: function() {
					console.log('ок');
				},
				statusCode: {
					200: function(res) {
						form.html('Вы вошли на сайт');
						window.location.href = '/chat';
						console.log(res);
					},
					403: function(jqXHR) {
						var error = JSON.parse(jqXHR.responseText);
						$('.error', form).html(error.message);
					}
				}
			});

			return false;

		});
	})();

	(function() {
		var socket = io.connect();

	    /*socket.on('news', function (data) {
	      console.log(data);
	      socket.emit('my other event', { my: 'data' });
	    });*/

    	$('.chat-form').on('submit', function() {
    		var form = $(this);

    		var value = form.find('input').val();

    		socket.emit('message', value, function(data) {
				$('.messages').append('<li>' + data + '</li>');
    		});
    		form.find('input').val('');

    		return false;
    	});

    	socket.on('message', function (data) {
	    	$('.messages').append('<li>' + data + '</li>');
	  	});
	})();
});