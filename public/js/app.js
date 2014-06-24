var socket = io(window.location.hostname);
var svg = d3.select("svg");

var width = Math.round(window.innerWidth) - 20;
var height = Math.round(window.innerHeight) - 20;

var index = 0;

var barWidth = 2;

svg
	.attr("height", height)
	.attr("width", width);

var xScale = d3.scale.linear()
	.domain([0, width/barWidth])
	.rangeRound([0, width]);

var yScale = d3.scale.linear()
	.domain([0, 200])
	.rangeRound([0, height]);

var colorScale = d3.scale.linear()
	.domain([0, 200])
	.range(["#0D0080", "#FF0000"]);

svg
	.append("text")
		.attr("x", 50)
		.attr("y", 50)
		.attr("font-size", 24)

socket.on('data', function (data) {
	if(index >= width/barWidth){
		svg.selectAll("rect").remove();
		index=0;
	}
	svg
	.select("text")
		.text(data.temp);

	svg
	.append("rect")
		.attr("height", yScale(data.temp))
		.attr("y", height - yScale(data.temp))
		.attr("x", function(){
			index++;
			return xScale(index);
		})
		.attr("width", barWidth)
		.style("fill", colorScale(data.temp));
});