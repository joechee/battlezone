(function (window) {


	function AttackHandler() {}


	AttackHandler.prototype.turnEndHandler = function () {
		throw new Error("AttackHandler turnEndHandler not implemented!");

	};

	AttackHandler.prototype.turnStartHandler = function () {
		throw new Error("AttackHandler turnStarthandler not implemented!");
	};

	AttackHandler.prototype.init = function (parent) {
		// Should have at least:
		// this.parent = parent;
		throw new Error("AttackHandler initialize not implemented!")
	};

	AttackHandler.prototype.canAttack = function (hexX, hexY) {
		throw new Error("AttackHandler move not Implemented!");		
	};

	AttackHandler.prototype.attack = function (hexX, hexY) {
		throw new Error("AttackHandler move not Implemented!");
	};


	function DamageAttack() {}
	DamageAttack.prototype = new AttackHandler();
	DamageAttack.prototype.computeDamage = function () {
		var range = this.parent.maxDamage - this.parent.minDamage + 1;
		return Math.floor(Math.random() * range) + this.parent.minDamage;
	};
	DamageAttack.prototype.init = function (parent) {
		this.parent = parent;
	}; 

	/* MeleeAttack */


	function MeleeAttack() {}

	MeleeAttack.prototype = new DamageAttack();
	MeleeAttack.prototype.init = function (parent) {
		DamageAttack.prototype.init.call(this, parent);
	};

	MeleeAttack.prototype.canAttack = function (target, attackSpaceX, attackSpaceY) {
		var targetHex = target.location;
		if (target === this.parent || target.owner === this.parent.owner) {
			return [];
		} else if (attackSpaceX !== undefined && attackSpaceY !== undefined) {
			var attackSpaceHex = new HexOffset(attackSpaceX, attackSpaceY);
			var paths = this.parent.canMove(attackSpaceX, attackSpaceY);
			if (targetHex.getDistance(attackSpaceHex) === 1 && paths) {
				// Just get the first path
				if (paths.length > 1) {
					paths = [new HexOffset(attackSpaceX, attackSpaceY)];
				}
				return paths;
			} else {
				return [];
			}
		} else {
			var paths = [];
			var neighbours = targetHex.getNeighbours();
			var result;
			for (var i = 0; i < neighbours.length; i++) {
				var neighbourOffset = neighbours[i].getOffset();
				result = this.canAttack(target, neighbourOffset.x, neighbourOffset.y);
				for (var path in result) {
					paths.push(neighbours[i]);
				}
			}
			return paths;

		}
		
	};

	MeleeAttack.prototype.getAttackRange = function () {
		var units = this.parent.engine.units;
		var hexes = [];
		for (var i = 0; i < units.length; i++) {
			if (this.canAttack(units[i]).length > 0) {
				hexes.push(units[i].location);
			}
		}
		return hexes;
	};

	MeleeAttack.prototype.attack = function (target, attackSpaceX, attackSpaceY) {
		var canAttack = this.canAttack(target, attackSpaceX, attackSpaceY);
		if (canAttack.length > 0) {
			this.parent.move(attackSpaceX, attackSpaceY);
			target.takeDamage(this.computeDamage());
			return true;
		} else {
			return false;
		}
	};

	function RangeAttack() {}

	RangeAttack.prototype = new DamageAttack();
	RangeAttack.prototype.init = function (parent) {
		DamageAttack.prototype.init.call(this, parent);
	};

	RangeAttack.prototype.canAttack = function (target, attackSpaceX, attackSpaceY) {
		return [[new HexOffset(this.parent.x, this.parent.y)]];
	};

	RangeAttack.prototype.attack = function (target, attackSpaceX, attackSpaceY) {
		var canAttack = this.canAttack(target, attackSpaceX, attackSpaceY);
		if (canAttack) {
			target.takeDamage(this.computeDamage());
			return true;
		} else {
			return false;
		}
		// Handle After attack handlers?
	};


	var AttackHandlers = {
		DefaultAttackHandler: MeleeAttack,
		MeleeAttack: MeleeAttack,
		RangeAttack: RangeAttack
	};

	window.AttackHandlers = AttackHandlers;

})(window);

