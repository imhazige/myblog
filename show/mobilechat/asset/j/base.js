(function() {
	kzg = {

	};

	var ctimeout;
	var jk = jQuery;
	var poll_stopped;
	var poll_xhr;

	kzg.base = {
		ids : ids,
		log : log,
		tmpl : tmpl,
		escape_html : escape_html,
		start_poll : start_poll,
		stop_poll : stop_poll,
		apply : _apply,
		now : now,
		rpad : rpad,
		request : request,
		requestTry3times : try_req,
		showDialog : showDialog,
		isIE : isIE,
		enable : enable,
		disable : disable,
		isEnable : isEnable,
		showMsg : showMsg,
		buildValidateOps : buildValidateOps,
		format : format,
		paddingLeft:paddingLeft,
		paddingRight:paddingRight
	};

	function log(m) {
		window.console && window.console.log && window.console.log(m);
	}

	function rpad(r, s, p) {
		p = p ? p : '&nbsp;';
		if (!r) {
			r = '';
		}
		if (r.length > s) {

			return r;
		}

		var rt = r;
		for (var i = 0; i < s - r.length; i++) {
			rt += p;
		}

		//		console.log('return r:' + rt + ']');

		return rt;
	}

	function ids(is) {
		for (var o in is) {
			var k = o;
			if (is[o]) {
				k = is[o];
			}
			is[o] = document.getElementById(k);
		}

		return is;
	}

	function _apply(o, no) {
		for (var k in no) {
			o[k] = no[k];
		}

		return o;
	}

	function paddingLeft(s, c, n) {
		if (!s || !c || s.length >= n) {
			return s;
		}
		var max = (n - s.length) / c.length;
		for (var i = 0; i < max; i++) {
			s = c + s;
		}
		return s;
	}

	// right padding s with c to a total of n chars
	function paddingRight(s, c, n) {
		if (!s || !c || s.length >= n) {
			return s;
		}
		var max = (n - s.length) / c.length;
		for (var i = 0; i < max; i++) {
			s += c;
		}
		return s;
	}

	function now() {
		return jQuery.format.date((new Date()).getTime(),
				"MM-dd-yyyy hh:mm:ss:SSS");
	}

	function buildValidateOps(ops) {
		var suc = ops.success;
		var ops = $.extend(ops, {
					highlight : function(element) {
						$(element).closest('.control-group')
								.removeClass('success').addClass('error');
					},
					success : function(element) {
						element.text('OK!').addClass('valid')
								.closest('.control-group').removeClass('error')
								.addClass('success');
						suc && suc(element);
					}
				});
		return ops;
	}

	function isEnable(el) {
		return !('disabled' == $(el).attr('disabled'));
	}

	function disable(el) {
		$(el).attr('disabled', 'disabled')
	}

	function enable(el) {
		$(el).removeAttr('disabled');
	}

	function format(str, context) {
		// we can not use the same textarea, must remove it and use text() on it
		// one time
		var tpl_el = document.getElementById('kzg_tpl_cont');
		if (!tpl_el) {
			$.tmpl('<div id="kzg_tpl_cont" style="display:none;"></div>')
					.appendTo(document.body);
		}
		tpl_el = document.getElementById('kzg_tpl_cont');
		$(tpl_el).html('<textarea></textarea>');

		return $(tpl_el).children().text(str).tmpl(context).text();
	}

	function tmpl(el, data, html) {
		data = data ? data : {};
		el = jQuery(el);
		el.html('');
		jQuery.tmpl(html, data).appendTo(el);
		return el;
	}

	function escape_html(str) {
		str = $('<div/>').text(str).html()

		return str;
	}

	function stop_poll(force) {
		ctimeout && clearTimeout(ctimeout);
		poll_stopped = true;
		force && poll_xhr && poll_xhr.abort();
	}

	function request(ops) {
		var pars = ops.params;
		var suc = ops.ok;
		var fail = ops.error ? ops.error : error_handler;
		ops.type = ops.type ? ops.type : 'POST';
		var xhr = jQuery.ajax({
					url : ops.url,
					dataType : 'json',
					data : pars,
					type : ops.type,
					success : function(d) {
						suc && suc(d);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						fail
								&& fail(jqXHR.status, textStatus,
										jqXHR.responseText);
					},
					complete : ops.complete
				});

		return xhr;
	}

	function try_req(ops) {
		var error_count = 0;
		var suc = ops.ok;
		var fail = ops.error ? ops.error : error_handler;

		function do_req() {
			var xhr = request({
						url : ops.url,
						params : ops.params,
						ok : function(d) {
							error_count = 0;
							suc && suc(d);
						},
						error : function(code, status, text) {
							error_count++;
							if (error_count > 3) {
								fail && fail(code, status, text);

								return;
							}
							do_req();
						}
					});

			return xhr;
		}

		return do_req();
	}

	function error_handler(code, status, text) {
		text = text ? text : '';
		status = status ? status : '';
		if (code == "0") {
			text = "remote server is unavailable!";
		}
		var html = code + ':' + text;
		// here is coupling
		showMsg('msgTpl', html);
	}

	function showMsg(tplid, html, showTime) {
		var tpl = document.getElementById(tplid);
		if (!tpl) {
			throw new Error('tplid ' + tplid + ' is not valid');
		}
		var e = $.tmpl($(tpl).html()).prependTo(document.body);
		$.tmpl(html).appendTo(e);
		if (showTime) {
			setTimeout(function() {
						e.remove();
					}, showTime);
		}

		return e;
	}

	function start_poll(ops) {
		poll_stopped = false;
		var error_count = 0;
		var suc = ops.ok;
		var fail = ops.error ? ops.error : error_handler;
		var gap = ops.gap ? ops.gap : 2000;

		function do_poll() {
			if (poll_stopped) {
				return;
			}
			var pars;
			if (ops.paramsFn) {
				pars = ops.paramsFn();
			} else {
				pars = ops.params;
			}
			var pollops = $.extend(ops, {
						url : ops.url,
						params : pars,
						ok : function(d) {
							error_count = 0;
							suc && suc(d);
							if (-1 == gap) {
								do_poll();
							} else {
								ctimeout = setTimeout(do_poll, gap);
							}
						},
						error : function(code, status, text) {
							error_count++;
							if (error_count > 3) {
								fail && fail(code, status, text);
								return;
							}
							if (-1 == gap) {
								do_poll();
							} else {
								ctimeout = setTimeout(do_poll, gap);
							}
						}
					});

			poll_xhr = request(pollops);
		}
		do_poll();
	}

	var ctimeout = null;

	// show JQuery UI dialog
	function showDialog(el, ops) {

		var dlg;
		var dlgOps = {
			autoOpen : false,
			draggableType : true,
			resizable : false,
			modal : true,
			closeOnEscape : false,
			// dialogClass:'',
			height : 400,
			width : 450,
			title : 'Please Add Title'
		};
		if (ops) {
			_this.apply(dlgOps, ops);
		}
		if (typeof el == 'string') {
			dlg = jQuery(el);
		} else {
			dlg = el;
		}
		return dlg.dialog(dlgOps);
	}

	function isIE() {

		return jQuery.browser.msie;
	}

})();