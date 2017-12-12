<template>
  <div id="app">
    <div class="navigation">
      <div style="height: 80px"></div>
      <navigation></navigation>
    </div>
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
import navigation from './components/navigation.vue'

export default {
  name: 'app',
  components: {
    navigation
  }
}
</script>

<style>
html,
body {
	margin: 0;
	padding: 0;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.navigation {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 240px;
	overflow: auto;
	background: #545c64;
}

.main {
	padding: 20px 20px 40px 260px;
}
</style>
