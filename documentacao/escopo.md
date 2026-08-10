# 📄 Documento de Escopo - Projeto EcoFactory

**Curso:** Técnico em Informática para Internet — SENAI  
**Projeto:** EcoFactory — Sistema de Monitoramento e Gestão de uma Indústria Inteligente  
**Modalidade:** Projeto Integrador Full Stack  

---

## 1. Problema

A **EcoFactory**, uma indústria em expansão, enfrenta desafios operacionais devido ao registro descentralizado e manual de suas informações operacionais em planilhas e documentos físicos. Essa abordagem causa:

- Dificuldade no acompanhamento em tempo real do estado de funcionamento e manutenção das máquinas;
- Falta de controle centralizado da quantidade produzida versus a meta estipulada;
- Falta de visibilidade sobre o consumo de recursos vitais (água e energia) e gestão de resíduos;
- Dificuldade de registro e rastreabilidade de ocorrências relativas à Saúde e Segurança do Trabalho (SST);
- Lentidão na tomada de decisões estratégicas por escassez de indicadores claros e consolidados.

---

## 2. Objetivo do Projeto

Desenvolver uma aplicação web Full Stack responsiva, intuitiva e centralizada para o monitoramento e gestão em tempo real dos processos industriais da EcoFactory, permitindo o gerenciamento de equipamentos, controle de produção, indicadores ambientais e gestão de segurança.

---

## 3. Público-Alvo e Usuários

| Usuário | Necessidades Principais |
| :--- | :--- |
| **Operadores de Chão de Fábrica** | Registrar e atualizar o status das máquinas, quantidade produzida e relatar ocorrências de segurança. |
| **Supervisores de Produção** | Acompanhar a produtividade das máquinas, programar manutenções e monitorar metas de produção. |
| **Gestores / Gerentes Industriais** | Visualizar o dashboard consolidado com indicadores de eficiência, sustentabilidade e SST para tomada de decisão rápida. |

---

## 4. Escopo Funcional

### 4.1 Módulo Núcleo (Obrigatório)
**CRUD Completo de Máquinas:**
- **Cadastrar:** Inserção de novos equipamentos (Nome, Setor, Tipo, Status, Consumo médio de energia, Temperatura atual).
- **Listar:** Exibição das máquinas em tabela/cards informativos.
- **Editar:** Atualização de dados cadastrais e operacionais.
- **Excluir:** Remoção de máquinas mediante confirmação do usuário.

### 4.2 Módulos Complementares
- **Módulo de Produção:** Registro de produtos fabricados vs. metas, com cálculo automático da produtividade:
  $$\text{Produtividade (\%)} = \left(\frac{\text{Quantidade Produzida}}{\text{Quantidade Esperada}}\right) \times 100$$
- **Módulo de Sustentabilidade:** Registro de consumo de energia, água e resíduos reciclados, com cálculo do percentual ambiental:
  $$\text{Percentual Reciclado (\%)} = \left(\frac{\text{Quantidade Reciclada}}{\text{Total de Resíduos}}\right) \times 100$$
- **Módulo de Saúde e Segurança (SST):** Registro de ocorrências por tipo, local, nível de risco (*Baixo, Médio, Alto, Crítico*) e medidas preventivas.
- **Dashboard Central:** Exibição de estatísticas gerais em tempo real (total de máquinas, status atual, produtividade média, consumo energético e incidentes abertos).

---

## 5. Arquitetura e Tecnologias-
 **Front-End:** React.js, Vite, HTML5, CSS3, JavaScript (ES6+), Fetch API / Axios.
- **Back-End:** Node.js, Express.js.
- **Banco de Dados:** PostgreSQL (Relacional).
- **Versionamento & Colaboração:** Git, GitHub.
- **Prototipação & Design:** Figma / Canva.