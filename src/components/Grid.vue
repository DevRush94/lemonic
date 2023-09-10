<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>
<script>
var myToken;
const clientId = '4875732b46fe4b2b8671c683ea012688';
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a'; // Keep this secret and safe, typically done server-side.
const redirectUri = encodeURIComponent('http://127.0.0.1:5173/'); // Replace with your redirect URI
const basicAuth = btoa(`${clientId}:${clientSecret}`);
const scopes = encodeURIComponent('user-read-private user-read-email'); // Define your required scopes

var url = new URL(window.location.href);
var code = url.searchParams.get('code');
if (!code) {
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
  url = new URL(window.location.href);
  code = url.searchParams.get('code');
  if (code) {
    getAccessToken(code);
  }
}
else {
  url = new URL(window.location.href);
  code = url.searchParams.get('code');
  if (code) {
    getAccessToken(code);
  }
}


function getAccessToken(authorizationCode) {
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET'; // Keep this secret and safe, typically done server-side.
  const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI

  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&code=${authorizationCode}&redirect_uri=${encodeURIComponent(redirectUri)}`
  })
    .then(response => response.json())
    .then(data => {
      console.log('Access Token:', data.access_token);
      myToken = data.access_token

    })
    .catch(error => {
      console.error('Error fetching access token:', error);
    });
}

// To get track
// const accessToken = myToken // Replace with your token
// const trackId = '5nTtCOCds6I0PHMNtqelas'; // Replace with your track ID

// fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
//   method: 'GET',
//   headers: {
//     'Authorization': `Bearer ${accessToken}`,
//     'Content-Type': 'application/json'
//   }
// })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('There was an error!', error);
//   });
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
