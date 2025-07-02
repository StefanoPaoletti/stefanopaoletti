const API_URL = 'https://i3h2ejsg2gaphd399bucrhkdljki9p8f.ui.nabu.casa/api/states';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NGM5OTZiNDYyOWM0NTZmOTMzYTlmZGM3OWYzMmYyYyIsImlhdCI6MTc1MTQ0NDQyNSwiZXhwIjoyMDY2ODA0NDI1fQ.qXdskUZ_saYc32o4aIwjeA5N3dubbi86VoaZ1_pU6Zc'; // Sostituisci con il nuovo token!

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
  // Sostituisci con gli ID reali dei tuoi sensori Ecowitt
  const temperature = await fetchSensorData('sensor.ecowitt_temperature');
  const humidity = await fetchSensorData('sensor.ecowitt_humidity');
  const windSpeed = await fetchSensorData('sensor.ecowitt_wind_speed');

  document.getElementById('temperature').textContent = `${temperature} °C`;
  document.getElementById('humidity').textContent = `${humidity} %`;
  document.getElementById('wind_speed').textContent = `${windSpeed} km/h`;
}

// Esegui subito e poi ogni 5 minuti
updateData();
setInterval(updateData, 300000); // 5 minuti
