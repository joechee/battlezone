test("Test HexAxial and HexCube", function () {
	var axial = new HexAxial(2, 3);
	var cube = new HexCube(1, 2, -3);

	var getAxial = axial.getAxial();
	strictEqual(getAxial.r, 2);
	strictEqual(getAxial.q, 3);
	var getCube = axial.getCube();
	strictEqual(getCube.x, 3);
	strictEqual(getCube.y, -5);
	strictEqual(getCube.z, 2);

	getAxial = cube.getAxial();
	getCube = cube.getCube();
	strictEqual(getCube.x, 1);
	strictEqual(getCube.y, 2);
	strictEqual(getCube.z, -3);

	strictEqual(getAxial.r, -3);
	strictEqual(getAxial.q, 1);

});


test("Test Invalid HexCube", function () {
	throws(function () {
		var cube = new HexCube(1, 2, 3);
	}, Error);
});


test("Test getNeighbours", function () {
	var axial = new HexAxial(2, 3);
	var neighbours = axial.getNeighbours();
	strictEqual(neighbours.length, 6);
});

test("Test getDistance", function () {
	var axial1 = new HexAxial(2, 3);
	var axial2 = new HexAxial(2, 4);

	strictEqual(axial1.getDistance(axial2), 1);
});


test("Test Offset", function () {
	var offset1 = new HexOffset(0, 0);
	var offset2 = new HexOffset(0, 1);

	strictEqual(offset1.getDistance(offset2), 1);
	var offset3 = new HexOffset(1, 0);
	strictEqual(offset1.getDistance(offset3), 1);

	var offset4 = new HexOffset(1, 1);
	strictEqual(offset1.getDistance(offset4), 1);

	var offset5 = new HexOffset(2, 2);
	strictEqual(offset1.getDistance(offset5), 3);


	var offset6 = new HexOffset(1, 2);
	var offset7 = new HexOffset(1, 3);
	strictEqual(offset6.getDistance(offset7), 1);

});