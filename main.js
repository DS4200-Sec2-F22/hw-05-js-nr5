const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left:50, right:50, top:25, bottom:25}

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

/*
//
//
SCATTERPLOT
//
//
*/

//frame being used for scatterplot
const SCATTERFRAME = d3.select("#scatterVis")
				.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");

//scale for x-axis of scatterplot
const X_SCALE_SCATTER = d3.scaleLinear()
						.domain([0, 10])
						.range([0, VIS_WIDTH]);

//scale for y-axis of scatterplot
const Y_SCALE_SCATTER = d3.scaleLinear()
						.domain([10.5, 0]) //listed in descending order to properly visualize
						.range([0, VIS_HEIGHT]);

d3.csv("data/scatter-data.csv").then((data) => {

	//appending points 
	SCATTERFRAME.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE_SCATTER(d.x) + MARGINS.left;})
				.attr("cy", (d) => {return Y_SCALE_SCATTER(d.y);})
				.attr("r", 10)
				.attr("class", "point")
				.attr("data-x", (d) => {return d.x}) 
				.attr("data-y", (d) => {return d.y}); //x and y values of each point from the CSV, will be referenced later

	//visualizing x axis
	SCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT) + ")")
			.call(d3.axisBottom(X_SCALE_SCATTER).ticks(9))
			.attr("font-size", "20px");

	//visualizing y axis
	SCATTERFRAME.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + 0 + ")")
			.call(d3.axisLeft(Y_SCALE_SCATTER).ticks(9))
			.attr("font-size", "20px");
		//calling the initialization for all CSV-specified points
	
	initAllPoints();
});


//adds click functionality to all existing points
function initAllPoints() {
	let points = document.querySelectorAll(".point");
	points.forEach(point => {initPoint(point)});
}

//initializes a single point with click functionality
function initPoint(point) {
	point.addEventListener('click', (e) => {pointClicked(point)});
}

//handling for clicking a point on the SVG
function pointClicked(point) {
	let pointDisplay = document.getElementById("lastClicked"); //selecting div that will display the last clicked point coordinates
	let x = point.getAttribute("data-x");
	let y = point.getAttribute("data-y");
	pointDisplay.innerHTML = "Last clicked point: (" + x + "," + y + ")"; //injecting HTML with clicked point text
	pointDisplay.style.display = "block"; //show div
	//logic for whether circle border should be shown or hidden
	if (point.style.strokeWidth == "2px") {
		point.style.strokeWidth = "0px";
	} else {
		point.style.strokeWidth = "2px";
	}
}

//plotting user-added points
document.getElementById("addPointButton").addEventListener('click', addPoint);

//iterative value that ensures unique user-added point IDs
let pointsAdded = 0;

//letting a user add a point to the scatterplot
function addPoint() {
	let x = document.getElementById("x-coordinate").value;
	let y = document.getElementById("y-coordinate").value;

	SCATTERFRAME.append("circle")
					.attr("cx", X_SCALE_SCATTER(x) + MARGINS.left)
					.attr("cy", Y_SCALE_SCATTER(y))
					.attr("r", 10)
					.attr("class", "point")
					.attr("data-x", x) //specified in dropdown
					.attr("data-y", y) //specified in dropdown
					.attr("id", pointsAdded); //guaranteed to be unique
	initPoint(document.getElementById(pointsAdded)); //initializing this point individually
	pointsAdded = pointsAdded + 1; //
}

/*
//
//
//BAR CHART
//
//
*/

//frame being used for bar chart
const BARFRAME = d3.select("#barVis")
                .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

//width of each bar; may be changed
const BAR_WIDTH = 40

//x-scale for bar chart
const X_SCALE_BAR = d3.scaleBand()
  .domain(["A", "B", "C", "D", "E", "F", "G"])
  .range([0, (BAR_WIDTH * 8)])

//rendering bars from CSV file
d3.csv("data/bar-data.csv").then((data) => {
	console.log(data);

	const MAX_Y_BAR = d3.max(data, (d) => {return parseInt(d.amount);});

	//y-scale for bar chart
		const Y_SCALE_BAR = d3.scaleLinear()
		.domain([0, MAX_Y_BAR + 50])
	    .range([0, VIS_HEIGHT]);
	const Y_SCALE_BAR_AXIS = d3.scaleLinear()
		.domain([0, MAX_Y_BAR + 50])
	    .range([VIS_HEIGHT, 0]);
	

	//appending points 
    BARFRAME.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", (d) => {return X_SCALE_BAR(d.category) + MARGINS.left;})
                .attr("y", (d) => { return VIS_HEIGHT - Y_SCALE_BAR(d.amount);})
                .attr("width", BAR_WIDTH)
                .attr("height", (d) => { return Y_SCALE_BAR(d.amount); })
                .attr("class", "bar");

    //adding x-axis
    BARFRAME.append("g")
        .attr("transform", 
              "translate(" + MARGINS.left + "," + VIS_HEIGHT + ")")
        .call(d3.axisBottom(X_SCALE_BAR).ticks(7))
            .attr("font-size", "20px");

    //adding y-axis
    BARFRAME.append("g")
    	.attr("transform",
    			"translate(" + MARGINS.left + "," + "0" + ")")
    	.call(d3.axisLeft(Y_SCALE_BAR_AXIS).ticks(10))
            .attr("font-size", "20px");

     //adding tooltip
 	const TOOLTIP = d3.select("#barVis")
 						.append("div")
 							.attr("class", "tooltip")
 							.style("opacity", 0);

	//tooltip behavior when mousing over a bar
 	function mouseover(event, d) {
 		TOOLTIP.style("opacity", 1);
 	}

 	//tooltip behavior when moving mouse while on a bar
 	function mousemove(event, d) {
 		TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
 			.style("left", (event.pageX + 5) + "px")
 			.style("top", (event.pageY - 50) + "px");
 	}

 	//tooltip behavior when moving mouse off of bar
 	function mouseleave(event, d) {
 		TOOLTIP.style("opacity", 0);
 	}

 	BARFRAME.selectAll(".bar")
 			.on("mouseover", mouseover)
 			.on("mousemove", mousemove)
 			.on("mouseleave", mouseleave);

});