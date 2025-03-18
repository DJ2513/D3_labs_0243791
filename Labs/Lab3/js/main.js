/*
*    main.js
*/

var svg = d3.select('#chart-area').append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.csv("./data/ages.csv").then(data => {
  data.forEach(e => {
    e.age = +e.age;
  });

  var circles = svg.selectAll("circle")
    .data(data);

  circles.enter()
    .append("circle")
    .attr("cx", (_d, i) => { return (i * 50) + 25 })
    .attr("cy", 25)
    .attr("r", (d) => { return d.age })
    .attr("fill", (d) => {
      if (d.age > 10) {
        return "green";
      } else {
        return "blue";
      }
    });

}).catch(err => {
  console.log("CSV ERROR: " + err);
});


d3.tsv("./data/ages.tsv").then(data => {
  data.forEach(e => {
    e.age = +e.age;
  });
  console.log(data);
}).catch(err => {
  console.log("TSV ERROR: " + err);
});

d3.json("./data/ages.json").then(data => {
  data.forEach(e => {
    e.age = +e.age;
  });
  console.log(data);
}).catch(err => {
  console.log("JSON ERROR: " + err);
});