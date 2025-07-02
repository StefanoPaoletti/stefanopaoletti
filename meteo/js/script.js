const API_URL = 'https://i3h2ejsg2gaphd399bucrhkdljki9p8f.ui.nabu.casa/api/states';
const TOKEN = '[inserisci-il-nuovo-token-qui]'; // Solo per test locali, rimuovi prima di caricare su GitHub!

// Funzione per recuperare i dati di un sensore
async function fetchSensorData(entityId) {
  try {
    const response = await axios.get(`${API_URL}/${entityId}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.state;
  } catch (error) {
    console.error(`Errore nel recupero di ${entityId}:`, error);
    return '--';
  }
}

// Aggiorna i dati sulla pagina
async function updateData() {
  const outdoorTemperature = await fetchSensorData('sensor.gw2000a_v2_2_3_outdoor_temperature');
  const humidity = await fetchSensorData('sensor.gw2000a_v2_2_3_humidity');
  const windSpeed = await fetchSensorData('sensor.gw2000a_v2_2_3_wind_speed');
  const windDirection = await fetchSensorData('sensor.gw2000a_v2_2_3_wind_direction');
  const hourlyRain = await fetchSensorData('sensor.gw2000a_v2_2_3_hourly_rain_rate_piezo');
  const uvIndex = await fetchSensorData('sensor.gw2000a_v2_2_3_uv_index');

  document.getElementById('outdoor_temperature').textContent = `${outdoorTemperature} °C`;
  document.getElementById('humidity').textContent = `${humidity} %`;
  document.getElementById('wind_speed').textContent = `${windSpeed} km/h`;
  document.getElementById('wind_direction').textContent = `${windDirection} °`;
  document.getElementById('hourly_rain_rate_piezo').textContent = `${hourlyRain} mm/h`;
  document.getElementById('uv_index').textContent = uvIndex;
}

// Grafico della temperatura
const ctx = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Timestamp
    datasets: [{
      label: 'Temperatura Esterna (°C)',
      data: [],
      borderColor: '#007bff',
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Ora' } },
      y: { title: { display: true, text: 'Temperatura (°C)' } }
    }
  }
});

// Aggiorna il grafico ogni 5 minuti
async function updateChart() {
  const temperature = await fetchSensorData('sensor.gw2000a_v2_2_3_outdoor_temperature');
  const now = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  temperatureChart.data.labels.push(now);
  temperatureChart.data.datasets[0].data.push(temperature);

  // Limita a 20 punti per evitare sovraccarico
  if (temperatureChart.data.labels.length > 20) {
    temperatureChart.data.labels.shift();
    temperatureChart.data.datasets[0].data.shift();
  }

  temperatureChart.update();
}

// Esegui subito e poi ogni 5 minuti
updateData();
updateChart();
setInterval(updateData, 300000); // 5 minuti
setInterval(updateChart, 300000);
