(function() {
	kzg.svg = {
		Engine : Engine,
		ViewObj : ViewObj
	};

	function log(m) {
		window.console && console.log(m);
	}

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

	/**
	 * @config start Date
	 * @config scope days from start, note, if its value is 1, it only contain
	 *         the start day, same so forth
	 */
	function ViewObj(ops) {
		var _this = this;
		var el_x;
		var el_y;
		var el_curve;
		var el_mp_control;
		var el_left_control;
		var el_right_control;
		var el_area;
		var el_mp_text;
		var done;
		var buffer = [];
		var cx_y;
		var cy_x;
		var cx_x;
		var cy_top;
		var mp;
		var lp;
		var rp;
		var stand_deviation;
		var curve_x_unit;
		var x_unit_count;
		var y_unit_count;
		var EG;
		var orgin_mpv;
		var str_x_vlaue = ops.str_x_vlaue;
		var str_y_vlaue = ops.str_y_vlaue;

		function ctor() {
			EG = kzg.svg.Engine.get();
			scope = def(ops, 'scope', 31);
			def(ops, 'x_unit_width', 10);

			stand_deviation = 10;
			mp = {
				v : 50
			};
			lp = {
				v: mp.v - 3 * stand_deviation
			};
			rp = {
				v: mp.v + 3 * stand_deviation
			};
			curve_x_unit = 0.5;

			_this.config = ops;
		}

		this.draw = function(delta, r, EG) {
		};

		this.render = function(EG) {
			var r = EG.canvas;

			// draw coordination
			draw_coord(r, EG);
			draw_curve(r, EG);
			draw_mp_control(r, EG);
			draw_lr_controls(r, EG);
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

		function draw_coord(r, EG) {
			// x
			x_unit_count = 100 / ops.x_unit;
			// x line start y
			cx_y = EG.getHeight() - ops.x_offset_to_bottom;
			// x line start x
			cy_x = ops.x_start;
			// x line end x
			cx_x = cy_x + ops.x_unit_width * x_unit_count;
			//
			y_unit_count = 100 / ops.y_unit;
			cy_top = cx_y - y_unit_count * ops.y_unit_height;
			// text y
			var text_y = cx_y + ops.x_text_y_offset_to_xline;
			// month text y
			var month_text_y = text_y + ops.x_month_text_y_offset_to_xtext;

			// point and text
			for (var i = 1; i <= x_unit_count; i++) {
				var cx = cy_x + ops.x_unit_width * i;
				var point_x = cx;
				var xv = str_x_vlaue(i * ops.x_unit);

				// // point
				// buffer.push(r.circle(point_x, cx_y, ops.x_point_radius)
				// .attr(ops.attrs.xpoint));

				// grid line
				EG.l([cx, cx_y], [cx, cy_top]).attr(ops.attrs.x_grid_line);

				// text
				buffer.push(r.text(point_x, text_y, xv)
						.attr(ops.attrs.x_point_text));

			}
			// line
			buffer.push(EG.l([cy_x, cx_y], [cx_x, cx_y])
					.attr(ops.attrs.x_coor_line));

			for (var i = 1; i <= y_unit_count; i++) {
				var cy = cx_y - ops.y_unit_height * i;
				var point_y = cy;
				var yv = str_y_vlaue(i * ops.y_unit);

				// // point
				// buffer.push(r.circle(point_x, cx_y, ops.x_point_radius)
				// .attr(ops.attrs.xpoint));

				// grid line
				EG.l([cy_x, cy], [cx_x, cy]).attr(ops.attrs.x_grid_line);

				// text
				buffer.push(r.text(cy_x + ops.y_text_x_offset_to_yline,
						point_y, yv).attr(ops.attrs.y_point_text));

			}
			// y
			// y line start y
			buffer.push(EG.l([cy_x, cy], [cy_x, cx_y])
					.attr(ops.attrs.y_coor_line));
		}

		function x_with(v) {
			return ops.x_unit_width / ops.x_unit * v;
		}
		
		function x_value(x) {
			return x * ops.x_unit / ops.x_unit_width ;
		}

		function x(v) {
			return cy_x + x_with(v);
		}

		function y_height(v) {
			return ops.y_unit_height / ops.y_unit * v;
		}

		function y(v) {
			return cx_y - y_height(v);
		}
		
		function yx(x){
			return y(_this.calcMeanZ(x, mp.v, stand_deviation));
		}

		function draw_curve(r, EG) {
			// log(NormalDensityZx(50,50,1));
			// return;
			var path = 'M';
			for (var i = 0; i <= 100; i += curve_x_unit) {
				if (i) {
					path += 'L';
				}
				path += x(i) + ','
						+ yx(i);
			}
			if (!el_curve) {
				el_curve = EG.l([0, 0], [0, 0]).attr(ops.attrs.curve);
			}
			// log(path);
			el_curve.attr('path', path);
		}

		function draw_mp_control(r, EG) {
			var mx = x(mp.v);
			if (!el_mp_control) {
				el_mp_control = EG.l([0, 0], [0, 0]).attr(ops.attrs.mp_control);
				var indrag;
				el_mp_control.drag(function(dx, dy, ox, oy) {
							indrag && h_mp_drag(dx, dy);
						}, function(ox, oy) {
							indrag = true;
							orgin_mpv = mp.v;
						}, function() {
							indrag = false;
						});
			}
			var by = cx_y + ops.mp_control_offset_bottom;
			el_mp_control.attr('path', 'M' + mx + ','
							+ (cy_top + ops.mp_control_offset_top) + 'L' + mx
							+ ',' + by);
			
			if (!el_mp_text){
				el_mp_text = r.text(0,0,'').attr(ops.attrs.control_text); 
			}
			el_mp_text.attr({'text':str_x_vlaue(mp.v),x:mx,y:by + 2});										
		}
		
		function draw_control(r,EG,el,attr,pd){
			var mx = x(pd.v);
			if (!el) {
				el = EG.l([0, 0], [0, 0]).attr(attr);
				var indrag;
				el.drag(function(dx, dy, ox, oy) {
							indrag && h_control_drag(el,pd,dx, dy);
						}, function(ox, oy) {
							indrag = true;
							pd.orgin = pd.v;
						}, function() {
							indrag = false;
						});
			}
			var by = cx_y + ops.lr_control_offset_bottom;
			el.attr('path', 'M' + mx + ','
							+ (cy_top + ops.lr_control_offset_top) + 'L' + mx
							+ ',' + by);
			if (!pd.txtel){
				pd.txtel = r.text(0,0,'').attr(ops.attrs.control_text); 
			}
			pd.txtel.attr({'text':str_x_vlaue(pd.v),x:mx,y:by + 2});
							
			return el;				
		}

		function draw_lr_controls(r, EG) {
			el_left_control = draw_control(r,EG,el_left_control,ops.attrs.left_control,lp);
			el_right_control = draw_control(r,EG,el_right_control,ops.attrs.right_control,rp);
			
			//
			var x0 = Math.min(lp.v,rp.v);
			var x1 = Math.max(lp.v,rp.v);
			
			var path = 'M' + x(x0) + ',' + y(0) + 'L' + x(x0) + ',' + yx(x0);
			var drawdx;
			for (var i = x0; i <= x1; i += curve_x_unit) {
				path += 'L';
				path += x(i) + ','
						+ yx(i);
				drawdx = i;						
			}			
			if (drawdx < x1){
				path += 'L' + x(x1) + ',' + yx(x1);
			}
			path += 'L' + x(x1) + ',' + y(0) + 'Z';
			if (!el_area) {
				el_area = EG.l([0, 0], [0, 0]).attr(ops.attrs.area);
			}
			// log(path);
			el_area.attr('path', path);
			firechange();
		}
		
		function h_control_drag(el,pd,dx,dy){
			var orgin_mpv = pd.orgin;
			var nv = orgin_mpv + x_value(dx);
			if (0>=nv || nv >= 100){
				return;
			}
			pd.v = nv;			
			draw_lr_controls(EG.canvas, EG);
		}
		
		function h_mp_drag(dx,dy){
			var nv = orgin_mpv + x_value(dx);
			if (0>=nv || nv >= 100){
				return;
			}
			_this.update(nv,stand_deviation);
		}

		this.update = function(m, sd) {
			mp.v = m;
			stand_deviation = sd;

			draw_curve(EG.canvas, EG);
			draw_mp_control(EG.canvas, EG);
			draw_lr_controls(EG.canvas, EG);
			firechange();
		};
		
		function firechange(){
			var x0 = Math.min(lp.v,rp.v);
			var x1 = Math.max(lp.v,rp.v);
			
			var area = StandardNormalQx(x1,mp.v,stand_deviation) - StandardNormalQx(x0,mp.v,stand_deviation);
			area = Math.abs(area*100);
			
			fire(_this,'onchange',{
				mean:mp.v,
				stand_deviation:stand_deviation,
				area:area
			});
		}
		
		this.calcMeanZ = function(x,mean,sd){
			return NormalDensityZx(x,mean,sd) * 1000;
		};
		
		this.onchange = function(fn){
			on(_this,'onchange',fn);
		};

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

	function NormalDensityZx(x, Mean, StdDev) {
		//see http://upload.wikimedia.org/math/1/7/4/174897095c6dc9e304a02a2d0d7b04d2.png
		var a = x - Mean;
		return Math.exp(-(a * a) / (2 * StdDev * StdDev))
				/ (Math.sqrt(2 * Math.PI) * StdDev);
	}
	function NormalDensityStandrdDev(x, Mean,z) {
		//see http://upload.wikimedia.org/math/1/7/4/174897095c6dc9e304a02a2d0d7b04d2.png
		var a = x - Mean;
		return Math.exp(-(a * a) / (2 * StdDev * StdDev))
				/ (Math.sqrt(2 * Math.PI) * StdDev);
	}
	function StandardNormalQx(x,Mean, StdDev) {
		x = (x-Mean)/StdDev;
		if (x === 0) // no approximation necessary for 0
			return 0.50;

		var t1, t2, t3, t4, t5, qx;
		var negative = false;
		if (x < 0) {
			x = -x;
			negative = true;
		}
		t1 = 1 / (1 + (0.2316419 * x));
		t2 = t1 * t1;
		t3 = t2 * t1;
		t4 = t3 * t1;
		t5 = t4 * t1;
		qx = NormalDensityZx(x, 0, 1)
				* ((0.319381530 * t1) + (-0.356563782 * t2)
						+ (1.781477937 * t3) + (-1.821255978 * t4) + (1.330274429 * t5));
		if (negative == true)
			qx = 1 - qx;
		return qx;
	}
})();