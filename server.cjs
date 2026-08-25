const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecofactory',
  password: 'senai',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error(err.stack);
  }
  release();
});

app.get('/api/maquinas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM maquinas ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.post('/api/maquinas', async (req, res) => {
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;

  if (!nome || !nome.trim() || !setor || !setor.trim()) {
    return res.status(400).json({ erro: 'Campos invalidos' });
  }

  if (Number(consumo_energia) < 0 || Number(temperatura) < 0) {
    return res.status(400).json({ erro: 'Valores invalidos' });
  }

  const statusValidos = ['Operacional', 'Manutenção', 'Desligada'];
  const statusFinal = statusValidos.includes(status) ? status : 'Operacional';

  try {
    const queryText = `
      INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      nome.trim(), 
      setor.trim(), 
      tipo || 'Prensa', 
      statusFinal, 
      Number(consumo_energia) || 0, 
      Number(temperatura) || 0
    ];

    const resultado = await pool.query(queryText, values);
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.put('/api/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;

  if (!nome || !nome.trim() || !setor || !setor.trim()) {
    return res.status(400).json({ erro: 'Campos invalidos' });
  }

  if (Number(consumo_energia) < 0 || Number(temperatura) < 0) {
    return res.status(400).json({ erro: 'Valores invalidos' });
  }

  const statusValidos = ['Operacional', 'Manutenção', 'Desligada'];
  const statusFinal = statusValidos.includes(status) ? status : 'Operacional';

  try {
    const queryText = `
      UPDATE maquinas 
      SET nome = $1, setor = $2, tipo = $3, status = $4, consumo_energia = $5, temperatura = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      nome.trim(), 
      setor.trim(), 
      tipo || 'Prensa', 
      statusFinal, 
      Number(consumo_energia) || 0, 
      Number(temperatura) || 0,
      id
    ];

    const resultado = await pool.query(queryText, values);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Nao encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.delete('/api/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('DELETE FROM maquinas WHERE id = $1 RETURNING *', [id]);
    
    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Nao encontrado' });
    }

    res.json({ mensagem: 'Sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/residuos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM residuos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.post('/api/residuos', async (req, res) => {
  const { material, quantidade, tipo } = req.body;

  if (!material || !material.trim() || !quantidade || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: 'Campos invalidos' });
  }

  try {
    const queryText = `
      INSERT INTO residuos (material, quantidade, tipo, data)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [material.trim(), Number(quantidade), tipo || 'Plástico'];

    const resultado = await pool.query(queryText, values);
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.put('/api/residuos/:id', async (req, res) => {
  const { id } = req.params;
  const { material, quantidade, tipo } = req.body;

  if (!material || !material.trim() || !quantidade || Number(quantidade) <= 0) {
    return res.status(400).json({ erro: 'Campos invalidos' });
  }

  try {
    const queryText = `
      UPDATE residuos 
      SET material = $1, quantidade = $2, tipo = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [material.trim(), Number(quantidade), tipo || 'Plástico', id];

    const resultado = await pool.query(queryText, values);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Nao encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.delete('/api/residuos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('DELETE FROM residuos WHERE id = $1 RETURNING *', [id]);
    
    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Nao encontrado' });
    }

    res.json({ mensagem: 'Sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.listen(port, () => {
  console.log(`Porta: ${port}`);
});