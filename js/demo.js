(function (window) {
	var drawing = document.querySelector('#drawing');
	engine = new EngineGUI({
		'$': drawing,
		players: [
		],
		winCondition: WinConditions.Default,
		mapSize: {
			width: 10, // Will need to convert to hex coords
			height: 10
		},
		winHandler: WinHandlers.Alert,
		onclick: function (dom) {
			if (dom.classList.contains("path") && dom.classList.contains("unit")) {
				var gridX = dom.getAttribute('gridX');
				var gridY = dom.getAttribute('gridY');
				engine.currentUnit.playerAttack(engine.getUnit(parseInt(gridX, 10), parseInt(gridY, 10)));
			} else if (dom.classList.contains("path")) {
				var gridX = dom.getAttribute('gridX');
				var gridY = dom.getAttribute('gridY');
				engine.currentUnit.playerMove(parseInt(gridX, 10), parseInt(gridY, 10));

			}
		}
	});

	var player1 = new Player("yolo", "#abcdef");
	var player2 = new Player("doge", "#fedcba");

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 3,
		owner: player2,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: engine,
		location: {
			x: 1,
			y: 1
		}
	});

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 3,
		owner: player2,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: engine,
		location: {
			x: 1,
			y: 5
		}
	});

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 6,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: engine,
		owner: player1,
		location: {
			x: 1,
			y: 3
		}
	});

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 3,
		owner: player2,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: engine,
		location: {
			x: 7,
			y: 5
		}
	});




	function setUpHandlers() {

		var $skipTurn = document.querySelector('#next-turn');
		$skipTurn.addEventListener('click', function (e) {
			if (engine.currentUnit.owner === player1) {
				engine.playerSkip(player1);
			} else {
				throw new Error("Not your turn!");
			}
		});
	}


	setUpHandlers();
	engine.start();


})(window);