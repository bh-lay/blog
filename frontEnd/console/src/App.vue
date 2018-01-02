<template>
  <div id="app">
    <div class="main">
      <div class="main-body">
        <router-view/>
      </div>
    </div>
    <navigation></navigation>
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
	position: relative;
  height: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
}

#app {
	position: relative;
  height: 100%;
  overflow: hidden;
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
	background: #fff;
}

.main {
	position: relative;
	height: 100%;
	background: #545c64;
  overflow: auto;
}
.main-body {
	padding: 20px 20px 40px 260px;

}
</style>
