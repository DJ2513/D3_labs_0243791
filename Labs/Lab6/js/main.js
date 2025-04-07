/*
*    main.js
*/
d3.json("./data/revenues.json").then(data => {
  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  var margin = { top: 10, right: 10, bottom: 100, left: 100 };
  var width = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .style('background', '#1a1a1a');

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.3);

  var y = d3.scaleLinear()
    .range([charHeight, 0]);

  var xAxis = d3.axisBottom(x);
  var xAxisG = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + charHeight + ")")
    .call(xAxis)

  xAxisG.selectAll("text")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .selectAll(".domain, .tick line")
    .style("stroke", "white");

  var yAxisG = g.append("g")
    .attr("class", "y axis")

  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", charHeight + 50)
    .attr("font-size", "20px")
    .style("fill", "white")
    .text("Month");

  var yLabel = svg.append("text")
    .attr('x', -(height - margin.bottom - margin.top) / 2 - margin.top)
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .text("Revenue (dlls.)");

  var flag = true;

  function update(data, flag) {
    var field = flag ? "revenue" : "profit";
    y.domain([0, d3.max(data, d => d[field])]);
    yAxisG.call(d3.axisLeft(y).ticks(10).tickFormat(d => "$" + d / 1000 + "K"))
      .selectAll("text").style("fill", "white")
      .selectAll(".domain, .tick line").style("stroke", "white");

    var rects = g.selectAll('rect').data(data);
    rects.exit().remove();

    rects
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d[field]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => charHeight - y(d[field]))
      .attr("fill", "yellow");

    rects.enter().append("rect")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d[field]))
      .attr("width", x.bandwidth())
      .attr("height", d => charHeight - y(d[field]))
      .attr("fill", "yellow");

    yLabel.text(flag ? "Revenue (dlls.)" : "Profit (dlls.)");
  };

  update(data, flag);

  d3.interval(() => {
    update(data);
    flag = !flag;
  }, 1000);

}).catch(error => {
  console.error('Error loading the data:', error);
});

