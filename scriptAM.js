
const Graph1Container = document.createElement("div");


const Graph1Canvas = document.createElement("canvas");
Graph1Canvas.id = "offencePoliceChart";
Graph1Canvas.style.width = "100%";
Graph1Canvas.style.maxWidth = "80rem";

Graph1Container.appendChild(Graph1Canvas);

const dataSetSelect = document.createElement("select");
dataSetSelect.id = "dataSetSelect";


Graph1Container.appendChild(dataSetSelect);


const graph1Element = document.getElementById("bodyContent");
if (graph1Element) {
  const titleElement = document.getElementById(
    "Crimes_et_d.C3.A9lits_enregistr.C3.A9s_par_les_services_de_police"
  );
  titleElement.insertAdjacentElement("afterend", Graph1Container);
} else {
  console.error("Element with id 'bodyContent' not found.");
}


const Graph1Ctx = Graph1Canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", function () {
  
  let table1 = document.getElementById("table1");

  let dataYears = Array.from(
    table1.querySelectorAll("tbody > tr:first-child > th:not(:first-child)")
  )
    .slice(1)
    .map((th) => th.innerText.trim());

  console.log(dataYears);

  dataYears.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    dataSetSelect.appendChild(option);
  });


  let mixedData = [];
  Array.from(table1.querySelectorAll("tbody > tr:not(:first-child)")).forEach(
    (row) => {
      let countryName = row.cells[1].textContent.trim();
      Array.from(row.cells)
        .slice(2)
        .forEach((cell, index) => {
          let year = dataYears[index];
          mixedData.push({
            year: year,
            country: countryName,
            data: parseFloat(cell.textContent.replace(",", ".")),
          });
        });
    }
  );

 
  console.log(mixedData);


  function createLabelsAndDatasets(selectedYear) {

    const countries = Array.from(
      new Set(mixedData.map((item) => item.country))
    );

    
    const filteredData = mixedData.filter((item) => item.year === selectedYear);

    
    const datasets = [
      {
        label: `Crime Index (${selectedYear})`,
        data: countries.map((country) => {
          const dataForCountry = filteredData.find(
            (item) => item.country === country
          );
          return dataForCountry ? dataForCountry.data : null;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ];

    return {
      labels: countries,
      datasets: datasets,
    };
  }


  const initialYear = dataSetSelect.value || dataYears[0];
  const initialData = createLabelsAndDatasets(initialYear);

 
  const config = {
    type: "bar",
    data: initialData,
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Country",
          },
        },
        y: {
          stacked: false,
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Crime Index",
          },
          maintainAspectRatio: false,
        },
      },
    },
  };

 
  let myChart = new Chart(Graph1Ctx, config);

 
  function updateChart(selectedYear) {
    const newData = createLabelsAndDatasets(selectedYear);
    myChart.data.labels = newData.labels;
    myChart.data.datasets = newData.datasets;
    myChart.update();
  }

  dataSetSelect.addEventListener("change", function (event) {
    const selectedYear = event.target.value;
    updateChart(selectedYear);
  });


  dataSetSelect.value = initialYear;
  updateChart(initialYear);

  const myObj = JSON.stringify(mixedData);
  console.log(myObj);
  localStorage.setItem("testJson", myObj);
});


const Graph2Container = document.createElement("div");

const Graph2Canvas = document.createElement("canvas");
Graph2Canvas.id = "homicidePoliceChart";
Graph2Canvas.style.width = "100%";
Graph2Canvas.style.maxWidth = "80rem";

Graph2Container.appendChild(Graph2Canvas);

const Graph2Element = document.getElementById("bodyContent");
if (Graph2Element) {
  const titleElement = document.getElementById("Homicides");
  titleElement.insertAdjacentElement("afterend", Graph2Container);
} else {
  console.error("Element with id 'bodyContent' not found.");
}

const Graph2Ctx = Graph2Canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", function () {
  let table2 = document.getElementById("table2");

  let dataYears2 = Array.from(
    table2.querySelectorAll("thead > tr:first-child > th")
  )
    .slice(2)
    .map((th) => th.innerText.trim());

  console.log(dataYears2);

  let mixedData2 = [];
  Array.from(table2.querySelectorAll("tbody > tr")).forEach((row) => {
    let countryName2 = row.cells[1].textContent.trim();

    if (countryName2 === "England and\n                      Wales(UK)") {
      countryName2 = "England-Wales(UK)";
    }

    Array.from(row.cells)
      .slice(2)
      .forEach((cell, index) => {
        let year2 = dataYears2[index];
        mixedData2.push({
          year: year2,
          country: countryName2,
          data: parseFloat(cell.textContent.replace(",", ".")),
        });
      });
  });

  console.log(mixedData2);

  function createLabelsAndDatasets() {
    const countries = Array.from(
      new Set(mixedData2.map((item) => item.country))
    );

    const datasets = dataYears2.map((year, index) => {
      return {
        label: `Prison Population (${year})`,
        data: countries.map((country) => {
          const dataForCountry = mixedData2.find(
            (item) => item.year === year && item.country === country
          );
          return dataForCountry ? dataForCountry.data : null;
        }),
        backgroundColor:
          index === 0 ? "rgba(75, 192, 192, 0.2)" : "rgba(255, 99, 132, 0.2)", // Couleur différente pour chaque année   -TABLE2
        borderColor:
          index === 0 ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      };
    });

    return {
      labels: countries,
      datasets: datasets,
    };
  }

  const initialData = createLabelsAndDatasets();

  const config = {
    type: "bar",
    data: initialData,
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Country",
          },
        },
        y: {
          stacked: false,
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Prison Population (per 100,000 inhabitants)",
          },
        },
      },
    },
  };

  let myChart2 = new Chart(Graph2Ctx, config);
});

const GraphAJaxContainer = document.createElement("div");

const GraphAjaxCanvas = document.createElement("canvas");
GraphAjaxCanvas.id = "homicidePoliceChart";
GraphAjaxCanvas.style.width = "100%";
GraphAjaxCanvas.style.maxWidth = "80rem";

GraphAJaxContainer.appendChild(GraphAjaxCanvas);

const GraphAjaxElement = document.getElementById("bodyContent");
if (GraphAjaxElement) {
  const titleElement = document.getElementById("firstHeading");
  titleElement.insertAdjacentElement("afterend", GraphAJaxContainer);
} else {
  console.error("Element with id 'bodyContent' not found.");
}

const GraphAjaxCtx = GraphAjaxCanvas.getContext("2d");

var dataPoints = [];
$.getJSON("https://canvasjs.com/services/data/datapoints.php", function(data) {  
    $.each(data, function(key, value){
        dataPoints.push({x: value[0], y: parseInt(value[1])});
    });
    chart = new Chart("chartContainer",{
        title:{
            text:"Live Chart with dataPoints from External JSON"
        },
        data: [{
        type: "line",
        dataPoints : dataPoints,
        }]
    });
    chart.render();
    updateChart();
});

function updateChart() {
  $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=" + (dataPoints.length + 1) + "&ystart=" + (dataPoints[dataPoints.length - 1].y) + "&length=1&type=json", function(data) {
      $.each(data, function(key, value) {
          dataPoints.push({
              x: parseInt(value[0]),
              y: parseInt(value[1])
          });
     });
     chart.render();
     setTimeout(function(){updateChart()}, 1000);
  });
}

