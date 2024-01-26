// app.js
const express = require('express');
const apiRoutes = require('./apiRoutes');

const app = express();
const PORT = process.env.PORT || 3020;

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});