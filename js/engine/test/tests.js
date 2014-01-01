function generateBattleEngine() {
	return new BattleEngine({
		players: [
		],
		winCondition: WinConditions.None,
		mapSize: {
			width: 10, // Will need to convert to hex coords
			height: 10
		},
		winHandler: WinHandlers.Alert
	});
}

function generateUnits(battle) {
	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 20
			}
		});
}

test("Test Libraries", function () {

	var libs = [
		"BattleEngine", "Unit", "AttackHandlers", "DamageHandlers", "MovementHandlers",
		"HexCube", "HexAxial", "HexOffset", "WinConditions"
	];

	for (var i = 0; i < libs.length; i++) {
		ok(window[libs[i]], libs[i] + " included!");
	}
});

test("Test Battlefield Setup", function () {
	var battle = generateBattleEngine();

	ok(true, "Passed!");
});

test("Test Initial Units Setup", function () {

	var battle = generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});



	ok(battle.getMap()[1][1] === test, "Passed!");
});

test("Test Multiple Units Setup Success", function () {
	var battle = new generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 2
			}
		});

	ok(battle.getMap()[1][1] === test, "Passed!");
	ok(battle.getMap()[1][2] === test2, "Passed!");
});


test("Test Multiple Units Setup Failure", function () {
	var battle = generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	throws(function () {
		var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});
	}, Error, "Great!");
});


test("Test movement", function () {
	var battle = new generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	battle.start();

	strictEqual(test.stepsRemaining, 5);

	test.move(1, 2);

	strictEqual(test.stepsRemaining, 4);

	test.move(1, 3);
	strictEqual(test.stepsRemaining, 3);

	test.move(0, 0);
	strictEqual(test.stepsRemaining, 0);

	var result = test.move(0, 1);
	strictEqual(result, false);


});


test("Test 2 unit movement", function () {
	var battle = generateBattleEngine();

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 1,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 1,
			y: 1
		}
	});

	var test2 = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 5,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 1,
			y: 2
		}
	});
	battle.start();

	test.move(1, 2);
	ok(true);
});

test("Test attack", function () {
	var battle = generateBattleEngine();

	var player1 = new Player();
	var player2 = new Player();
	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			owner: player1,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.MeleeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			owner: player2,
			location: {
				x: 1,
				y: 2
			}
		});

	battle.start();

	var firstPath = test.canAttack(test2);
	var targetHex = firstPath[firstPath.length - 1].getOffset();
	test.attack(test2, targetHex.x, targetHex.y);

	strictEqual(test.location.getOffset().x, targetHex.x);
	strictEqual(test.location.getOffset().y, targetHex.y);
});


test("Test ranged attack", function () {
	var battle = generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 5,
			maxDamage: 5,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 20
			}
		});

	battle.start();

	var paths = test.canAttack(test2);
	test.attack(test2);

	strictEqual(test.location.getOffset().x, 1);
	strictEqual(test.location.getOffset().y, 1);

	strictEqual(test2.hp, 5);
});

test("Test unit death", function () {
	var battle = generateBattleEngine();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 20
			}
		});

	battle.start();

	var paths = test.canAttack(test2);
	test.attack(test2);

	strictEqual(test.location.getOffset().x, 1);
	strictEqual(test.location.getOffset().y, 1);
	strictEqual(test2.dead, true);
});

test("Test Turn Mechanism", function () {
	var battle = generateBattleEngine();

	var player = new Player();
	var player2 = new Player();

	var test = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 1
			}
		});

	var test2 = new Unit({
			name: "Test Unit",
			hp: 10,
			minDamage: 10,
			maxDamage: 10,
			speed: 5,
			movementHandler: new MovementHandlers.WalkHandler(),
			attackHandler: new AttackHandlers.RangeAttack(),
			damageHandler: new DamageHandlers.Default(),
			engine: battle,
			location: {
				x: 1,
				y: 20
			}
		});

	battle.start();
	strictEqual(battle.turn, 1);

	for (var i = 2; i < 10; i++) {
		battle.nextUnit();
		battle.nextUnit();
		strictEqual(battle.turn, i);
	}
});

test("Test Turn Player Restrictions", function () {
	var battle = generateBattleEngine();

	var player1 = new Player();
	var player2 = new Player();
	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 5,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 1,
			y: 1
		},
		owner: player1
	});


	var test2 = new Unit({
		name: "Test Unit2",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 10,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 10,
			y: 1
		},
		owner: player2
	});


	battle.start();

	strictEqual(test.playerMove(1, 2), false);
	battle.nextUnit();
	strictEqual(test.playerMove(1, 2), true);

});

test("Test checks on game started", function () {
	var battle = generateBattleEngine();
	var player = new Player();
	var player2 = new Player();

	var test = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 5,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 1,
			y: 1
		},
		owner: player2
	});

	throws(function () {
		battle.nextUnit();
	}, Error);
	throws(function () {
		test.playerMove(1, 2);
	}, Error);
	throws(function () {
		test.playerAttack(test);
	}, Error);

});

test("Check win condition", function () {
	var player = new Player("Player 1");
	var player2 = new Player("Player 2");

	var battle = new BattleEngine({
		players: [
		],
		winCondition: WinConditions.Default,
		mapSize: {
			width: 10, // Will need to convert to hex coords
			height: 10
		},
		winHandler: function (self, winners) {
			var winner = winners[0];
			strictEqual(winner, player2);
		}
	});


	var test2 = new Unit({
		name: "Test Unit",
		hp: 10,
		minDamage: 10,
		maxDamage: 10,
		speed: 5,
		movementHandler: new MovementHandlers.WalkHandler(),
		attackHandler: new AttackHandlers.MeleeAttack(),
		damageHandler: new DamageHandlers.Default(),
		engine: battle,
		location: {
			x: 1,
			y: 2
		},
		owner: player2
	});
	battle.start();
	battle.nextUnit();

	strictEqual(battle.started, false);
});
