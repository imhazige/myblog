/**
 * http://code.google.com/p/zkjs/
   author careprad	
   email:careprad@gmail.com
 */

(function() {
	var kzgutil = window.kzg.util = {
		json : new (function() {
			var pad = function(n) {
				return n < 10 ? "0" + n : n;
			}, doDecode = function(json) {
				return eval("(" + json + ')');
			}, doEncode = function(o) {
				if (!kzg.isDefined(o) || o === null) {
					return "null";
				} else if (kzg.isArray(o)) {
					return encodeArray(o);
				} else if (kzg.isDate(o)) {
					return kzgutil.json.encodeDate(o);
				} else if (kzg.isString(o)) {
					return encodeString(o);
				} else if (typeof o == "number") {					
					return String(o);
				} else if (kzg.isBoolean(o)) {
					return String(o);
				} else {
					var a = ["{"], b, i, v;
					for (i in o) {
						// don't encode DOM objects
						if (!o.getElementsByTagName) {
							if (o.hasOwnProperty(i)) {
								v = o[i];
								switch (typeof v) {
									case "undefined" :
									case "function" :
									case "unknown" :
										break;
									default :
										if (b) {
											a.push(',');
										}
										a.push(doEncode(i), ":", v === null
														? "null"
														: doEncode(v));
										b = true;
								}
							}
						}
					}
					a.push("}");
					return a.join("");
				}
			}, m = {
				"\b" : '\\b',
				"\t" : '\\t',
				"\n" : '\\n',
				"\f" : '\\f',
				"\r" : '\\r',
				'"' : '\\"',
				"\\" : '\\\\'
			}, encodeString = function(s) {
				if (/["\\\x00-\x1f]/.test(s)) {
					return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
								var c = m[b];
								if (c) {
									return c;
								}
								c = b.charCodeAt();
								return "\\u00"
										+ Math.floor(c / 16).toString(16)
										+ (c % 16).toString(16);
							}) + '"';
				}
				return '"' + s + '"';
			}, encodeArray = function(o) {
				var a = ["["], b, i, l = o.length, v;
				for (i = 0; i < l; i += 1) {
					v = o[i];
					switch (typeof v) {
						case "undefined" :
						case "function" :
						case "unknown" :
							break;
						default :
							if (b) {
								a.push(',');
							}
							a.push(v === null ? "null" : kzgutil.json.encode(v));
							b = true;
					}
				}
				a.push("]");
				return a.join("");
			};

			this.encodeDate = function(o) {
				return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1)
						+ "-" + pad(o.getDate()) + "T" + pad(o.getHours())
						+ ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds())
						+ '"';
			};

			this.encode = doEncode;

			this.decode = doDecode;

		})(),
		format : {
			htmlEncode : function(value) {
				return !value ? value : String(value).replace(/&/g, "&amp;")
						.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(
								/"/g, "&quot;");
			},			
			htmlDecode : function(value) {
				return !value ? value : String(value).replace(/&gt;/g, ">")
						.replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(
								/&amp;/g, "&");
			}
		},
		log : {
			_c : 0,
			depth : 2000,
			style : '',
			level : 'info',
			color : {
				error : 'red',
				warn : 'yellow',
				info : 'lime',
				debug : 'white'
			},
			console: {
				inited:false,
				div:null,
				visible:false,
				init:function(){
					div = document.createElement('div');
					div.style.cssText = 'zIndex:90000;overflow:auto;left:0;top:0;position:absolute;width:500;height:300;display:none;background-color:black;';
					document.body.appendChild(div);	
					kzg.on(document,'keypress',function(e){						
//						TODO ie
						if (!e.shiftKey || !e.ctrlKey){
							return;
						}
						if (kzg.browser.msie && 15 != e.keyCode){
							return;
						}
						if (kzg.browser.safari && 15 != e.keyCode){
							return;						
						}
						if (kzg.browser.mozzila && 'o' != String.fromCharCode(e.charCode).toLowerCase()){
							return;
						}						
						this.visible = !this.visible;
						div.style.display = this.visible?'':'none';
					});
				},
				log:function(msg){					
					if (!this.inited){
						this.init();
						this.inited = true;
					}					
					div.innerHTML += msg ;
					div.scrollTop = div.scrollHeight - div.clientHeight; 
				}
			},
			error : function(msg) {
				if ('object' === typeof(msg)) {
					msg = kzgutil.json.encode(msg);
				}
				if (this.errhandle) {
					this.errhandle(msg);
				}
				if ('none' == this.level)
					return;
				this.log('<div style="' + this.style + ';color:'
						+ this.color.error + '"><b>ERROR ['
						+ new Date().format('yy-MM-dd HH:mm:ss:uuu') + ']:'
						+ kzgutil.format.htmlEncode(msg)
						+ '</b></div>');
			},			
			warn : function(msg) {
				if ('object' === typeof(msg)) {
					msg = kzgutil.json.encode(msg);
				}
				if ('none' == this.level || 'error' == this.level)
					return;
				this.log('<div style="' + this.style + ';color:'
						+ this.color.warn + '"><b>WARN ['
						+ new Date().format('yy-MM-dd HH:mm:ss:uuu') + ']:'
						+ kzgutil.format.htmlEncode(msg) + '</b></div>');
			},
			info : function(msg) {
				if ('object' === typeof(msg)) {
					msg = kzgutil.json.encode(msg);
				}
				if ('none' == this.level || 'error' == this.level
						|| 'warn' == this.level)
					return;
				this.log('<div style="' + this.style + ';color:'
						+ this.color.info + '"><b>INFO ['
						+ new Date().format('yy-MM-dd HH:mm:ss:uuu') + ']:'
						+ kzgutil.format.htmlEncode(msg) + '</b></div>');
			},
			debug : function(msg) {
				if ('object' === typeof(msg)) {
					msg = kzgutil.json.encode(msg);
				}				
				if ('none' == this.level || 'error' == this.level
						|| 'warn' == this.level || 'info' == this.level)
					return;
				this.log('<div style="' + this.style + ';color:'
						+ this.color.debug + '"><b>DEBUG ['
						+ new Date().format('yy-MM-dd HH:mm:ss:uuu') + ']:'
						+ kzgutil.format.htmlEncode(msg) + '</b></div>');
			},
			log : function(msg) {				
				if (!this.console) {
					return;
				}
				this.console.log(msg);
			}
		}
	};
})();