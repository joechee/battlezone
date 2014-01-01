(function (window) {

	function DamageHandler() {}

	DamageHandler.prototype.init = function (parent) {
		this.parent = parent;
	};

	DamageHandler.prototype.takeDamage = function () {
		// This should return the amount of damage taken
		throw new Error("Not Implemented!");
	};


	function DefaultDamageHandler() {}
	DefaultDamageHandler.prototype = new DamageHandler();
	DefaultDamageHandler.prototype.takeDamage = function (damage) {
		this.parent.hp = this.parent.hp - damage;
		return Math.min(damage, this.parent.hp);
	};


	var DamageHandlers = {
		Default: DefaultDamageHandler
	};

	window.DamageHandlers = DamageHandlers;
})(window);