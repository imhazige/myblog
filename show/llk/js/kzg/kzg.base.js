/**
 * http://code.google.com/p/zkjs/
   author careprad	
   email:careprad@gmail.com
 */

Array.prototype.indexOfKey = function(key) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] && this[i].key == key) {
			return i;
		}
	}

	return -1;
};

Array.prototype.indexOf = function(elm) {
	for (var i = 0; i < this.length; i++)
		if (elm == this[i])
			return i;
	return -1;
}

Array.prototype.erase = function(elm) {
	for (var i = 0; i < this.length; i++)
		if (elm == this[i])
			this[i] = null;
}

Array.prototype.get = function(key) {
	var index = this.indexOfKey(key);

	if (-1 == index)
		return null;

	return this[index];
}

Array.prototype.removei = function(index) {
	if (index < 0 || index >= this.length)
		return;
	for (var i = index; i < this.length; i++)
		this[i] = this[i + 1];
	this.length--;
}

// remove the element in the array
Array.prototype.removeo = function(obj) {
	var bl;

	bl = false;
	for (var i = 0; i < this.length; i++) {
		if (obj === this[i] || bl) {
			this[i] = this[i + 1];
			bl = true;
		}
	}
	if (bl) {
		this.length--;
	}
}

Array.prototype.clear = function() {
	this.length = 0;

	return this;
};

Number.prototype.leftpad = function(count) {
	var s = this + '';
	var scount = s.length;
	for  (var i = 0 ; i < (count - scount) ; i++){
		s = '0' + s;
	}
	
	return s;
};

Date.prototype.format = function(format) {
	var it = new Date();
	var it = this;
	var M = it.getMonth() + 1, H = it.getHours(), m = it.getMinutes(), d = it
			.getDate(), s = it.getSeconds(),u = it.getMilliseconds(),Y = it.getFullYear();			
	var n = {
		'yyyy' : Y,
		'yy' : (Y + '').substring(2,4),
		'MM' : M.leftpad(2),
		'M' : M,
		'dd' : d.leftpad(2),
		'd' : d,
		'HH' : H.leftpad(2),
		'H' : H,
		'mm' : m.leftpad(2),
		'm' : m,
		'ss' : s.leftpad(2),
		's' : s,
		'uuu': u.leftpad(3),
		'u':u
	};
	return format.replace(/([a-zA-Z]+)/g, function(s, $1) {
				return n[$1];
			});
};

if (window.kzg) {
	throw new Error("kzg has registered.");
}
(function() {
	window.STRING_EMPTY = '';

	var userAgent = navigator.userAgent.toLowerCase();

	window.kzg = {
		browser : {
			version : (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [
					0, '0'])[1],
			safari : /webkit/.test(userAgent),
			opera : /opera/.test(userAgent),
			msie : /msie/.test(userAgent) && !/opera/.test(userAgent),
			mozilla : /mozilla/.test(userAgent)
					&& !/(compatible|webkit)/.test(userAgent),
			chrome : /chrome/.test(userAgent)
		},
		get : function(id) {
			return document.getElementById(id);
		},
		setStyle : function(el, styleText) {
			if (this.browser.msie) {
				el.style.cssText = styleText;
			} else {
				el.setAttribute("style", styleText);
			}
		},
		addCss : function(el, css) {
			if (!css || '' == css) {
				return;
			}
			var ncss = this._getCsss(el);
			var acsss = css.split(/\s+/);
			for (var i = 0; i < acsss.length; i++) {
				ncss[acsss[i]] = acsss[i];
			}
			var cssName = '';
			for (k in ncss) {
				if ('' == k) {
					continue;
				}
				cssName += ' ' + k;
			}
			this.setCss(el, cssName);
		},
		removeCss : function(el, css) {
			if (!css || '' == css) {
				return;
			}
			var ncss = this._getCsss(el);
			var cssName = '';
			for (k in ncss) {
				if ('' == k || css == k) {
					continue;
				}
				cssName += ' ' + k;
			}
			this.setCss(el, cssName);
		},
		_getCsss : function(el) {
			var ncss = {};
			var ocss = this.getCss(el);
			var oacsss = ocss ? ocss.split(/\s+/) : [];
			for (var i = 0; i < oacsss.length; i++) {
				ncss[oacsss[i]] = oacsss[i];
			}

			return ncss;
		},
		getCss : function(el) {
			if (this.browser.msie) {
				return el.getAttribute("className");
			} else {
				return el.getAttribute("class");
			}
		},
		setCss : function(el, argCssName) {
			if (this.browser.msie) {
				el.setAttribute("className", argCssName);
			} else {
				el.setAttribute("class", argCssName);
			}
		},
		clearCss : function(el) {
			this.setStyle('');
			if (this.browser.msie) {
				el.removeAttribute("className");
			} else {
				el.removeAttribute("class");
			}
		},
		/**
		 * get the left of the element
		 */
		getPixLeft : function(argObj) {
			var pixleft;

			pixleft = 0;
			while (argObj) {
				pixleft += argObj.offsetLeft;
				argObj = argObj.offsetParent;
			};

			return pixleft;
		},
		/**
		 * get the top of the element
		 */
		getPixTop : function(argObj) {
			var pixtop;

			pixtop = 0;
			while (argObj) {
				pixtop += argObj.offsetTop;
				argObj = argObj.offsetParent;
			};

			return pixtop;
		},

		remove : function(argObj) {
			if (argObj.parentNode) {
				argObj.parentNode.removeChild(argObj);
			}
		},

		on : function(elem, type, fn) {
			if (elem.addEventListener)
				elem.addEventListener(type, function(e) {
							fn(e);
						}, false);
			else if (elem.attachEvent)
				elem.attachEvent("on" + type, function() {
							fn(window.event);
						});
		},
		/*
		 * un : function(el, type, fn) { $(el).unbind(type, fn); },
		 */
		oe : function(o, type, fn) {
			if (!o.eves)
				o.eves = [];
			if (!o.eves[type])
				o.eves[type] = [];
			o.eves[type][o.eves[type].length] = fn;
		},
		ue : function(o, type, fn) {
			if (!o.eves)
				return;
			if (!o.eves[type])
				return;
			o.eves[type].erase(fn);
		},
		fire : function(o, type, ops) {
			if (!o.eves)
				return;
			if (!o.eves[type])
				return;
			var e = {
				src : o,
				stop : false
			};
			for (var i = 0; i < o.eves[type].length; i++) {
				if (o.eves[type][i]) {
					o.eves[type][i](e, ops);
					if (e.stop)
						return;
				}
			}
		},
		cr : function(tag) {
			return document.createElement(tag);
		},
		crradio : function(argName, argIsChecked) {
			var radio;

			if (this.browser.msie) {
				var text = "<input type=\"radio\" name=\"" + argName
						+ "\" value=\"checked\" >";
				radio = document.createElement(text);
			} else {
				radio = document.createElement("input");
				radio.setAttribute("type", "radio");
				radio.setAttribute("name", argName);
				radio.setAttribute("value", "checked");
			}
			radio.checked = argIsChecked;

			return radio;
		},
		ok : function(fn) {
			kzg.oe(kzg, 'ok', fn);
		},
		isnum : function(argNum) {
			if (0 != argNum && !argNum) {
				return false;
			}

			if ("" == argNum) {
				return false;
			}

			return !isNaN(new Number(argNum));
		},

		inade : function(argObj, argStrsomewhere, argNewObj) {
			var parent;

			switch (argStrsomewhere.toLowerCase()) {
				case "beforebegin" :
					argObj.parentNode.insertBefore(argNewObj, argObj);
					break;
				case "afterbegin" :
					var nn = !argObj.childNodes ? null : argObj.childNodes[0];
					if (!nn) {
						nn = null
					}
					;
					argObj.insertBefore(argNewObj, nn);
					break;
				case "beforeend" :
					argObj.appendChild(argNewObj);
					break;
				case "afterend" :
					var nnode = this.nextnode(argObj);
					argObj.parentNode.insertBefore(argNewObj, nnode);
					break;
			}
		},
		/**
		 * get the current absolute screen left of the element
		 * */
		getLeft:function(argObj){
			var pixleft;

			pixleft = 0;
			while (argObj) {
				pixleft += argObj.offsetLeft;
				pixleft -= argObj.scrollLeft;
				argObj = argObj.offsetParent;
			};

			return pixleft;
		},
		/**
		 * get the current absolute screen top of the element
		 * */
		getTop:function (argObj){
			var pixtop;

			pixtop = 0;
			while (argObj) {
				pixtop += argObj.offsetTop;
				pixtop -= argObj.scrollTop;
				argObj = argObj.offsetParent;
			};

			return pixtop;
		},
		nextnode : function(argObj) {
			var parent, obj;

			obj = null;
			parent = argObj.parentNode;
			for (var i = 0; parent.childNodes[i]; i++) {
				if (parent.childNodes[i] === argObj) {
					try {
						obj = parent.childNodes[i + 1];
					} catch (e) {
						obj = null;
					}
					break;
				}
			}
			return obj;
		},
		/**
		 * adjust the x,y point to prevent from oversteping out the window
		 */
		adjustPosition : function(x, y, width, height) {
			var cw;
			var ch;

			cw = document.body.clientWidth;
			ch = document.body.clientHeight;
			// left
			if (x + width > cw) {
				x = cw - width;
			}
			x = Math.max(0, x);
			// zk.log("x : height:document.body.clientWidth" + x +"|" + width +
			// "|" + cw);
			// zk.log("y : height:document.body.clientHeight" + y +"|" + height
			// + "|" + ch);
			// top
			if (y + height > ch) {
				y = ch - height;
			}
			y = Math.max(0, y);

			return {
				"x" : x,
				"y" : y
			}
		},
		isArray : function(v) {
			return v.constructor==Array;
		},
		isDate : function(v) {
			return v.constructor==Date;
		},
		isObject : function(v) {
			return typeof v === 'object';
		},		
		isFunction : function(v) {
			return typeof v === 'function';
		},
		isNumber : this.isnum,
		isString : function(v) {
			return typeof v === 'string';
		},
		isBoolean : function(v) {
			return typeof v === 'boolean';
		},
		isElement : function(v) {
			return v ? !!v.tagName : false;
		},
		isDefined : function(v) {
			return typeof v !== 'undefined';
		}
	};

	kzg.Url = function(argOrginUrl) {
		var _this = this;
		var params = {};
		var baseurl = null;

		this.putParam = function(argKey, argValue) {
			if (argKey && argValue) {
				params[argKey] = argValue;
			}
		};
		this.getParam = function(argKey) {
			return params[argKey];
		};

		this.toString = function() {
			var keys = params.keyset;
			var url = baseurl;
			var qs = "?";
			for (k in params) {
				var value = params[k];
				if (value === 0 || value) {
					url = url + qs + k + "=" + value;
				}
				qs = "&";
			}

			return url;
		};

		if (!argOrginUrl || "" == argOrginUrl) {
			throw new Error("orgin url null.");
		}
		var index = argOrginUrl.indexOf("?");
		if (-1 != index) {
			baseurl = argOrginUrl.substring(0, index);
			if (index + 1 < argOrginUrl.length - 1) {
				var querystring = argOrginUrl.substring(index + 1);
				var kvss = querystring.split("&");
				for (var i = 0; i < kvss.length; i++) {
					var kvs = kvss[i].split("=");
					if (1 >= kvs.length) {
						continue;
					}
					_this.putParam(kvs[0], kvs[1]);
				}
			}
		} else {
			baseurl = argOrginUrl;
		}
	};

	kzg.on(window, "load", function() {
				kzg.fire(kzg, 'ok');
			});
})();