// Utilities for converting from offset grids to axial coordinates

// Ideas taken from http://www.redblobgames.com/grids/hexagons/

(function (window) {

	var Hex = function () {
		// Coordinates stored in axial coordinates
	};

	Hex.prototype.clone = function () {
		var newHex = new Hex();
		for (var i in this) {
			newHex[i] = this[i];
		}
		return newHex;
	};

	Hex.prototype.getType = function () {
		return Hex;
	};
	
	Hex.prototype.setCube = function (cubeX, cubeY, cubeZ) {
		if (cubeX + cubeY + cubeZ !== 0) {
			throw new Error("Invalid cube coordinates!");
		}
		this.x = cubeX;
		this.y = cubeY;
		this.z = cubeZ;
	};

	Hex.prototype.setAxial = function (axialR, axialQ) {
		this.x = axialQ,
		this.z = axialR,
		this.y = -axialQ - axialR // For the 0 property
	};

	Hex.prototype.setOffset = function (offsetX, offsetY) {
		this.x = offsetY;
		this.z = offsetX - (offsetY + offsetY % 2) / 2;
		this.y = - this.x - this.z;
	};

	Hex.prototype.getOffset = function () {
		return {
			y: this.x,
			x: this.z + (this.x + this.x % 2) / 2
		};
	};


	Hex.prototype.getCube = function () {
		return {
			x: this.x,
			z: this.z,
			y: this.y 
		};
	};

	Hex.prototype.getAxial = function () {
		return {
			r: this.z,
			q: this.x
		};
	};

	Hex.prototype.getNeighbours = function () {
		var neighbourOffsets = [
			[0, 1], [-1, 1], [-1, 0],
			[0, -1], [1, -1], [1, 0]
		];
		var neighbours = [];
		var thisAxial = this.getAxial();
		for (var i = 0; i < neighbourOffsets.length; i++) {

			neighbours.push(
				new HexAxial(thisAxial.r + neighbourOffsets[i][0],
							 thisAxial.q + neighbourOffsets[i][1])
			);
		}

		return neighbours;
	};

	Hex.prototype.getAugmentedBasis = function () {
		return [
			[0, 1], [-1, 1], [-1, 0],
			[0, -1], [1, -1], [1, 0]
		];
	};

	Hex.prototype.getAxialDirections = Hex.prototype.getAugmentedBasis;

	Hex.prototype.getDistance = function (hex) {
		// Gets Manhattan Distance
		var selfCube = this.getCube();
		var hexCube = hex.getCube();
		var distanceSum = Math.abs(selfCube.x - hexCube.x) +
							Math.abs(selfCube.y - hexCube.y) + 
							Math.abs(selfCube.z - hexCube.z);
		return distanceSum / 2;
	};

	function HexCube(cubeX, cubeY, cubeZ) {
		var hex = new Hex();
		hex.setCube(cubeX, cubeY, cubeZ);
		return hex;
	}

	function HexAxial(axialR, axialQ) {
		var hex = new Hex();
		hex.setAxial(axialR, axialQ);
		return hex;
	}

	function HexOffset(offsetX, offsetY) {
		var hex = new Hex();
		hex.setOffset(offsetX, offsetY);
		return hex;
	}
	window.HexCube = HexCube;
	window.HexAxial = HexAxial;
	window.HexOffset = HexOffset;

})(window);