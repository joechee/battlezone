(function (window) {
	function PriorityQueue(lambda) {
		if (!lambda) {
			throw new Error("No lambda specified!");
		}
		this.lambda = lambda;
		this.heap = [];
	}

	PriorityQueue.prototype.add = function (item) {
		this.heap.push(item);

		var currentIndex = this.heap.length - 1;

		while (true) {
			if (currentIndex === 0) {
				return;
			} else {
				var parent = Math.floor(currentIndex / 2);
				if (this.lambda(this.heap[parent]) < this.lambda(this.heap[currentIndex])) {
					swap(this.heap, parent, currentIndex);
					currentIndex = parent;
				} else {
					return;
				}
			}
		}
	};

	PriorityQueue.prototype.dequeue = function (item) {
		if (this.getLength() === 0) {
			throw new Error("Queue Empty!");
		} else if (this.getLength() === 1) {
			return this.heap.pop();
		}
		var item = this.heap[0];
		this.heap[0] = this.heap.pop();

		var currentIndex = 0;
		while (true) {
			if (currentIndex >= this.heap.length) {
				return item;
			} else {
				var leftChild = currentIndex * 2 + 1;
				var rightChild = currentIndex * 2 + 2;
				if (leftChild < this.heap.length && this.lambda(this.heap[currentIndex]) < this.lambda(this.heap[leftChild])) {
					swap(this.heap, currentIndex, leftChild);
				} else if (rightChild < this.heap.length && this.lambda(this.heap[currentIndex]) < this.lambda(this.heap[rightChild])) {
					swap(this.heap, currentIndex, rightChild);
				} else {
					return item;
				}
			}
		}
	};

	PriorityQueue.prototype.remove = function (item) {
		if (this.getLength() === 0) {
			throw new Error("Queue Empty!");
		} else if (this.getLength() === 1) {
			if (this.heap[0] === item) {
				this.heap.pop();
			} else {
				throw new Error("Item not in queue!");
			}
		} else {
			var index = this.heap.indexOf(item);
			if (index === -1) {
				throw new Error("Item not in queue!");
			}
			this.heap[index] = this.heap.pop();

			var currentIndex = index;
			while (true) {
				if (currentIndex >= this.heap.length) {
					return item;
				} else {
					var leftChild = currentIndex * 2 + 1;
					var rightChild = currentIndex * 2 + 2;
					if (leftChild < this.heap.length && this.lambda(this.heap[currentIndex]) < this.lambda(this.heap[leftChild])) {
						swap(this.heap, currentIndex, leftChild);
					} else if (rightChild < this.heap.length && this.lambda(this.heap[currentIndex]) < this.lambda(this.heap[rightChild])) {
						swap(this.heap, currentIndex, rightChild);
					} else {
						return item;
					}
				}
			}
		}
	};

	PriorityQueue.prototype.contains = function (item) {
		return this.heap.indexOf(item) !== -1;
	};

	PriorityQueue.prototype.getLength = function () {
		return this.heap.length;
	};

	function swap(arr, a, b) {
		var swap = arr[a];
		arr[a] = arr[b];
		arr[b] = swap;
	}







	window.PriorityQueue = PriorityQueue;
})(window);