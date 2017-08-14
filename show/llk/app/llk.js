var kzgg = kzg.game;
var log = kzg.util.log;
var GE = kzgg.GameEngine.instance;

(function() {
	var IMGW = 31;
	var IMGH = 34;
	var matrix;
	var CX = 10;
	var CY = 6;
	var X;
	var Y;
	var allCount;
	var typesMap;
	var btnSuggest;

	var presel;
	var backSceen;

	// TODO duration has no use in effect
	var ANDUR = 10;

	function cacOXY(ix, iy) {
		return {
			x : X + ix * IMGW,
			y : Y + iy * IMGH
		};
	}

	function match1(o1, o2) {
		if ((o1.x + IMGW == o2.x && o1.y == o2.y)
				|| (o2.x + IMGW == o1.x && o1.y == o2.y)) {
			return true;
		}

		if ((o1.y + IMGH == o2.y && o1.x == o2.x)
				|| (o2.y + IMGH == o1.y && o1.x == o2.x)) {
			return true;
		}

		return false;
	}

	function passX(y1, y2, x1, x2, o1, o2) {
		if (y1 == -1) {
			return y1;
		}
		if (y2 == CY) {
			return y2;
		}
		var y = y1;
		while (y <= y2) {
			for (var x = x1; x < x2; x++) {
				if (matrix[y][x] && matrix[y][x] !== o1 && matrix[y][x] !== o2) {
					break;
				}
			}
			if (x == x2) {
				break;
			}
			y += 1;
		}

		return y <= y2 ? y : false;
	}

	function passY(x1, x2, y1, y2, o1, o2) {
		if (x1 == -1) {
			return x1;
		}
		if (x2 == CX) {
			return x2;
		}
		var x = x1;
		while (x <= x2) {
			for (var y = y1; y < y2; y++) {
				if (matrix[y][x] && matrix[y][x] !== o1 && matrix[y][x] !== o2) {
					break;
				}
			}
			if (y == y2) {
				break;
			}
			x += 1;
		}

		return x <= x2 ? x : false;
	}

	function match2(o1, o2) {
		var p1 = llk.pathLine(o1);
		var p2 = llk.pathLine(o2);

		var yn = Math.min(o1.iy, o2.iy);
		var yx = Math.max(o1.iy, o2.iy);
		var xn = Math.min(o1.ix, o2.ix);
		var xx = Math.max(o1.ix, o2.ix);

		var lx;
		var ly;

		function rY(ix, x, bl) {
			if (ix < x) {
				return 'r';
			} else if (ix == x) {
				return bl ? 'b' : 't';
			} else {
				return 'l';
			}
		}

		function rX(iy, y, bl) {
			if (iy < y) {
				return 'b';
			} else if (iy == y) {
				return bl ? 'r' : 'l';
			} else {
				return 't';
			}
		}

		// TODO justify

		// o1-Y->o2
		if (p1.xmax >= p2.xmin && p1.xmin <= p2.xmin) {
			lx = passY(p2.xmin, Math.min(p1.xmax, p2.xmax), yn, yx, o1, o2);

			if (false !== lx) {
				var r1 = rY(o1.ix, lx, true);
				var r2 = rY(o2.ix, lx, false);
				var rst = [[o1.ix, o1.iy, r1],
						[lx, o1.iy, lx != o1.ix ? 'c' : r1],
						[lx, o2.iy, lx != o2.ix ? 'c' : r2], [o2.ix, o2.iy, r2]];
				log.debug('-Y->' + kzg.util.json.encode(rst));

				return rst;
			}
		}
		// o2-Y->o1
		if (p2.xmax >= p1.xmin && p2.xmin <= p1.xmin) {
			lx = passY(p1.xmin, Math.min(p1.xmax, p2.xmax), yn, yx, o1, o2);

			if (false !== lx) {
				var r1 = rY(o2.ix, lx, true);
				var r2 = rY(o1.ix, lx, false);
				var rst = [[o2.ix, o2.iy, r1],
						[lx, o2.iy, lx != o2.ix ? 'c' : r1],
						[lx, o1.iy, lx != o1.ix ? 'c' : r2], [o1.ix, o1.iy, r2]];
				log.debug('-Y`->' + kzg.util.json.encode(rst));

				return rst;
			}
		}
		// o1-X->o2
		if (p1.ymax >= p2.ymin && p1.ymin <= p2.ymin) {
			ly = passX(p2.ymin, Math.min(p1.ymax, p2.ymax), xn, xx, o1, o2);

			if (false !== ly) {
				var r1 = rX(o1.iy, ly, true);
				var r2 = rX(o2.iy, ly, false);
				var rst = [[o1.ix, o1.iy, r1],
						[o1.ix, ly, ly != o1.iy ? 'c' : r1],
						[o2.ix, ly, ly != o2.iy ? 'c' : r2], [o2.ix, o2.iy, r2]];
				log.debug('-X->' + kzg.util.json.encode(rst));

				return rst;
			}
		}
		// o2-X->o1
		if (p2.ymax >= p1.ymin && p2.ymin <= p1.ymin) {
			ly = passX(p1.ymin, Math.min(p1.ymax, p2.ymax), xn, xx, o1, o2);

			if (false !== ly) {
				var r1 = rX(o2.iy, ly, true);
				var r2 = rX(o1.iy, ly, false);
				var rst = [[o2.ix, o2.iy, r1],
						[o2.ix, ly, ly != o2.iy ? 'c' : r1],
						[o1.ix, ly, ly != o1.iy ? 'c' : r2], [o1.ix, o1.iy, r2]];

				log.debug('-X`->' + kzg.util.json.encode(rst));

				return rst;
			};
		}

		return false;
	}

	function suggest() {
		var t1, t2, match;

		for (var type in typesMap) {
			var types = typesMap[type];
			if (!kzg.isArray(types)) {
				continue;
			}
			for (var j = 0; j < types.length; j++) {

				var t1 = types[j];
				for (var k = j + 1; k < types.length; k++) {
					var t2 = types[k];
					if (match1(t1, t2)) {
						return [t1, t2];
					}

					if (match2(t1, t2)) {
						return [t1, t2];
					}
				}
			}
		}

		return false;
	}

	function h_click(e, obj) {
		// llk.Resource.medias['select'].play();
		var s = kzg.util.json.encode(llk.pathLine(obj));
		log.debug('path:-->' + s);
		if (!presel) {
			obj.select();
		} else if (presel === obj) {
		} else if (obj.equals(presel)) {
			var _pre = presel;
			function done() {
				GE.removeGameObject(_pre);
				GE.removeGameObject(obj);
				// llk.Resource.medias['erase'].play();
				var anim1 = new llk.Animate({
							frames : llk.Resource.bombs,
							playCount : 1,
							duration : ANDUR,
							x : obj.x,
							y : obj.y,
							width : IMGW,
							height : IMGH
						});
				var anim2 = new llk.Animate({
							frames : llk.Resource.bombs,
							playCount : 1,
							duration : ANDUR,
							x : _pre.x,
							y : _pre.y,
							width : IMGW,
							height : IMGH
						});
				GE.addGameObject(anim1);
				GE.addGameObject(anim2);
				matrix[_pre.iy][_pre.ix] = null;
				matrix[obj.iy][obj.ix] = null;
				typesMap[_pre.type].removeo(_pre);
				typesMap[_pre.type].removeo(obj);
				allCount -= 2;
				if (!allCount) {

					function loveScene() {
						backSceen.setImage(llk.Resource.others['ok']);
						var cheers = new llk.Animate({
									frames : llk.Resource.cheers,
									// playCount : 1,
									duration : ANDUR,
									x : GE.canvas.width / 2
											- llk.Resource.cheers[0].width / 2,
									y : GE.canvas.height / 2 - 160
								});
						GE.addGameObject(cheers);
						var text = new llk.Text({
							text : 'IE9\ndo not support ogg format? But the other do!\nNew Audio() not support!\n Hope it will follow the w3c specication.',
							duration : -1,
							x : GE.canvas.width / 2,
							y : GE.canvas.height / 2 - 80,
							style : '#990021'
						});
						GE.addGameObject(text);
					}

					var text = new llk.Text({
								text : '( ⊙o⊙ ) Owesome!',
								duration : 2000,
								x : GE.canvas.width / 2,
								y : GE.canvas.height / 2 - 80,
								style : '#990021'
							});
					GE.addGameObject(text);
					GE.removeGameObject(btnSuggest);
					llk.Resource.medias['m'].play();
					setTimeout(loveScene, 2000);
				} else {
					while (!suggest()) {
						// style and text
						var text = new llk.Text({
									text : 'shuffle',
									duration : 2000,
									x : GE.canvas.width / 2,
									y : 20,
									style : '#990021'
								});
						GE.addGameObject(text);
						shuffle();
					}
				}
			}

			var ismatch = false;
			var result;
			if (match1(obj, presel)) {
				ismatch = true;
				done();
			} else if (result = match2(obj, presel)) {
				ismatch = true;
				var s = kzg.util.json.encode(result);
				var line = new llk.LineObj({
							path : result
						});
				GE.addGameObject(line);
				kzg.oe(line, 'done', done);
			}

			if (ismatch) {
				kzg.ue(obj, 'click', h_click);
				kzg.ue(presel, 'click', h_click);
				presel = null;
			} else {
				presel.select(false);
				obj.select();
				presel = obj;
			}

			return;
		} else {
			presel.select(false);
			obj.select();
		}
		presel = obj;
	}

	function lineImageX(cxt2D, x0, x1, y, img, height, width) {
		var count = Math.abs(x1 - x0) / width;
		var xs = Math.min(x0, x1);

		for (var i = 0; i < count; i++) {
			cxt2D.drawImage(img, xs + i * width - width / 2, y - height / 2,
					width, height);
		}
	}

	function lineImageY(cxt2D, y0, y1, x, img, height, width) {
		var count = Math.abs(y1 - y0) / width;
		var ys = Math.min(y0, y1);

		for (var i = 0; i < count; i++) {
			cxt2D.drawImage(img, x - width / 2, ys + i * height - height / 2,
					width, height);
		}
	}

	function shuffle() {
		typesMap = [];
		for (var i = 0; i < CY; i++) {
			var arr = matrix[i];
			for (var j = 0; j < CX; j++) {
				var fy = Math.floor(Math.random() * CY);
				var fx = Math.floor(Math.random() * CX);
				var obj = arr[j];
				arr[j] = matrix[fy][fx];
				matrix[fy][fx] = obj;

				var xy1 = cacOXY(j, i);
				var xy2 = cacOXY(fx, fy);

				if (matrix[fy][fx]) {
					matrix[fy][fx].x = xy2.x;
					matrix[fy][fx].y = xy2.y;
					matrix[fy][fx].ix = fx;
					matrix[fy][fx].iy = fy;
				}

				if (arr[j]) {
					arr[j].x = xy1.x;
					arr[j].y = xy1.y;
					arr[j].ix = j;
					arr[j].iy = i;
				}

			}
		}

		for (var i = 0; i < CY; i++) {
			var arr = matrix[i];
			for (var j = 0; j < CX; j++) {
				if (!arr[j]) {
					continue;
				}
				var type = arr[j].type;
				if (!typesMap[type]) {
					typesMap[type] = [];
				}
				typesMap[type].push(arr[j]);
			}
		}
	}

	var llk = kzgg.llk = {
		Text : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;
			var dur = ops.duration;
			var texts = ops.text.split('\n');

			function ctor() {

			}

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				//				cxt2D.font = ops.font ? ops.font : '26px bold'
				cxt2D.fillStyle = ops.style;
				for (var i = 0; i < texts.length; i++) {
					cxt2D.fillText(texts[i], ops.x, ops.y + i * 26);
				}

				if (dur == -1) {
					return;
				}
				dur -= duration;
				if (dur <= 0) {
					GE.removeGameObject(_this);
				}
			};

			this.zOrder = 1;
			this.text = ops.text;

			ctor();

		},
		ImageButton : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;

			var state = 0;
			var imgw = ops.images[0].width;
			var imgh = ops.images[0].height;

			function ctor() {
				kzg.on(GE.canvas, 'click', h_click);
				kzg.on(GE.canvas, 'mousemove', h_mover);
			}

			function h_mover(e) {
				if (!_this.inRange(e.clientX, e.clientY)) {
					state = 0;
					GE.canvas.style.cursor = '';
					return;
				}
				state = 1;
				GE.canvas.style.cursor = 'pointer';
			}

			function h_click(e) {
				if (!_this.inRange(e.clientX, e.clientY)) {
					return;
				}
				kzg.fire(_this, 'click');
			}

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				cxt2D.drawImage(_this.images[state], _this.x, _this.y);
			};

			this.inRange = function(x, y) {
				x -= kzg.getLeft(GE.canvas);
				y -= kzg.getTop(GE.canvas);
				if (_this.x > x)
					return false;
				if (_this.y > y)
					return false;
				if (_this.x + imgw < x)
					return false;
				if (_this.y + imgh < y)
					return false;

				return true;
			};

			this.zOrder = 1;
			this.x = ops.x;
			this.y = ops.y;
			this.images = ops.images;

			ctor();
		},
		Animate : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;
			var curFrame = 0;
			var frames = ops.frames;
			var frmCount = frames.length;
			var frmDur = ops.duration;
			var playCount = ops.playCount;
			var curPlayCount = 0;
			var lastDur = frmDur;

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				if (ops.width && ops.height) {
					cxt2D.drawImage(frames[curFrame], _this.x, _this.y,
							ops.width, ops.height);
				} else {
					cxt2D.drawImage(frames[curFrame], _this.x, _this.y);
				}
				lastDur -= duration;
				if (lastDur <= 0) {
					curFrame += 1;
					lastDur = frmDur;
					if (isNaN(playCount)) {
						curFrame %= frmCount;
					} else {
						if (0 == curFrame % frmCount) {
							curPlayCount += 1;
						}
						if (curPlayCount == playCount) {
							GE.removeGameObject(_this);
						}
					}
				}
			};

			this.x = ops.x;
			this.y = ops.y;
			this.zOrder = 1;
		},
		LineObj : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;

			var p1 = llk.cacXY(ops.path[0]);
			var p2 = llk.cacXY(ops.path[1]);
			var p3 = llk.cacXY(ops.path[2]);
			var p4 = llk.cacXY(ops.path[3]);

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				cxt2D.beginPath();
				cxt2D.lineTo(p1[0], p1[1]);
				cxt2D.lineTo(p2[0], p2[1]);
				cxt2D.lineTo(p3[0], p3[1]);
				cxt2D.lineTo(p4[0], p4[1]);
				cxt2D.strokeStyle = '#ec0033';
				cxt2D.stroke();
				GE.removeGameObject(this);
				kzg.fire(_this, 'done');
			};

			this.zOrder = 1;
		},
		BlockObj : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;

			var state = 0;
			var highlight = false;
			var highlightCount = 0;

			function ctor() {
				IMGW = _this.images[0].width;
				IMGH = _this.images[0].height;
				GE.ob('click', _this);
			}

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				if (4 == highlightCount) {
					highlight = false;
					highlightCount = 0;
				}
				if (highlight) {
					highlightCount += 1;
					state = highlightCount % 2;
				}
				cxt2D.drawImage(_this.images[state], _this.x, _this.y);
			};

			this.inRange = function(x, y) {
				// FIXME need caculate every time of the width when canvas' is a
				// percentage value
				x -= kzg.getLeft(GE.canvas);
				y -= kzg.getTop(GE.canvas);
				if (_this.x > x)
					return false;
				if (_this.y > y)
					return false;
				if (_this.x + IMGW < x)
					return false;
				if (_this.y + IMGH < y)
					return false;

				return true;
			};

			this.select = function(bl) {
				state = bl === false ? 0 : 2;
			};

			this.equals = function(obj) {
				return obj && _this.images[0].src === obj.images[0].src;
			};

			this.highlight = function() {
				highlight = true;
			};

			this.zOrder = 1;
			this.x = ops.x;
			this.y = ops.y;
			this.ix = ops.ix;
			this.iy = ops.iy;
			this.images = ops.images;
			this.type = this.images[0].src;

			ctor();
		},
		BackObj : function(ops) {
			kzgg.GameObject.call(this);

			var _this = this;
			var img = ops.image;

			function ctor() {

			}

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				cxt2D.drawImage(img, 0, 0, cxt2D.canvas.width,
						cxt2D.canvas.height);
			};

			this.setImage = function(argimg) {
				img = argimg;
			};

			this.zOrder = 0;

			ctor();
		},
		LoadAnimate : function() {
			kzgg.GameObject.call(this);

			var _this = this;
			var img;
			var blocks = [];
			var bombs = [];
			var loadnum = 0;
			var allcount = 0;

			function ctor() {
				img = new Image();
				img.onload = function() {
					img.ready = true;
					loadall();
				};
				img.src = 'images/Loading.gif';
			}

			function loadall() {
				for (var i = 1; i <= _this.types; i++) {
					allcount += 3;
					var img0 = new Image();
					img0.onload = h_load;
					img0.src = 'images/' + i + '.png';
					blocks.push(img0);
					var img1 = new Image();
					img1.onload = h_load;
					img1.src = 'images/' + i + '_L1.png';
					blocks.push(img1);
					var img2 = new Image();
					img2.onload = h_load;
					img2.src = 'images/' + i + '_L2.png';
					blocks.push(img2);
				}

				loadAnis(1, 6, bombs, 'images/B');
				loadAnis(1, 15, _this.cheers, 'images/cheers/cheers');

				load('dot', 'images/dots.gif');
				load('shuf0', 'images/btnSug1.png');
				load('shuf1', 'images/btnSug1_.png');
				load('background', 'images/background.jpg');
				load('ok', 'images/ok.jpg');

				loadAudio('m', 'audio/m.mp3');
			}

			function h_load(e) {
				loadnum += 1;
			}

			function loadAnis(start, end, arr, prefix) {
				for (var i = start; i <= end; i++) {
					var img0 = new Image();
					allcount += 1;
					img0.onload = h_load;
					img0.src = prefix + i.leftpad(3) + '.png';
					arr.push(img0);

				}
			}

			function loadAudio(key, src) {
				var audio;

				if (window.Audio) {
					audio = new Audio();
				} else {
					audio = document.createElement('audio');
				}
				allcount += 1;
				audio.onload = h_load;
				audio.src = src;
				audio.autobuffer = true;
				audio.load();
				_this.medias[key] = audio;
			}

			function load(key, src) {
				var img = new Image();
				allcount += 1;
				img.onload = h_load;
				img.src = src;
				_this.others[key] = img;
			}

			function getLoadingRate() {
				return loadnum / allcount;
			};

			this.draw = function(duration, cxt2D, xScroll, yScroll) {
				if (!img.ready) {
					return;
				}
				cxt2D.drawImage(img, 0, 0, cxt2D.canvas.width,
						cxt2D.canvas.height);
				var rate = getLoadingRate();
				cxt2D.font = '20px yellow';
				cxt2D.textAlign = 'center';
				cxt2D.textBaseline = 'middle';
				cxt2D.fillText(
						'loading...' + (rate + '').substring(2, 4) + '%',
						cxt2D.canvas.width / 2, cxt2D.canvas.height / 2);
				if (0.99 < rate) {
					GE.removeGameObject(_this);
					llk.Resource.blocks = _this.blocks;
					llk.Resource.bombs = _this.bombs;
					llk.Resource.cheers = _this.cheers;
					llk.Resource.others = _this.others;
					llk.Resource.medias = _this.medias;
					llk.Resource.types = _this.types;
					llk.start();
					return;
				}

			};

			this.blocks = blocks;
			this.bombs = bombs;
			this.cheers = [];
			this.others = [];
			this.medias = [];
			this.types = 39;

			ctor();
		},
		cacXY : function(args) {
			var ix = args[0], iy = args[1], type = args[2];

			var xy = cacOXY(ix, iy);
			var x = xy.x;
			var y = xy.y;

			switch (type) {
				case 'l' :
					x = x;
					y += IMGH / 2;
					break;
				case 't' :
					x += IMGW / 2;
					y = y;
					break
				case 'r' :
					x += IMGW;
					y += IMGH / 2;
					break;
				case 'b' :
					x += IMGW / 2;
					y += IMGH;
					break;
				case 'c' :
					x += IMGW / 2;
					y += IMGH / 2;
					break;
			}

			return [x, y];
		},
		pathLine : function(obj) {
			var xMin = obj.ix - 1;
			var xMax = obj.ix + 1;
			var yMin = obj.iy - 1;
			var yMax = obj.iy + 1;

			while (xMin != -1) {
				if (matrix[obj.iy][xMin]) {
					xMin += 1;
					break;
				}
				xMin -= 1;
			}
			while (xMax != CX) {
				if (matrix[obj.iy][xMax]) {
					xMax -= 1;
					break;
				}
				xMax += 1;
			}
			while (yMin != -1) {
				if (matrix[yMin][obj.ix]) {
					yMin += 1;
					break;
				}
				yMin -= 1;
			}
			while (yMax != CY) {
				if (matrix[yMax][obj.ix]) {
					yMax -= 1;
					break;
				}
				yMax += 1;
			}

			return {
				xmin : xMin,
				xmax : xMax,
				ymin : yMin,
				ymax : yMax
			};
		},
		clear : function() {
			if (matrix) {
				for (var i = 0; i < CY; i++) {
					var arr = matrix[i];
					for (var j = 0; j < CX; j++) {
						var obj = arr[j];
						if (!obj) {
							continue
						};
						kzg.ue(obj, 'click', h_click);
						GE.removeGameObject(obj);
					}
				}
			}
		},
		start : function() {
			allCount = CX * CY;
			backSceen = new llk.BackObj({
						image : llk.Resource.others['background']
					});
			GE.addGameObject(backSceen);

			// var btnShuffle = new llk.ImageButton({
			// images : [llk.Resource.others['shuf0'],
			// llk.Resource.others['shuf1']],
			// x : GE.canvas.width - 200,
			// y : 80
			// });
			//
			// GE.addGameObject(btnShuffle);
			// kzg.oe(btnShuffle, 'click', shuffle);

			btnSuggest = new llk.ImageButton({
						images : [llk.Resource.others['shuf0'],
								llk.Resource.others['shuf1']],
						x : GE.canvas.width - 200,
						y : 80
					});

			GE.addGameObject(btnSuggest);
			kzg.oe(btnSuggest, 'click', function() {
						var d1 = new Date();
						var tt = suggest();
						var d2 = new Date();
						log.debug('suggest spend:' + (d2 - d1));

						if (!tt) {
							log.error('not suggest.');
							return;
						}
						tt[0].highlight();
						tt[1].highlight();
					});

			matrix = [];
			X = (GE.canvas.width - CX * IMGW) / 2;
			Y = (GE.canvas.height - CY * IMGH) / 2 + 60;

			for (var i = 0; i < CY; i++) {
				var arr = matrix[i] = [];
				for (var j = 0; j < CX; j++) {
					var index = (Math.floor((i * CX + j) / 2) % llk.Resource.types)
							* 3;
					var xy = cacOXY(j, i);
					var obj = arr[j] = new llk.BlockObj({
								x : xy.x,
								y : xy.y,
								ix : j,
								iy : i,
								images : [llk.Resource.blocks[index],
										llk.Resource.blocks[index + 1],
										llk.Resource.blocks[index + 2]]
							});
					kzg.oe(obj, 'click', h_click);
					GE.addGameObject(obj);
				}
			}

			shuffle();
		},
		Resource : {
			blocks : null,
			bombs : null,
			cheers : null,
			others : null,
			medias : null,
			types : null
		}

	};

	llk.LoadAnimate.prototype = new kzgg.GameObject();
	llk.BackObj.prototype = new kzgg.GameObject();
	llk.BlockObj.prototype = new kzgg.GameObject();
	llk.Animate.prototype = new kzgg.GameObject();
	llk.ImageButton.prototype = new kzgg.GameObject();
	llk.Text.prototype = new kzgg.GameObject();
})();

kzg.ok(function() {
			var d2;
			try {
				d2 = document.createElement("canvas").getContext("2d");
			} catch (e) {
				alert('Oops! You browser seems to be not support html5 canvas!');
				return;
			}
			log.level = 'debug';
			GE = kzgg.GameEngine.init({
						canvas : document.getElementById('canvas'),
						fps : 16
					});
			var la = new kzgg.llk.LoadAnimate();
			GE.addGameObject(la);
			GE.canvas.style.width = GE.canvas.width;
			GE.canvas.style.height = GE.canvas.height;
		});