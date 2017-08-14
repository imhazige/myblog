/**
 * author:Ka
 * 
 * email: admin@ig2net.info
 * 
 */
(function() {
	kzg = {
		Engine : Engine,
		Ivy : Ivy
	};

	function log(x) {
		console && console.log(x);
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
			for (var i in objs) {
				if (objs[i] === o) {
					objs[i] = null;

					return;
				}
			}
		};

		Engine.instance = _this;
	}

	Engine.get = function() {
		return Engine.instance;
	};

	/**
	 * height:required width:required
	 */
	function Ivy(ops) {
		var _this = this;

		var EG = Engine.get();

		// the interval between every draw
		var gap = ops.interval ? ops.interval : 32;
		// the grow length for every draw
		var speed = ops.speed ? ops.speed : 6;
		ops.think = ops.think ? ops.think : 1;
		ops.color = ops.color ? ops.color : '#008000';
		ops.leaf_color = ops.leaf_color ? ops.leaf_color : '#008000';
		ops.flower_color = ops.flower_color ? ops.flower_color : '#e3d7f4';
		ops.unit_length = ops.unit_length ? ops.unit_length : 60;
		// the main growth angle for the ivy
		var angle = !isNaN(ops.angle) ? ops.angle : 45;
		var x = ops.left ? ops.left : ops.width / 2;
		var y = ops.top ? ops.top : 0;
		var CURVE_ANGLE = 35;

		// the padding to the edge
		var padding = ops.padding ? ops.padding : [0, 0, 0, 0];
		var obj = null;

		var ATTR_MAIN = {
			// 'fill' : '#f57900',
			// 'fill-rule' : 'evenodd',
			'stroke' : ops.color,
			'stroke-width' : ops.think + 'px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		};

		var ATTR_LEAF = {
			'fill-rule' : 'evenodd',
			'fill' : ops.leaf_color,
			'stroke' : 'none'
		};

		var ATTR_FLOWER = {
			'fill-rule' : 'evenodd',
			'fill' : ops.flower_color,
			'stroke' : 'none'
		};

		var ATTR_CONTROL_P1 = {
			'fill' : 'red'
		};

		var ATTR_CONTROL_P2 = {
			'fill' : 'green'
		};

		// log(ops);

		function _ctor() {
			// define point
			// define_ivy(x, y, 90, 60);
			// define_ivy(x+10,y,68,30);
			// define_ivy(x+10,y,5,30);
			obj = new IObj(x, y, angle, ops.unit_length, speed, ATTR_MAIN,
					ATTR_LEAF, ATTR_FLOWER);
			// _this.push(new IObj(0, y+100, 0, 60, speed, ATTR_MAIN));
			// _this.push(new IObj(x,y,90,68,speed+5,ATTR_MAIN));
			// var lo = new LeafObj(0,0,10,ATTR_LEAF);
			// lo.draw(0,r);
		}

		this.draw = function(duration, r, e) {
			obj.draw(duration, r, e);
		};

		/**
		 * unit_length:length of every curve
		 * 
		 * unit_speed:growth speed for every draw, in px
		 * 
		 */
		function define_ivy(mx, my, angle, unit_length, unit_speed) {
			// define point
			var left = true;

			var i = 0;
			var ps = [];
			do {
				var p;
				var length = unit_length * (1 - (0.5 * Math.random()));
				var wight = 1 - (0.2 * Math.random());
				var maxheight = tan(length / 3, CURVE_ANGLE * wight);
				// p =
				// define_curve(mx,my,angle,length,(left?1:-1)*Math.random(),maxheight);
				angle = angle + (left ? 1 : -1) * Math.random() * 20;
				p = define_curve(mx, my, angle, length,
						(left ? 1 : -1) * wight, maxheight);
				mx = p[3][0], my = p[3][1];
				if ((mx > ops.width - padding[1]) || mx < padding[3]
						|| my > ops.height - padding[2] || my < padding[0]) {
					// log('exit because of padding:' + (ops.height -
					// padding[2]));
					// log([(mx > ops.width - padding[1]) , mx < padding[3]
					// , my > ops.height - padding[2] , my < padding[0]]);

					break;
				}
				// ps.push(p);
				left = !left;

				// debug
				i++;
				// l(p[0],p[3]);
				// c(p[0]);
				// c(p[1]).attr(ATTR_CONTROL_P1);
				// c(p[2]).attr(ATTR_CONTROL_P2);
				ps = ps.concat(decomposition(p, unit_speed / length));
			} while (i < 200);
			// ls(ps).attr(ATTR_MAIN);

			// log(ps);

			return ps;
		}

		/**
		 * x,y: the start point angle:0 to 360, clockwise curve_weight:-1 to 1,
		 * 
		 * length: the legth of every curve unit
		 * 
		 * curve_weight:0-1 the control point angle to the baseline
		 * 
		 * curve_height:the control point distance to the baseline
		 * 
		 * return:the 4 points of the bizer curve
		 */
		function define_curve(x, y, angle, length, curve_weight, curve_height) {
			var p = [[x, y]];

			// end point
			p[3] = [x + cos(length, angle), y + sin(length, angle)];

			if (0 == curve_weight) {
				var slen = length / 3;
				p[1] = [x + cos(slen, angle), y + sin(slen, angle)];
				p[2] = [x + cos(2 * slen, angle), y + sin(2 * slen, angle)];
			} else {
				// control1
				var p1l = sec(curve_height, CURVE_ANGLE
								* Math.abs(curve_weight));
				// log('p1l=' + p1l);
				var a1 = angle + CURVE_ANGLE * curve_weight;
				p[1] = [x + cos(p1l, a1), y + sin(p1l, a1)];

				// control2
				var p2l = length
						- ctan(curve_height, CURVE_ANGLE
										* Math.abs(curve_weight));
				var a2 = atan(curve_height / p2l);
				// log('a2=' + a2);
				p2l = sec(curve_height, a2);
				// log('p2l=' + p2l);
				a2 = angle + (curve_weight > 0 ? a2 : -a2);
				p[2] = [x + cos(p2l, a2), y + sin(p2l, a2)];
			}

			return p;
		}

		function atan(n) {
			return Math.atan(n) / 0.017453293;
		}

		function ctan(l, a) {
			return l / Math.tan(a * 0.017453293);
		}

		function tan(l, a) {
			return l * Math.tan(a * 0.017453293);
		}

		function cos(l, a) {
			return l * Math.cos(a * 0.017453293);
		}

		function sec(l, a) {
			return l / Math.sin(a * 0.017453293);
		}

		function sin(l, a) {
			return l * Math.sin(a * 0.017453293);
		}

		/**
		 * decompose the bizer curve to points according to the speed p:the 4
		 * points of the bizer curve speed:0-1, the growth rate per unit of the
		 * curve
		 * 
		 * Return:the array of the points {v:[x,y],...}
		 */
		function decomposition(p, speed) {
			var ps = [];
			for (var i = 0; i < 1; i += speed) {
				ps.push({
							v : bizer0(i, p)
						});
			}
			ps[ps.length - 1].joint = true;

			return ps;
		}

		function bizer0(t, points) {
			var x = Math.pow(1 - t, 3) * points[0][0] + 3 * t
					* Math.pow(1 - t, 2) * points[1][0] + 3 * Math.pow(t, 2)
					* (1 - t) * points[2][0] + Math.pow(t, 3) * points[3][0];
			var y = Math.pow(1 - t, 3) * points[0][1] + 3 * t
					* Math.pow(1 - t, 2) * points[1][1] + 3 * Math.pow(t, 2)
					* (1 - t) * points[2][1] + Math.pow(t, 3) * points[3][1];

			return [x, y];
		}

		/**
		 * 
		 * unit:length of every curve
		 * 
		 * speed:growth speed in px
		 * 
		 * leaf_size:number, leaf scale size
		 * 
		 * leaf_speed:0-1 growth speed of leaf
		 */
		function IObj(x, y, angle, unit, speed, attr, attr_leaf, attr_flower,
				leaf_size, leaf_speed, flower_szie) {
			var me = this;
			var ps = [];
			var np;
			var el;
			var EG = Engine.get();

			function _ctor() {
				// log(_this);
				// log([x, y, angle, unit, speed]);
				ps = define_ivy(x, y, angle, unit, speed);
				// log(ps.length);
				np = ps.shift();
				if (!np) {
					log('no point at this configuration.');

					return;
				}
				leaf_size = leaf_size ? leaf_size : 0.2;
				flower_szie = flower_szie ? flower_szie : 0.15
				// root leaf, the size should be larger
				var lo = new LeafObj(np.v[0], np.v[1], leaf_size,
						leaf_angle1(), leaf_speed, attr_leaf);
				EG.push(lo);
				lo = new LeafObj(np.v[0], np.v[1], leaf_size, leaf_angle2(),
						leaf_speed, attr_leaf);
				EG.push(lo);
			}

			function leaf_angle1() {
				return angle + (Math.random() > 0.5 ? -1 : 1) * 30
						* Math.random();
			}

			function leaf_angle2() {
				return angle - 90 + (Math.random() > 0.5 ? -1 : 1) * 30
						* Math.random();
			}

			this.draw = function(duration, r, EG) {
				var p = ps.shift();
				if (!p) {

					return;
				}
				if (!el) {
					el = EG.l(np.v, p.v).attr(attr);
				} else {
					var path = el.attr('path');
					el.attr('path', path + 'L' + p.v[0] + ',' + p.v[1]);
				}

				if (p.joint) {
					// leaf
					var rsize = 1 - 0.5 * (Math.random());
					var tsize = leaf_size * rsize;
					var lo = new LeafObj(p.v[0], p.v[1], tsize, leaf_angle1(),
							leaf_speed, attr_leaf);
					EG.push(lo);

					// the other direction
					tsize = tsize
							* (1 + (Math.random() > 0.5 ? -1 : 1) * 0.3
									* (Math.random()));
					lo = new LeafObj(p.v[0], p.v[1], tsize, leaf_angle2(),
							leaf_speed, attr_leaf);
					EG.push(lo);

					if (rsize >= 0.7) {
						tsize = flower_szie * rsize
								* (1 - 0.5 * (Math.random()));
						lo = new FlowerObj(p.v[0], p.v[1], tsize,
								leaf_angle2(), leaf_speed, attr_flower);
						EG.push(lo);
					}
				}

				np = p;
			};

			_ctor();
		}

		function GrowObj(lz, x, y, size, angle, speed, attr, frmdur) {
			var me = this;
			var el;
			var s = 0.1;
			speed = speed ? speed : 0.01;
			var done_fn = [];
			var _done;

			function _ctor() {
				angle = angle % 360;
				if (0 > angle) {
					angle += 360;
				}
				angle1 = angle + 10;
				angle2 = angle - 10;
			}

			this.done = function(fn) {
				if (fn) {
					done_fn.push(fn);
				}
			};

			this.hasDone = function() {
				return _done;
			};

			this.draw = function(duration, r, EG) {
				if (_done) {
					return;
				}
				if (1 <= s) {
					// EG.remove(me);
					_done = true;
					for (var ifn in done_fn) {
						done_fn[ifn](el);
					}

					return;
				}
				if (!el) {
					el = r.path(lz).attr(attr);
				} else {
					s += speed;
				}
				var sc = s * size;
				var transfmstr = 'S' + sc + ',' + sc + ',0,0' + 'T' + x + ','
						+ y;
				if (angle) {
					transfmstr = 'R' + angle + ',0,0' + transfmstr;
				}
				el.transform(transfmstr);
			};

			_ctor();
		}

		function LeafObj(x, y, size, angle, speed, attr) {
			var lz = 'M 132.4058,107.5348 C 63.685539,96.388112 -1.673558,65.654055 0,2 63.102131,-9.5151352 112.12347,35.629791 132.4058,107.5348 z';

			var obj = new GrowObj(lz, x, y, size, angle, speed, attr);

			var _inanim;
			var lastDur = 0;
			frmdur = 1000/16;
			
			var _el;
			var done_transform;
			var anim_angle = 0;
			var MAX_ANGLE = 20;
			var MAX_ANGLE_REDUCTION = 5;
			var cur_max_angle = MAX_ANGLE;
			var dir_amin = 1;
			var ANGLE_INCREASE = MAX_ANGLE_REDUCTION;

			function _ctor() {
				obj.done(function(el) {
							_el = el;
							done_transform = _el.transform();
							el.hover(function() {
										if (_inanim) {
											return;
										}

										start_anim();
									});
						});
			}

			function start_anim() {
				_inanim = true;
			}
			
			function stop_anim(){
				_inanim = false;
				_el.transform(done_transform);
				cur_max_angle = MAX_ANGLE;
				anim_angle = 0;
			}

			this.draw = function(duration, r, e) {
				if (obj.hasDone()) {
					if (_inanim) {
						lastDur -= duration;
						if (lastDur <= 0) {							
							lastDur = frmdur;
							if (dir_amin*anim_angle > 0 && Math.abs(anim_angle) > cur_max_angle){								
								//reset anim_angle
								anim_angle = dir_amin*cur_max_angle;
								//change direction
								dir_amin = -dir_amin;
								cur_max_angle -= MAX_ANGLE_REDUCTION;
								if (cur_max_angle <= 0){
									//stop animation
									stop_anim();
									
									return;
								}
							}else{
								
							}
							anim_angle += dir_amin * ANGLE_INCREASE;
							var transstr = _el.transform();
							transstr += 'r' + (dir_amin * ANGLE_INCREASE) + ',0,0';
							_el.transform(transstr);
						}
					}
				} else {
					obj.draw(duration, r, e);
				}
			};

			_ctor();
		}

		function FlowerObj(x, y, size, angle, speed, attr) {
			var lz = 'm 10.370533,-93.549107 c -18.9777971,-0.3227 -35.539997,17.869938 -37.437497,41.59375 -0.21898,2.73786 -0.23733,5.43119 -0.0625,8.0625 -1.8764,-1.79995 -3.92313,-3.48863 -6.125,-5.0625 -19.98648,-14.286116 -45.51707,-12.82726 -57.03125,3.28125 -11.514186,16.1085 -4.64273,40.7451297 15.34375,55.0312527 3.69905,2.6440403 7.57607,4.7724403 11.53125,6.3437503 -1.76857,1.85207 -3.45084,3.83271 -5,6 -14.28612,19.98648 -12.82726,45.54832 3.28125,57.0625 16.1085,11.51419 40.74513,4.64273 55.03125,-15.34375 2.4482599,-3.42514 4.4406999,-7.03488 5.9687499,-10.6875 0.60223,5.33827 2.06063,10.80017 4.46874996,16.125 10.12332714,22.38461 32.95866714,33.909104 50.99998714,25.75 18.04133,-8.15909 24.46707,-32.92788 14.34375,-55.3125 -0.93921,-2.07678 -2.01223,-4.05461 -3.15625,-5.9375 4.32992,-0.75968 8.71104,-2.06034 13,-4 22.38461,-10.12333 33.909087,-32.9586733 25.749997,-51.000003 -8.159097,-18.04133 -32.927887,-24.46707 -55.312497,-14.34375 -1.36868,0.61898 -2.68323,1.29 -3.96875,2 1.23493,-3.85847 2.06229,-7.94954 2.40625,-12.25 1.95871,-24.489097 -12.45002,-45.640088 -32.1875,-47.21875 -0.6168,-0.04933 -1.23155,-0.08334 -1.84374,-0.09375 z';

			var obj = new GrowObj(lz, x, y, size, angle, speed, attr);
			var obj1 = new GrowObj(lz, x, y, size * 0.2, angle, speed, {
						'fill-rule' : 'evenodd',
						'fill' : '#ffffff',
						'stroke' : 'none'
					});

			function _ctor() {
				obj.done(function(el) {
							el.hover(function() {
										el.attr('fill-opacity', 0.85);
									}, function() {
										el.attr('fill-opacity', 1);
									});
						});
			}

			this.draw = function(duration, r, e) {
				obj.draw(duration, r, e);
				obj1.draw(duration, r, e);
			};

			_ctor();

		}

		_ctor();
	}

	function invert_color(color) {
		var c1 = color.substring(1, 3);
		var c2 = color.substring(3, 5);
		var c3 = color.substring(5, 7);

		c1 = (255 - parseInt(c1, 16)).toString(16);
		c2 = (255 - parseInt(c2, 16)).toString(16);
		c3 = (255 - parseInt(c3, 16)).toString(16);

		return '#' + pad(c1) + pad(c2) + pad(c3);
	}

	function pad(c) {
		return c.length < 2 ? '0' + c : c;
	}

})();