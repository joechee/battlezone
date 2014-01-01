(function (window) {

	function HexDOMMap() {
		this.map = {};
		this.hexes = [];
	}

	HexDOMMap.prototype.addHexagon = function (offsetX, offsetY, hexDOM) {
		if (!this.map[offsetX]) {
			this.map[offsetX] = {};
		}
		if (this.map[offsetX][offsetY]) {
			this.map[offsetX][offsetY].push(hexDOM);
		} else {
			this.map[offsetX][offsetY] = [hexDOM];
		}
		this.hexes.push(hexDOM);

	};

	HexDOMMap.prototype.getDOMArray = function (offsetX, offsetY) {
		if (!this.map[offsetX]) {
			this.map[offsetX] = {};
		}
		return this.map[offsetX][offsetY];
	};

	HexDOMMap.prototype.getFirstDOM = function (offsetX, offsetY) {
		var DOMArray = this.getDOMArray(offsetX, offsetY);
		return DOMArray ? DOMArray[0] : undefined;
	};

	HexDOMMap.prototype.getHexes = function () {
		return this.hexes;
	};

	function HexGrid(width, height, radius, debug) {
		var self = this;
		var grid = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.hexDOMMap = new HexDOMMap();
		var widthStep = 2 * Math.cos(Math.PI/6) * radius;
		var heightStep = 1.5 * radius;
		var gridOffsetX = 2.5 * radius;
		var gridOffsetY = radius;

		var actualWidth = width * widthStep + gridOffsetX;
		var actualHeight = height * heightStep + gridOffsetY;


		grid.setAttribute('width', actualWidth);
		grid.setAttribute('height', actualHeight);

		function onclick(e) {
			var hexDOM = e.target;
			self.onclick(hexDOM);
		}

		for (var j = 0; j < height; j++) {
			var yCoord = j * heightStep;
			var offset = j % 2 ? -0.5 : 0 
			for (var i = 0; i < width; i++) {
				var xCoord = (i + offset) * widthStep;
				var hex = createHexagon(xCoord + gridOffsetX, yCoord + gridOffsetY, radius);

				hex.setAttribute('gridX', i);
				hex.setAttribute('gridY', j);
				grid.appendChild(hex);
				this.hexDOMMap.addHexagon(i, j, hex);
				hex.addEventListener('click', onclick);
				if (debug) {
					grid.appendChild(createText(xCoord + gridOffsetX, yCoord + gridOffsetY, radius, i + ", " + j));
				}
				grid.appendChild(createSprite(xCoord + gridOffsetX, yCoord + gridOffsetY));
			}
		}
		

		this.$ = grid;
	}

	HexGrid.prototype.onclick = function (hexDOM) {
		
	};

	HexGrid.prototype.getDOM = function () {
		return this.$;
	};


	HexGrid.prototype.addUnit = function (unit) {
		if (unit.dead) {
			return;
		}
		var offset = unit.location.getOffset();
		var hex = this.hexDOMMap.getFirstDOM(offset.x, offset.y);
		hex.classList.add("unit", unit.owner.getClassName());
	};

	HexGrid.prototype.removeUnit = function (unit) {
		var offset = unit.location.getOffset();
		var hex = this.hexDOMMap.getFirstDOM(offset.x, offset.y);
		hex.classList.remove("unit", "current", unit.owner.getClassName());
	};

	HexGrid.prototype.setCurrentUnit = function (unit) {
		if (this.currentUnitHex) {
			this.unsetCurrentUnit();
		}
		var offset = unit.location.getOffset();
		var hex = this.hexDOMMap.getFirstDOM(offset.x, offset.y);
		hex.classList.add("current");
		this.currentUnitHex = hex;
	};

	HexGrid.prototype.unsetCurrentUnit = function () {
		if (this.currentUnitHex) {
			this.currentUnitHex.classList.remove("current");
			this.currentUnitHex = undefined;
		}
	};

	HexGrid.prototype.drawPath = function (path) {
		// Path should be an array of hexes
		this.highlightedPath = path;
		for (var i = 0; i < path.length; i++) {

		}
	};

	HexGrid.prototype.undrawPath = function () {
		this.highlightedPath = undefined;
	};

	HexGrid.prototype.highlightMovementRange = function (unit) {

		var movementRange = unit.getMovementRange();

		for (var i = 0; i < movementRange.length; i++) {
			var offset = movementRange[i].getOffset();
			this.hexDOMMap.getFirstDOM(offset.x, offset.y).classList.add("path");
		}
	};

	HexGrid.prototype.highlightAttackRange = function (unit) {
		var attackRange = unit.getAttackRange();
		for (var i = 0; i < attackRange.length; i++) {
			var offset = attackRange[i].getOffset();
			this.hexDOMMap.getFirstDOM(offset.x, offset.y).classList.add("path");
		}
	};

	HexGrid.prototype.highlightRange = function (unit) {
		this.highlightMovementRange(unit);
		this.highlightAttackRange(unit);
	};

	HexGrid.prototype.removeHighlight = function () {
		var hexes = this.hexDOMMap.getHexes();
		for (var i = 0; i < hexes.length; i++) {
			hexes[i].classList.remove("path");
		}
	};


	function createHexagon(centerX, centerY, radius) {
		var poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		var points = "";
		for (var i = 0; i < 6; i++) {
			var angle = 2 * Math.PI / 6 * (i + 0.5);
			var pointX = centerX + radius * Math.cos(angle);
			var pointY = centerY + radius * Math.sin(angle);
			points += pointX + "," + pointY + " ";
		}

		poly.setAttribute("points", points);
		return poly;
	}

	function createText(centerX, centerY, size, textContent) {
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		text.setAttribute('x', centerX - size / 2);
		text.setAttribute('y', centerY);
		text.setAttribute('font-size', '30%')
		text.textContent = textContent;
		return text;

	}

	function createSprite(centerX, centerY, src) {
		var sprite = document.createElementNS('http://www.w3.org/2000/svg','image');
		var width = 20;
		var height = 27;


		sprite.style['background-image'] = "url(img/dragon.png)";
		sprite.setAttribute('x', centerX - width / 2);
		sprite.setAttribute('y', centerY - 2/3 * height);
		sprite.setAttributeNS('http://www.w3.org/1999/xlink','href','img/dragon.png');
		sprite.setAttribute('width', width);
		sprite.setAttribute('height', height);
		return sprite;
	}
	
	window.HexGrid = HexGrid;
})(window);