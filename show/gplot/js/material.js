(function() {
	kzg = {
		Engine : Engine,
		LineObj : LineObj,
		NodeObj : NodeObj
	};

	function log(x) {
		window.console && console.log(x);
		var el = document.getElementById('log');
		if (!el) {
			return;
		}
		el.value += x + '\n';
		el.scrollTop = 10000;
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
			if (!o){
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
	 * @config from
	 * @config angle relative to the from point
	 * @config to
	 * @config pit arrow in start(1)/end(0)/both(2) relative to from point
	 * @config speed
	 */
	function LineObj(ops) {
		var _this = this;
		var EG = Engine.get();
		var ps = [];
		var length;
		var speed = ops.speed;
		var from = ops.from;
		var angle = ops.angle;
		var pit = ops.pit;
		var el;
		var np;
		var el_arr1;
		var el_arr2;
		var isdone;
		var to = ops.to;
		var arrow_length = 10;
		var arrow_angle = 60;
		var eve_ls = [];
		var drawn_from;
		var drawn_to;

		function ctor() {
			def(ops, 'attr', {
						'stroke' : '#ccc',
						'stroke-width' : '2px',
						'stroke-linecap' : 'butt',
						'stroke-linejoin' : 'miter',
						'stroke-opacity' : 1
					});

			if (ops.offset) {
				drawn_from = EG.toXY(from, ops.offset, angle);
				drawn_to = EG.toXY(to, ops.offset, 180 + angle);
			} else {
				drawn_from = from;
				drawn_to = to;
			}

			if (pit) {
				draw_arrow(true);
			}

			length = EG.distance(drawn_from, drawn_to);

			for (var i = 0; i < length; i += speed) {
				ps.push({
							v : EG.toXY(drawn_from, i, angle)
						});
			}

			ps.push({
						v : drawn_to
					});

			// log('line obj:');
			// log(ops);

			on(_this, 'done', ops.done);

			_this.config = ops;
		}

		function draw_arrow(start_or_end) {
			var xy;
			var ag2;
			if (start_or_end) {
				xy = drawn_from;
				ag2 = angle;
			} else {
				xy = drawn_to;
				ag2 = 180 + angle;
			}
			var b = EG.csc(arrow_length, arrow_angle);
			var b1 = EG.sin(b, 90 - arrow_angle);
			var b2 = EG.cos(b, 90 - arrow_angle);
			// log(b1 + '<>' + b2);

			var agl = arrow_angle / 2;
			var al = EG.csc(arrow_length, agl);
			var xy1 = EG.toXY(xy, al, ag2 + agl);
			var xy2 = EG.toXY(xy, al, ag2 - agl);

			var el_arr = EG.canvas.path('M{0},{1}L{2},{3}L{4},{5}z', xy[0],
					xy[1], xy1[0], xy1[1], xy2[0], xy2[1]).attr({
						fill : ops.attr.stroke,
						// stroke :start_or_end?'red':'none'
						stroke : 'none'
					});

			if (start_or_end) {
				el_arr1 = el_arr;
			} else {
				el_arr2 = el_arr;
			}
		}

		this.addDependency = function(dir) {
			if (2 == pit) {
				log('addDependency:already is both direction');

				return false;
			}
			
			if (!pit && dir) {
				pit = 2;
				// add start arrow
				draw_arrow(true);
			}

			if (pit && !dir) {
				pit = 2;
				if (!isdone) {
					// let time line draw it					
				} else {
					// add end arrow
					draw_arrow(false);
				}
			}
			
			return pit == 2;
		};

		this.update = function(isstart, xy) {
			// update from to
			if (isstart) {
				from = xy;
			} else {
				to = xy;
			}

			// update angle
			angle = EG.toAngle(from, to);

			// update draw
			if (ops.offset) {
				drawn_from = EG.toXY(from, ops.offset, angle);
				drawn_to = EG.toXY(to, ops.offset, 180 + angle);
			} else {
				drawn_from = from;
				drawn_to = to;
			}

			EG.remove(el_arr1);			
			EG.remove(el_arr2);			
			EG.remove(el);
			el_arr1 && el_arr1.remove();
			el_arr1 = null;
			el_arr2 && el_arr2.remove();
			el_arr2 = null;
			el && el.remove();
			el = EG.l(drawn_from, drawn_to).attr(ops.attr);
			if (2 == pit) {				
				draw_arrow(true);
				draw_arrow(false);
			} else {
				draw_arrow(pit);
			}
		};

		this.draw = function(delta, r, EG) {
			var p = ps.shift();
			if (!p) {

				return;
			}
			if (!el) {
				el = EG.l(drawn_from, p.v).attr(ops.attr);
				// start
			} else {
				var path = el.attr('path');
				el.attr('path', path + 'L' + p.v[0] + ',' + p.v[1]);
			}

			np = p;

			if (0 === ps.length) {
				to = p.v;
				if (2 == pit || !pit) {
					draw_arrow(false);
				}
				isdone = true;
				fire(_this, 'done');
			}
		};

		ctor();
	}

	/**
	 * @config x
	 * @config y
	 * @config width
	 * @config height
	 * @config angle the main axle line angle for the emit out line, relative to
	 *         this node
	 * @config text
	 * @config icon icon image
	 * @config done handler when drawn is done
	 */
	function NodeObj(ops) {
		var _this = this;
		var img;
		var evls = [];
		var text_el;
		var x = ops.x;
		var y = ops.y;
		var indrag;
		var drag_x;
		var drag_y;
		var cur_x = x;
		var cur_y = y;

		function ctor() {
			def(ops, 'width', 20);
			def(ops, 'height', 20);

			// log('node obj:');
			// log(ops);

			on(_this, 'done', ops.done);
			_this.config = ops;
		}

		function e_click() {
			ops.click && ops.click(_this);
		}

		function e_hover_in() {
			ops.hover_in && ops.hover_in(_this);
		}

		function e_hover_out() {
			ops.hover_out && ops.hover_out(_this);
		}

		function update(dx, dy) {
			cur_x = x + dx;
			cur_y = y + dy;

			img.attr({
						x : cur_x - ops.width / 2,
						y : cur_y - ops.height / 2
					});
			if (text_el) {
				text_el.attr({
							x : cur_x,
							y : cur_y +  + ops.height
						});
			}
			fire(_this, 'move', {
						x : cur_x,
						y : cur_y
					});
		}

		this.draw = function(delta, r, eg) {
			if (!img) {
				img = r.image(ops.icon, x - ops.width / 2, y - ops.height / 2,
						ops.width, ops.height).attr({
							'cursor':'pointer'
						});
				img.click(e_click);
				img.hover(e_hover_in, e_hover_out);				
				img.drag(function(dx, dy, ox, oy) {
							indrag && update(dx, dy);
						}, function(ox, oy) {
							indrag = true;
							drag_x = ox;
							drag_y = oy;
						}, function() {
							indrag = false;
							x = cur_x;
							y = cur_y;
						});
				// text
				if (ops.text) {
					text_el = r.text(x, y + ops.height, ops.text).attr({
						fill:'#19A2AA',
						'font-size':'12px',
						stroke:'none',
						'font-family':'Verdana',
						'font-weight':'bold',
						'cursor':'pointer'
					});
					text_el.drag(function(dx, dy, ox, oy) {							
							indrag && update(dx, dy);
						}, function(ox, oy) {
							indrag = true;
							drag_x = ox;
							drag_y = oy;
						}, function() {
							indrag = false;
							x = cur_x;
							y = cur_y;
						});
				}
				fire(_this, 'done');
			}
		};

		/**
		 * add handler when this object been moved
		 */
		this.event_move = function(h) {
			on(_this, 'move', h);
		};

		this.dep_in_move = function(n) {
		};

		this.dep_out_move = function(n) {
		};

		ctor();
	}

	function def(obj, name, v) {
		obj[name] = obj[name] ? obj[name] : v;
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

})();