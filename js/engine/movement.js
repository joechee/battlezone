(function (window) {

	function Visited() {
		this.map = {};
	}

	Visited.prototype.checkVisited = function (x, y) {
		if (this.map[x] && this.map[x][y]) {
			return true;
		} else {
			return false;
		}
	};

	Visited.prototype.visit = function (x, y) {
		if (!this.map[x]) {
			this.map[x] = {};
		}
		this.map[x][y] = true;
	};

	Visited.prototype.unvisit = function (x, y) {
		if (!this.map[x]) {
			this.map[x] = {};
		}
		delete this.map[x][y];
	};

	Visited.prototype.getVisited = function () {
		var hexes = [];
		for (var i in this.map) {
			for (var j in this.map[i]) {
				hexes.push(new HexOffset(i, j));
			}
		}
		return hexes;
	};

	function MovementHandler() {}

	MovementHandler.prototype.turnEndHandler = function () {
		throw new Error("MovementHandler turnEndHandler not implemented!");
	};

	MovementHandler.prototype.turnStartHandler = function () {
		throw new Error("MovementHandler turnStartHandler not implemented!");
	};

	MovementHandler.prototype.generateTurnStartHandler = function() {
		var thisHandler = this;
		return function () {
			thisHandler.turnStartHandler();
		};
	};

	MovementHandler.prototype.init = function (parent) {
		// Should have at least:
		// this.parent = parent;
		// this.engine = engine;
		throw new Error("MovementHandler initialize not implemented!")
	};

	MovementHandler.prototype.canMove = function (hexX, hexY) {
		throw new Error("MovementHandler canMove not Implemented!");		
	};

	MovementHandler.prototype.move = function (hexX, hexY) {
		throw new Error("MovementHandler move not Implemented!");
	};

	MovementHandler.prototype.getMovementRange = function () {
		throw new Error("MovementHandler getMovementRange not Implemented!");
	};


	function WalkHandler() {
		// A movement handler based on the unit speed trait
	}

	WalkHandler.prototype = new MovementHandler();

	WalkHandler.prototype.init = function (parent, map) {
		this.parent = parent;
		this.engine = this.parent.engine;
		
		if (!this.parent.speed) {
			throw new Error("This unit has no speed attribute!");
		}

		var turnStartHandler = this.generateTurnStartHandler();

		this.engine.registerTurnStartHandler(turnStartHandler);

		if (this.engine.started) {
			turnStartHandler();
		}
	};

	function backtrack(node) {
		var path = [];
		while (node.parent) {
			path.unshift(node);
			node = node.parent;
		}
		path.unshift(node);
		return path;
	}

	function checkBounds(offsetX, offsetY, engine) {
		return (offsetX >= 0 && offsetX < engine.mapSize.width && offsetY >= 0 && offsetY < engine.mapSize.height);
	}

	WalkHandler.prototype.canMove = function (hexX, hexY) {
		var thisHandler = this;
		var self = this.parent;
		// Might need to memoize
		// TODO: Change this to BFS


		var queue = [self.location.clone()];
		var nextQueue = [];
		var visited = new Visited();
		var stepsTaken = 0;
		var stepsRemaining = this.parent.stepsRemaining;

		if (!checkBounds(hexX, hexY, this.engine)) {
			return false;
		}

		while (true) {
			if (queue.length === 0 && nextQueue.length === 0) {
				return [];
			} else if (queue.length === 0) {
				queue = nextQueue;
				nextQueue = [];
				stepsTaken++;
				continue;
			} else if (stepsTaken > stepsRemaining) {
				return []; // Can terminate because this is BFS
			} else {
				var currentLocation = queue.pop();
				var offset = currentLocation.getOffset();
				var object = thisHandler.engine.getMap()[offset.x] && thisHandler.engine.getMap()[offset.x][offset.y];
				if (visited.checkVisited(offset.x, offset.y)) {
					continue;
				} else if (object && object !== self) {
					continue;
				} else if (!checkBounds(offset.x, offset.y, this.engine)) {
					continue;					
				} else if (offset.x === hexX && offset.y === hexY) {

					return backtrack(currentLocation);
				} else {
					visited.visit(offset.x, offset.y);
					var neighbours = currentLocation.getNeighbours();
					for (var i = 0; i < neighbours.length; i++) {
						neighbours[i].parent = currentLocation;
						nextQueue.push(neighbours[i]);
					}
				}

			}
		}
	};

	WalkHandler.prototype.getMovementRange = function () {
		var thisHandler = this;
		var stepsRemaining = this.parent.stepsRemaining;
		var queue = [this.parent.location.clone()];
		var nextQueue = [];
		var visited = new Visited();
		var stepsTaken = 0;
		var stepsRemaining = this.parent.stepsRemaining;
		while (true) {
			if (queue.length === 0 && nextQueue.length === 0) {
				break;
			} else if (queue.length === 0) {
				queue = nextQueue;
				nextQueue = [];
				stepsTaken++;
				continue;
			} else if (stepsTaken > stepsRemaining) {
				break; // Can terminate because this is BFS
			} else {
				var currentLocation = queue.shift();
				var offset = currentLocation.getOffset();
				var object = thisHandler.engine.getMap()[offset.x] && thisHandler.engine.getMap()[offset.x][offset.y];
				if (visited.checkVisited(offset.x, offset.y)) {
					continue;
				} else if (object && object !== this.parent) {
					continue;
				} else if (!checkBounds(offset.x, offset.y, this.engine)) {
					continue;					
				} else {
					visited.visit(offset.x, offset.y);
					var neighbours = currentLocation.getNeighbours();
					for (var i = 0; i < neighbours.length; i++) {
						neighbours[i].parent = currentLocation;
						nextQueue.push(neighbours[i]);
					}
				}

			}
		}
		var parentOffset = this.parent.location.getOffset();
		visited.unvisit(parentOffset.x, parentOffset.y);
		return visited.getVisited();
	};

	WalkHandler.prototype.turnStartHandler = function () {
		this.parent.stepsRemaining = this.parent.speed;
	};

	WalkHandler.prototype.move = function (hexX, hexY, path) {
		var canMove = this.canMove(hexX, hexY);
		if (canMove.length > 0) {
			var path = canMove;
			this.parent.location = new HexOffset(hexX, hexY);
			this.parent.stepsRemaining = this.parent.stepsRemaining - path.length + 1;
			return true;
		} else {
			return false;
		}
	};


	var MovementHandlers = {
		DefaultMovementHandler: WalkHandler,
		//FlyHandler: FlyHandler,
		WalkHandler: WalkHandler
	};

	window.MovementHandlers = MovementHandlers;
})(window);