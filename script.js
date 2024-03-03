// Load the data from the JSON file
d3.json('results.json').then(matches => {
    // Set dimensions and margins for the graph
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the div called 'match-overview'
    const svg = d3.select("#match-overview")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, Math.max(...matches.map(match => Math.max(match.GF, match.GA)))])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
      .range([ 0, height ])
      .domain(matches.map(match => match.opponent))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    // Bars for Goals For
    svg.selectAll(".bar-gf")
      .data(matches)
      .join("rect")
      .attr("class", "bar-gf")
      .attr("x", x(0) )
      .attr("y", d => y(d.opponent))
      .attr("width", d => x(d.GF))
      .attr("height", y.bandwidth())
      .attr("fill", "#4CAF50")
      .append("title") // Tooltip for GF
      .text(d => `GF: ${d.GF}, GA: ${d.GA}`);

    // Bars for Goals Against
    svg.selectAll(".bar-ga")
      .data(matches)
      .join("rect")
      .attr("class", "bar-ga")
      .attr("x", x(0) )
      .attr("y", d => y(d.opponent))
      .attr("width", d => x(d.GA))
      .attr("height", y.bandwidth())
      .attr("fill", "#f44336")
      .attr("transform", `translate(0,${y.bandwidth() / 2})`)
      .append("title") // Tooltip for GA
      .text(d => `GF: ${d.GF}, GA: ${d.GA}`);
});
