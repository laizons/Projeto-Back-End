// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const controller = require('../controllers/usuarioController'); // suas rotas antigas

// 1) Registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  // data.user contém o usuário criado (sem senha)
  res.status(201).json({
    user: data.user,
    message: 'Registro bem-sucedido. Verifique seu e-mail para confirmar a conta.'
  });
});

// 2) Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  // data.session.access_token é o JWT para autenticar outras rotas
  res.json({ session: data.session });
});

// 3) “Quem sou eu” (rota protegida)
router.get('/me', async (req, res) => {
  // espera header Authorization: Bearer <token>
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não enviado' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });
  res.json({ user });
});

// 4) Suas rotas antigas (opcional)
// lista usuários vindos do seu controller
router.get('/', controller.getUsuarios);
// cria usuário no seu banco customizado (se ainda usar)
router.post('/', controller.createUsuario);

module.exports = router;
