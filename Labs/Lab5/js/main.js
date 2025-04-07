/*
*    main.js
*/

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = +d.height;
  });

  var margin = { top: 10, right: 10, bottom: 100, left: 100 };
  var width = 600;
  var height = 400;

  var charWidth = width - margin.left - margin.right;
  var charHeight = height - margin.top - margin.bottom;

  var padding = 0.3

  var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, charWidth])
    .paddingInner(padding)
    .paddingOuter(padding)

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([charHeight, 0]);

  var color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeSet3);

  g.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr("y", (d) => y(d.height))
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth())
    .attr("height", (d) => charHeight - y(d.height))
    .attr("fill", (d) => color(d.name));

  var bottomAxis = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + charHeight + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40) translate(-5,10)");

  var leftAxis = d3.axisLeft(y).ticks(5).tickFormat(d => d + " m");
  g.append("g")
    .attr("class", "y axis")
    .call(leftAxis);

  svg.append("text")
    .attr('x', -(height - margin.bottom - margin.top) / 2 - margin.top)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height (m)");

  svg.append("text")
    .attr("x", charWidth / 2)
    .attr("y", charHeight + 160)
    .attr("font-size", "20px")
    .text("The world's Tallest Buildings");

}).catch(err => {
  console.log("CSV ERROR: " + err);
});
