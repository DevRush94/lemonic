<template>
  <header>
    <nav>
      <li>Lemonic</li>
      <li>
        <input
          type="text"
          id="search-input"
          placeholder="Search..."
          @input="handleInput" />
        <ul class="autocomplete-results" v-show="showAutocomplete">
          <li v-for="result in autocompleteResults" @click="selectResult(result)" :key="result.id">
            <div>{{ result.name }}</div>
          </li>
        </ul>
      </li>
      <li class="ham">Ham</li>
    </nav>
  </header>
</template>

<script>
import { inject, ref } from 'vue';

export default {
  setup() {
    const store = inject('store');

    const showAutocomplete = ref(false);
    const autocompleteResults = ref([]);
    let timeout = null;

    const handleInput = (event) => {
      clearTimeout(timeout);
      const inputValue = event.target.value;
      showAutocomplete.value = inputValue.length > 0;

      // Set a new timeout to trigger the API request after 300ms of inactivity
      timeout = setTimeout(() => {
        getAutocompleteResults(inputValue);
      }, 300);
    };

    const getAutocompleteResults = async (query) => {
      if (query) {
        getSearchSong(query);
      } else {
        autocompleteResults.value = [];
        showAutocomplete.value = false;
      }
    };

    const getSearchSong = async (query) => {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album,track`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        autocompleteResults.value = data.tracks.items.map(item => {
          return {
            id: item.id,
            duration_ms: item.duration_ms,
            name: item.name,
            cover: item.album.images[0].url,
          };
        });
        showAutocomplete.value = true;
      } else {
        console.error('Error fetching autocomplete results:', response.statusText);
        showAutocomplete.value = false;
      }
    };

    const selectResult = (result) => {
      showAutocomplete.value = false;
      store.setTrack(result);
    };

    return {
      showAutocomplete,
      autocompleteResults,
      handleInput,
      selectResult,
    };
  },
};
</script>

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

.autocomplete-results {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  position: absolute;
  border: 1px solid #ccc;
  z-index: 1000;
}

.autocomplete-results li {
  padding: 5px;
  cursor: pointer;
  font-size: 15px;
  border: 1px solid #eee;
}

.autocomplete-results li:hover {
  background-color: #ccc;
}
</style>
