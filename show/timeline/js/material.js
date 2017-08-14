(function() {
	kzg.svg = {
		Engine : Engine,
		ViewObj : ViewObj
	};

	function log(m) {
		window.console && console.log(m);
	}

	var add_day = kzg.add_day;
	var diff_day = kzg.diff_day;

	function Engine(ops) {
		var _this = this;

		if (ops.el && 'string' == typeof(ops.el)) {
			ops.el = document.getElementById(ops.el);
		}
		if (!ops.el) {
			throw new Error('error:el not passed in.');

			return;
		}

		var r = Raphael(ops.el, ops.width, ops.height);
		var objs = [];
		var start = 0;
		var handle;
		var width = ops.width;
		var height = ops.height;

		this.start = function() {
			if (handle) {
				return;
			}
			draw();
		};

		this.stop = function() {
			if (handle) {
				clearTimeout(handle);
				handle = null;
			}
		};

		this.getHeight = function() {
			return height;
		};
		this.getWidth = function() {
			return width;
		};

		this.setSize = function(w, h) {
			if (w) {
				r.setSize(w, _this.getHeight());
			}
			if (h) {
				r.setSize(_this.getWidth(), h);
			}
		};

		this.clear = function() {
			r.clear();
			start = 0;
			handle = null;
			objs = [];
		};

		function draw() {
			var current = new Date().getTime(), delta = current - start;

			for (var io in objs) {
				objs[io] && objs[io].draw(delta, r, _this);
			}

			handle = setTimeout(draw, 1000 / 16);
		}

		this.l = function(p1, p2) {
			return r.path('M{0},{1}L{2},{3}', p1[0], p1[1], p2[0], p2[1]);
		};

		this.canvas = r;

		this.ls = function(vs) {
			// log(vs);
			var fmtstr = 'M';
			for (var i = 0; i < vs.length; i++) {
				if (i > 0) {
					fmtstr += 'L';
				}
				var v = vs[i];
				// console.log(ofv * pvrlength);
				fmtstr += v[0] + ',' + v[1];
			}
			// log(fmtstr);
			return r.path(fmtstr);
		}

		function c(p, d) {
			d = d ? d : 2;
			return r.circle(p[0], p[1], d);
		}

		this.push = function(o) {
			objs.push(o);
		};

		this.remove = function(o) {
			if (!o) {
				return;
			}
			for (var i in objs) {
				if (objs[i] === o) {
					objs[i] = null;

					return;
				}
			}
		};

		this.each = function(fn) {
			for (var i in objs) {
				var rt = fn(objs[i]);
				if (rt) {
					return rt;
				}
			}

			return false;
		};

		Engine.instance = _this;

		this.distance = function(from, to) {
			return Math.sqrt(Math.pow((from[0] - to[0]), 2)
					+ Math.pow((from[1] - to[1]), 2));
		};

		this.toAngle = function(from, to) {
			var x = to[0] - from[0];
			var y = to[1] - from[1];

			var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
			var cos = x / hypotenuse;
			var radian = Math.acos(cos);
			var angle = 180 / (Math.PI / radian);
			if (y < 0) {
				angle = -angle;
			} else if ((y == 0) && (x < 0)) {
				angle = 180;
			}
			return angle;
		};

		this.toXY = function(from, length, angle) {
			return [from[0] + _this.cos(length, angle),
					from[1] + _this.sin(length, angle)];
		};

		this.atan = function(n) {
			return Math.atan(n) / 0.017453293;
		};

		this.ctan = function(l, a) {
			return l / Math.tan(a * 0.017453293);
		};

		this.tan = function(l, a) {
			return l * Math.tan(a * 0.017453293);
		};

		this.cos = function(l, a) {
			return l * Math.cos(a * 0.017453293);
		};

		this.sec = function(l, a) {
			return l / Math.sin(a * 0.017453293);
		};

		this.csc = function(l, a) {
			return l / Math.cos(a * 0.017453293);
		};

		this.sin = function(l, a) {
			return l * Math.sin(a * 0.017453293);
		};
	}

	Engine.get = function() {
		return Engine.instance;
	};

	function PorjectObj() {
	}

	function CoorXObj() {
	}

	function CoorYObj() {
	}

	/**
	 * @config start Date
	 * @config scope days from start, note, if its value is 1, it only contain
	 *         the start day, same so forth
	 */
	function ViewObj(ops) {
		var _this = this;
		var scope = ops.scope;
		var start = ops.start;
		var el_x;
		var el_y;
		var done;
		var buffer = [];
		var projs = ops.data.projects;
		var note_disc = ops.data.notes_and_discussions;
		var x_days = {};
		var y_projs = {};
		var cx_y;
		var cy_x;
		var cx_x;
		var last_date;
		var bez_offset_x = ops.bez_offset_x;
		var bez_offset_y = ops.bez_offset_y;

		function ctor() {
			scope = def(ops, 'scope', 31);

			_this.config = ops;
		}

		this.draw = function(delta, r, EG) {
		};

		this.render = function(EG, data) {
			var r = EG.canvas;

			// draw coordination
			draw_coord(r, EG);
			// log($.toJSON(projs));
			draw_projects(r, EG);
			draw_note_disc(r, EG);
			// draw porjects
		};

		this.remove = function() {
			var el;
			while (el = buffer.pop()) {
				el.remove();
			}
		};

		function x_unit_move(x, count) {
			x += ops.x_unit_width * count;

			return x;
		}

		function do_proj(p, r, EG) {
			var str;
			var data = [];
			var pre2_point = null;
			for (var k in p.points) {
				var pin = p.points[k];
				var date = kzg.str_2date(k);
				var previous_make = false;

				var x = x_days[k];
				var yv = cx_y - pin.active_tasks_nb * ops.y_unit;
				if (yv < 0) {
					log('E-----');
					log(pin.yv);
					log(k);
				}
				if (isNaN(x)) {
					if (1 == diff_day(ops.start, date)) {
						//draw start gap area
						//						p.previous_point = [cy_x - ops.x_unit_width / 2, yv];
						x = x_unit_move(cy_x, -0.5);
						previous_make = true;
					}else if (2 == diff_day(ops.start, date)) {
						//this point is used for Bezier Curve control point(up or down trend)
						pre2_point = [x_unit_move(cy_x, -1.5),yv];
						continue;
					} else {
						//						log('ERROR:' + k);
						//						log('ERROR:' + date);
						//						log(diff_day(last_date, date));
						continue;
					}
				}

				if (p.start_date == k) {
					//start from zero
					if (!previous_make) {
						data.push([x_unit_move(x, -1), cx_y]);
					}
				}

				data.push([x, yv]);

				if (p.end_date == k && date < last_date) {
					//end down to zero
					data.push([x_unit_move(x, 1), cx_y]);
				}

				if (!y_projs[k] || y_projs[k] > yv) {
					y_projs[k] = yv;
				}
			}
			
			if (!data.length){
				//this may happen, because we fetch data 2 days earlier from the ops.start, it may include project which end in this day
				return;
			}

			var bgpp;
			var next_point;
			for (var i = 0, ii = data.length; i < ii; i++) {
				var xy = data[i];
				var control1;
				var control2;

				var x = xy[0];
				var y = xy[1];
				if (!i) {		
					if(pre2_point){
						var xy2 = data[i + 1];
						var a = getAnchors(pre2_point[0], pre2_point[1], x, y, xy2[0], xy2[1]);						
						control1 = [a.x2,a.y2];
					}else{
						control1 = [x,y];		
					}								
					bgpp = ["M", x, cx_y, "L", x, y, "C", control1[0], control1[1]];
				}else if (i && i < ii - 1) {
					var xy1 = data[i - 1];
					var xy2 = data[i + 1];
					// bgpp = bgpp.concat([xy1[0]+15,xy1[1]-15, x-15, y+15,
					// x,y]);
					var a = getAnchors(xy1[0], xy1[1], x, y, xy2[0], xy2[1]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
//					r.circle(a.x1, a.y1, 1).attr({fill: "green", stroke: 'none'});
//            		r.circle(a.x2, a.y2, 1).attr({fill: "red", stroke: 'none'});
//            		r.circle(x,y, 1).attr({fill: "black", stroke: 'none'});
				}
			}
			// last one
//			var xy2 = data[i + 1];
//			var a = getAnchors(pre2_point[0], pre2_point[1], x, y, xy2[0], xy2[1]);						
//			control1 = [a.x2,a.y2];
			control2 = [x,y];
			bgpp = bgpp.concat([control2[0], control2[1], x, y, "L", x, cx_y, "Z"]);
			buffer.push(r.path(bgpp).attr(ops.attrs.project).attr('fill', p.hexcolor));
		}
		
		function draw_projects(r, EG) {
			if (!projs) {
				return;
			}
			// projects
			for (var i = 0; i < projs.length; i++) {
				var proj = projs[i];

				do_proj(proj, r, EG);
			}
		}

		function draw_note_disc(r, EG) {
			if (!note_disc) {
				return;
			}
			for (var i = 0, count = note_disc.length; i < count; i++) {
				var n = note_disc[i];
				var date = n.date;
				var notes = n.notes;
				var disc = n.discussions;
				var x = x_days[date];
				if (isNaN(x)){
					continue;
				}

				// notes
				var ymax = y_projs[date];
				if (isNaN(ymax)) {
					ymax = cx_y;
				}
				// log(date + ':' + ymax);

				var r_with_note = ops.width_note / 2;
				var y_now = null;
				for (var j = 0, jcount = notes.length; j < jcount; j++) {
					var nt = notes[j];
					if (!y_now) {
						y_now = ymax - ops.y_offset_note - r_with_note;
					} else {
						y_now -= (ops.width_note + ops.y_space_note);
					}
					buffer.push(r.rect(x - r_with_note, y_now - r_with_note,
							ops.width_note, ops.width_note)
							.attr(ops.attrs.notes).attr('fill',
									nt.project_hexcolor));
				}

				// discuss
				var y_d_now = null;
				for (var t = 0, tcount = disc.length; t < tcount; t++) {
					var d = disc[t];

					if (!y_d_now) {
						y_d_now = ymax;
					} else {
						y_d_now -= ops.y_space_discussion;
					}
					buffer.push(EG.l([x, y_d_now], [x, y_d_now - ops.y_space_discussion])
							.attr(ops.attrs.discussion).attr('stroke',
									d.project_hexcolor));
				}
			}
		}

		function draw_coord(r, EG) {
			// x

			// x line start y
			cx_y = EG.getHeight() - ops.x_offset_to_bottom;
			// x line start x
			cy_x = ops.x_start;
			// x line end x
			cx_x = ops.x_end;
			// text y
			var text_y = cx_y + ops.x_text_y_offset_to_xline;
			// month text y
			var month_text_y = text_y + ops.x_month_text_y_offset_to_xtext;

			// point and text
			var start_date;
			for (var i = 0; i < scope; i++) {
				start_date = new Date(start.getTime());
				start_date.setDate(start.getDate() + i);
				var day = start_date.getDate();

				var point_x = cy_x + i * ops.x_unit_width + ops.x_unit_width
						/ 2;

				var day_key = kzg.date_str(start_date);
				x_days[day_key] = point_x;

				// point
				buffer.push(r.circle(point_x, cx_y, ops.x_point_radius)
						.attr(ops.attrs.xpoint));

				// text
				buffer.push(r.text(point_x, text_y, day)
						.attr(ops.attrs.x_point_text));

				// month text
				var mon = start_date.getMonth() + 1;
				if (1 == day) {
					var text = ops.lang18.month[mon];

					// year text
					if (1 == mon) {
						text = start_date.getFullYear() + ' ' + text;
					}
					buffer.push(r.text(point_x, month_text_y, text)
							.attr(ops.attrs.x_month_text));
				}
			}
			last_date = start_date;
			log(kzg.date_str(ops.start) + '<>' + kzg.date_str(start_date));
			// line
			buffer.push(EG.l([cy_x, cx_y], [cx_x, cx_y])
					.attr(ops.attrs.x_coor_line));

			// y
			// y line start y
			// var cy_y = ops.y_offset_to_top;
			// buffer.push(EG.l([cy_x,cy_y],[cy_x,cx_y]).attr(ops.attrs.y_coor_line));
		}

		ctor();
	}

	function def(obj, name, v) {
		obj[name] = obj[name] ? obj[name] : v;

		return obj[name];
	}

	function fire(o, n, d) {
		var eve_ls = o._eve_ls;
		if (!eve_ls) {
			return;
		}
		var eves = eve_ls[n];
		if (!eves) {
			return;
		}
		for (var i in eves) {
			var f = eves[i];
			f && f(o, d);
		}
	}

	function on(o, n, f) {
		if (!f) {
			return;
		}
		var eve_ls = o._eve_ls;
		if (!eve_ls) {
			eve_ls = {};
			o._eve_ls = eve_ls;
		}
		var eves = eve_ls[n];
		if (!eve_ls[n]) {
			eves = [];
			eve_ls[n] = eves;
		}
		eves.push(f);
	};

	function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
		var l1 = (p2x - p1x) / 2, l2 = (p3x - p2x) / 2, a = Math
				.atan((p2x - p1x) / Math.abs(p2y - p1y)), b = Math
				.atan((p3x - p2x) / Math.abs(p2y - p3y));
		a = p1y < p2y ? Math.PI - a : a;
		b = p3y < p2y ? Math.PI - b : b;
		var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2, dx1 = l1
				* Math.sin(alpha + a), dy1 = l1 * Math.cos(alpha + a), dx2 = l2
				* Math.sin(alpha + b), dy2 = l2 * Math.cos(alpha + b);
		return {
			x1 : p2x - dx1,
			y1 : p2y + dy1,
			x2 : p2x + dx2,
			y2 : p2y + dy2
		};
	}
})();