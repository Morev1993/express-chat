$(document).ready(function() {
	$('.login-form').on('submit', function() {
		var form = $(this);

		console.log('submit');

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

	})
});