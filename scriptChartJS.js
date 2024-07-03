
function table1ToJSON() {
    const table = document.getElementById('table1');
   // const tableBis = document.getElementById('table2');
    const headers = [];
    const json = {};

    const headerCells = table.rows[1].cells;
    for (let i = 2; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText);
    }


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

       /* for (let iBis = 2; iBis < table.length; iBis++){
            console.log(tableBis[iBis]);
            
            while (tableBis[iBis][1] === country) {
                
            }
        }*/

        json[country] = data;
    }


    return json;

}

const result = table1ToJSON();
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


function table2ToJSON() {  // extract all in 1 and separate charts ? 
    const table = document.getElementById('table2');
    const headers = [];
    const json = table1ToJSON();
    console.log (json);
    // Get headers (years)
    const headerCells = table.rows[0].cells;
    for (let i = 1; i < headerCells.length; i++) {
        headers.push(headerCells[i].innerText);
    }
    console.log(headers);
    // Iterate over the rows
    for (let i = 1; i < 29; i++) {
        const row = table.rows[i];
        const country = row.cells[i].innerText.trim();

        console.log(country);
        /*for (let j = 2; j < row.cells.length; j++) {
            const year = headers[j - 2];
            const value = row.cells[j].innerText.replace(',', '.').trim();
            if (value !== ':') { // Exclude missing data
                data[year] = parseFloat(value);
            }
        }*/
       console.log(json);

        if (json.country ) {
            const data1 = {};

            for (let j = 2; j < 4; j ++) {
                const year = headers[j];
                const value1 = row.cells[j].innerText.replace(',', '.').trim();

                console.log(year);
                console.log(value1);

                if (value1 !== ':') { // Exclude missing data
                    data1.year = parseFloat(value1);
                }

                json[country] = data1;
            }

            
        }
    }


    return json;

}

const result2 = table2ToJSON();
console.log(result2);


// come back to it later 





/*

function updateChartJson() {


    //get data from external JSON

    var dataPoints = [];
    $.getJSON("https://canvasjs.com/services/data/datapoints.php", function(data) {  
    $.each(data, function(key, value){
        dataPoints.push({x: value[0], y: parseInt(value[1])});
    });




    var chrt = document.getElementById("canvasId");
      var chartId = new Chart(chrt, {
         type: 'line',
         data: {
            labels: Object.keys,
            datasets: [{
               label: "online tutorial subjects",
               data: Object.values,
               backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'lightblue', 'gold'],
               borderColor: ['black'],
               borderWidth: 2,
               pointRadius: 5,
            }],
         },
         options: {
            responsive: false,
         },
      });
    





    const labels = Object.keys(dataPoints);
    const dataJ = Object.values(dataPoints);

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Crime Data for ${country}`,
                data: dataJ,
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



    if (chrt) {
        chart.destroy(); // Destroy the previous chart
    }

    
    chrt = new Chart(ctx, config);

    updateChartJson();
};*/
