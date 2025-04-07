/*
*    main.js
*/
d3.json("./data/revenues.json").then(data => {
  data.forEach(d => {
    d.revenue = +d.revenue;
  });

  var margin = { top: 10, right: 10, bottom: 100, left: 100 };
  var width = 600;
  var height = 400;

  var charWidth = width - margin.left - margin.right;
  var charHeight = height - margin.top - margin.bottom;
  var padding = 0.3;
  var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, charWidth])
    .paddingInner(padding)
    .paddingOuter(padding);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([charHeight, 0]);

  g.selectAll('rect')
    .data(data).enter()
    .append('rect')
    .attr("y", (d) => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth())
    .attr("height", (d) => charHeight - y(d.revenue))
    .attr("fill", "yellow");

  var bottomAxis = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + charHeight + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40) translate(-5,10)");

  var leftAxis = d3.axisLeft(y).ticks(10).tickFormat(d => "$" + d / 1000 + "K");
  g.append("g")
    .attr("class", "y axis")
    .call(leftAxis);

  svg.append("text")
    .attr('x', -(height - margin.bottom - margin.top) / 2 - margin.top)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");

  svg.append("text")
    .attr("x", charWidth / 2)
    .attr("y", charHeight + 90)
    .attr("font-size", "20px")
    .text("Month");


}).catch(error => {
  console.error('Error loading the data:', error);
});