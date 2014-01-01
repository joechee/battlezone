(function (window) {

	var id = 0;

	function Player (name, color) {
		this.name = name;
		this.color = color || "#abcdef";
		this.id = id++;
		var style = document.createElement('style');
		style.type = "text/css";
		style.innerHTML = ".unit.player-" + this.id + " { fill:" + this.color + "}";
		document.body.appendChild(style);
	}

	Player.prototype.getClassName = function () {
		return "player-" + this.id;
	};
	
	window.Player = Player;

})(window);