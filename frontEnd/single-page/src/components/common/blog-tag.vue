<style lang="scss" scoped>
a {
  position: relative;
  display: inline-block;
  height: 20px;
  margin: 0 4px 0 8px;
  padding: 0 6px 0 7px;
  border-radius: 0 4px 4px 0;
  background: #eff3f5;
  line-height: 20px;
  font-size: 12px;
  color: #6c8693;
  text-decoration: none;
  transition: 0.15s;
}
a:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 8px 10px 0;
  border-color: transparent #eff3f5 transparent transparent;
  transition: 0.15s;
}
a:after {
  content: '';
  display: block;
  position: absolute;
  width: 4px;
  height: 4px;
  top: 8px;
  left: -2px;
  border-radius: 100%;
  background: #fff;
}
a:hover {
  background: #525f7a;
  color: #e2e6e9;
}
a:hover:before {
  border-right-color: #525f7a;
}
a.router-link-exact-active {
  background: #1f4ead;
  color: #bed0f4;
  cursor: default;
}
a.router-link-exact-active:before {
  border-right-color: #1f4ead;
}
</style>
<template>
<router-link :to="'/blog?tag=' + tag" >{{tag}}</router-link>
</template>

<script>
export default {
	name: 'blogTag',
	props: {
		tag: {
			type: String,
			default: ''
		}
	}
}
</script>
