const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const alertasPath = path.join(__dirname, '../data/alertas.json');

exports.buscarClima = async (req, res) => {
  const cidade = req.query.cidade || 'Taquara';
  const apiKey = '60bc49547c4a1db519cebb0013a6a548';

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await axios.get(url);
    const clima = response.data;

    const condicao = clima.weather[0].main.toLowerCase();
    const descricao = clima.weather[0].description;
    const temperatura = clima.main.temp;
    const umidade = clima.main.humidity;
    const vento = clima.wind.speed;

    const alertas = await fs.readJson(alertasPath).catch(() => []);
    const novosAlertas = [];

    if (condicao.includes('rain') || condicao.includes('storm')) {
      novosAlertas.push({
        titulo: 'Alerta de Tempestade ou Chuva Forte',
        descricao: `Previsão de ${descricao} em ${cidade}`,
        categoria: 'chuva',
        local: cidade
      });
    }

    if (vento > 10) {
      novosAlertas.push({
        titulo: 'Alerta de Ventos Fortes',
        descricao: `Velocidade do vento acima de 36 km/h (${vento} m/s)`,
        categoria: 'vento',
        local: cidade
      });
    }

    if (temperatura >= 35) {
      novosAlertas.push({
        titulo: 'Alerta de Calor Extremo',
        descricao: `Temperatura muito alta: ${temperatura}°C`,
        categoria: 'calor',
        local: cidade
      });
    }

    if (temperatura <= 5) {
      novosAlertas.push({
        titulo: 'Alerta de Frio Extremo',
        descricao: `Temperatura muito baixa: ${temperatura}°C`,
        categoria: 'frio',
        local: cidade
      });
    }

    if (umidade < 30) {
      novosAlertas.push({
        titulo: 'Alerta de Baixa Umidade',
        descricao: `Umidade relativa do ar abaixo de 30% (${umidade}%)`,
        categoria: 'umidade',
        local: cidade
      });
    }

    alertas.push({
      titulo: 'Teste de Alerta Manual',
      descricao: `Esse é um alerta de teste salvo manualmente.`,
      categoria: 'teste',
      local: cidade
    });
    await fs.writeJson(alertasPath, alertas, { spaces: 2 });
    

    res.json({
      clima: descricao,
      temperatura,
      umidade,
      vento,
      alertas_gerados: novosAlertas.length,
      detalhes: novosAlertas
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar dados do clima', detalhes: err.message });
  }
};
