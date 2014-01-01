(function (window) {

	function BattleEngine(options) {
		this.started = false;
		if (options) {
			this.init(options);
		}
	}

	BattleEngine.prototype.init = function (options) {
		if (!options.winCondition || !options.winHandler) {
			throw new Error("No win conditions!");
		} else {
			this.winCondition = options.winCondition;
			this.winHandler = options.winHandler;
		}

		this.turnStartHandlers = [];
		this.turnEndHandlers = [];
		
		this.units = [];
		this.mapSize = options.mapSize;
	};

	BattleEngine.prototype.addUnit = function (unit) {
		var map = this.getMap();
		var location = unit.location.getOffset();
		if (!map[location.x]) {
			map[location.x] = {};
		}

		if (map[location.x][location.y]) {
			throw new Error("There is another unit at this position!");
		} else {
			this.map[location.x][location.y] = unit;
			this.units.push(unit);
		}
	};

	BattleEngine.prototype.removeUnit = function (unit) {
		var location = unit.location.getOffset();
		delete this.map[location.x][location.y];
		if (this.unitTurnOrder.contains(unit)) {
			this.unitTurnOrder.remove(unit);
		}
		var unitIndex = this.units.indexOf(unit);
		if (unitIndex !== -1) {
			this.units.splice(unitIndex, 1);
		}
		//TODO: remove unit handlers
	};

	BattleEngine.prototype.getMap = function () {
		if (!this.map) {
			this.map = {};
		}
		return this.map;
	};

	BattleEngine.prototype.start = function () {
		if (this.started) {
			throw new Error("Battle has already started!");
		}
		this.started = true;
		this.turn = 0;
		this.unitTurnOrder = new PriorityQueue(function (x) {
			return x.speed;
		});
		this.startTurn();
		this.nextUnit(); // Initialize the first unit
	};

	BattleEngine.prototype.stop = function () {
		this.started = false;
	};

	BattleEngine.prototype.startTurn = function () {
		this.turn++;
		for (var i = 0; i < this.turnStartHandlers.length; i++) {
			this.turnStartHandlers[i]();
		}

		this.setUpUnitTurnOrder();
	};

	BattleEngine.prototype.setUpUnitTurnOrder = function () {
		if (this.unitTurnOrder.getLength() !== 0) {
			throw new Error("Invalid unit turn order!");
		}

		for (var i = 0; i < this.units.length; i++) {
			this.unitTurnOrder.add(this.units[i]);
		}
	};

	BattleEngine.prototype.registerTurnStartHandler = function (handler) {
		this.turnStartHandlers.push(handler);
	};

	BattleEngine.prototype.registerTurnEndHandler = function (handler) {
		this.turnEndHandlers.push(handler);
	};

	BattleEngine.prototype.nextUnit = function () {
		if (!this.started) {
			throw new Error("Game has not started!");
		} else if (this.unitTurnOrder.getLength() > 0) {
			this.currentUnit = this.unitTurnOrder.dequeue();
		} else {
			this.endTurn();
			if (this.started) {
				this.startTurn();
				this.currentUnit = this.unitTurnOrder.dequeue();
			}
		}
	};

	BattleEngine.prototype.endTurn = function () {
		for (var i = 0; i < this.turnEndHandlers.length; i++) {
			this.turnEndHandlers[i]();
		}
		this.checkWinCondition();
	};

	BattleEngine.prototype.checkWinCondition = function () {
		var winner = this.winCondition(this);
		if (winner) {
			this.stop();
			this.winHandler(this, winner);
		}
	};


	BattleEngine.prototype.playerSkip = function (player) {
		if (!player) {
			throw new Error("No arguments passed in!");
		} else if (this.currentUnit.owner === player) {
			this.nextUnit();
		} else {
			throw new Error("Not your turn!");
		}
	};

	BattleEngine.prototype.getUnit = function (offsetX, offsetY) {
		if (!this.map[offsetX]) {
			this.map[offsetX] = {};
		}
		return this.map[offsetX][offsetY];
	};

	window.BattleEngine = BattleEngine;


})(window);