(function() {

	var NS = kzg;
	// var log = NS.log;

	var st_d;
	var st_n;
	var st_r;
	var st_h;
	var st_s;
	var st_c;
	
	var pollstop;

	function fmt_int(n) {
		var ns = n + '';

		var rs = [];
		for (var i = ns.length - 1, j = 1; i >= 0; i--, j++) {
			rs.push(ns.charAt(i));
			if (0 != j && !(j % 3)) {
				rs.push(',');
			}
		}
		rs = rs.reverse();
		var str = rs.join('');
		if (',' == str.charAt(0)) {
			str = str.substring(1);
		}

		return str;
	}

	function fmt_num(v, index) {
		if (isNaN(index)) {
			index = 2;
		}
		if (0 === v) {
			return '0';
		}
		var v = v + '';
		var l = v.length;
		var s = [];
		s[0] = v.substring(0, l - index);
		s[1] = v.substring(l - index);

		return fmt_int(parseInt(s[0])) + '.' + s[1];
	}

	function override(d, s) {
		for (var i in s) {
			d[i] = s[i];
		}

		return d;
	}

	function load() {
		function baseops() {
			return {
				width : 600,
				height : 180,
				chartwidth : 400,
				chartheight : 120,
				chartx : 80,
				charty : 20,
				offsetvtext : 30,
				vtextfn : function(v) {
					return fmt_num(v);
				},
				lasttextfn : function(v) {
					var rate = v[2][3];
					if (-1 == rate.indexOf('%')) {
						rate = rate + '%';
					}

					return fmt_num(v[1]) + '\n' + v[2][2] + ' (' + rate + ')';
				},
				lasttextrenderfn : function(v, gc) {
					if ('-' != v[2][2].charAt(0)) {
						gc = gc.attr({
									stroke : 'none',
									fill : 'red'
								});
					} else {
						gc = gc.attr({
									stroke : 'none',
									fill : 'green'
								});
					}

					return gc;
				}
			};
		}

		st_d = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder1'),
					timeoffset : -5
				}));
		st_n = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder2'),
					timeoffset : -5
				}));
		st_r = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder3'),
					timeoffset : 9
				}));
		st_h = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder4'),
					timeoffset : 8
				}));
		st_s = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder5'),
					timeoffset : 8
				}));
		st_c = new NS.Chart(override(baseops(), {
					el : document.getElementById('holder6'),
					timeoffset : 8
				}));

		var sel = document.getElementById('sel');
		sel.onchange = function() {
			var tsc = sel.options[sel.selectedIndex].value;
			st_d.setTimescan(NS.TIME_SCAN[tsc]);
			st_n.setTimescan(NS.TIME_SCAN[tsc]);
			st_r.setTimescan(NS.TIME_SCAN[tsc]);
			st_h.setTimescan(NS.TIME_SCAN[tsc]);
			st_s.setTimescan(NS.TIME_SCAN[tsc]);
			st_c.setTimescan(NS.TIME_SCAN[tsc]);
		};

		var count = 0;
		var rate = 1;
		document.getElementById('btn').onclick = function() {
			pollstop = true;
		};

		poll();
	}

	function jpc_stoke(v, st, vdiff, log) {
		if (log) {
			console.log(v);
		}
		if (!vdiff) {
			vdiff = 1000;
		}
		var ss = v.split(',');
		var index = 1;
		var io = ss[index].indexOf('.');
		ss[index] = ss[index].substring(0, io)
				+ ss[index].substring(io + 1, io + 3);
		ss[index] = parseInt(ss[index].replace(/\./g, ''));
		ss[2] = ss[2].substring(0, ss[2].indexOf('.') + 3);

		st.push(ss[index], new Date(), ss, vdiff);
	}

	function poll() {
		if (pollstop){
			return;
		}
		// var hq_str_int_dji="道琼斯,12949.90,45.79,0.35";
		jpc('http://hq.sinajs.cn/list=int_dji', function() {
					jpc_stoke(hq_str_int_dji, st_d, 10000);
				});
		// var hq_str_int_nasdaq="纳斯达克,2951.78,-8.07,-0.27";
		jpc('http://hq.sinajs.cn/list=int_nasdaq', function() {
					jpc_stoke(hq_str_int_nasdaq, st_n);
				});
		// var hq_str_int_nikkei="日经指数,9485.09,100.92,1.08";
		jpc('http://hq.sinajs.cn/list=int_nikkei', function() {
					jpc_stoke(hq_str_int_nikkei, st_r);
				});
		// var hq_str_int_hangseng="恒生指数,21472.46,-19.16,-0.09";
		jpc('http://hq.sinajs.cn/list=int_hangseng', function() {
					jpc_stoke(hq_str_int_hangseng, st_h, 10000);
				});

		// var hq_str_b_FSSTI="新加坡海峡时报指数,3004.67,4.08,0.14,03:07";
		jpc('http://hq.sinajs.cn/list=b_FSSTI', function() {
					jpc_stoke(hq_str_b_FSSTI, st_s);
				});

		// var hq_str_s_sh000001="上证指数,2354.741,-8.856,-0.37,391941,3648759";
		jpc('http://hq.sinajs.cn/list=s_sh000001', function() {
					jpc_stoke(hq_str_s_sh000001, st_c);
				});

		setTimeout(poll, 3000);
	}

	function jpc(src, fn) {
		var head = document.getElementsByTagName("head")[0];
		var j = document.createElement("script");
		j.type = "text/javascript";
		j.onload = j.onreadystatechange = function() {
			if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				j.onload = j.onreadystatechange = null;
				fn && fn();
				if (head && j.parentNode) {
					head.removeChild(j);
				}
			}
		}
		// j.src = src + '&tmp=' + new Date().getTime();
		j.src = src;
		head.appendChild(j);
	}

	window.onload = load;

})();