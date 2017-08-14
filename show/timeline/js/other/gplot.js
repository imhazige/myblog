(function() {
	var NS;

	var Engine = kzg.Engine;
	var LineObj = kzg.LineObj;
	var NodeObj = kzg.NodeObj;

	if (!window.co) {
		co = {
			admin : {}
		};
	}

	function log(x) {
		console && console.log(x);
		var el = document.getElementById('log');
		if (!el) {
			return;
		}
		el.value += x + '\n';
		el.scrollTop = 10000;
	}

	NS = co;

	NS.gplot = {
		load : load
	};

	var nodes = [];
	var line_length;
	var node_height;
	var node_width;
	var line_speed;
	var A_SCOPE;
	var line_offset;
	var eg;

	var config;

	function load(ops) {
		new Engine({
					el : ops.el,
					width : ops.width,
					height : ops.height
				});

		config = ops;
		eg = Engine.get();

		ops.start.x = ops.width / 2;
		// ops.start.y = ops.height / 2;
		ops.start.y = 300;
		// ops.start.y = 20;
		
		// calc the whole nodes, line length, image size
		line_length = 120;
		node_height = 60;
		node_width = 60;
		line_speed = 10;
		A_SCOPE = 120;
		
		var startN = load_node(ops.start);
		
		line_offset = eg.distance([0, 0], [node_width / 2, node_height / 2]);

		eg.start();
	}

	function db_node() {
	}

	function get_icon(n) {
	}

	function e_hover_out(n) {
	}

	function e_hover_in(n) {
		// show detail
	}

	function e_click(n) {
		// jump?
	}

	function load_node(ops) {
		if (!ops.name || !ops.type) {
			log('WARN:ignore node without name and type.');

			return null;
		}
		var type = ops.type;
		var config = $.extend({
					width : node_width,
					height : node_height,
					text : ops.name,
					done : e_done,
					data : ops,
					hover_in : e_hover_in,
					hover_out : e_hover_out,
					click : e_click
				}, ops);
		var nobj;
		switch (type) {
			case '' :

				break;
		}

		nobj = new NodeObj(config);
		eg.push(nobj);

		return nobj;
	}

	function find_node_by_data(d) {
		var node = eg.each(function(n) {
					if (n instanceof NodeObj) {
						var data = n.config.data;
						if (is_data_equal(data, d)) {
							return n;
						}
					}
				});

		return node;
	}

	function find_line_by_relation(from, to) {
		// log(from.name + '<---->' + to.name);
		var node = eg.each(function(l) {
					if (l instanceof LineObj) {
						var d1 = l.config.fromData;
						var d2 = l.config.toData;
						// log(d1.name + '<>' + d2.name);
						if ((is_data_equal(d1, from) && is_data_equal(d2, to))
								|| (is_data_equal(d1, to) && is_data_equal(d2,
										from))) {
							return l;
						}
					}
				});

		return node;
	}

	function is_data_equal(d1, d2) {
		// log(d1);
		// log(d2);
		return d1.type == d2.type && d1.name == d2.name;
	}

	var c = 0;

	function got_line_dir(line, from, to) {
		var dir;
		var fromData = line.config.fromData;
		var toData = line.config.toData;
		if (is_data_equal(fromData, from) && is_data_equal(toData, to)) {
			dir = false;
		} else if (is_data_equal(toData, from) && is_data_equal(fromData, to)) {
			dir = true;
		} else {
			log('ERROR:got_line_dir:the relation node is not equal line from/to data.');

			return;
		}

		return dir;
	}

	function e_done(n) {
		var d = n.config.data;
		// log('------------e_done for ' + d.name);

		// get all the in/out relation 1 depth
		var ns = config.node_relation(d);

		if (!ns || !ns.length) {
			// end this line
			log('none relation for ' + d.name);
			return;
		}

		// debug
		// if (c > 3) {
		// log('DEBUG EXITS.');
		// return;
		// }
		c++;

		// calc in/out line, angle, x,y

		var angle_scope;
		if (!n.config.angle) {
			// the root
			angle_scope = 360;
		} else {
			angle_scope = A_SCOPE;
		}

		var unit_angle = angle_scope / ns.length;

		var ii = 0;
		for (var i = 0; i < ns.length; i++) {
			var on = ns[i];
			if (!on.name || !on.type) {
				log('WARN:ignore node without name and type.');
				continue;
			}
			var en = find_node_by_data(on);

			var line = find_line_by_relation(d, on);
			if (en && line) {
				// line to exists node
				log('exists line:' + d.name + '---' + on.name);
				// NOTE:here, depen_in means on depend n
				var dir = got_line_dir(line, d, on);
				var dresult = line.addDependency(dir);
				// if (dresult) {
				// n.event_move((function(idir, il) {
				// return function(o, d) {
				// il.update(idir, [d.x, d.y]);
				// }
				// })(dir, line));
				// }
			} else {
				// create new node
				var a = n.config.angle;
				var toxy;
				if (!a) {
					// root point, orrient to bottom
					a = -90;
				}
				var from = [n.config.x, n.config.y];
				var toxy;
				if (en) {
					toxy = [en.config.x, en.config.y];
					a = eg.toAngle(from, toxy);
					log('append line ' + d.name + '<==>' + on.name);
					// log(a);
				} else {
					if (0 == unit_angle) {
						unit_angle = 25;
					}
					if (0 == 360 % unit_angle) {
						unit_angle -= 7;
					}
					a = a + (ii % 2 ? -1 : 1) * ((ii + 1) / 2 | 0) * unit_angle;
					// a = a + (ii % 2 ? -1 : 1) * ii * unit_angle;
					// random
					// a = a + (2 * Math.random() > 1 ? -1 : 1)
					// * (30 * Math.random());
					toxy = eg.toXY(from, line_length, a);
					// x,y
					on.x = toxy[0];
					on.y = toxy[1];
					on.angle = a;
					log('new line ' + d.name + '<==>' + on.name);
				}

				// line from n to on, so depen_in mean on depend n, if true,
				// arrow in start
				var l = new LineObj({
							from : from,
							fromData : d,
							to : toxy,
							offset : line_offset,
							toData : on,
							angle : a,
							speed : line_speed,
							pit : on.depen_in,
							done : (function(eid, en) {
								return function(l) {
									if (en) {
									} else {
										en = load_node(eid);
									}
									en.event_move(function(o, d) {
//												log('---new line move --');
												l.update(false, [d.x, d.y]);
											});
								};
							})(on, en)
						});
				n.event_move((function(ion, il) {
							return function(o, d) {
//								log('new line move');
								il.update(true, [d.x, d.y]);
							}
						})(on, l));
				eg.push(l);

				// count created node
				ii++;
			}
		}

		// log('<<<<<<<' + d.name);
	}
})();