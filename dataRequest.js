const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

// Carrega as credenciais do Spotify do arquivo config.json
const configPath = './config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const spotifyClientId = config.clientId;
const spotifyClientSecret = config.clientSecret;

async function getSpotifyTrackId(nomeMusica, nomeArtista) {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64')}`,
        },
      }
    );

    const accessToken = response.data.access_token;

    const searchResponse = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `${nomeMusica} ${nomeArtista}`,
          type: 'track',
        },
      }
    );

    // Verifica se há resultados na resposta
    if (searchResponse.data.tracks.items.length > 0) {
      // Retorna o ID da primeira música encontrada
      return searchResponse.data.tracks.items[0].id;
    } else {
      // Se não houver resultados, retorna null ou algum valor indicativo de ausência de ID
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getFormattedMusicas() {
  try {
    // Faz a requisição para a API da Genie
    const response = await axios.get('https://app.genie.co.kr/chart/j_RealTimeRankSongList.json');

    // Obtém as informações relevantes do JSON de resposta
    const musicas = response.data.DataSet.DATA.map(async (song) => {
      const nomeMusica = song.SONG_NAME;
      const nomeArtista = decodeURIComponent(song.ARTIST_NAME);

      // Obtém o ID da música no Spotify
      const spotifyTrackId = await getSpotifyTrackId(nomeMusica, nomeArtista);

      return {
        rank: song.RANK_NO,
        title: song.SONG_NAME,
        artist: decodeURIComponent(song.ARTIST_NAME),
        album: song.ALBUM_NAME,
        imageUrl: decodeURIComponent(song.ALBUM_IMG_PATH),
        spotifyTrackId, // Adiciona o ID da música no Spotify ao objeto
      };
    });

    // Espera que todas as promessas sejam resolvidas antes de retornar
    return Promise.all(musicas);
  } catch (error) {
    throw error;
  }
}

module.exports = { getFormattedMusicas, getSpotifyTrackId };