<style lang="scss" scoped>
@use "../../../common/styles/variables" as *;
.container {
  width: 90%;
  max-width: 1280px;
  margin: auto;
}
@media screen and (max-width: $max-mobile-width) {
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
