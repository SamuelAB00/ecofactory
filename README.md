# EcoFactory 🏭🌱

Aplicação web completa para monitoramento de eficiência energética, gestão de resíduos industriais e controle de Saúde e Segurança do Trabalho (SST) em ambiente fabril.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, Lucide React, Tailwind CSS / CSS Modules
- **Backend:** Node.js, Express, CORS
- **Banco de Dados:** PostgreSQL (`pg`)

---

## 🛠️ Recursos da Aplicação

- **Dashboard:** Métricas e visão geral da produção ecológica.
- **Máquinas:** Cadastro, status de operação, consumo de energia e controle de temperatura.
- **Resíduos:** Registro e classificação de materiais descartados ou reciclados.
- **Segurança (SST):** Registro de riscos e ocorrências, definição de níveis de risco e medidas preventivas.

---

## 🛢️ Estrutura do Banco de Dados (PostgreSQL)

Antes de iniciar a aplicação, crie o banco de dados `ecofactory` e execute as tabelas abaixo:

```sql
CREATE DATABASE ecofactory;

CREATE TABLE IF NOT EXISTS maquinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  setor VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'Prensa',
  status VARCHAR(50) DEFAULT 'Operacional',
  consumo_energia NUMERIC DEFAULT 0,
  temperatura NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS residuos (
  id SERIAL PRIMARY KEY,
  material VARCHAR(100) NOT NULL,
  quantidade NUMERIC NOT NULL,
  tipo VARCHAR(50) DEFAULT 'Plástico',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ocorrencias (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  nivel_risco VARCHAR(20) NOT NULL DEFAULT 'Baixo',
  local VARCHAR(100) NOT NULL,
  medida_preventiva TEXT DEFAULT '',
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## 🔌 Rotas da API REST

| Módulo | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Máquinas** | `GET` | `/api/maquinas` | Listar máquinas |
| | `POST` | `/api/maquinas` | Cadastrar máquina |
| | `PUT` | `/api/maquinas/:id` | Atualizar máquina |
| | `DELETE` | `/api/maquinas/:id` | Excluir máquina |
| **Resíduos** | `GET` | `/api/residuos` | Listar resíduos |
| | `POST` | `/api/residuos` | Cadastrar resíduo |
| | `PUT` | `/api/residuos/:id` | Atualizar resíduo |
| | `DELETE` | `/api/residuos/:id` | Excluir resíduo |
| **SST** | `GET` | `/api/ocorrencias` | Listar ocorrências |
| | `POST` | `/api/ocorrencias` | Cadastrar ocorrência |
| | `DELETE` | `/api/ocorrencias/:id` | Excluir ocorrência |

## ⚡ Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install

 Configure o banco de dados:
Abra o arquivo server.cjs e ajuste suas credenciais de acesso ao PostgreSQL na constante pool.

Inicie o Backend (Servidor Express):

node server.cjs

Inicie o Frontend (Vite / React):

npm run dev