// server.js
require('dotenv').config();
const PORT      = process.env.PORT || 5000;
const express   = require('express');
const cors      = require('cors');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const fs        = require('fs-extra');
const path      = require('path');

const usuarioRoutes = require('./routes/usuarioRoutes');
const alertaRoutes  = require('./routes/alertaRoutes');
const climaRoutes   = require('./routes/climaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// --- SIMULAÇÃO DE USUÁRIOS e REFRESH TOKENS ---
const usuarios = [
  { id: 1, email: 'usuario@exemplo.com', senha: bcrypt.hashSync('123456', 10) }
];
let refreshTokens = [];

// --- FUNÇÕES JWT ---
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRES_IN }
  );
  refreshTokens.push(token);
  return token;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.user = payload;
    next();
  });
}

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = usuarios.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });
  if (!bcrypt.compareSync(senha, user.senha))
    return res.status(401).json({ error: 'Senha incorreta' });

  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
});

app.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token))
    return res.status(403).json({ error: 'Refresh token inválido' });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Refresh token expirado' });
    const user = usuarios.find(u => u.id === payload.id);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.sendStatus(204);
});

// --- ROTAS DA API (protegidas) ---
app.use('/usuarios', authenticateToken, usuarioRoutes);
app.use('/alertas', authenticateToken, alertaRoutes);
app.use('/clima', authenticateToken, climaRoutes);

// --- ROTA PÚBLICA DE HOME ---
const alertasPath = path.join(__dirname, 'data/alertas.json');
app.get('/', async (req, res) => {
  const alertas = await fs.readJson(alertasPath).catch(() => []);
  if (alertas.length === 0)
    return res.send('🚨 Nenhum alerta ativo no momento.');

  let resposta = '<h2>🚨 ALERTAS ATIVOS</h2><ul>';
  alertas.forEach(a => {
    resposta += `<li><strong>[${a.categoria}]</strong> ${a.titulo} — ${a.descricao} (${a.local})</li>`;
  });
  resposta += '</ul>';
  res.send(resposta);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
