/*
*    main.js
*/

var svg = d3.select('#chart-area').append("svg")
  .attr("width", 500)
  .attr("height", 500);

d3.json("./data/buildings.json").then(data => {
  var rect = svg.selectAll("rect")
    .data(data);

  var max = d3.max(data, (d) => { return d.height; })
  var buildings = d3.map(data, (d) => { return d.name; })
  var range = [0, 400]
  var padding = 0.3

  var x = d3.scaleBand()
    .domain(buildings)
    .range(range)
    .paddingInner(padding)
    .paddingOuter(padding)

  var y = d3.scaleLinear()
    .domain([0, max])
    .range(range);

  rect.enter()
    .append("rect")
    .attr("width", 40)
    .attr("height", (d) => {
      console.log(`${d.name}: ` + y(+d.height));
      return y(+d.height)
    })
    .attr("x", (_d, i) => { return i * 50 })
    .attr("y", 100)
    .attr("fill", (_d, i) => { return d3.schemeSet3[i] });

}).catch(err => {
  console.log("CSV ERROR: " + err);
});
