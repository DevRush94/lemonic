
<script>
const clientId = '4875732b46fe4b2b8671c683ea012688';
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a';
const basicAuth = btoa(clientId + ':' + clientSecret);
const redirectUri = encodeURIComponent('http://127.0.0.1:5173/');

const url = new URL(window.location.href);
const code = url.searchParams.get('code');

if (!code && !localStorage.getItem('token')) {
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
} else {
  window.history.replaceState({}, document.title, location.href.split("?")[0]);

  if (!localStorage.getItem('token')) {
    getAccessToken(code).then(getTrackDetails);
  } else {
    getTrackDetails();
  }
}

async function getAccessToken(authorizationCode) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

async function getTrackDetails() {
  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There was an error fetching track details!', error);
  }
}

</script>
<template>
  <main>
    <div class="box">
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>
      <li class="grid">
        <div class="song-box"></div>
      </li>

    </div>
  </main>
</template>

<style scoped>
.box {
  padding: 100px 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2vw 1vw;
  flex-wrap: wrap;
}

.grid {
  flex: 1 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
}

.song-box {
  width: calc(10vw + 15px);
  height: calc(10vw + 15px);
  background: #000;
}
</style>
