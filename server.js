import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

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
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar resíduos' });
  }
});

app.post('/api/residuos', async (req, res) => {
  const { material, quantidade, tipo, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO residuos (material, quantidade, tipo, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [material, quantidade, tipo, data || new Date().toISOString().split('T')[0]]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao salvar resíduo' });
  }
});

app.delete('/api/residuos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM residuos WHERE id = $1', [id]);
    res.json({ message: 'Resíduo removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao deletar resíduo' });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend rodando com sucesso em http://localhost:3001');
});