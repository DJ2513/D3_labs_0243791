/*
*    main.js
*/

var svg = d3.select('#chart-area').append("svg")
  .attr("width", 900)
  .attr("height", 900);

d3.json("./data/buildings.json").then(data => {
  var rect = svg.selectAll("rect")
    .data(data);

  rect.enter()
    .append("rect")
    .attr("width", 40)
    .attr("height", (d) => { return +d.height })
    .attr("x", (_d, i) => { return i * 50 })
    .attr("y", 100)
    .attr("fill", (d) => {
      switch (d.country) {
        case "China":
          return "gray";
        case "United States":
          return "blue";
        case "UAE":
          return "green";
        case "Saudi Arabia":
          return "yellow";
        case "South Korea":
          return "purple";
        default:
          return "black";
      }
    });

}).catch(err => {
  console.log("CSV ERROR: " + err);
});
