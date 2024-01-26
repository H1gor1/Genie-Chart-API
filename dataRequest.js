const axios = require('axios');
const querystring = require('querystring');

async function getFormattedMusicas() {
  try {
    // Faz a requisição para a API
    const response = await axios.get('https://app.genie.co.kr/chart/j_RealTimeRankSongList.json');

    // Obtém as informações relevantes do JSON de resposta
    const musicas = response.data.DataSet.DATA.map(song => {
      return {
        rank: song.RANK_NO,
        title: song.SONG_NAME,
        artist: decodeURIComponent(song.ARTIST_NAME), // Decodifica percent-encoding
        album: song.ALBUM_NAME,
        imageUrl: decodeURIComponent(song.ALBUM_IMG_PATH) // Decodifica percent-encoding
      };
    });

    return musicas;
  } catch (error) {
    throw error;
  }
}

module.exports = { getFormattedMusicas };