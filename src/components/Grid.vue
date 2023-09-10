<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
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
