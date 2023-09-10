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
const clientSecret = 'f4490eb08e334cba9e0a02a472a59f1a';
const basicAuth = (new Buffer.from(client_id + ':' + client_secret).toString('base64'));

function getAccessToken(authorizationCode) {

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials`
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
