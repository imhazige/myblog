(function() {

	kzg.bellcurve = {

	};

	function log(m) {
		window.console && console.log(m);
	}

	var Engine = kzg.svg.Engine;
	var ViewObj = kzg.svg.ViewObj;
	var EG;

	var mocked_datas;
	var views = [];

	var attrs = {
		// x coordination line
		x_coor_line : {
			'stroke' : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		},
		x_grid_line : {
			'stroke' : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 0.2
		},
		// x point text
		x_point_text : {
			fill : '#19A2AA',
			'font-size' : '12px'
		},
		y_point_text : {
			fill : '#19A2AA',
			'font-size' : '12px'
		},
		curve : {
			'stroke' : '#19A2AA',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		},
		area : {
			'stroke' : 'none',
			fill : '#19A2AA',
			'fill-opacity' : 0.2
		},
		mp_control : {
			'stroke' : '#03406A',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'cursor' : 'w-resize',
			'stroke-opacity' : 0.5
		},
		left_control : {
			'stroke' : '#A62D00',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'cursor' : 'w-resize',
			'stroke-opacity' : 0.5
		},
		right_control : {
			'stroke' : '#469400',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'cursor' : 'w-resize',
			'stroke-opacity' : 0.5
		},
		control_text : {
			fill : '#000',
			'font-size' : '12px'
		}
	};

	var ids = {
		canvas : null,
		txt_sd : null,
		txt_median : null,
		slider_stand_deviation : null,
		slider_median : null,
		txt_area : null
	};

	var view;

	function init() {
		for (var k in ids) {
			ids[k] = document.getElementById(k);
		}

		var el = ids.canvas;

		var view_width = $(el).width();
		var view_height = $(el).height();
		new Engine({
					el : el,
					width : view_width,
					height : view_height
				});
		EG = Engine.get();

		var x_unit = 5;
		var x_count = 100 / x_unit;
		var x_start = 20;
		var x_offset_to_right = 20;
		var x_offset_to_bottom = 60;

		var y_unit = 10;
		var y_count = 100 / y_unit;
		var ops = {
			x_unit_width : (view_width - x_start - x_offset_to_right) / x_count,
			x_start : x_start,
			x_unit : x_unit,
			x_offset_to_bottom : x_offset_to_bottom,
			y_unit : y_unit,
			y_unit_height : (view_height - x_offset_to_bottom - 20) / y_count,
			attrs : attrs,
			x_text_y_offset_to_xline : 10,
			y_text_x_offset_to_yline : -10,
			mp_control_offset_bottom : 50,
			mp_control_offset_top : -10,
			lr_control_offset_bottom : 50,
			lr_control_offset_top : -10,
			str_x_vlaue : str_x_vlaue,
			str_y_vlaue : str_y_vlaue
		};
		view = new ViewObj(ops);
		// log(ops.y_unit_height);

		silder(ids.txt_sd, ids.slider_stand_deviation, 50, 1, 10, function(v) {
					var m = $(ids.txt_median).val() * 100;
					var r = view.calcMeanZ(m, m, v);
					return 100 > r;
				});
		silder(ids.txt_median, ids.slider_median, 99, 1, 50, function(v) {
					var r = view.calcMeanZ(v, v, $(ids.txt_sd).val() * 100);
					return 100 > r;
				});
				
		view.onchange(function(o, d) {
					$(ids.txt_median).val(str_x_vlaue(d.mean));
					$(ids.txt_sd).val(str_x_vlaue(d.stand_deviation));
					$(ids.slider_median).slider("value", d.mean);
					$(ids.txt_area).val(str_x_vlaue(d.area,5));
				});		

		view.render(EG);		
	}

	function update() {
		view.update($(ids.txt_median).val() * 100, $(ids.txt_sd).val() * 100);
	}

	function str_x_vlaue(v,d) {
		var t = v / 100 + '';

		if (isNaN(d)){
			d = 4;
		}
		if (t.length > d) {
			t = t.substring(0, d);
		}

		return t;
	}

	function str_y_vlaue(v) {
		var t = v / 10 + '';
		
		if (t.length > 4) {
			t = t.substring(0, 4);
		}
		
		return t;
	}

	function silder(id_txt, id, max, min, v, check) {
		var d = id;
		var txt = id_txt;

		$(d).slider({
					range : "min",
					value : v,
					min : min,
					max : max,
					slide : function(event, ui) {
						var v = str_x_vlaue(ui.value);
						if (!check(ui.value)) {
							return false;
						}
						$(txt).val(v);
						update();
					}
				});
		$(txt).val(str_x_vlaue($(d).slider("value")));
	}

	$(init);
})();