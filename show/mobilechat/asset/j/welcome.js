(function() {
	var ids = {
		btnLinkReq : null,
		frm1 : null
	};

	function init() {
		for (var k in ids) {
			ids[k] = document.getElementById(k);
		}
		$(ids.btnLinkReq).click(function() {
					$(ids.frm1).removeClass('hidden-desktop');
				});
		init_validate();
	}

	function init_validate() {
		$(ids.frm1).validate({
			rules : {
				username : {
					minlength : 2,
					required : true
				},
				email : {
					required : true,
					email : true
				}
			},
			messages : {
				username : {
//					minlength : jQuery
//							.format("At least {0} characters required!")
					minlength : 'Why your name is so short?'		
				},
				email : {
					required : "We need your email address to send token to you"
				}
			},
			highlight : function(element) {
				$(element).closest('.control-group').removeClass('success')
						.addClass('error');
			},
			success : function(element) {
				element.text('OK!').addClass('valid').closest('.control-group')
						.removeClass('error').addClass('success');
			}
		});
	}

	$(init);
})();