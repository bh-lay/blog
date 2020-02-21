<template>
  <div id="app">
    <navigation></navigation>
    <div class="main">
      <div class="main-body">
        <router-view/>
      </div>
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
	position: relative;
  height: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
}

#app {
	position: relative;
	display: flex;
  height: 100%;
  overflow: hidden;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.navigation {
	width: 240px;
	overflow: auto;
	background: #fff;
}

.main {
	position: relative;
	flex-grow: 1;
	width: 300px;
	height: 100%;
	background: #545c64;
  overflow: auto;
}
.main-body {
	padding: 20px 20px 40px;
}
.el-form-item__label {
	line-height: 20px
}
</style>
