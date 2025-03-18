/*
*    main.js
*/

var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 600;
var height = 400;

var g = d3.select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");



d3.json("./data/buildings.json").then(data => {
  var rects = g.selectAll("rect").data(data);

}).catch(err => {
  console.log("CSV ERROR: " + err);
});
