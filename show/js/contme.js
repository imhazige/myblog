(function() {
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

	function main() {
		var n1 = $('#ign_ct_contme');
		var n2 = $('#ign_win_contme');

		window.ign_contme = function() {
			n1.hide();
			n2.show();
			n2.center();
		};

		window.ign_contme_send = function() {
			var txt = document.getElementById('ign_contme_txt');
			var info = document.getElementById('ign_contme_info');

			if ('' == info.value) {
				return;
			}

			$.ajax({
						url : '/show/contactme.php',
						dataType : 'json',
						type : 'post',
						data : {
							msg : txt.value,
							info : info.value
						},
						success : function(d) {
						},
						error : function() {
						}
					});

			n2.hide();
		};

		window.ign_contme_cancel = function() {
			n2.hide();
		};

		n1.show();

		function positionFooter() {
			n1.css({
						position : "absolute",
						top : ($(window).scrollTop() + $(window).height() - n1
								.outerHeight())
								+ "px"
					})
		}

		$(window).scroll(positionFooter).resize(positionFooter)

		positionFooter();

		window.ign_close_contme = function() {
			n1.hide();
		};
	}

	function load() {
		jQuery.fn.center = function() {
			this.css("position", "absolute");
			this.css("top", (($(window).height() - this.outerHeight()) / 2)
							+ $(window).scrollTop() + "px");
			this.css("left", (($(window).width() - this.outerWidth()) / 2)
							+ $(window).scrollLeft() + "px");
			return this;
		}
		$(main);
	}

	if (!window.jQuery) {
		jpc('http://code.jquery.com/jquery-1.4.2.min.js', load);
	} else {
		load();
	}
})();