
function dataFrom1() {
    const table = document.getElementById('table1');
    const tableBis = document.getElementById('table2');
    const headers = [];
    const json = {};

    const headerCells = table.rows[1].cells;
    for (let i = 1; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText);
    }
    
    const headerCellsBis = tableBis.rows[0].cells
    for (let i = 2; i < headerCellsBis.lenght; i++) {
        headers.push(headerCellsBis[i+1]).innerText
    }

    console.log(headers);
    console.log(tableBis);

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

       for (let iBis = 2; iBis < tableBis.rows.length; iBis++){
            const rowBis = tableBis.rows[iBis];
            const countryBis = row.cells[1].innerText.trim();
            const dataBis = {};

            for (let jBis = 2; jBis < rowBis.cells.lenght; jBis++) {

                while (tableBis[iBis][jBis] === country) {
                
                    const yearBis = headers[j + 10];
                    const value = rowBis.cells[jBis].innerText.replace(',', '.').trim();
                    if (value !== ':') { // Exclude missing data
                        data[yearBis] = parseFloat(value);
                    }

                
                }
            }
           
        }

        json[country] = data;
    }


    return json;

}

const result = dataFrom1();
console.log(result);


const countries = Object.keys(result);
const slider = document.getElementById('countrySlider');
const selectedCountrySpan = document.getElementById('selectedCountry');
const ctx = document.getElementById('myChart');
slider.max = countries.length - 1;

let chart;

slider.addEventListener('input', function() {
    const selectedIndex = this.value;
    const selectedCountry = countries[selectedIndex];
    selectedCountrySpan.innerText = selectedCountry;
    console.log(selectedCountry);
    updateChart(selectedCountry);
});

function updateChart(country) {
    const countryData = result[country];
    const labels = Object.keys(countryData);
    const data = Object.values(countryData);

    const config = {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: `Crime Data for ${country}`,
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };



    if (chart) {
        chart.destroy(); // Destroy the previous chart
    }

    
    chart = new Chart(ctx, config);
}

// Initialize the chart with the first country
updateChart(countries[0]);


/*function dataFrom2() {  // extract all in 1 and separate charts ? 
    const table = document.getElementById('table2');
    const headers = [];
    const data = [];

    const headerCells = table.rows[0].cells;
    for (let i = 1; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText);
    }
    console.log(headers);
    // Iterate over the rows
    for (let i = 1; i < 29; i++) {
        const row = table.rows[i];
        const country = row.cells[i].innerText.trim();
        const dataCountry = {country};

        console.log(country);
        /*for (let j = 2; j < row.cells.length; j++) {
            const year = headers[j - 2];
            const value = row.cells[j].innerText.replace(',', '.').trim();
            if (value !== ':') { // Exclude missing data
                data[year] = parseFloat(value);
            }
        }

        data.push(dataCountry);
    }


    return data;

}

const result2 = dataFrom2();
console.log(result2);

*/
// come back to it later 


const years = Object.keys(dataFrom2[0]).filter(key => key !== 'country');
const yearSlider = document.getElementById('yearSlider');
const selectedYearSpan = document.getElementById('selectedYear');
const barChartCtx = document.getElementById('barChart');
yearSlider.max = years.length - 1;

let barChart;

yearSlider.addEventListener('input', function() {
    const selectedIndex = this.value;
    const selectedYear = years[selectedIndex];
    selectedYearSpan.innerText = selectedYear;
    updateBarChart(selectedYear);
});

function updateBarChart(year) {
    const dataForYear = dataFrom2.map(d => ({ country: d.country, value: d[year] })).filter(d => d.value !== undefined);
    const labels = dataForYear.map(d => d.country);
    const data = dataForYear.map(d => d.value);

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Data for ${year}`,
                data: data,
                borderWidth: 1
            }]
        }
    };

    if (barChart) {
        barChart.destroy(); // Destroy the previous chart
    }

    barChart = new Chart(barChartCtx, config);
}

// Initialize the bar chart with the first year
updateBarChart(years[0]);



