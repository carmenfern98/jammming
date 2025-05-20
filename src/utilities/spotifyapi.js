const clientId = 'ab2b2fe9f7dd44ff8b115b22017790c0'; // Replace with your client ID
const redirectUri = 'https://carmenfern98.github.io/jammming/'; // Must match exactly what you put in Spotify Dev Console
const scope = 'playlist-modify-public playlist-modify-private';

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const Spotify = {
  async getAccessToken() {
    let accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    
    if (accessToken && Date.now() < expiresAt) {return accessToken;}

    const refreshed = await this.refreshAccessToken();
    if (refreshed) return refreshed;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      const codeVerifier = generateRandomString(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      localStorage.setItem('code_verifier', codeVerifier);

      const state = generateRandomString(16);
      const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

      window.location.href = authUrl;
      return;
    } else{const codeVerifier = localStorage.getItem('code_verifier');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    const data = await response.json();
    console.log('Token response:', data)

    if (!response.ok) {
        console.error('Token request failed:', data);
        return null;
      }

    accessToken = data.access_token;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);

    window.history.replaceState({}, document.title, '/'); // Clean up URL
    return accessToken;
  }
},
async savePlaylist(name, trackUris){
    if (!name || !trackUris.length)return;
    const accessToken= await this.getAccessToken();
    if(!accessToken) {
       console.error('No access token');
        return;}

    try{
        const userResponse = await fetch ('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userData = await userResponse.json();
        const userId = userData.id;

        console.log('User ID:', userId)

        const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: 'Created with Jammming',
                public: false
            })
        });
        const playlistData = await createResponse.json();
        const playlistId = playlistData.id;
        console.log('Created playlist:', playlistData);
        
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackUris
          })
        });
        console.log('Playlist saved to Spotify');
    } catch (error){
        console.error('Error saving playlist', error);
    }
},
async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if(!refreshToken){
        console.error('No refresh token found');
        return null;
    }
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
    })
    const response = await fetch('https://accounts.spotify.com/api/token',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await response.json();

    if (!response.ok){
        console.error('Refresh token failed', data);
        return null;
    }

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);
    return data.access_token

}
}

export default Spotify;
