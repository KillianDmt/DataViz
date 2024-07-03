import * as d3 from "d3";
import * as topojson from "topojson-client";

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
        const country = row.cells[1].innerText.trim();
        const data = {};

        for (let j = 2; j < row.cells.length; j++) {
            const year = headers[j - 2];
            const value = row.cells[j].innerText.replace(',', '.').trim();
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
console.log(result);

// Create the Map to hold country shapes
const countryMap = new Map();

// Fetch the GeoJSON data
fetch('./assets/europe.topojson')
    .then(response => response.json())
    .then(topoData => {
        const geoData = topojson.feature(topoData, topoData.objects.countries).features;
        geoData.forEach(feature => {
            const countryName = feature.properties.NAME;
            countryMap.set(countryName, feature);
        });
        console.log(countryMap);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

function UpdateChart(year) {
    const dataForYear = Object.keys(result).map(country => ({
        country: country,
        crimes: result[country][year] || 0,
        countryShape: countryMap.get(country)
    })).filter(d => d.countryShape)
      .sort((a, b) => d3.descending(a.crimes, b.crimes));

    const radius = d3.scaleSqrt()
        .domain([0, d3.max(dataForYear, d => d.crimes)])
        .range([0, 40]);

    const path = d3.geoPath();

    d3.select("#chart").html(""); // Clear the existing chart

    const svg = d3.select("#chart").append("svg")
        .attr("width", 975)
        .attr("height", 610)
        .attr("viewBox", [0, 0, 975, 610])
        .attr("style", "width: 100%; height: auto; height: intrinsic;");

    svg.append("path")
        .datum(topojson.feature(topoData, topoData.objects.countries))
        .attr("fill", "#ddd")
        .attr("d", path);

    svg.append("g")
        .attr("fill", "brown")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .selectAll("circle")
        .data(dataForYear)
        .join("circle")
        .attr("transform", d => `translate(${d3.geoCentroid(d.countryShape)})`)
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
    UpdateChart(year);
});

// Initial chart rendering
UpdateChart(2020);
