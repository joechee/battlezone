test("Test PriorityQueue", function () {
	var test = new PriorityQueue(function (x) {return x;});

	test.add(1);
	test.add(2);
	test.add(3);
	strictEqual(test.dequeue(), 3);
	strictEqual(test.dequeue(), 2);
	strictEqual(test.dequeue(), 1);

});


test("Test PriorityQueue", function () {
	var test = new PriorityQueue(function (x) {return x;});

	test.add(2);
	test.add(3);
	test.add(1);
	strictEqual(test.dequeue(), 3);
	strictEqual(test.dequeue(), 2);
	strictEqual(test.dequeue(), 1);

});


test("Test PriorityQueue", function () {
	var test = new PriorityQueue(function (x) {return x;});

	test.add(3);
	test.add(2);
	test.add(1);
	strictEqual(test.dequeue(), 3);
	strictEqual(test.dequeue(), 2);
	strictEqual(test.dequeue(), 1);
});