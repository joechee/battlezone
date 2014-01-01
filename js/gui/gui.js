(function (window) {

	function EngineGUI (options) {
		BattleEngine.apply(this, arguments);
		this.hexGrid = new HexGrid(10, 10, 20, options.debug);
		if (options.$) {
			options.$.appendChild(this.hexGrid.getDOM());
		}
		this.hexGrid.onclick = options.onclick;
	}
	EngineGUI.prototype = new BattleEngine();

	EngineGUI.prototype.addUnit = function (unit) {
		BattleEngine.prototype.addUnit.apply(this, arguments);
		this.hexGrid.addUnit(unit);

		/*
		Overload Unit with funky methods

		*/

		var thisEngine = this;
		unit.move = function () {
			thisEngine.hexGrid.removeUnit(this);
			thisEngine.hexGrid.removeHighlight();
			this.constructor.prototype.move.apply(this, arguments);
			thisEngine.hexGrid.addUnit(this);
			thisEngine.hexGrid.setCurrentUnit(thisEngine.currentUnit);
			thisEngine.hexGrid.highlightRange(thisEngine.currentUnit);
		};

		unit.attack = function (target) {
			thisEngine.hexGrid.removeUnit(target);
			thisEngine.hexGrid.removeHighlight();
			var attackPaths = this.canAttack.apply(this, arguments);
			if (attackPaths.length > 1) {
				var attackHex = attackPaths[0].getOffset();
				if (arguments[1] === undefined) {
					arguments = [arguments[0], attackHex.x, attackHex.y];
					this.constructor.prototype.attack.apply(this, arguments);
				}
			}
			thisEngine.hexGrid.addUnit(target);
		};

	};

	EngineGUI.prototype.removeUnit = function (unit) {
		BattleEngine.prototype.removeUnit.apply(this, arguments);
		this.hexGrid.removeUnit(unit);
	};

	EngineGUI.prototype.init = function () {
		BattleEngine.prototype.init.apply(this, arguments);
	};

	EngineGUI.prototype.nextUnit = function () {
		this.hexGrid.unsetCurrentUnit();
		this.hexGrid.removeHighlight();
		BattleEngine.prototype.nextUnit.apply(this, arguments);
		this.hexGrid.setCurrentUnit(this.currentUnit);
		this.hexGrid.highlightRange(this.currentUnit);
	};



	window.EngineGUI = EngineGUI;




})(window);