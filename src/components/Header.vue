<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header>
    <nav>
      <li>Lemonic</li>
      <li class="ham">Ham</li>
    </nav>
  </header>
</template>

<style scoped>
header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;


}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li {
  list-style: none;
  letter-spacing: 1px;
  font-weight: 700;
}

.ham {
  text-indent: -9999px;
  overflow: hidden;
  width: 40px;
  height: 40px;
  background: #333;
}
</style>
