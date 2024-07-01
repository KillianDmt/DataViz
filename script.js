import * as d3 from "d3";
import * as topojson from "topojson";

function tableToJSON() {
    const table = document.getElementById('table1');
    const headers = [];
    const json = {};

    // Get headers (years)
    const headerCells = table.rows[1].cells;
    for (let i = 2; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText);
    }

    // Iterate over the rows
    for (let i = 2; i < table.rows.length; i++) {
        const row = table.rows[i];
        const country = row.cells[1].innerText;
        const data = {};

        for (let j = 2; j < row.cells.length; j++) {
            const year = headers[j - 2];
            const value = row.cells[j].innerText.replace(',', '.');
            if (value !== ':') { // Exclude missing data
                data[year] = parseFloat(value);
            }
        }

        json[country] = data;
    }

    return json;
}

// Run the function and log the output
const result = tableToJSON();
console.log(JSON.stringify(result, null, 2));


const MapEurope = new Map();


// europe.topojson dans ./assets

function UpdateChart(year) {
    const ChartForYear = result.filter(d => d.date === year.toString());

     // Continue with the rest of the D3.js code to create the chart
     const data = result.map((d) => ({
        ...d,
        countryShape: MapEurope.get(d.country),
    })).filter(d => d.countryShape)
      .sort((a, b) => d3.descending(a.crimes, b.crimes));

    const radius = d3.scaleSqrt([0, d3.max(data, d => d.crimes)], [0, 40]);
    const path = d3.geoPath();

    d3.select("#chart").html(""); // Clear the existing chart

    const svg = d3.select("#chart").append("svg")
        .attr("width", 975)
        .attr("height", 610)
        .attr("viewBox", [0, 0, 975, 610])
        .attr("style", "width: 100%; height: auto; height: intrinsic;");

    svg.append("path")
        .datum(topojson.feature(world, world.objects.countries)) // Assuming 'world' contains world map data
        .attr("fill", "#ddd")
        .attr("d", path);

    svg.append("g")
        .attr("fill", "brown")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("transform", d => `translate(${centroid(d.countryShape)})`)
        .attr("r", d => radius(d.crimes))
      .append("title")
        .text(d => `${d.country}\n${d.crimes} crimes`);

    const legend = svg.append("g")
        .attr("fill", "#777")
        .attr("transform", "translate(915,608)")
        .attr("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .selectAll("g")
        .data(radius.ticks(4).slice(1))
        .join("g");

    legend.append("circle")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("cy", d => -radius(d))
        .attr("r", radius);

    legend.append("text")
        .attr("y", d => -2 * radius(d))
        .attr("dy", "1.3em")
        .text(radius.tickFormat(4, "s"));
}

document.getElementById("slider").addEventListener("input", function() {
    const year = this.value;
    document.getElementById("dateLabel").innerText = year;
    updateChart(year);
});

// Initial chart rendering
updateChart(2020);


