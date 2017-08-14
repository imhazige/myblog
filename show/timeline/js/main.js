(function() {
	kzg.proj = {

	};

	function log(m) {
		window.console && console.log(m);
	}

	var Engine = kzg.svg.Engine;
	var ViewObj = kzg.svg.ViewObj;

	var diff_day = kzg.diff_day;
	var add_day = kzg.add_day;
	
	var mocked_datas;
	var views = [];

	var ids = {
		canvas : null
	};

	var attrs = {
		// x coordination
		xpoint : {
			fill : '#000',
			stroke : 'none'
		},
		// x coordination line
		x_coor_line : {
			'stroke' : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		},
		// y coordination line
		y_coor_line : {
			'stroke' : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		},
		// x point text
		x_point_text : {
			fill : '#19A2AA',
			'font-size' : '12px'
		},
		// month text
		x_month_text : {
			fill : '#000',
			'font-size' : '12px',
			'text-anchor' : 'start'
		},
		// project
		project : {
			stroke : 'none',
			'fill-opacity' : '0.3'
		},
		notes : {
			stroke : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1,
			fill : 'gray',
			'fill-opacity' : '0.3'
		},
		discussion : {
			stroke : '#000',
			'stroke-width' : '1px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : '0.3'
		}
	};

	var lang18 = {
		month : {
			1 : 'January',
			2 : 'February',
			3 : 'March',
			4 : 'April',
			5 : 'May',
			6 : 'June',
			7 : 'July',
			8 : 'August',
			9 : 'September',
			10 : 'October',
			11 : 'November',
			12 : 'December'
		}
	};

	var EG;
	var view;
	var day_unit_width = 35;
	var view_days_count = 31;
	var view_width;
	var view_height;

	var view_cur_x_start;
	var view_cur_x_end;

	var x_first_start_date;
	var x_last_start_date;

	//note, ie9 have bug when this value is biger than 200000
	var init_left_offset = 100000;
	var x_offset = -init_left_offset;
	
	var DATA_DAY_OFFSET = -2;

	function init() {
		for (var k in ids) {
			ids[k] = document.getElementById(k);
		}

		var el = ids.canvas;

		$(el).css('left', -init_left_offset);

		view_width = 1085;
		view_height = $(el).height();
		new Engine({
					el : el,
					width : view_width * 3,
					height : view_height
				});
		EG = Engine.get();

		// TODO fetch data
		var d1 = new Date();
		// date_start.setDate(1)
		
		//mock data
//		mocked_datas = mock_data([add_day(d1,-1),add_day(d1,1)],1);
//
//		log($.toJSON(mocked_datas));
//		
//		return;
		
		mocked_datas = testdata;
		
		var start_data = get_data([add_day(d1, DATA_DAY_OFFSET),
				add_day(d1, view_days_count * 3 - 1)]);

		// var d = kzg.str_2date('2011-02-02');
		// log(d);
		// log(diff_day(add_day(d1,100),d1));
		// return;

		load_view({
					start : d1,
					data : start_data
				});

		// scroll event
		// $(ids.canvas).on('mousedown',h_drag_start);
		kzg.dragscroll(ids.canvas, {
					start : h_drag_start,
					dragging : h_drag_do,
					end : h_drag_end
				});
		// kzg.dragscroll(document.getElementById('abc'));

		// EG.push(view);
		// EG.start();
	}

	function h_drag_start(e) {
		// ids.canvas._start = new Date(date_start.getTime());
		$(document.body).css('cursor', 'move');
	}

	function h_drag_do(e, d) {
		var offset = x_offset + d.dx;
		// EG.canvas.setViewBox(-offset, 0, EG.getWidth(), EG.getHeight(),
		// true);
		$(ids.canvas).css('left', offset);
	}

	function h_drag_end(e, d) {
		$(document.body).css('cursor', '');
		// log('end:');
		// log(d);

		x_offset += d.dx;
		// EG.canvas.setViewBox(-x_offset, 0, EG.getWidth(), EG.getHeight(),
		// true);
		$(ids.canvas).css('left', x_offset);

		// return;
		// load buffer view
		if (-x_offset < view_cur_x_start + view_width) {
			// log('left');
			// left load
			var dir = false;
			var d_scope = calc_date_scope(dir);
			// TODO fetch data
			load_view({
						dir : dir,
						start : add_day(d_scope[0], -DATA_DAY_OFFSET),
						data : get_data(d_scope)
					});
		} else if (-x_offset > view_cur_x_end - view_width) {
			// log('right');
			// right load
			var dir = true;
			var d_scope = calc_date_scope(dir);
			// TODO fetch data
			load_view({
						dir : dir,
						start : add_day(d_scope[0], -DATA_DAY_OFFSET),
						data : get_data(d_scope)
					});
		}
	}

	function get_data(date_scope) {
		
		
		var st = kzg.date_str(date_scope[0]);
		var et = kzg.date_str(date_scope[1]);
			
		while(st<mocked_datas.projects[0].start_date || et>mocked_datas.projects[mocked_datas.projects.length-1].end_date){
			//add mock data
			var needadd_start; 
			var needadd_end;		
			if (st<mocked_datas.projects[0].start_date){
				
				var mocksdate_now_start = kzg.str_2date(mocked_datas.projects[0].start_date);			
				needadd_start = add_day(mocksdate_now_start,-view_days_count*2);
				//make a joint data
				needadd_end = add_day(mocksdate_now_start,-1);
				
				var new_datas = mock_data([needadd_start,needadd_end],5);
				log('left');
				log([kzg.date_str(needadd_start),kzg.date_str(needadd_end)]);
				mocked_datas.projects = new_datas.projects.concat(mocked_datas.projects);
				mocked_datas.notes_and_discussions = new_datas.notes_and_discussions.concat(mocked_datas.notes_and_discussions); 			
			}
			if (et>mocked_datas.projects[mocked_datas.projects.length-1].end_date){
				
				var mocksdate_now_end = kzg.str_2date(mocked_datas.projects[mocked_datas.projects.length-1].end_date);
				needadd_start = add_day(mocksdate_now_end,1);
				
				//make a joint data
				needadd_end = add_day(needadd_start,view_days_count*2);
				
				var new_datas = mock_data([needadd_start,needadd_end],5);
				log('right');
				log([kzg.date_str(needadd_start),kzg.date_str(needadd_end)]);
				mocked_datas.projects = mocked_datas.projects.concat(new_datas.projects);
				mocked_datas.notes_and_discussions = mocked_datas.notes_and_discussions.concat(new_datas.notes_and_discussions); 			
			}
		}
		
		
		var proj_count = mocked_datas.projects.length;
		var nd_count = mocked_datas.notes_and_discussions.length;
		
		var ps = [];
		var nds = [];
		var start_index;
		
		
		function inscope(start,end){
			if (st<=start && start<=et){
				return true;
			}
			if (st<=end && end<=et){
				return true;
			}
			return false; 			
		}
		
		for (var i = 0 ; i < proj_count ; i++){
			var p = mocked_datas.projects[i];			
			if (!inscope(p.start_date,p.end_date)){
				continue;
			}
			ps.push(p);
		}
		
		for (var i = 0 ; i < nd_count ; i++){
			var nd = mocked_datas.notes_and_discussions[i];			
			if (nd.date < st || nd.date > et ){
				continue;
			}
			nds.push(nd);
		}
		
		return {projects:ps,notes_and_discussions:nds};				
	}

	function mock_data(date_scope,count) {
		function random_color() {
			return '#'
					+ (0x1000000 + (Math.random()) * 0xffffff).toString(16)
							.substr(1, 6);
		}

		var start = date_scope[0];
		var day_scope = diff_day(date_scope[1], date_scope[0]);
		// log(day_scope);

		var porjs = [];
		var notes_and_discussions = [];
		var mockd;
		for (var i = 0; i < count; i++) {
			var st = start;
			if (mockd) {
				st = add_day(mockd[1], -2);
			}
			mockd = mock_project(st, day_scope / count + 5, date_scope[1]);
			porjs.push(mockd[0]);
		}

		// mock notes
		var exs = {};
		for (var i = 0; i <= day_scope; i++) {
			var nst = start;
			nst = add_day(nst, i);
			if (nst > date_scope[1]) {
				break;
			}
			var dstr = kzg.date_str(nst);
			if (exs[dstr]) {
				continue;
			}
			exs[dstr] = true;
			var notes = [];
			var count = 5 * Math.random();
			for (var t = 0; t < count; t++) {
				notes.push({
							project_hexcolor : random_color()
						});
			}
			var discussions = [];
			var count = 5 * Math.random();
			for (var t = 0; t < count; t++) {
				discussions.push({
							project_hexcolor : random_color()
						});
			}

			var dns = {
				date : dstr,
				notes : notes,
				discussions : discussions
			};
			notes_and_discussions.push(dns);
		}
		// log(mockd[1]);

		function mock_project(st, day_scope, de) {
			var proj = {
				points : {},
				hexcolor : random_color()
			};

			var lastd;
			for (var j = 0; j <= day_scope; j++) {
				var d = add_day(st, j);
				if (d > de) {
					break;
				}
				var dstr = kzg.date_str(d);
				proj.points[dstr] = {
					active_tasks_nb : Math.round(20 * Math.random())
				};
				lastd = d;
				if (lastd.getFullYear() == de.getFullYear()
						&& lastd.getMonth() == de.getMonth()
						&& lastd.getDate() == de.getDate()) {
					break;
				}
			}
			proj.start_date = kzg.date_str(st);
			proj.end_date = kzg.date_str(lastd);

			return [proj, lastd];
		}

		var result = {
			projects : porjs,
			notes_and_discussions : notes_and_discussions
		};

		// log(date_scope);
		// log($.toJSON(result));

		return result;
	}

	// 1 more day previous view start and 0 more day next view end
	function calc_date_scope(dir, count) {
		var rd;
		if (!count) {
			count = 1;
		}
		if (!dir) {
			// left
			rd = add_day(x_first_start_date, -count * view_days_count);
		} else {
			// right
			rd = add_day(x_last_start_date, count * view_days_count);
		}
		// here we should keep the days match the count, so need
		var rd2 = add_day(rd, count * view_days_count - 1);

		return [add_day(rd, DATA_DAY_OFFSET), rd2];
	}

	function load_view(ops) {
		var dir = ops.dir;
		var daylen;
		if (isNaN(dir)) {
			view_cur_x_start = init_left_offset - view_width;
			view_cur_x_end = init_left_offset + 2 * view_width;
			x_first_start_date = ops.start;
			x_last_start_date = add_day(x_first_start_date, 2 * view_days_count);
			daylen = 3 * view_days_count;
			ops = $.extend(ops, {
						x_start : view_cur_x_start,
						x_end : view_cur_x_end
					});
		} else if (!dir) {
			// left
			var x_start = view_cur_x_start - view_width;
			daylen = view_days_count;
			ops = $.extend(ops, {
						x_start : x_start,
						x_end : view_cur_x_start
					});
			view_cur_x_start = x_start;
			x_first_start_date = ops.start;
			
			//remove last one view 
			if (views.length>2){
				var remove_view = views.pop();
				remove_view.remove();
				var now_start_view = views[views.length-1];
				view_cur_x_end = now_start_view.config.x_end;
				x_last_start_date = now_start_view.config.start;
				log('remove right view:' + kzg.date_str(remove_view.config.start));
				log('cur last start date:' + kzg.date_str(x_last_start_date));
			}
			
		} else {
			// extend right
			var x_end = view_cur_x_end + view_width;
			daylen = view_days_count;
			ops = $.extend(ops, {
						x_start : view_cur_x_end,
						x_end : x_end
					});
			view_cur_x_end = x_end;
			x_last_start_date = ops.start;
						
			//remove first one view
			if (views.length>2){
				var remove_view = views.shift();
				remove_view.remove();
				var now_start_view = views[0];
				view_cur_x_start = now_start_view.config.x_start;
				x_first_start_date = now_start_view.config.start;
				log('remove left view:' + kzg.date_str(remove_view.config.start));
				log('cur first start date:' + kzg.date_str(x_first_start_date));
			}
		}
		var config = $.extend(ops, {
					attrs : attrs,
					x_offset_to_bottom : 60,
					y_offset_to_left : 0,
					x_point_radius : 5,
					x_unit_width : 35,
					x_offset_to_right : 0,
					// x text to x line(y direction)
					x_text_y_offset_to_xline : 15,
					// y coord start y
					y_offset_to_top : 20,
					// moth text to x day text
					x_month_text_y_offset_to_xtext : 10,
					// view days scope, note, if its value is 1, it only contain
					// the start day
					scope : daylen,
					lang18 : lang18,
					// unit y
					y_unit : 4,
					// note offset to the project point
					y_offset_note : 20,
					// space among notes
					y_space_note : 10,
					// width of one note square
					width_note : 10,
					//space among discussion
					y_space_discussion : 10
				});
		// log('new view:' + start);
		view = new ViewObj(config);

		view.render(EG);
		
		if (isNaN(dir)){
			//init
			views.push(view);
		}else if(!dir){
			//left
			views.unshift(view);
		}else{
			//right
			views.push(view);
		}

		// this is for the non-viewbox solution
		EG.setSize(view_cur_x_end);
	}

	$(init);
})();