
    // Fetch remote data and create a real-time updating chart
    function createRealTimeChart() {
        const ctx = document.createElement('canvas');
        document.getElementById('fetchId').appendChild(ctx);

        const config = {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Real-time Data',
                    data: [],
                    borderColor: '#FF6384',
                    borderWidth: 1,
                    fill: false
                    }]
                },
            options: {
                responsive: true,
                scales: {
                    x:      {
                        type: 'realtime',
                        realtime: {
                            duration: 60000, // Show the last 60 seconds of data
                            refresh: 60000, // Fetch new data every 60 seconds
                            delay: 2000, // Delay of 2 seconds for smoother updates
                            onRefresh: function(chart) {
                                fetchData(chart);
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }

        const chart = new Chart(ctx, config);

        function fetchData() {
            
            fetch('https://canvasjs.com/services/data/datapoints.php')
                .then(response => response.json())
                .then(data => {
                    const points = data.map(point => ({
                        x: Date.now(),

                        y:point[1]
                    }));
                    chart.data.datasets[0].data.push(...points);
                    chart.update();
                })
                .catch(error => console.error('Error fetching data:', error));
        }

        setInterval(fetchData, 1000);
    }

    createRealTimeChart();

