// server.js

// Carrega variáveis de ambiente de .env
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Middleware de autenticação JWT (se estiver usando)
const auth          = require('./middlewares/auth');

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const alertaRoutes  = require('./routes/alertaRoutes');
const climaRoutes   = require('./routes/climaRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas públicas (registro/login)
app.use('/usuarios', usuarioRoutes);

// Rotas protegidas (exigem token válido)
app.use('/alertas', auth, alertaRoutes);
app.use('/clima',   auth, climaRoutes);

// Rota raiz – redireciona para a página de clima
app.get('/', (req, res) => res.redirect('/clima.html'));

// Porta dinâmica para Azure (ou 5000 em local)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
