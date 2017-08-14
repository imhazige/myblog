/**
 * http://code.google.com/p/zkjs/ author careprad email:careprad@gmail.com
 */

(function() {
	var requestAnimationFrame = window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame || window.oRequestAnimationFrame
			|| function(callback) {
				setTimeout(callback, 1000 / 60);
			};

	var kzgg = window.kzg.game = {
		GameEngine : function(ops) {
			var _this = this;

			var objs = [];
			var lastFrame = new Date().getTime();
			var fps;
			var xScroll = 0;
			var yScroll = 0;
			var canvas = null;
			var cxt2D = null;
			var backBuf = null;
			var backBufCxt2D = null;
			var addedGameObjects = [];
			var removedGameObjects = [];

			function ctor() {
				canvas = ops.canvas;
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				cxt2D = canvas.getContext('2d');
				backBuf = document.createElement('canvas');
				backBuf.width = canvas.width;
				backBuf.height = canvas.height;
				backBufCxt2D = backBuf.getContext('2d');
				fps = ops.fps ? ops.fps : 1000;

				_this.cxt2D = cxt2D;
				_this.canvas = canvas;

				setInterval(draw, 1000 / fps);
			}

			function draw() {
				var curFrame = new Date().getTime();
				var dt = curFrame - lastFrame;
				lastFrame = curFrame;

				backBufCxt2D.clearRect(0, 0, backBuf.width, backBuf.height);

				removeOldGameObjects();
				addNewGameObjects();

				// first update all the game objects
				for (var x = 0; x < objs.length; ++x) {
					if (objs[x].update) {
						objs[x].update(dt, backBufCxt2D, xScroll, yScroll);
					}
				}

				// then draw the game objects
				for (var x = 0; x < objs.length; ++x) {
					if (objs[x].draw) {
						objs[x].draw(dt, backBufCxt2D, xScroll, yScroll);
					}
				}

				// copy the back buffer to the displayed canvas
				cxt2D.clearRect(0, 0, canvas.width, canvas.height);// TODO need
																	// I?
				cxt2D.drawImage(backBuf, 0, 0);

			}

			this.shutdownAll = function() {
				for (var x = 0; x < this.gameObjects.length; ++x) {
					if (this.gameObjects[x].shutdown) {
						this.gameObjects[x].shutdown();
					}
				}

				this.removeOldGameObjects();
			}

			function addNewGameObjects() {
				if (addedGameObjects.length != 0) {
					for (var x = 0; x < addedGameObjects.length; ++x) {
						objs.push(addedGameObjects[x]);
					}

					addedGameObjects.clear();
					objs.sort(function(a, b) {
								return a.zOrder - b.zOrder;
							});
				}
			}

			function removeOldGameObjects() {
				if (removedGameObjects.length != 0) {
					for (var x = 0; x < removedGameObjects.length; ++x) {
						objs.removeo(removedGameObjects[x]);
					}
					removedGameObjects.clear();
				}
			}

			this.clear = function() {
				cxt2D.clearRect(0, 0, canvas.width, canvas.height);
			};

			this.addGameObject = function(gameObject) {
				addedGameObjects.push(gameObject);
			};
			this.removeGameObject = function(gameObject) {
				removedGameObjects.push(gameObject);
			};
			this.ob = function(type, gameobj) {
				kzg.on(canvas, type, function(e) {
							if (!gameobj.inRange(e.clientX, e.clientY)) {
								return;
							}
							kzg.fire(gameobj, type, gameobj)
						});
			};

			ctor();
		},
		GameObject : function() {
			this.zOrder = 0;
			this.update = function(duration, cxt2D, xScroll, yScroll) {
			};
			this.draw = function(duration, cxt2D, xScroll, yScroll) {
			};
			this.inRange = function(x, y) {
			};
		}
	};

	kzgg.GameEngine.init = function(ops) {
		kzgg.GameEngine.instance = new kzgg.GameEngine(ops);
		return kzgg.GameEngine.instance;
	};
})();