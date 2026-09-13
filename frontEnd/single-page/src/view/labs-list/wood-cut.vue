<style lang="scss" scoped>
@use "../../common/styles/variables" as *;
.wood-cut-web {
  padding: 160px 0;
  background: #dddbda;
}
.wood-cut-web-inner {
  display: flex;
  width: 860px;
  margin: 0 auto;
  gap: 60px;
  .screenshot {
    display: block;
    width: 400px;
    aspect-ratio: 1.6;
    background: #333;
    object-fit: cover;
  }
  .intro {
    width: 500px;
    .title {
      height: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      font-size: 22px;
      font-weight: 600;
      color: #000;
    }
    .desc {
      margin-bottom: 70px;
      line-height: 1.3em;
      font-size: 16px;
      color: #888;
    }
    .links {
      display: flex;
      gap: 20px;
    }
  }
}
@media screen and (max-width: $pad-landscape-width) {
  .wood-cut-web {
    padding: 100px 0;
  }
  .wood-cut-web-inner {
    width: 100%;
    flex-direction: column;
    align-items: center;
    .screenshot {
      max-width: 90%;
    }
    .intro {
      width: 80%;
      text-align: center;
      .desc {
        margin-bottom: 30px;
      }
      .links {
        justify-content: center;
      }
    }
  }
}
</style>
<template>
<div class="wood-cut-web">
    <div class="wood-cut-web-inner">
      <img class="screenshot" v-lazy :src="thumb" />
      <div class="intro">
        <div class="title">A.I. 木料切割助手</div>
        <div class="desc">A.I. 木料切割助手，一款辅助板材、亚克力切割助手。借助于 A.I. 智能分析，合理规划摆放位置，计划切割线条。</div>
        <div class="links">
          <Button type="primary" size="large" href="https://tools.calcifer.work/wood-cutting-assistant/?sample=billy">
            立即访问
          </Button>
          <Button size="large" type="ghost" href="https://github.com/bh-lay/wood-cutting-assistant">
            Github
          </Button>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { imgHosting } from '@/filters'
const thumb = imgHosting('/labs/wood-cutting-assistant.jpg', 'zoom', 1000)
</script>
