(function() {
	jQuery.fn.center = function() {
		this.css("position", "absolute");
		this.css("top", (($(window).height() - this.outerHeight()) / 2)
						+ $(window).scrollTop() + "px");
		this.css("left", (($(window).width() - this.outerWidth()) / 2)
						+ $(window).scrollLeft() + "px");
		return this;
	}

	function log(v) {
		console.log(v);
		var l = $('#log');
		l.html(l.html() + v + '<br>');
	}

	var vist_closed;
	var pollstop;
	var btnactype = 'sms';
	var wp_sid;
	var phono;
	var p_data = [];
	var SIZE_HIDE_MSG = 5;
	var debugmode;
	var phono_inited;
	var MSG_EMPTY = 'text and type Enter to send or call.';
	var IMG_PREFIX = 'img/';
	var cur_call;

	var ac = {
		s : 'action.php',
		c : 'close.php',
		p : 'poll.php',
		r : 'rd.php'
	};

	var ids = {
		btnSend : 'btnSend',
		inpto : 'telnum',
		txtmsg : 'txtmsg',
		rdocall : 'rdocall',
		rdosms : 'rdosms',
		rdoim : 'rdoim',
		tipmsg : 'tipmsg',
		statusmsg : 'statusmsg',
		hist : 'hist',
		callwin : '__01',
		btn_answer : 'btn_answer',
		btn_ignore : 'btn_ignore',
		img_avatar : 'img_avatar',
		btn_close : 'call-06',
		callwin_msg : 'callwin_msg'

	};

	var _this = kzg = {
		init : init,
		h_ta_click : h_ta_click,
		clicktab : clicktab,
		onKeyupPasswd : onKeyupPasswd,
		h_ta_blur : h_ta_blur
	}

	function gid(id) {
		return document.getElementById(id);
	}

	function initids() {
		for (var i in ids) {
			ids[i] = gid(ids[i]);
		}
	}

	function pad(v) {
		if (v < 10) {
			return '0' + v;
		}

		return v;
	}

	function fmt_time(d) {
		d = d ? d : new Date();
		return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':'
				+ pad(d.getSeconds())
	}

	function closess() {
		stoppoll();
		if (vist_closed) {
			return;
		}
		$.ajax({
					async : false,
					url : ac.c,
					dataType : 'json',
					type : 'post',
					data : {
						vid : _this.vid
					}
				});
		vist_closed = true;
	}

	function stoppoll() {
		pollstop = true;
	}

	function startpoll() {
		var error_count = 0;

		function error_handle(msg) {
			if (!msg) {
				msg = '';
			}
			closess();
			alert('poll error many times:' + msg);
		}

		function deldayfn() {
			if (pollstop) {
				return;
			}
			setTimeout(pollfn, 2000);
		}

		function pollfn() {
			$.ajax({
						url : ac.p + '?t=' + new Date().getTime(),
						dataType : 'json',
						type : 'post',
						data : {},
						success : function(d) {
							// d = $.parseJSON(d);
							if (!d || (d.status && 'error' == d.status)) {
								error_count++;
								if (!d) {
									d = {
										msg : 'server no data response!'
									}
								}
								if (error_count > 3) {
									error_handle(d.msg);
									return;
								}
							} else {
								error_count = 0;
							}
							processmsg(d);
							deldayfn();
						},
						error : function() {
							error_count++;
							if (error_count > 3) {
								error_handle('net work error.');
								return;
							}
							deldayfn();
						}
					});
		}

		deldayfn();
	}

	function processmsg(d) {
		for (var i in d.data) {
			var id = d.data[i];
			showinmsg(id.from, id);
		}
	}

	function buildid(to, type) {
		type = type.toLowerCase();
		return to + '_' + type;
	}

	function get_pdatabytype(to, type) {
		type = type.toLowerCase();
		return get_pdata(buildid(to, type));
	}

	function get_pdata(id, k) {
		if (!p_data[id]) {
			return null;
		}

		var d = p_data[id];

		if (!k) {
			return d;
		}

		return d[k];
	}

	function set_pdata(id, k, v) {
		if (!p_data[id]) {
			p_data[id] = {
				id : id
			};
		}
		p_data[id][k] = v;
	}

	function create_pdata(to, type, text) {
		type = type.toLowerCase();
		var id = buildid(to, type);
		var ri = Math.floor(5 * Math.random());
		p_data[id] = {
			id : id,
			to : to,
			type : type,
			text : text ? text : to,
			avatar : 'f_' + ri + '.gif'
		};

		return p_data[id];
	}

	function do_hist_msg(p, msg, inm) {
		var n_hist = gid(id_p_msg_hist(p));
		var st = $(gid(id_p_msg_status(p)));
		var hist = $(n_hist);
		var pid = id_base(p);

		var count = get_pdata(pid, 'msg.count');
		count = count ? count : 1;
		set_pdata(pid, 'msg.count', count + 1);

		var n_ui = get_pdata(pid, 'msg.uiel');
		n_ui = n_ui ? n_ui : [];
		set_pdata(pid, 'msg.uiel', n_ui);

		if (inm) {
			n_ui.push($("<div class='hist-me'><b>Me: </b>" + msg
					+ "<span class='msg-time'>" + fmt_time() + "</span></div>")
					.appendTo(hist));
		} else {
			if ('string' == typeof(msg)) {
				msg = {
					msg : msg,
					time : fmt_time()
				};
			}
			st.hide();
			n_ui.push($("<div class='hist-p'><b>" + p.text + ": </b>" + msg.msg
					+ "<span class='msg-time'>" + msg.time.substring(11)
					+ "</span></div>").appendTo(hist));
			move_top($(gid(id_ct_provider(p))));
		}

		// hide hist
		if (count > SIZE_HIDE_MSG && !get_pdata(pid, 'showhist')) {
			var hid_a = gid(id_p_msg_hist_morea(pid));

			if (hid_a) {
				$(hid_a).html(count - 3 + ' more messages');
				n_ui[n_ui.length - 3].addClass('x-hide');
			} else {
				for (var i = 1; i < n_ui.length - 2; i++) {
					n_ui[i].addClass('x-hide');
				}
				var a = $('<a id="' + id_p_msg_hist_morea(pid)
						+ '" href="javascript://" class="showhidemsg" >'
						+ (count - 3) + ' more messages</a>');
				a.insertAfter(n_ui[0]).bind('click', function() {
							hist.children().removeClass('x-hide');
							$(this).remove();
						});
			}
		}

	}

	function showinmsg(to, frommsg) {
		var nd = get_pdatabytype(to, frommsg.type);
		if (!nd) {
			nd = create_pdata(to, frommsg.type, to);
			shownew(nd);
		}

		do_hist_msg(nd, frommsg);
	}

	function h_ta_click(elid) {
		var ta = $(gid(elid));
		var nowtxt = ta.val();
		if (MSG_EMPTY == nowtxt) {
			ta.val('');
			ta.removeClass('emptyta');
		} else {

		}
	}

	function h_ta_blur(elid) {
		var ta = $(gid(elid));
		var nowtxt = ta.val();
		if ('' == nowtxt) {
			ta.val(MSG_EMPTY);
			ta.addClass('emptyta');
		} else {

		}
	}

	function clicktab(id) {

	}

	function onKeyupPasswd(ev, tid, id) {
		var evKeyup = ev || window.event;

		if (13 !== evKeyup.keyCode) {
			return;
		}

		var txt = $(gid(tid));
		var msg = $.trim(txt.val());
		var d = get_pdata(id);

		dosend(d, msg);
		txt.val("");
	}

	function build_tab(d) {
		return "<div id='"
				+ id_ct_provider(d)
				+ "'><div id=\""
				+ d.id
				+ "\" class=\"d\" style=\"position:relative; background:#F7F7F7; padding:5px; width:100%; display:inline-block;\" onclick=\"kzg.clicktab('"
				+ d.id
				+ "');\">"
				+ "<div style=\"float:left; width:70px;\">"
				+ "<div style=\"position:relative; width:10px; height:15px;\"></div>"
				+ "<div style=\"position:relative; width:65px; height:65px;\">"
				+ "<img class=\"back_image\" type=button name=like_button style=\"width:65px; height:65px;\" src=\"img/"
				+ d.avatar
				+ "\"></div>"
				+ "<div style=\"position:relative; width:10px; height:15px;\">"
				+ d.type.toUpperCase()
				+ "</div>"
				+ "</div>"
				+ "<div style=\"float:left; width:85%;color:black;\">"
				+ "<div style=\"position:relative; height:10px;\"></div>"
				+ "<div style=\"position:relative;\">"
				+ "<b><div class=\"textinfo\" style=\"position:relative; float:left; \"></div></b>"
				+ "<div style=\"position:relative; float:left; width:10px; height:15px;\"></div>"
				+ "<b><div class=\"textinfo\" style=\"position:relative; float:left; COLOR: blue; TEXT-DECORATION: underline;\">"
				+ d.text
				+ "</div></b>"
				+ "<div style=\"position:relative; float:left; width:10px; height:15px;\"></div>"
				+ "<b><div id=\"\" class=\"textinfo\" style=\" position:relative; FONT-SIZE: 15px; float:left; color:#93c47d; \"><img src=\"img/loading.gif\"/>"
				+ "</div></b>"
				+ "<div style=\"position:relative; float:right; width:50px; height:11px;\"></div>"
				+ "<br>"
				+ "</div>"
				+ "<div style=\"clear:both;\"></div>"
				+ "<div id=\""
				+ "text_preta"
				+ d.id
				+ "\" class=\"textinfo\" style=\"position:relative;\"><span id=\""
				+ id_p_msg_status_txt(d)
				+ "\">&nbsp;</span></div>"
				+ "<div id=\""
				+ "text_ta"
				+ d.id
				+ "\" class=\"textinfo\" style=\"position:relative; \"> </div>"
				+ "<div ><textarea id=\""
				+ id_p_txtinput(d)
				+ "\" class=\"textbox emptyta\" name=\"sendrequest\" rows=\"2\" onblur=\"kzg.h_ta_blur(id);\" onclick=\"kzg.h_ta_click(id);\" onkeyup=\"kzg.onKeyupPasswd(event, this.id, '"
				+ d.id
				+ "');\">"
				+ MSG_EMPTY
				+ "</textarea></div>"
				+ "</div>"
				+ "</div>"
				+ "<hr color=\"#DDDDDD\" noshade=\"noshade\" size=\".5px\" width=\"100%\" />"
				+ '</div>';

	}

	function ac_send(to, msg, type, fn) {
		function error_handle(msg) {
			if (!msg) {
				msg = '';
			}
			// closess();
			alert('send failure!\n' + msg);
		}
		$.ajax({
					url : ac.s,
					dataType : 'json',
					type : 'post',
					data : {
						to : to,
						msg : msg,
						type : type
					},
					success : function(d) {
						// d = $.parseJSON(d);
						if (d && 'error' == d.status) {
							error_handle(d.msg);
							return;
						}
						fn && fn();
					},
					error : function() {
						error_handle();
					}
				});

	}

	function ac_rec(from, to, dir, msg, type, fn) {
		function error_handle(msg) {
			if (!msg) {
				msg = '';
			}
			// closess();
			alert('send failure!\n' + msg);
		}
		$.ajax({
					url : ac.r,
					dataType : 'json',
					type : 'post',
					data : {
						from : from,
						to : to,
						msg : msg,
						type : type,
						dir : dir
					},
					success : function(d) {
						// d = $.parseJSON(d);
						if (d && 'error' == d.status) {
							error_handle(d.msg);
							return;
						}
						fn && fn();
					},
					error : function() {
						error_handle();
					}
				});

	}

	function tip(msg, type) {
		msg = msg ? msg : '';
		var n = $(ids.tipmsg);

		n.text(msg);
		n.removeClass('tip-warn');
		n.removeClass('tip-error');
		if ('warn' == type) {
			n.addClass('tip-warn')
		} else if ('error' == type) {
			n.addClass('tip-error')
		}
	}

	function status(msg, type) {
		msg = msg ? msg : '';
		var st = $(ids.statusmsg);

		st.text(msg);
		st.removeClass('tip-warn').removeClass('tip-error');
		if ('warn' == type) {
			st.addClass('tip-warn')
		} else if ('error' == type) {
			st.addClass('tip-error')
		}
	}

	function hung_curcall() {
		if (!cur_call) {
			return false;
		}

		cur_call.hangup();
		cur_call = null;

		return true;
	}

	function call(to) {
		// to = to.substring(2);
		cur_call = phono.phone.dial(_this.appid, {
					headers : [{
								name : "x-to",
								value : to
							}, {
								name : "x-vid",
								value : _this.vid
							}],
					onRing : function() {
						status(to + " Ringing");
					},
					onAnswer : function() {
						status(to + "Answered");
					},
					onHangup : function() {
						status(to + "Hangup");
						btn.html(html_img(IMG_PREFIX + 'call.jpg', W, H));
						cur_call = null;
					},
					onError : function() {
						status(to + "Error");
						btn.html(html_img(IMG_PREFIX + 'call.jpg', W, H));
						cur_call = null;
					}
				});

		var W = 30;
		var H = 30;
		var btn = $(ids.btnSend);
		btn.html(html_img(IMG_PREFIX + 'hungup.jpg', W, H));
	}

	function shownew(p) {
		var p1 = build_tab(p);
		p.show = true;
		move_top(p1);
	}

	function move_top(n) {
		$(n).prependTo(ids.hist);
	}

	function html_img(src, width, height) {
		return '<img src="' + src + '"  width="' + (width ? width : '')
				+ '" height="' + (height ? height : '') + '">';
	}

	function update_type() {
		var W = 30;
		var H = 30;
		var btn = $(ids.btnSend);
		if ('sms' == btnactype) {
			btn.html(html_img(IMG_PREFIX + 'sms.gif', W, H));
			tip('Only Support Sms User In US And Canada.');
		} else if ('call' == btnactype) {
			btn.html(html_img(IMG_PREFIX + 'call.jpg', W, H));
			tip('Only Support Phone User In US And Canada, And You Need Allow The Flash Access Your Micphone And Speaker.');
		} else if ('im' == btnactype) {
			btn.html(html_img(IMG_PREFIX + 'im.gif', W, H));
			tip(
					'Only Support Xmpp User Such As: Gtalk Jabber AIM, And The Target XMPP User Need Add '
							+ wp_sid + ' As Their ' + 'Contact At First.',
					'warn');
		}
	}

	function h_radio() {
		hung_curcall();
		btnactype = this.value;
		update_type();
	}

	function parse_tel(v) {
		if (!v) {
			return '';
		}
		var v = $.trim(v);
		if ('' == v) {
			return v;
		}

		v = v.replace(/[^0-9]/g, '');

		var tel = parseInt(v);
		if (!tel) {
			log('invalid phone number:' + v);
			return '';
		}

		if (10 == v.length) {
			v = '+1' + v;
		} else {
			v = '+' + v;
		}

		return v;
	}

	function dosend(d, msg) {
		var to = d.to;
		if ('' == to || ('' == msg && 'call' != d.type)) {
			return;
		}
		if ('sms' == d.type) {
			ac_send(to, msg, d.type);
		} else if ('call' == d.type) {
			if (hung_curcall()) {
				return;
			}

			call(to);
			msg = 'call out to ' + to;
			ac_rec(wp_sid, to, 'out', msg, d.type);
		} else if ('im' == d.type) {
			// TODO tmp call
			// call(to);
			phono.messaging.send(to, msg);
			ac_rec(wp_sid, to, 'out', msg, d.type);
		}

		do_hist_msg(d, msg, true);
	}

	function h_button() {
		var to = ids.inpto.value;
		var txt = $(ids.txtmsg);
		var msg = $.trim(txt.val());

		// debug
		if (0 === msg.indexOf('/debug')) {
			debugmode = !debugmode;
			txt.val("");

			return;
		}

		if (debugmode) {
			try {
				var msgs = $.parseJSON(msg);
			} catch (e) {
				alert('not a valide json');
			}
			processmsg(msgs);

			return;
		}

		if ('' == to || ('' == msg && 'call' != btnactype)) {
			alert('can not send empty message or send to nobody.');

			return;
		}

		to = $.trim(to);
		var tel;
		if ('im' == btnactype) {
			tel = to;
		} else {
			tel = parse_tel(to);
		}

		var d = get_pdatabytype(tel, btnactype);

		if (!d) {
			d = create_pdata(tel, btnactype, to);
			shownew(d);
		}

		dosend(d, msg);

		txt.val('');
	}

	function h_messgin(event) {
		var message = event.message;
		var d = get_pdatabytype(message.from, 'im');
		do_hist_msg(d, message.body);
		ac_rec(message.from, wp_sid, 'in', message.body, 'im');
	}

	function init_phono() {
		var count = 0;
		var timestamp;
		function func() {
			if (phono_inited) {
				return;
			}
			if (0 === count) {

			} else if (count < 3) {
				status('init fail, try again.', 'warn');
			} else {
				status(
						'Sorry, Call and IM module init fail. Please try to reload this page again.',
						'error');
				phono_inited = 'cancel';

				return;
			}
			var tmp = new Date();
			timestamp = tmp;
			phono = $.phono({
						apiKey : _this.apiKey,
						onReady : function() {
							if ('cancel' == phono_inited) {

								return;
							}
							if (timestamp != tmp) {

								return;
							}
							wp_sid = this.sessionId;
							log('session init ok: ' + wp_sid);
							$(ids.rdocall).attr("disabled", false);
							$(ids.rdoim).attr("disabled", false);
							status();
							phono_inited = true;
						},
						phone : {
							headset : true,

							// Event Handlers
							onIncomingCall : function(event) {
								var call = event.call;
								var caller = call.initiator.substring(0,
										call.initiator.indexOf('@'));
								log("Incoming Call From: " + caller);
								var p = get_pdatabytype(caller, 'call');
								// console.log(event);
								show_callwin(call, p);
								var msg = 'call in from ' + caller;
								ac_rec(caller, wp_sid, 'in', msg, 'call');
								do_hist_msg(p, msg);
							},
							onHangup : function(event) {
								log("Hangup:" + call.id);
							},
							onError : function(event) {
								log("Phone error: " + e.reason);
							}
						},
						messaging : {
							onMessage : h_messgin
						}
					});
			count++;
			setTimeout(func, 10000);
		}

		func();
	}

	function init(ops) {
		initids();
		$.extend(_this, ops);
		for (var i in ac) {
			ac[i] = _this.prefix + ac[i];
		}

		$('input[type="radio"]').bind('click', h_radio);
		$(ids.rdosms).attr("disabled", false);

		$(ids.btnSend).bind('click', h_button);

		window.onbeforeunload = function(e) {
			return 'Are You Sure To Leave This Page?';
		};

		window.onunload = function() {
			closess();
		};

		status('Initializing Call And IM For You ...');

		init_phono();

		startpoll();

		update_type();
	}

	function hide_callwin() {
		$(ids.btn_ignore).unbind('click');
		$(ids.btn_close).unbind('click');
		$(ids.btn_answer).unbind('click');
		$(ids.callwin).hide();
	}

	function show_callwin(call, p) {
		if (!ids.callwin.inited) {

		}

		function h_ignore() {
			call.hangup();
			hide_callwin();
		}

		$(ids.btn_ignore).bind('click', h_ignore);
		$(ids.btn_close).bind('click', h_ignore);
		$(ids.btn_answer).bind('click', function() {
					call.answer();
					$(ids.callwin).hide();
				});

		ids.img_avatar.src = 'img/' + p.avatar;
		$(ids.callwin_msg).text('Call From ' + p.text);
		$(ids.callwin).show().center();
	}

	function id_base(p, id) {
		if (!id) {
			id = '';
		}
		if (typeof(p) === 'string' || typeof(p) === 'number') {
			return id + p;
		}

		if (typeof(p) === 'object') {
			return id + p.id;
		}

		throw 'undefined data type:' + typeof(p);
	}

	function id_ct_provider(p) {
		return id_base(p, 'ct_');
	}

	function id_p_msg_status(p) {
		return id_base(p, 'text_preta');
	}

	function id_p_msg_status_txt(p) {
		return id_base(p, 'msg_st');
	}

	function id_p_msg_hist(p) {
		return id_base(p, 'text_ta');
	}

	function id_p_msg_hist_morea(p) {
		return id_base(p, 'hist_ma');
	}

	function id_p_msg_hist_hidec(p) {
		return id_base(p, 'hist_hd');
	}

	function id_p_txtinput(p) {
		return id_base(p, 'ta');
	}

	function id_p_rate(p) {
		return id_base(p, 'rate_');
	}

	function id_rev_img(p) {
		return id_base(p, 'rev_img');
	}
})();