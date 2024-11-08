require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:8080' // 리디렉션 URI 설정
});

// 루트 경로에 대한 안내 메시지
app.get('/', (req, res) => {
  res.send('Spotify OAuth 서버가 실행 중입니다. /login으로 이동하여 로그인하세요.');
});

// Spotify 로그인 페이지로 리디렉션
app.get('/login', (req, res) => {
  const scopes = ['user-read-playback-state', 'user-modify-playback-state'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Redirect URI로 리디렉션된 후, authorization code를 받아 Access Token 요청
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    // Access Token과 Refresh Token 설정
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    res.send('Spotify 인증 성공! 이제 음악을 재생할 수 있습니다.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.send('토큰 요청에 실패했습니다.');
  }
});

// 음악 재생 엔드포인트
app.get('/play', async (req, res) => {
  const trackTitle = "All I Want for Christmas Is You"; // 테스트용 곡 제목

  try {
    // Spotify에서 트랙 검색
    const searchResults = await spotifyApi.searchTracks(`track:${trackTitle}`);
    if (searchResults.body.tracks.items.length > 0) {
      const trackUri = searchResults.body.tracks.items[0].uri;

      // 활성화된 기기 확인 후 재생
      const devices = await spotifyApi.getMyDevices();
      if (devices.body.devices.length > 0) {
        const deviceId = devices.body.devices[0].id;

        await spotifyApi.play({
          device_id: deviceId,
          uris: [trackUri]
        });
        res.send(`재생 중: ${trackTitle}`);
      } else {
        res.send("활성화된 Spotify 기기를 찾을 수 없습니다. Spotify를 열고 다시 시도하세요.");
      }
    } else {
      res.send('Spotify에서 곡을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('Error playing track:', error);
    res.send('음악 재생 중 오류가 발생했습니다.');
  }
});

app.listen(8080, () => {
  console.log('서버가 http://localhost:8080 에서 실행 중입니다. /login으로 이동하여 로그인하세요.');
});
