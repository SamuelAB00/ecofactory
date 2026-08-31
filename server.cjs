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

pool.connect((err) => {
  if (err) {
    console.log('ERRO BANCO:', err.message);
  } else {
    console.log('BANCO OK');
  }
});

app.get('/api/maquinas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.log('ERRO GET MAQUINAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/maquinas', async (req, res) => {
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nome, setor, tipo || 'Prensa', status || 'Operacional', consumo_energia || 0, temperatura || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('ERRO POST MAQUINAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.put('/api/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const result = await pool.query(
      `UPDATE maquinas SET nome=$1, setor=$2, tipo=$3, status=$4, consumo_energia=$5, temperatura=$6 WHERE id=$7 RETURNING *`,
      [nome, setor, tipo, status, consumo_energia, temperatura, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log('ERRO PUT MAQUINAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/api/maquinas/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM maquinas WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Excluído' });
  } catch (err) {
    console.log('ERRO DELETE MAQUINAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/residuos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM residuos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.log('ERRO GET RESIDUOS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/residuos', async (req, res) => {
  const { material, quantidade, tipo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO residuos (material, quantidade, tipo, data) VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [material, quantidade, tipo || 'Plástico']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('ERRO POST RESIDUOS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.put('/api/residuos/:id', async (req, res) => {
  const { id } = req.params;
  const { material, quantidade, tipo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE residuos SET material=$1, quantidade=$2, tipo=$3 WHERE id=$4 RETURNING *`,
      [material, quantidade, tipo, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log('ERRO PUT RESIDUOS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/api/residuos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM residuos WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Excluído' });
  } catch (err) {
    console.log('ERRO DELETE RESIDUOS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/ocorrencias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.log('ERRO GET OCORRENCIAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/ocorrencias', async (req, res) => {
  const { tipo, descricao, nivel_risco, local, medida_preventiva } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ocorrencias (tipo, descricao, nivel_risco, local, medida_preventiva, data) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        tipo || 'Geral',
        descricao || 'Sem descrição',
        nivel_risco || 'Baixo',
        local || 'Geral',
        medida_preventiva || ''
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('ERRO POST OCORRENCIAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/api/ocorrencias/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ocorrencias WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Excluído' });
  } catch (err) {
    console.log('ERRO DELETE OCORRENCIAS:', err.message);
    res.status(500).json({ erro: err.message });
  }
});

app.listen(3001, () => {
  console.log('SERVIDOR 3001 OK');
});