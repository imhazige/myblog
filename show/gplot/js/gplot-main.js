(function() {

	var nodes = [{
		name : 'note1',
		type : 'service',
		"description" : "Service 1 xxxxx desc",
		"dependent" : {
			"database" : ["#", "#db2"],
			"service" : ["#note2", '#note3', '#note3',
					'#note1']
		}

	}, {
		name : 'note2',
		type : 'service'
	}, {
		name : 'note3',
		type : 'service',
		"dependent" : {
			"database" : ["#", "#db2"],
			"service" : ["#note4"]
		}
	}, {
		name : 'note4',
		type : 'service',
		"dependent" : {
			"service" : ["#note1", "#note3"]
		}
	}
	, {
		name : 'note5',
		type : 'service',
		"dependent" : {
			"service" : ["#note4", "#note2","#note1"]
		}
	}
	, {
		name : 'note6',
		type : 'service',
		"dependent" : {
			"service" : ["#note2"]
		}
	}
	, {
		name : 'note7',
		type : 'service',
		"dependent" : {
			"service" : ["#note5","#note6"]
		}
	},{
		name : 'note8',
		type : 'service',
		"dependent" : {
			"service" : ["#note7"]
		}
	},{
		name : 'note9',
		type : 'service',
		"dependent" : {
			"service" : ["#note3"]
		}
	},{
		name : 'note10',
		type : 'service',
		"dependent" : {
			"service" : ["#note3"]
		}
	},{
		name : 'note11',
		type : 'service',
		"dependent" : {
			"service" : ["#note2"]
		}
	},{
		name : 'note12',
		type : 'service',
		"dependent" : {
			"service" : ["#note6"]
		}
	}
	];

	function log(x) {
		window.console && console.log(x);
		var el = document.getElementById('log');
		if (!el) {
			return;
		}
		el.value += x + '\n';
		el.scrollTop = 10000;
	}

	function init() {
		var el = document.getElementById('canvas');
		for (var i in nodes) {
			var n = nodes[i];
			nodes[i].icon = get_icon(n);			
		}
		var ops = {
				node_relation : node_relation,
				el : el,
				width : $(el).width(),
				height : $(el).height(),
				start : nodes[0]
			};

		kzg.gplot.load(ops);
	}

	var istart = 0; 
	
	function get_icon(d) {
		istart++;
		return 'css/img/'+istart+'.jpg'
	}

	function node_relation(n) {
		var dependent = combine_depends(n);
		//		log('node_relation:' + n.name);
		//		log(n);
		if (!dependent) {
			return false;
		}

		var deps = [];
		// depend out relation
		for (var k in dependent) {
			var da = dependent[k];
			for (var m in da) {
				var di = da[m];
				var name;
				if ('#' == di.charAt(0)) {
					name = di.substring(1);
				} else {
					name = di;
				}
				var sr = search_nodes(name, k);
				if (!sr) {
					continue;
				}
				// NOTE:here, depen_in means sr depend n
				var sr = $.extend({
							depen_in : false
						}, sr);
				deps.push(sr);
			}
		}

		// depend in relation
		for (var i in nodes) {
			var ni = nodes[i];
			var odep = combine_depends(ni);
			for (var k in odep) {
				var da = odep[k];
				for (var m in da) {
					var di = da[m];
					var name;
					if ('#' == di.charAt(0)) {
						name = di.substring(1);
					} else {
						continue;
					}
					if (name == n.name && k == n.type) {
						// NOTE:here, depen_in means sr depend n
						var sr = $.extend({
									depen_in : true
								}, ni);
						deps.push(sr);
					}
				}
			}
		}

//		log('got relation for:' + n.name);
//		log(deps);

		return deps;
	}

	function combine_depends(n) {
		if (!n.dependent && !n.jmsDestination) {
			return false;
		}
		var deps = [];
		var dependent = n.dependent ? n.dependent : {};
		if (n.jmsDestination) {
			dependent = $.extend({
						jms : [n.jmsDestination]
					}, dependent);
		}

		for (var i in dependent) {
			var d = dependent[i];
			remove_from_array(d,'#' + n.name);
			dependent[i] = unique_array(d);
		}

		return dependent;
	}

	function remove_from_array(a, v) {
		var i = index_of_array(a, v);
		if (-1 != i) {
			delete a[i];
		}
	}

	function index_of_array(a, v) {
		for (var i in a) {
			var vi = a[i];
			if (vi == v) {
				return i;
			}
		}

		return -1;
	}

	function unique_array(a) {
		var na = [];
		for (var i in a) {
			var v = a[i];
			if (-1 == index_of_array(na, v)) {
				na.push(v);
			}
		}

		return na;
	}

	function search_nodes(name, type) {
		for (var i in nodes) {
			var ni = nodes[i];
			if (ni.name == name && ni.type == type) {
				return ni;
			}
		}

		return false;
	}

	$(init);
})();