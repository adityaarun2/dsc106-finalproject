// Set dimensions and margins for the graph
const margin = { top: 20, right: 30, bottom: 40, left: 90 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.json('data/data.json').then(function(data) {

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, 4]) // Assuming no team scores more than 4 goals in a match
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Y axis
    const y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(d => d.date))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    // Bars for goals for
    svg.selectAll(".bar-gf")
      .data(data)
      .join("rect")
      .attr("class", "bar-gf")
      .attr("x", x(0))
      .attr("y", d => y(d.date))
      .attr("width", d => x(d.GF))
      .attr("height", y.bandwidth())
      .attr("fill", "#4CAF50")
      .on("click", (event, d) => showDetails(d));

    // Bars for goals against
    svg.selectAll(".bar-ga")
      .data(data)
      .join("rect")
      .attr("class", "bar-ga")
      .attr("x", x(0))
      .attr("y", d => y(d.date))
      .attr("width", d => x(d.GA))
      .attr("height", y.bandwidth())
      .attr("fill", "#f44336")
      .attr("transform", `translate(0, ${y.bandwidth()/2})`)
      .on("click", (event, d) => showDetails(d));
});

// Function to show details of a match
function showDetails(d) {
    const details = `Date: ${d.date}, Opponent: ${d.opponent}, Result: ${d.result}, Goals For: ${d.GF}, Goals Against: ${d.GA}, xG: ${d.xG}, xGA: ${d.xGA}, Possession: ${d.Poss}%`;
    d3.select("#details").text(details);
}
