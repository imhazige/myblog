(function() {
	kzg = {};

	var NS = kzg;

	// var NS = kzg.ext;
	// var util = NS.util;
	// var log = NS.log;

	var MS = 60000;
	var HS = 60 * MS;
	var DS = 24 * HS;

	/**
	 * time scan[time scope,time diff,time diff unit]
	 */
	var TIME_SCAN = NS.TIME_SCAN = {
		M1 : [MS, MS, 'M'],
		M5 : [5 * MS, MS, 'M'],
		M10 : [10 * MS, 5 * MS, 'M'],
		M30 : [30 * MS, 5 * MS, 'M'],
		H1 : [HS, 10 * MS, 'M'],
		// only support one day as maxmize scope, then all the unite is minute
		// H2 : [2 * HS, 30 * MS, 'M'],
		// H6 : [6 * HS, HS, 'H'],
		// H12 : [12 * HS, 3 * HS, 'H'],
		// D1 : [DS, 12 * HS, 'H'],
		// D7 : [7 * DS, 3 * DS, 'D'],
		ALL : [-1, null, 'M']
	};

	function research_unit(time, scan, rate) {
		var dt = new Date(time);

		dt.setUTCMilliseconds(0);
		dt.setUTCSeconds(0);
		if ('M' == scan) {
			for (var i = dt; rate; dt.setUTCMinutes(dt.getUTCMinutes() - 1)) {
				if (0 == dt.getUTCMinutes() % rate) {
					break;
				}
			}
		} else if ('H' == scan) {
			dt.setUTCMinutes(0);
		} else if ('D' == scan) {
			dt.setUTCMinutes(0);
			dt.setUTCHours(0);
		} else {
			throw new Error('no unit found.');
		}
		// console.log(dt.getUTCMinutes());

		return dt.getTime();
	}

	function search_unit(time, scan) {
		var dt = new Date(time);

		if ('M' == scan) {
			dt.setUTCSeconds(dt.getUTCSeconds() + 59);
		} else if ('H' == scan) {
			dt.setUTCMinutes(dt.getUTCMinutes() + 59);
			dt.setUTCMinutes(0);
		} else if ('D' == scan) {
			dt.setUTCHours(dt.getUTCHours() + 11);
			dt.setHours(0);
			dt.setUTCMinutes(0);
		} else {
			throw new Error('no unit found.');
		}

		dt.setUTCMilliseconds(0);
		dt.setUTCSeconds(0);

		return dt.getTime();
	}

	function calc_timerule(timescan, timebegin, time, values) {
		var hscope;
		var hrules = [];
		var firstu;
		var fvs = [];

		if (timescan == TIME_SCAN.ALL) {
			var dt = new Date(timebegin - 60000);
			var time0 = dt.getTime();
			hscope = [time0, time];
			fvs = values;

			var timdiff;
			// compress style
			var diff = hscope[1] - hscope[0];
			if (diff < 10 * MS) {
				// 1m
				firstu = search_unit(time0, 'M');
				timdiff = MS;
			} else if (diff < 30 * MS) {
				// 5m
				firstu = search_unit(time0, 'M');
				timdiff = 5 * MS;
			} else if (diff < HS) {
				// 10m
				firstu = search_unit(time0, 'M');
				timdiff = 10 * MS;
			} else if (diff < 2 * HS) {
				// 30m
				firstu = search_unit(time0, 'H');;
				timdiff = 30 * MS;
			} else if (diff < 6 * HS) {
				// 1h
				firstu = search_unit(time0, 'H');;
				timdiff = HS;
			} else {
				// 2h
				firstu = search_unit(time0, 'H');
				timdiff = 2 * HS;
			}
			for (var i = firstu; i <= hscope[1]; i += timdiff) {
				hrules.push(i);
			}
		} else {
			hscope = [time - timescan[0], time];

			for (var i = values.length - 1; i >= 0; i--) {
				var v = values[i];
				// start point
				if (v[0] < hscope[0] && i > 1) {
					var pv = values[i - 1];
					var x0 = hscope[0];
					var y0 = ((pv[1] - v[1]) / (pv[0] - v[0])) * (x0 - pv[0])
							+ pv[1];
					fvs.unshift([x0, y0]);
					break;
				}
				fvs.unshift(v);
			}

			// scroll style
			// note, here assert the timescan is in minutes diff
			firstu = research_unit(time, timescan[2], timescan[1] / MS);
			for (var i = firstu; i >= hscope[0]; i -= timescan[1]) {
				hrules.push(i);
			}
		}

		var rs = {
			hscope : hscope,
			hrules : hrules,
			values : fvs
		};

		return rs;
	}

	// fvs should be convert to integer
	function calc_verticalrule(fvs, vdiff) {
		// v scope and rules
		var vrules = [];
		var vscope = [];
		var maxv = 0;
		var minv = Number.MAX_VALUE;
		for (var i = fvs.length - 1; i >= 0; i--) {
			var v = fvs[i];
			maxv = Math.max(v[1], maxv);
			minv = Math.min(v[1], minv);
		}

		if (!vdiff) {
			vdiff = 1;
			if (maxv > 10) {
				var tv = '' + maxv;
				vdiff = Math.pow(10, (tv.substring(1).length));
			}
		}

		if (minv < vdiff) {
			vrules[0] = 0;
		} else {
			vrules[0] = Math.floor(minv / vdiff) * vdiff;
		}

		for (var i = vrules[0] + vdiff; i < maxv; i += vdiff) {
			vrules.push(i);
		}

		if (vrules[vrules.length - 1] < maxv) {
			vrules.push(vrules[vrules.length - 1] + vdiff);
		}
		var vscope = [vrules[0], vrules[vrules.length - 1]];
		var rs = {
			vscope : vscope,
			vrules : vrules
		};

		return rs;
	}

	function pad(t) {
		if (t < 10) {
			return '0' + t;
		}

		return t;
	}

	function fmt_time1(dt) {
		return pad(dt.getHours()) + ':' + pad(dt.getMinutes());
	}

	function fmt_time2(dt) {
		return dt.getFullYear() + '-'
				+ pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
	}

	function calcTime(d, offset) {
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		var nd = new Date(utc + (3600000 * offset));

		return nd;

	}

	NS.Chart = function BaseChart(ops) {
		var _this = this;
		var mc;

		this.constructor = function(ops) {
			_this.data = [];

			_this.timescan = ops.timescan ? ops.timescan : TIME_SCAN.ALL;
			_this.timebegin = ops.timebegin ? ops.timebegin : new Date()
					.getTime();
			ops.htextfn = function(v) {
				var offset = ops.timeoffset;
				var dt = calcTime(new Date(v), offset);

				var txt = fmt_time1(dt);

//				if (0 == dt.getHours() && 0 == dt.getMinutes()
//						&& 0 == dt.getSeconds()) {
//					txt += '\n' + fmt_time2(dt);
//				}

				return txt;
			};

			mc = new MoniChart(ops);
		}

		this.push = function(v, time, pd, vdiff) {
			_this.data.push([time, v, pd]);
			if (2 > _this.data.length) {
				return;
			}

			var hrc = calc_timerule(_this.timescan, _this.timebegin, time,
					_this.data);

			var vrc = calc_verticalrule(hrc.values, vdiff);

			mc.show({
						hrules : hrc.hrules,
						vrules : vrc.vrules,
						hscope : hrc.hscope,
						vscope : vrc.vscope,
						values : hrc.values
					});
		};

		this.setTimescan = function(timescan) {
			_this.timescan = timescan;
		};

		_this.constructor(ops);
	}

})();