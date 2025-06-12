const fs = require('fs-extra');
const path = require('path');
const filePath = path.join(__dirname, '../data/usuarios.json');

exports.getUsuarios = async (req, res) => {
  const data = await fs.readJson(filePath).catch(() => []);
  res.json(data);
};

exports.createUsuario = async (req, res) => {
  const data = await fs.readJson(filePath).catch(() => []);
  const novoUsuario = req.body;
  data.push(novoUsuario);
  await fs.writeJson(filePath, data, { spaces: 2 });
  res.status(201).json(novoUsuario);
};
