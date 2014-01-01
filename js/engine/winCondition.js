(function (window) {

	var WinConditions = {
		Default: function (self) {
			var players = [];
			var map = this.getMap();
			for (var i in map) {
				for (var j in map[i]) {
					if (players.indexOf(map[i][j].owner) === -1) {
						players.push(map[i][j].owner);
					}
				}
			}

			if (players.length > 1) {
				return false;
			} else {
				return players;
			}
			// Default should be all enemies destroyed
		},
		None: function (self) {
			// Unable to win game!
			return false;
		}
	};

	window.WinConditions = WinConditions;
})(window);


(function (window) {

	var WinHandlers = {
		Alert: function (self, winners) {
			if (winners.length === 1) {
				alert(winners[0].name + " has won this battle!");
			} else {
				alert("It is a draw!");
			}
		},
		Debug: function (self, winners) {
			console.debug(winner.name + " has won this battle!");
		}
	}

	window.WinHandlers = WinHandlers;
})(window);