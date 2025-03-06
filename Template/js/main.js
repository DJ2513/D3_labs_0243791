/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

var circle = svg.append("circle")
  .attr("cx", 376)
  .attr("cy", 250)
  .attr("r", 70)
  .attr("fill", "blue");

var rect = svg.append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 100)
  .attr("height", 75)
  .attr("fill", "red");