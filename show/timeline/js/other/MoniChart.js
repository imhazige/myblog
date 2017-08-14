(function() {
	function l(r, pvr) {
		return r.path('M{0},{1}L{2},{3}', pvr[0][0], pvr[0][1], pvr[1][0],
				pvr[1][1]);
	}

	function l2(r, p1, p2) {
		return r.path('M{0},{1}L{2},{3}', p1[0], p1[1], p2[0], p2[1]);
	}

	function loffV(r, p, off) {
		return l(r, [[p[0][0], p[0][1] + off], [p[1][0], p[1][1] + off]]);
	}

	function loffH(r, p, off) {
		return l(r, [[p[0][0] + off, p[0][1]], [p[1][0] + off, p[1][1]]]);
	}

	window.MoniChart = function(ops) {
		ops.width = ops.width ? ops.width : 520;
		ops.height = ops.height ? ops.height : 380
		var r = Raphael(ops.el, ops.width, ops.height);

		// core bgcolor
		var BGCOLOR = '#fafafa'
		// inset border color for core chart
		var BCOLOR0 = '#737269';
		var BCOLOR1 = 'gray';
		// rule color
		var RCOLOR = 'black';
		// rule line in chart's color
		var CRCOLOR = '#c0c0c0';
		// value color in core
		var VLCOLOR = 'blue';
		// last value cursor color
		var TCURCOLOR = 'blue';
		// core chart width and height
		var wc = ops.chartwidth ? ops.chartwidth : ops.width * 0.8;
		var hc = ops.chartheight ? ops.chartheight : ops.height * 0.8;
		// last cursor offset from core chart right border
		var off_lasrcur = ops.offsetLastPointer ? ops.offsetLastPointer : 5;
		var off_lasttext = ops.offsetLastText ? ops.offsetLastText : 5;

		// radius of rules
		var rh = 5; // |-
		var rv = 5; // -|
		// text offset from rule
		var offset_htxt = 15; // -
		var offset_vtxt = ops.offsetvtext ? ops.offsetvtext : 25; // |
		// core chart ponit
		var xc = ops.chartx ? ops.chartx : 60;
		var yc = ops.charty ? ops.charty : 30;
		// rule's offset from border
		var offset_hr = 5;
		var offset_vr = 5;
		// offset to core chart
		var off2c_h = 20;
		var off2c_v = 20;
		// last cursor triangle height
		var lastcur_height = 2;
		var lastcur_width = 2;
		// core chart border point
		var pbs = [[xc, yc], [wc + xc, yc], [wc + xc, hc + yc], [xc, hc + yc]];
		// rule point
		var pvr = [[pbs[0][0] - off2c_h, pbs[0][1] + offset_vr],
				[pbs[3][0] - off2c_h, pbs[3][1] - offset_vr]];
		var phr = [[pbs[3][0] + offset_hr, pbs[3][1] + off2c_h],
				[pbs[2][0] - offset_hr, pbs[2][1] + off2c_h]];

		var buffer = [];

		// - text function
		var htextfn = ops.htextfn ? ops.htextfn : function(v) {
			return v;
		}

		// |
		var vtextfn = ops.vtextfn ? ops.vtextfn : function(v) {
			return v;
		}

		var curtextfn = ops.lasttextfn ? ops.lasttextfn : function(v) {
			return v[1];
		};

		var b0 = l2(r, pbs[0], pbs[1]).attr({
					stroke : BCOLOR0
				});
		var b1 = l2(r, pbs[1], pbs[2]).attr({
					stroke : BCOLOR1
				});

		var b3 = l2(r, pbs[2], pbs[3]).attr({
					stroke : BCOLOR1
				});
		var b4 = l2(r, pbs[3], pbs[0]).attr({
					stroke : BCOLOR0
				});

		var vr = l(r, pvr).attr({
					stroke : RCOLOR
				});

		var hr = l(r, phr).attr({
					stroke : RCOLOR
				});

		this.show = function(ops) {
			if (!ops.values || !ops.values.length) {
				throw new Error('values is empty.');
			}

			if (2 > ops.values.length) {
				throw new Error('Values must more than two!');
			}

			var o;
			while (o = buffer.pop()) {
				o.remove();
			}

			// rule values, from min to max
			var hrs = ops.hrules;
			var vrs = ops.vrules;
			var hscope = ops.hscope;
			var vscope = ops.vscope;
			var vs = ops.values;

			// h | rule in core
			var ofh = hscope[1] - hscope[0];
			var phrlength = phr[1][0] - phr[0][0];
			var hy = phr[0][1];
			for (var i = 0; i < hrs.length; i++) {
				var v = hrs[i] - hscope[0];
				var offx = (v * 1.0 / ofh) * phrlength;
				var ix = phr[0][0] + offx;
				buffer.push(l2(r, [ix, hy - rh], [ix, hy + rh]));
				buffer.push(loffH(r, pvr, ix - pvr[0][0]).attr({
							stroke : CRCOLOR
						}));
				buffer.push(r.text(ix, hy + offset_htxt, htextfn(hrs[i])));
			}

			// v - rule in core
			var ofv = vscope[1] - vscope[0];
			var pvrlength = pvr[1][1] - pvr[0][1];
			var vx = pvr[1][0];
			for (var i = 0; i < vrs.length; i++) {
				var v = vrs[i] - vscope[0];
				var offy = (v * 1.0 / ofv) * pvrlength;
				var iy = pvr[1][1] - offy;
				buffer.push(l2(r, [vx - rv, iy], [vx + rv, iy]).attr({
							stroke : RCOLOR
						}));
				buffer.push(loffV(r, phr, iy - phr[0][1]).attr({
							stroke : CRCOLOR
						}));
				buffer.push(r.text(vx - offset_vtxt, iy, vtextfn(vrs[i])));
			}

			// value
			var fmtstr = 'M';
			var lastp;
			for (var i = 0; i < vs.length; i++) {
				if (i > 0) {
					fmtstr += 'L';
				}
				var v = vs[i];
				var ix = phr[0][0] + (v[0] - hscope[0]) / ofh * phrlength;
				var iy = pvr[1][1] - (v[1] - vscope[0]) / ofv * pvrlength;
				// console.log(ofv * pvrlength);
				fmtstr += ix + ',' + iy;
				if (i == vs.length - 1) {
					lastp = [ix, iy];
				}
			}
			// console.log(fmtstr);
			buffer.push(r.path(fmtstr).attr({
						stroke : VLCOLOR
					}));

			// cursor
			var curp0x = pbs[1][0] + off_lasrcur;
			var curp0y = lastp[1];
			buffer.push(r.path('M{0},{1}L{2},{3}L{4},{5}z', curp0x, curp0y,
					curp0x + lastcur_height, curp0y + lastcur_width,
					curp0x + lastcur_height, curp0y - lastcur_width).attr({
						fill : TCURCOLOR,
						stroke : 'none'
					}));
			buffer.push(r.text(curp0x + off_lasttext, curp0y - 2,
					curtextfn(vs[vs.length - 1])).attr({
						stroke : 'none',
						fill : TCURCOLOR,
						'text-anchor' : 'start'
					}));
		};
	};

	return;

//	window.onload = function() {
//		var mc = new MoniChart({
//					el : document.getElementById('holder'),
//					width : 600,
//					height : 400,
//					chartwidth : 500,
//					chartheight : 200,
//					chartx : -200,
//					charty : 0
//				});
//
//		var values = [[2, 1], [120, 20], [500, 10], [700, 80]];
//
//		var hrules = [100, 300, 500, 700];
//		var hscope = [0, 900];
//
//		var argvrules = [0, 100, 300, 500, 700, 2000, 5000, 10000];
//		var inv = setInterval(function() {
//
//					// mock
//					// values.shift();
//					var vx = values[values.length - 1];
//					values.push([
//							vx[0] + 100,
//							vx[1]
//									+ ((Math.floor(10 * Math.random()) % 2)
//											? -1
//											: 1)
//									* Math.floor(50 * Math.random())]);
//
//					// mock time diff
//					hrules.push(hrules[hrules.length - 1] + 600);
//
//					// h scope and rules
//					var h_timediff = 100; // unit distance on h axis
//					hscope[0] += h_timediff;
//					hscope[1] += h_timediff;
//					// check not in screen, cut off values
//					var fvs = [];
//					for (var i = values.length - 1; i >= 0; i--) {
//						var pv = fvs[0];
//						var v = values[i];
//						// start point
//						if (v[0] < hscope[0]) {
//							if (!pv) {
//								break;
//							}
//							var x0 = hscope[0];
//							var y0 = ((pv[1] - v[1]) / (pv[0] - v[0]))
//									* (x0 - pv[0]) + pv[1];
//							fvs.unshift([x0, y0]);
//							break;
//						}
//						fvs.unshift(v);
//					}
//
//					// rules
//					while (hrules.length) {
//						if (hrules[0] >= hscope[0]) {
//							break;
//						}
//						hrules.shift();
//					}
//
//					while (hrules.length) {
//						if (hrules[hrules.length - 1] <= hscope[1]) {
//							break;
//						}
//						hrules.pop();
//					}
//
//					// v scope and rules
//					var vrules = [];
//					var maxv = 0;
//					// rule count on v axis
//					var vcount = 6;
//					for (var i = fvs.length - 1; i >= 0; i--) {
//						var v = fvs[i];
//						maxv = Math.max(v[1], maxv)
//					}
//					for (var i = 0; i < argvrules.length; i++) {
//						if (argvrules[i] > maxv) {
//							vrules.push(argvrules[i]);
//
//							break;
//						}
//						vrules.push(argvrules[i]);
//					}
//					var vscope = [vrules[0], vrules[vrules.length - 1]];
//
//					mc.show({
//								hrules : hrules,
//								vrules : vrules,
//								hscope : hscope,
//								vscope : vscope,
//								values : fvs
//							});
//				}, 1000);
//
//		var btn = document.getElementById('btn');
//		btn.onclick = function() {
//			clearInterval(inv);
//		};
//	};
})();