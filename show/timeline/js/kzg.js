(function() {
	kzg = {
		tpml:tpml,
		log:log,
		is_enable:is_enable,
		disable:disable,
		enable:enable,
		date_str:date_str,
		str_2date:str_2date,
		diff_day:diff_day,
		add_day:add_day,
		day_euqal:day_euqal
	};
	
	function log(m){
		window.console && console.log(m);
	}
	
//	BEGIN LOGIC
//	only fit this project
	
	function str_2date(str){
		var ss = str.split('-');
		var date = new Date();
		date.setFullYear(ss[0]);
		date.setMonth(ss[1]);
		date.setMonth(date.getMonth()-1);
		date.setDate(ss[2]);
		return date;
	}
	
	function date_str(start_date){
		return start_date.getFullYear() + '-' + date_pad((start_date.getMonth() + 1)) + '-' + date_pad(start_date.getDate());
	}
	
	function day_euqal(lastd,de){
		return lastd.getFullYear() == de.getFullYear() && lastd.getMonth() == de.getMonth() && lastd.getDate() == de.getDate();
	}
	
	function day_clear_hmss(d){
//		var d = new Date();
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		
		return d;
	}
		
	function diff_day(date1, date2) {
		date1 = add_day(date1,0);
		date2 = add_day(date2,0);
		day_clear_hmss(date1);
		day_clear_hmss(date2);
		var diff  = date1 - date2;		
		if (0 == diff){
			return 0;
		}
		return (diff > 0 ? 1 : -1) * Math.ceil(Math.abs((diff) /(24 * 60 * 60 * 1000)));
//		return date.getDate();
	}
	
	function add_day(d, days) {
		var nd = new Date(d.getTime());

		nd.setDate(nd.getDate() + days);

		return nd;
	}
	
	function date_pad(s){
		var s = s+'';
		if (1==s.length){
			return '0' + s;
		}
		
		return s;
	}
	
//	END LOGIC

	function tpml(tpl, context) {
		var txttpl = document.getElementById('txttpl_cont');
		if (!txttpl){
			$.tmpl('<div id="txttpl_cont" style="display:none;"></div>').appendTo(document.body);
			txttpl = document.getElementById('txttpl_cont');
		}
		txttpl.innerHTML = '<textarea id="txt_tmpl"></textarea>';
		return $('#txt_tmpl').text(tpl).tmpl(context).text();
	}
	
	function is_enable(el) {
		return 'disabled' != $(el).attr('disabled');
	}

	function disable(el) {
		$(el).attr('disabled', 'disabled')
	}

	function enable(el) {
		$(el).removeAttr('disabled');
	}

})();