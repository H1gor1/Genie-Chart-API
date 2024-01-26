// app.js
const express = require('express');
const cors = require('cors'); // Importando o CORS
const apiRoutes = require('./apiRoutes');

const app = express();
const PORT = process.env.PORT || 3020;

app.use(cors());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});