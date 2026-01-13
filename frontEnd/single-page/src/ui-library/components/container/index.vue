<style lang="scss" scoped>
@use "../../../common/styles/variables" as *;
.container {
  width: $laptop-normal-width;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: $laptop-big-width) {
  .container {
    width: $pad-portrait-width;
  }
}
@media screen and (max-width: $laptop-small-width) {
  .container {
    width: $pad-landscape-width;
  }
}
@media screen and (max-width: $pad-portrait-width) {
  .container {
    width: auto;
    margin-right: 60px;
    margin-left: 60px;
  }
}
@media screen and (max-width: $pad-landscape-width) {
  .container {
    width: auto;
    margin-right: 10px;
    margin-left: 10px;
  }
}

</style>
<template>
<div class="container"><slot /></div>
</template>
<script>
export default {
	name: 'ui-container',
}
</script>
