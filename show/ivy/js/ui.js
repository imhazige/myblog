(function() {

	var EG;
	var el;

	function init() {
		color_pick('color_ivy', '#008000');
		color_pick('color_leaf', '#008000');
		color_pick('color_flower', '#e3d7f4');
		silder('txt_width', 'slider_range_width', 10, 1, 1);
		silder('txt_unit', 'slider_range_unit', 200, 10, 60);

		silder('txt_angle', 'slider_range_angle', 360, 0, 90);
		silder('txt_growth', 'slider_range_growth', 10, 1, 10);

		el = $('#ivy');
		EG = new kzg.Engine({
					el : 'ivy'
				});

		$('#create').click(start);
		$('#stop').click(function() {
					EG.stop();
				});
		$('#reset').click(function() {
					EG.clear();
				});

	}

	function silder(id_txt, id, max, min, v) {
		var d = document.getElementById(id);
		var txt = document.getElementById(id_txt);

		$(d).slider({
					range : "min",
					value : v,
					min : min,
					max : max,
					slide : function(event, ui) {
						$(txt).val(ui.value);
					}
				});
		$(txt).val($(d).slider("value"));
	}

	function color_pick(id, v) {
		var d = document.getElementById(id);
		$(d).val(v);
		$(d).miniColors({
					change : function(hex, rgb) {

					},
					open : function(hex, rgb) {

					},
					close : function(hex, rgb) {

					}
				});
	}

	function start() {
		var msg = '';
		
		$('#tip1').css('display','none');

		var speed = parseInt($('#txt_growth').val());

		if (!speed || 10 < speed || 1 > speed) {
			msg += 'growth must between 1 - 10\n';
			$('#txt_growth').addClass('error');
		} else {
			$('#txt_growth').removeClass('error');
		}

		var think = parseInt($('#txt_width').val());
		if (!think || 10 < think || 1 > think) {
			msg += 'ivy width must between 1 - 10\n';
			$('#txt_width').addClass('error');
		} else {
			$('#txt_width').removeClass('error');
		}
		var color = $('#color_ivy').val();
		var leaf_color = $('#color_leaf').val();
		var flower_color = $('#color_flower').val();

		var angle = parseInt($('#txt_angle').val());
		if (isNaN(angle) || 360 < angle || 0 > angle) {
			msg += 'ivy angle must between 0 - 360\n';
			$('#txt_angle').addClass('error');
		} else {
			$('#txt_angle').removeClass('error');
		}
		var unit_length = parseInt($('#txt_unit').val());
		if (!unit_length || 200 < unit_length || 10 > unit_length) {
			msg += 'ivy unit length must between 10 - 200\n';
			$('#txt_unit').addClass('error');
		} else {
			$('#txt_unit').removeClass('error');
		}

		var left = parseInt($('#txt_x').val());
		if (isNaN(left) || el.width() < left || 0 > left) {
			msg += 'x must between 0 - ' + el.width() + '\n';
			$('#txt_x').addClass('error');
		} else {
			$('#txt_x').removeClass('error');
		}

		var top = parseInt($('#txt_y').val());
		if (isNaN(top) || el.height() < top || 0 > top) {
			msg += 'y must between 0 - ' + el.height() + '\n';
			$('#txt_y').addClass('error');
		} else {
			$('#txt_y').removeClass('error');
		}

		if (msg) {
			$('#tip').html(msg);

			return;
		}

		EG.push(new kzg.Ivy({
					width : el.width(),
					height : el.height(),
					speed : speed,
					think : think,
					color : color,
					leaf_color : leaf_color,
					flower_color : flower_color,
					angle : angle,
					unit_length : unit_length,
					left : left,
					top : top
				}));
		EG.start();		
	}

	$(init);
})();