const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecofactory',
  password: 'senai',
  port: 5432,
});

app.get('/api/residuos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM residuos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/residuos', async (req, res) => {
  const { material, quantidade, tipo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO residuos (material, quantidade, tipo, data) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *',
      [material, Number(quantidade), tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/residuos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM residuos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/configuracoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM configuracoes ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/configuracoes', async (req, res) => {
  const { nome_empresa, meta_mensal } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO configuracoes (nome_empresa, meta_mensal) VALUES ($1, $2) RETURNING *',
      [nome_empresa, Number(meta_mensal)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/relatorios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM relatorios_esg ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/relatorios', async (req, res) => {
  const { periodo, total_reciclado, emissoes_co2_evitadas, energia_poupada, agua_economizada } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO relatorios_esg (periodo, total_reciclado, emissoes_co2_evitadas, energia_poupada, agua_economizada) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [periodo, total_reciclado, emissoes_co2_evitadas, energia_poupada, agua_economizada]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001!');
});