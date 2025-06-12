const fs = require('fs-extra');
const path = require('path');
const filePath = path.join(__dirname, '../data/alertas.json');

exports.getAlertas = async (req, res) => {
  const data = await fs.readJson(filePath).catch(() => []);
  res.json(data);
};

exports.createAlerta = async (req, res) => {
  const data = await fs.readJson(filePath).catch(() => []);
  const novoAlerta = req.body;
  data.push(novoAlerta);
  await fs.writeJson(filePath, data, { spaces: 2 });
  res.status(201).json(novoAlerta);
};
