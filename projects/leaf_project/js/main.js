
var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xScale = d3.scaleLog()
	.domain([142, 150000])
	.range([0, width]);

var yScale = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal(d3.schemePastel1);

var xAxisG = svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")

var yAxisG = svg.append("g")
	.attr("class", "y axis");

svg.append("text")
	.attr("class", "axis-label")
	.attr("x", width / 2)
	.attr("y", height + 50)
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.text("Income (GDP per Capita)");

svg.append("text")
	.attr("class", "axis-label")
	.attr("x", -height / 2)
	.attr("y", -60)
	.attr("transform", "rotate(-90)")
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.text("Life Expectancy (yrs)");

var yearText = svg.append("text")
	.attr("class", "year-text")
	.attr("x", width - 30)
	.attr("y", height - 10)
	.attr("text-anchor", "end")
	.attr("font-size", "50px")
	.style("opacity", "0.4")
	.text("");

d3.json("data/data.json").then(function (data) {
	const formattedData = data.map((year) => {
		return {
			year: year.year,
			countries: year.countries.filter((country) => {
				return country.income && country.life_exp;
			}).map((country) => {
				country.income = +country.income;
				country.life_exp = +country.life_exp;
				country.population = +country.population;
				return country;
			})
		}
	});

	var counter = 0;

	update(formattedData[counter]);

	d3.interval(() => {
		counter = (counter + 1) % formattedData.length;
		update(formattedData[counter]);
	}, 1000)

}).catch(error => {
	console.log("There was an error: " + error);
})


function update(data) {
	var t = d3.transition().duration(1000);
	var xAxis = d3.axisBottom(xScale)
		.tickValues([400, 4000, 40000])
		.tickFormat(d => "$" + d);
	xAxisG.call(xAxis);

	var yAxis = d3.axisLeft(yScale);
	yAxisG.call(yAxis);

	var circles = svg.selectAll("circle")
		.data(data.countries, d => d.country);

	circles.transition(t)
		.attr("cx", d => xScale(d.income))
		.attr("cy", d => yScale(d.life_exp))
		.attr("r", d => Math.sqrt(area(d.population) / Math.PI))
		.attr("fill", d => color(d.continent))
		.attr("opacity", "0.8");

	circles.enter().append("circle")
		.attr("cx", d => xScale(d.income))
		.attr("cy", d => yScale(d.life_exp))
		.attr("r", 0)
		.attr("fill", d => color(d.continent))
		.attr("opacity", "0.8")
		.transition(t)
		.attr("r", d => Math.sqrt(area(d.population) / Math.PI));

	yearText.text(data.year)
}