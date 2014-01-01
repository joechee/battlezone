(function (window) {
	var Hex = (new HexAxial(0, 0)).getType();


	/* 
		TODO: Remove handlers once unit is dead
	*/
	function Unit(attributes) {
		this.init(attributes);
	}

	Unit.prototype.init = function (attributes) {
		for (var i in attributes) {
			this[i] = attributes[i];
		}

		if (this.location instanceof Hex) {

		} else {
			this.location = new HexOffset(this.location.x, this.location.y);
		}

		/* Should just do some type checking */

		if (!this.hp) {
			throw new Error("This unit does not have any HP!");
		} else if (!this.movementHandler) {
			throw new Error("No movement handler defined!");
		} else if (!this.attackHandler) {
			throw new Error("No attack handler defined!");
		} else if (!this.engine) {
			throw new Error("No engine attached!");
		} else if (!this.location) {
			throw new Error("Location not defined!");
		}

		// TODO: Need support for multiple units at a position

		this.engine.addUnit(this);
		

		this.movementHandler.init(this);
		this.damageHandler.init(this);
		this.attackHandler.init(this);
	};

	Unit.prototype.takeDamage = function (damage) {
		if (damage === undefined || damage === NaN) {
			throw new Error("No damage specified!");
		}
		this.damageHandler.takeDamage(damage);
		if (this.hp <= 0) {
			this.die();
		}
	};

	Unit.prototype.canMove = function (hexX, hexY) {
		if (hexX === undefined || hexY === undefined) {
			throw new Error("No location specified!");
		}
		return this.movementHandler.canMove(hexX, hexY);
	};

	Unit.prototype.move = function (hexX, hexY) {
		if (hexX === undefined || hexY === undefined) {
			throw new Error("No location specified!");
		}
		var offsetCoords = this.location.getOffset();
		var originalX = offsetCoords.x;
		var originalY = offsetCoords.y;
		var map = this.engine.getMap();
		var result = this.movementHandler.move(hexX, hexY);
		if (!map[originalX]) {
			map[originalX] = {};
		}
		if (map[originalX][originalY] && map[originalX][originalY] !== this) {
			throw new Error("There is another unit at this position!");
		} else if (result) {
			delete map[originalX][originalY];
			var currentOffset = this.location.getOffset();
			if (!this.engine.map[currentOffset.x]) {
				this.engine.map[currentOffset.x] = {};
			}
			this.engine.map[currentOffset.x][currentOffset.y] = this;
			return true;
		} else {
			return false;
		}
	};

	Unit.prototype.getMovementRange = function () {
		return this.movementHandler.getMovementRange();
	};

	Unit.prototype.getAttackRange = function () {
		return this.attackHandler.getAttackRange();
	};

	Unit.prototype.canAttack = function (target) {
		if (!target) {
			throw new Error("No target specified!");
		}
		return this.attackHandler.canAttack(target);
	};

	Unit.prototype.attack = function (target, attackSpaceX, attackSpaceY) {
		if (!target) {
			throw new Error("No target specified!");
		}
		return this.attackHandler.attack(target, attackSpaceX, attackSpaceY);
	};

	// Public functions 
	Unit.prototype.playerMove = function (hexX, hexY) {
		if (!this.engine.started) {
			throw new Error("Engine not started!");
		} else if (this.engine.currentUnit === this) {
			var result = this.move(hexX, hexY);
			// Should abstract this out into some kind of turn end condition
			if (this.stepsRemaining === 0) {
				this.engine.nextUnit();
			}
			return result;
		} else {
			return false;
		}
	};

	Unit.prototype.playerAttack = function (target, attackSpaceX, attackSpaceY) {
		if (!this.engine.started) {
			throw new Error("Engine not started!");
		} else if (this.engine.currentUnit === this) {
			var result = this.attack(target, attackSpaceX, attackSpaceY);
			if (this.stepsRemaining === 0) {
				this.engine.nextUnit();
			}
			return result;
		} else {
			return false;
		}
	};

	Unit.prototype.die = function () {
		this.hp = 0;
		this.engine.removeUnit(this);
		this.dead = true;
		// TODO: Handle handler deregistration
		if (this.deathHandler) {
			this.deathHandler();
		}
		this.engine.checkWinCondition();
	};

	window.Unit = Unit;

})(window);