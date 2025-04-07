let formattedData, interval;
let time = 0;
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

var tip = d3.tip().attr("class", "d3-tip").html(d => {
	var text = "<strong>Country:</strong><span style='color:red'> " + d.country + "</span><br>";
	text += "<strong>Continent:</strong><span style='color:red;text-transform:capitalize'> " + d.continent + "</span><br>";
	text += "<strong>Life Expectancy:</strong><span style='color:red'> " + d3.format(".2f")(d.life_exp) + "</span><br>";
	text += "<strong>GDP Per Capita:</strong><span style='color:red'> " + d3.format("$,.0f")(d.income) + "</span><br>";
	text += "<strong>Population:</strong><span style='color:red'> " + d3.format(",.0f")(d.population) + "</span><br>";
	return text;
});
svg.call(tip);

d3.json("data/data.json").then(function (data) {
	formattedData = data.map((year) => {
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

	$("#play-button").on("click", function () {
		var button = $(this);
		if (button.text() === "Play") {
			button.text("Pause");
			interval = setInterval(step, 100);
		} else {
			button.text("Play");
			clearInterval(interval);
		}
	});

	$("#reset-button").on("click", function () {
		time = 0;
		update(formattedData[time]);
		$("#play-button").text("Play");
		clearInterval(interval);
	});

	$("#continent-select").on("change", function () {
		update(formattedData[time]);
	});

	$("#date-slider").slider({
		max: 2014, min: 1800, step: 1,
		slide: (event, ui) => {
			time = ui.value - 1800;
			update(formattedData[time]);
		}
	});

	update(formattedData[time]);

}).catch(error => {
	console.log("There was an error: " + error);
})

function step() {
	time = (time < 214) ? time + 1 : 0;
	update(formattedData[time]);
}

function update(data) {
	var t = d3.transition().duration(100);
	var xAxis = d3.axisBottom(xScale)
		.tickValues([400, 4000, 40000])
		.tickFormat(d => "$" + d);
	xAxisG.call(xAxis);

	var yAxis = d3.axisLeft(yScale);
	yAxisG.call(yAxis);

	var continent = $("#continent-select").val();
	var countries = data.countries.filter(d => {
		if (continent === "all") { return true; }
		else { return d.continent === continent; }
	});

	var circles = svg.selectAll("circle")
		.data(countries, d => d.country);

	circles.exit().remove();

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
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.transition(t)
		.attr("r", d => Math.sqrt(area(d.population) / Math.PI));

	yearText.text(data.year);
	$("#year")[0].innerHTML = +(time + 1800);
	$("#date-slider").slider("value", +(time + 1800));
}