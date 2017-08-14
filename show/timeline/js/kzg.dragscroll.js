(function() {
	kzg.dragscroll = dragscroll;

	function dragscroll(el, ops) {
		$(el).on('mousedown', null, {
					config : ops
				}, h_drag_start);
	}

	function h_drag_start(e) {
		var config = e.data.config;
		config._x = e.pageX;
		config._y = e.pageY;
		$(document).on('mousemove', null, {
					el : this,
					config : config
				}, h_drag_do);
		$(document).on('mouseup', null, {
					el : this,
					config : config
				}, h_drag_end);
		config && config.start && config.start(e);
	}

	function h_drag_do(e) {
		// console.log('drag');
		var config = e.data.config;
		var data = calc_d(e);
		config && config.dragging && config.dragging(e, data);
	}

	function h_drag_end(e) {
		$(document).off('mousemove', h_drag_do);
		$(document).off('mouseup', h_drag_end);
		var config = e.data.config;
		var data = calc_d(e);
		config && config.end && config.end(e, data);
	}

	function calc_d(e) {
		var config = e.data.config;
		if (isNaN(config._x)) {
			return {
				dx : 0,
				dy : 0
			};
		}
		var data = {
			dx : e.pageX - config._x,
			dy : e.pageY - config._y
		};

		return data;
	}
})();
