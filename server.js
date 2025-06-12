const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const climaRoutes = require('./routes/climaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/alertas', alertaRoutes);
app.use('/clima', climaRoutes);

const fs = require('fs-extra');
const path = require('path');
const alertasPath = path.join(__dirname, 'data/alertas.json');

app.get('/', async (req, res) => {
  const alertas = await fs.readJson(alertasPath).catch(() => []);
  if (alertas.length === 0) return res.send('🚨 Nenhum alerta ativo no momento.');

  let resposta = '<h2>🚨 ALERTAS ATIVOS</h2><ul>';
  alertas.forEach(a => {
    resposta += `<li><strong>[${a.categoria}]</strong> ${a.titulo} — ${a.descricao} (${a.local})</li>`;
  });
  resposta += '</ul>';
  res.send(resposta);
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

