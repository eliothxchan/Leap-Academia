var full_grid = [];

$(document).on('ready', function() {

	var window_width = $(window).width();
	var window_height = $(window).height();
	var top_components = splitToParts(window_width, 10, 10);
	var left_components = splitToParts(window_height, 10, 10);

	for (var i = 0; i < top_components.length; i++) {
		full_grid[i] = [];
	}

	for (var i = 0; i < top_components.length; i++) {
		for (var j = 0; j < left_components.length; j++) {
			full_grid[i].push(new point(top_components[i], left_components[j]));
		}
	}

	console.log(full_grid);
});

function point(top, left) {
	this.top = top;
	this.left = left;
}

function splitToParts(size, numParts, padding) {

	var arr = [];
	var reduced_size = size-padding;

	for (var i = 0; i < numParts; i++) {
		arr.push(padding+(reduced_size/numParts*i));
	}

	return arr;

}

function closestSnapPoint(top, left) {

	var diff = 99999999;
	var closestPointIndex = new point(-1, -1);

	for (var i = 0; i < full_grid.length; i++) {
		for (var j = 0; j < full_grid[i].length; j++) {

			var ldiff = Math.abs(left - full_grid[i][j].left);
			var tdiff = Math.abs(top - full_grid[i][j].top);

			if (Math.sqrt(ldiff*ldiff + tdiff*tdiff) < diff) {
				diff = Math.sqrt(ldiff*ldiff + tdiff*tdiff);
				console.log("Diff = "+diff);
				closestPointIndex = [i,j];
				console.log("Left = "+full_grid[i][j].left);
				console.log("Top = "+full_grid[i][j].top);
			}
		}
	}

	var closestPoint = full_grid[closestPointIndex[0]][closestPointIndex[1]];
	console.log("Closest Point: "+closestPoint.top+" "+closestPoint.left);
	return closestPoint;

}