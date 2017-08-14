(function() {
	var stop = false;

	Array.prototype.removeo = function(obj) {
		var bl;

		bl = false;
		for (var i = 0; i < this.length; i++) {
			if (obj === this[i] || bl) {
				this[i] = this[i + 1];
				bl = true;
			}
		}
		if (bl) {
			this.length--;
		}
	}

	function apply(p, p1) {
		for (var i in p1) {
			p[i] = p1[i];
		}

		return p;
	}

	function titleEl(txt, p) {
		return apply(p, {
					title : txt.url,
					url : encodeURI(txt.url).toLowerCase()
				});
	}

	function text(cxt2D, texts) {
		var buffer = [];
		var y = 0;
		var x = 20;
		var durms = 8000;
		var vms = 8000;
		var fontsize0 = '10';
		var fontsize1 = '20';

		function callback1(o, txt) {
			o.animate(titleEl(txt, p3), vms, '<', function() {
						o.remove();
						o.removed = true;
						buffer.removeo(o);
						callback2(txt);
					});
			send();
		}

		function callback2(txt) {
			texts.push(txt);
		}

		function animfnt(r) {
			console.log(r);
			if (1 == r) {
				return fontsize1;
			}
			return fontsize0 + r * (fontsize1 - fontsize0);
		}

		var p1 = {
			fill : '#0196E3',
			'fill-opacity' : 0.1,
			'font-family' : 'forte,"Myriad Pro","Helvetica Neue",Helvetica,Arial,Sans-Serif',
			'font-size' : fontsize0,
			'text-anchor' : 'start'
		};

		var p2 = {
			y : cxt2D.height / 2,
			'fill-opacity' : 1,
			'font-family' : 'forte,"Myriad Pro","Helvetica Neue",Helvetica,Arial,Sans-Serif',
			'font-size' : fontsize1,
			'text-anchor' : 'start'
		};

		var p3 = {
			y : cxt2D.height,
			'font-size' : fontsize0,
			'font-family' : 'forte,"Myriad Pro","Helvetica Neue",Helvetica,Arial,Sans-Serif',
			'fill-opacity' : 0.1,
			'text-anchor' : 'start'
		};

		function stopall() {
			stop = true;
			for (var i = 0; i < buffer.length; i++) {
				if (buffer[i].removed) {
					continue;
				}
				buffer[i].pause();
			}
		}

		function restartall() {
			stop = false;
			for (var i = 0; i < buffer.length; i++) {
				if (buffer[i].removed) {
					continue;
				}
				buffer[i].resume();
			}
		}
		function send() {
			// if (stop) {
			// setTimeout(send, durms);
			// return;
			// }
			var alp = 1;
			var txt = texts.shift();
			if (!txt) {
				setTimeout(send, durms);

				return;
			}
			var p = titleEl(txt, p1);
			var o = cxt2D.text(x, 0, txt.name).attr(p);
			buffer.push(o);
			o.mouseover(function() {
						o.attr({
									cursor : 'pointer'
								});
						stopall();
					});
			o.mouseout(function() {
						o.attr({
									cursor : ''
								});
						restartall();
					});

			o.click(function() {
						window.status = p.title;
						window.location.assign(p.url)
					});
			o.animate(titleEl(txt, p2), vms, 'bounce', function() {
						callback1(o, txt);
					});

			// setTimeout(send, durms);
		}

		send();
	}
	
	function rcolor(){
		var cs = ['white','yellow','#a0eda9','pink','orange','#0196E3'];
		return cs[Math.floor(cs.length*Math.random())];
	}

	function vtext(cxt2D, x, y0, s, ms, callback) {
		var color = rcolor();
		var w = 5;
		var buffer = [];
		for (var i = 1; i < 10; i++) {
			y0 += w;
			w = w + 0.5;
			var r = w / 2;
			var alp = parseFloat('0.' + i);

			var o = cxt2D.text(x, y0, i).attr({
						fill : color,
//						fill : '#a0eda9',
						'fill-opacity' : alp
					}).scale(s, s);
			o.animate({
						y : cxt2D.height + 5
					}, ms, '>', (function(i, o) {
						return function() {
							if (1 == i) {
								while (buffer.length) {
									buffer.pop().remove();
								}
								callback();
							}
						};
					})(i, o));
			buffer.push(o);
		}
	}

	function vrect(cxt2D, x, y0, s, ms, callback) {
		var color = rcolor();
		var w = 2;
		var buffer = [];
		for (var i = 1; i < 10; i++) {
			y0 += w;
			w = w + 0.5;
			var r = w / 2;
			var alp = parseFloat('0.' + i);
			var o = cxt2D.rect(x - r, y0, w, w).attr({
						fill : color,
						'fill-opacity' : alp,
						stroke : 'none'
					}).scale(s, s);
			o.animate({
						y : cxt2D.height + 5
					}, ms, '>', (function(i, o) {
						return function() {
							if (1 == i) {
								while (buffer.length) {
									buffer.pop().remove();
								}
								callback();
							}
						};
					})(i, o));
			buffer.push(o);
		}
	}

	function newv(cxt2D) {
		var x = cxt2D.width * Math.random();
		var y = cxt2D.height * Math.random();
		var s = Math.max(0.6 * Math.random(),0.3);
		var v = 5000 * Math.random();
		v += 1000;

		return {
			x : x,
			y : y,
			s : s,
			v : v
		};
	}

	function ctor() {
	}

	function draw(cxt2D,texts) {
		var vobjs = [];

		for (var i = 0; i < 2; i++) {
			var vo = newv(cxt2D);
			vo.type = 0 == i % 2;
			vobjs.push(vo);
		}

		function resetarr(ovo) {
			var vo = newv(cxt2D);
			vo.type = ovo.type;
			function callback() {
				resetarr(vo);
			}
			if (vo.type) {
				vrect(cxt2D, vo.x, vo.y, vo.s, vo.v, callback);
			} else {
				vtext(cxt2D, vo.x, vo.y, vo.s, vo.v, callback);
			}
		}

		cxt2D.setStart();
		for (var i = 0; i < vobjs.length; i++) {
			var vo = vobjs[i];
			if (vo.type) {
				vrect(cxt2D, vo.x, vo.y, vo.s, vo.v, (function(vo) {
							return function() {
								resetarr(vo)
							};
						})(vo));
			} else {
				vtext(cxt2D, vo.x, vo.y, vo.s, vo.v, (function(vo) {
							return function() {
								resetarr(vo)
							};
						})(vo));
			}
		}
		cxt2D.setFinish();

		// category
		text(cxt2D, texts)
	};

	window.catanima = {
		draw:draw
	};
	


})();