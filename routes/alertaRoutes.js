// routes/alertaRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 1) LISTAR todos os alertas
// GET /alertas
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('alertas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2) CRIAR um alerta
// POST /alertas
router.post('/', async (req, res) => {
  const { titulo, descricao, categoria, local } = req.body;
  const { data, error } = await supabase
    .from('alertas')
    .insert({ titulo, descricao, categoria, local })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// 3) BUSCAR um alerta por ID
// GET /alertas/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from('alertas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Alerta não encontrado' });
  res.json(data);
});

// 4) ATUALIZAR um alerta
// PUT /alertas/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updates = req.body; // ex: { titulo: 'Novo título' }

  const { data, error } = await supabase
    .from('alertas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 5) DELETAR um alerta
// DELETE /alertas/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const { error } = await supabase
    .from('alertas')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send(); // No Content
});

module.exports = router;
