// Set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 70, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#match-overview")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.json('results.json').then( function(data) {

  // X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(d => d.date))
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.GF, d.GA))])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars for Goals For
  svg.selectAll(".bar-gf")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar-gf")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.GF))
      .attr("width", x.bandwidth() / 2)
      .attr("height", d => height - y(d.GF))
      .attr("fill", "#4CAF50");

  // Bars for Goals Against
  svg.selectAll(".bar-ga")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar-ga")
      .attr("x", d => x(d.date) + x.bandwidth() / 2)
      .attr("y", d => y(d.GA))
      .attr("width", x.bandwidth() / 2)
      .attr("height", d => height - y(d.GA))
      .attr("fill", "#f44336");

  // Tooltip
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  svg.selectAll("rect")
      .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`Date: ${d.date}<br>Opponent: ${d.opponent}<br>Result: ${d.result}<br>GF: ${d.GF}<br>GA: ${d.GA}`)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

});
