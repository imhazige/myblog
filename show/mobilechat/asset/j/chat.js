(function() {
	var ids = {};
	var base = kzg.base;
	var log = base.log;
	var stc, sts;
	var timer;

	kzg.mobichat = {
		init : init
	};
	
	var curConn = null;

	var ids = {
		ctLogScreen : null,
		dial_pad : null,
		btn_redail : null,
		btn_hangup : null,
		diai_pad_timer : null,
		diai_pad_status : null,
		labCredits : null,
		btnCall : null
	};

	function show(el) {
		$(el).removeClass('hidden');
	}
	
	function hide(el){
		$(el).addClass('hidden');
	}

	function init(ops) {
		// return;
		ids = base.ids(ids);

		// process_poll(mock);
		// return;

		initTwilioClient(ops);

		base.start_poll({
					url : 'ax/poll',
					gap : -1,
					paramsFn : paramsFn,
					ok : function(d) {
						process_poll(d);
					},
					error : function(code, text) {
						showMsg(code + ':' + text);
					}
				});

		$(window).unload(function() {
					base.stop_poll(true);
				});
	}
	
	function callEnd(conn){
		if (conn){
			$(ids.diai_pad_status).text(conn.status);	
		}		
		hide(ids.btn_hangup);
		show(ids.btn_redail);
		timer && clearTimeout(timer);
		curConn = null;
	}
	
	function callStart(conn){
		curConn = conn;
		$(ids.diai_pad_status).text(conn.status);
		hide(ids.btn_redail);
		show(ids.btn_hangup);
		var time = 0;
		timer = setInterval(function(){
			time = time+1000;
			var dt = new Date(time);
			var str = base.paddingLeft(dt.getMinutes() + '','0',2) + ':' + base.paddingLeft(dt.getSeconds() + '','0',2);
			$(ids.diai_pad_timer).text(str);
		},1000);
	}

	function initTwilioClient(ops) {
		Twilio.Device.setup(ops.twilioToken);

		Twilio.Device.ready(function() {
					
				});

		Twilio.Device.offline(function() {
					// Called on network connection lost.
					callEnd();
				});

		Twilio.Device.incoming(function(conn) {
					console.log(conn.parameters.From); // who is calling
					conn.status // => "pending"
					conn.reject();
					conn.status // => "connecting"
				});

		Twilio.Device.cancel(function(conn) {					
					callEnd(conn);
				});

		Twilio.Device.connect(function(conn) {
					callStart(conn);
				});

		Twilio.Device.disconnect(function(conn) {
					callEnd(conn);
				});

		Twilio.Device.presence(function(presenceEvent) {
					// Called for each available client when this device becomes
					// ready
					// and every time another client's availability changes.
					presenceEvent.from // => name of client whose availablity
					// changed
					presenceEvent.available // => true or false
				});

		Twilio.Device.error(function(e) {
					showMsg(e.message + " for " + e.connection);					
					callEnd(e.connection);
				});		
				
		$(ids.btn_hangup).click(function() {
					Twilio.Device.disconnectAll();					
				});

		$(ids.btnCall).click(function() {
					var isd = base.isEnable(ids.btnCall);
					if (!isd){
						return;
					}
					show(ids.dial_pad);
					Twilio.Device.connect();
					base.disable(ids.btnCall);		
				});
		$(ids.btn_redail).click(function(){
			Twilio.Device.disconnectAll();
			Twilio.Device.connect();
		});
		
		$(ids.dial_pad).click(function(eve){
				if ($(eve.target).hasClass('client-ui-button-number')){
					if (curConn){
						curConn.sendDigits($(eve.target).text());
					}	
				}				
		});

	}

	function paramsFn() {
		var ops = {
			stc : stc,
			sts : sts
		};
		if (stc) {
			ops.stc = stc;
		}
		if (sts) {
			ops.sts = sts;
		}

		return ops;
	}

	function process_poll(d) {
		var call = d.call;
		var sms = d.sms;

		for (var i = 0; i < call.length; i++) {
			var c = call[i];
			showMessageHistItem(c, true);
			stc = c.mid;
		}

		for (var i = 0; i < sms.length; i++) {
			var c = sms[i];
			showMessageHistItem(c);
			sts = c.mid;
		}

		$(ids.labCredits).text(d.credits);
		$(ids.ctLogScreen).scrollTop(100000);
	}

	function showMessageHistItem(m, call) {
		var msg = $.trim(m['text']);
		if (!msg) {
			return;
		}
		msg = base.escape_html(msg);
		var data = {
			iclass : call ? 'icon-volume-up' : 'icon-envelope',
			msg : msg
		};
		var tpl = 1 == m['who'] ? '#msg-item-tpl-left' : '#msg-item-tpl-right';
		$(tpl).tmpl(data).appendTo(ids.ctLogScreen);
	}

	function showMsg(html) {
		base.showMsg('msgTpl', html);
	}

	var mock = {
		"call" : [{
					"0" : "1",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : " ",
					"text" : " hi there ",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"sms_id" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "1",
					"mid" : "1"
				}, {
					"0" : "2",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "",
					"text" : " i am human ",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "3",
					"who" : "3",
					"5" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"sms_id" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "2",
					"mid" : "2"
				}],
		"sms" : [{
					"0" : "1",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : " ",
					"text" : "> hi ",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"sms_id" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "1",
					"mid" : "1"
				}, {
					"0" : "2",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "",
					"text" : "",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "3",
					"who" : "3",
					"5" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"sms_id" : "SM0ed9d8c3ded705d17b2fa646d2f402c1",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "2",
					"mid" : "2"
				}, {
					"0" : "3",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "hello",
					"text" : "hello",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM09198716ce36f368f63aba5ce89852c9",
					"sms_id" : "SM09198716ce36f368f63aba5ce89852c9",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "3",
					"mid" : "3"
				}, {
					"0" : "4",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "Hi there!",
					"text" : "Hi there!",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SM09198716ce36f368f63aba5ce89852c9",
					"sms_id" : "SM09198716ce36f368f63aba5ce89852c9",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "4",
					"mid" : "4"
				}, {
					"0" : "5",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "nice to meet you",
					"text" : "nice to meet you",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SMa6e50b5583c4a197a0b49b5faf085f32",
					"sms_id" : "SMa6e50b5583c4a197a0b49b5faf085f32",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "5",
					"mid" : "5"
				}, {
					"0" : "6",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "It's nice meeting you too .",
					"text" : "It's nice meeting you too .",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SMa6e50b5583c4a197a0b49b5faf085f32",
					"sms_id" : "SMa6e50b5583c4a197a0b49b5faf085f32",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "6",
					"mid" : "6"
				}, {
					"0" : "7",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "hello",
					"text" : "hello",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM91572a13c90440c64d8e98bdb15a9848",
					"sms_id" : "SM91572a13c90440c64d8e98bdb15a9848",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "7",
					"mid" : "7"
				}, {
					"0" : "8",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "hello",
					"text" : "hello",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM395a26ea2bf9dba54af609987992e2c3",
					"sms_id" : "SM395a26ea2bf9dba54af609987992e2c3",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "8",
					"mid" : "8"
				}, {
					"0" : "9",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "hello, good",
					"text" : "hello, good",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SMcbbe1182050136850221ac27f02399e6",
					"sms_id" : "SMcbbe1182050136850221ac27f02399e6",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "9",
					"mid" : "9"
				}, {
					"0" : "10",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "Hello there. Ayuh.",
					"text" : "Hello there. Ayuh.",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SMcbbe1182050136850221ac27f02399e6",
					"sms_id" : "SMcbbe1182050136850221ac27f02399e6",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "10",
					"mid" : "10"
				}, {
					"0" : "11",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "what's your name?",
					"text" : "what's your name?",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SMb5869e07e8cad522aee41bf10ee241ba",
					"sms_id" : "SMb5869e07e8cad522aee41bf10ee241ba",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "11",
					"mid" : "11"
				}, {
					"0" : "12",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "My name is kaz bot.",
					"text" : "My name is kaz bot.",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SMb5869e07e8cad522aee41bf10ee241ba",
					"sms_id" : "SMb5869e07e8cad522aee41bf10ee241ba",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "12",
					"mid" : "12"
				}, {
					"0" : "13",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "fuck you",
					"text" : "fuck you",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM63c02838ce4130efc315adf43712de08",
					"sms_id" : "SM63c02838ce4130efc315adf43712de08",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "13",
					"mid" : "13"
				}, {
					"0" : "14",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "Why are you so mean? ",
					"text" : "Why are you so mean? ",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SM63c02838ce4130efc315adf43712de08",
					"sms_id" : "SM63c02838ce4130efc315adf43712de08",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "14",
					"mid" : "14"
				}, {
					"0" : "15",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "just like that, do you love me?",
					"text" : "just like that, do you love me?",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM50ca1b1b4a7cc5c5eb4e627b914694da",
					"sms_id" : "SM50ca1b1b4a7cc5c5eb4e627b914694da",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "15",
					"mid" : "15"
				}, {
					"0" : "16",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "Yes I love everyone.",
					"text" : "Yes I love everyone.",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SM50ca1b1b4a7cc5c5eb4e627b914694da",
					"sms_id" : "SM50ca1b1b4a7cc5c5eb4e627b914694da",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "16",
					"mid" : "16"
				}, {
					"0" : "17",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "how old are you?",
					"text" : "how old are you?",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SMd5d1537c9d47c4921cb65ddc4a0cc837",
					"sms_id" : "SMd5d1537c9d47c4921cb65ddc4a0cc837",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "17",
					"mid" : "17"
				}, {
					"0" : "18",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "I was connected to the net on 1995.",
					"text" : "I was connected to the net on 1995.",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SMd5d1537c9d47c4921cb65ddc4a0cc837",
					"sms_id" : "SMd5d1537c9d47c4921cb65ddc4a0cc837",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "18",
					"mid" : "18"
				}, {
					"0" : "19",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "your age?",
					"text" : "your age?",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "1",
					"who" : "1",
					"5" : "SM29c8179882c7fea9d2fb77a3e119ca92",
					"sms_id" : "SM29c8179882c7fea9d2fb77a3e119ca92",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "19",
					"mid" : "19"
				}, {
					"0" : "20",
					"id" : "1",
					"1" : "1",
					"session_id" : "1",
					"2" : "I am secret in human years.",
					"text" : "I am secret in human years.",
					"3" : "1363924018",
					"time" : "1363924018",
					"4" : "2",
					"who" : "2",
					"5" : "SM29c8179882c7fea9d2fb77a3e119ca92",
					"sms_id" : "SM29c8179882c7fea9d2fb77a3e119ca92",
					"6" : "1",
					"7" : "+17733362561",
					"from" : "+17733362561",
					"8" : "+19893014216",
					"to" : "+19893014216",
					"9" : "732128",
					"token" : "732128",
					"10" : null,
					"start_time" : null,
					"11" : null,
					"update_time" : null,
					"12" : "1",
					"status" : "1",
					"13" : "",
					"status_change_reason" : "",
					"14" : "20",
					"mid" : "20"
				}]
	};

})();