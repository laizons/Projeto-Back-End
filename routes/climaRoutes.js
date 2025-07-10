// routes/climaRoutes.js

const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// GET /clima?lat=...&lon=...
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'latitude e longitude são obrigatórios' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  try {
    // 1) Reverse Geocoding: pega o nome oficial do município
    const geo = await axios.get('http://api.openweathermap.org/geo/1.0/reverse', {
      params: { lat, lon, limit: 1, appid: apiKey }
    });
    const local = geo.data[0]; 
    // Se não encontrar algo, cai no fallback abaixo
    const cidade = local?.name || '—';

    // 2) Dados de clima
    const weather = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat, lon, appid: apiKey, units: 'metric', lang: 'pt_br' }
    });
    const clima = weather.data;

    const condicao    = clima.weather[0].main.toLowerCase();
    const descricao   = clima.weather[0].description;
    const temperatura = clima.main.temp;
    const umidade     = clima.main.humidity;
    const vento       = clima.wind.speed;

    // 3) Gera alertas
    const alertas = [];
    if (condicao.includes('rain') || condicao.includes('storm')) {
      alertas.push({ titulo: 'Chuva Forte/Tempestade', descricao, categoria: 'chuva', local: cidade });
    }
    if (vento > 10) {
      alertas.push({ titulo: 'Ventos Fortes', descricao: `Vento ${vento} m/s`, categoria: 'vento', local: cidade });
    }
    if (temperatura >= 35) {
      alertas.push({ titulo: 'Calor Extremo', descricao: `Temp ${temperatura}°C`, categoria: 'calor', local: cidade });
    }
    if (temperatura <= 5) {
      alertas.push({ titulo: 'Frio Extremo', descricao: `Temp ${temperatura}°C`, categoria: 'frio', local: cidade });
    }
    if (umidade < 30) {
      alertas.push({ titulo: 'Baixa Umidade', descricao: `Umid ${umidade}%`, categoria: 'umidade', local: cidade });
    }

    // 4) Responde pro front
    return res.json({
      cidade,
      condicao: descricao,
      temperatura,
      umidade,
      vento,
      alertas_gerados: alertas.length,
      detalhes: alertas
    });

  } catch (err) {
    console.error('Erro ao buscar clima:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar dados de clima',
      detalhes: err.response?.data || err.message
    });
  }
});

module.exports = router;
