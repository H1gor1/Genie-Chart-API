const express = require('express');
const router = express.Router();
const { getFormattedMusicas } = require('./dataRequest');

router.get('/musicsGenie', async (req, res) => {
  try {
    const musicas = await getFormattedMusicas();
    res.json(musicas);
  } catch (error) {
    console.error('Erro ao obter dados da API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;