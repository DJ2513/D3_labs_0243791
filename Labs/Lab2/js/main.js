/*
*    main.js
*/

var data = [25, 20, 15, 10, 5];

var svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

var react = svg.selectAll("rect")
  .data(data);

react.enter()
  .append("rect")
  .attr("width", 40)
  .attr("height", (d) => { return d })
  .attr("x", (_d, i) => { return i * 50 })
  .attr("y", 100)
  .attr("fill", "blue");

