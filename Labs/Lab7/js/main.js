/*
*    main.js
*/
d3.json("./data/revenues.json").then(data => {
  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  var margin = { top: 10, right: 10, bottom: 100, left: 100 };
  var width = 600;
  var height = 400;

  var charWidth = width - margin.left - margin.right;
  var charHeight = height - margin.top - margin.bottom;

  var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .style('background', '#1a1a1a');

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, charWidth])
    .padding(0.3);

  var y = d3.scaleLinear()
    .range([charHeight, 0]);

  var xAxis = d3.axisBottom(x);
  var xAxisG = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + charHeight + ")")
    .call(xAxis)

  var yAxisG = g.append("g")
    .attr("class", "y axis")

  svg.append("text")
    .attr("x", charWidth / 2 + margin.left)
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
  const trans = d3.transition().duration(1500);

  function update(data) {
    var field = flag ? "revenue" : "profit";
    y.domain([0, d3.max(data, d => d[field])]);
    yAxisG.call(d3.axisLeft(y).ticks(10).tickFormat(d => "$" + d / 1000 + "K"))
      .selectAll("text").style("fill", "white")
      .selectAll(".domain, .tick line").style("stroke", "white");


    xAxisG.selectAll("text")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .selectAll(".domain, .tick line")
      .style("stroke", "white");


    var rects = g.selectAll('rect').data(data);
    rects.exit().attr("fill", "red")
      .transition(trans)
      .attr("y", y(0))
      .attr("height", 0)
      .remove();

    rects.transition(trans)
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d[field]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => charHeight - y(d[field]));

    rects.enter().append("rect")
      .attr("fill", "grey")
      .attr("y", y(0))
      .attr("height", 0)
      .attr("x", d => x(d.month))
      .attr("width", x.bandwidth())
      .merge(rects)
      .transition(trans)
      .attr("y", d => y(d[field]))
      .attr("height", d => charHeight - y(d[field]))

    yLabel.text(flag ? "Revenue (dlls.)" : "Profit (dlls.)");
  };

  d3.interval(() => {
    var newData = flag ? data : data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);

  update(data);
}).catch(error => {
  console.error('Error loading the data:', error);
});

