<style lang="scss" scoped>
.section-workbench {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 100px;

  .screenshot {
    display: block;
    width: 900px;
    margin-bottom: 20px;
    border-radius: 14px;
    aspect-ratio: 1.75;
    background: #2e3247;
    object-fit: cover;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5), 10px 10px 30px rgba(0, 0, 0, 0.5);
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.2s ease-out;
  }

  .title {
    line-height: 1.2em;
    font-weight: 700;
    font-size: 30px;
    color: #ddd2c5;
  }

  .desc {
    line-height: 1.2em;
    font-size: 18px;
    color: #cabeaf;
  }

  .links {
    a {
      display: inline-block;
      margin: 0 16px;
      font-size: 18px;
      color: #ddd2c5
    }
  }

  .widgets-list {
    width: 100%;
    margin: 50px 0;

    .widgets-list-title {
      padding: 20px 0;
      text-align: center;
      font-size: 20px;
      color: #ddd2c5;
    }

    .widgets-list-body {
      overflow: hidden;
    }

    .widgets-marquee {
      display: flex;
      width: max-content;
      animation: widgets-marquee 40s linear infinite;
    }

    .widgets-item {
      flex-shrink: 0;
      margin-right: 20px;

      .widgets-screenshot {
        width: 306px;
        height: 138px;
        background: url(./images/widgets.jpg);
        background-size: 619px;
      }
      .widgets-title {
        padding: 10px 0;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #8a837b;
      }
    }
  }
}

@keyframes widgets-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
<template>
  <div class="section-workbench">
    <img
      ref="screenshot"
      class="screenshot"
      v-lazy
      :src="thumb"
      @mousemove="onScreenshotMove"
      @mouseleave="onScreenshotLeave"
    />
    <div class="title">小剧起始页</div>
    <div class="desc">一款为自己开发的站点，是小剧工作上的独家兵器库，上网冲浪的小助手。</div>
    <Button size="large" href="https://e.bh-lay.com/">
      快速访问
    </Button>
    <div class="links">
      <a href="/blog?tag=%E5%B0%8F%E5%89%A7%E8%B5%B7%E5%A7%8B%E9%A1%B5">
        开发记录
      </a>
      <a :href="`https://github.com/${post.git_full_name}`">
        Github
      </a>
    </div>
    <div class="widgets-list">
      <div class="widgets-list-title">众多好用的小组件</div>
      <div class="widgets-list-body">
        <div class="widgets-marquee">
          <div
            class="widgets-item"
            v-for="(item, index) in marqueeWidgets"
            :key="index"
          >
            <div class="widgets-screenshot" :style="{
              backgroundPosition: `-${307 * (item[2] - 1) + 5}px  -${139 * (item[1] - 1) + 5}px`
            }"></div>
            <div class="widgets-title">{{ item[0] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { imgHosting } from '@/filters'

const widgets: [string, number, number][] = [
	['正则可视化', 1, 1], ['JSON格式化', 1, 2],
	['工位后视镜', 2, 1], ['文本对比', 2, 2],
	['二维码工具', 3, 1], ['倒计时', 3, 2],
	['三角形生成器', 4, 1], ['图片base64', 4, 2],
	['简裁变图', 5, 1], ['小书房', 5, 2]
]
const marqueeWidgets = [...widgets, ...widgets]

const post = ref({
	_id: '62c4ea07997fdf777f773f9c',
	id: 'a25as2cfjd',
	name: 'workbench',
	title: '',
	cover: '',
	time_create: 1657072135077,
	git_full_name: '/bh-lay/lays-workbench',
	demo_url: '',
	intro: '',
	github: {
		name: 'lays-workbench',
		full_name: 'bh-lay/lays-workbench',
		html_url: 'https://github.com/bh-lay/lays-workbench',
		description: '剧中人的个人上网首页',
		created_at: '2021-06-17T05:16:46Z',
		updated_at: '2025-12-14T14:51:12Z',
		pushed_at: '2026-01-15T15:04:05Z',
		git_url: 'git://github.com/bh-lay/lays-workbench.git',
		homepage: 'http://e.bh-lay.com/',
		stargazers_count: 23,
		watchers_count: 23,
		forks_count: 5
	}
})

const thumb = imgHosting('/blog/lays-workbench/home-screen-capture.jpg', 'zoom', 1800)

const screenshot = ref<HTMLElement | null>(null)
const MAX_TILT = 5

function onScreenshotMove(event: MouseEvent) {
  const el = screenshot.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 归一化到 -0.5 ~ 0.5，中心为 0
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  // 鼠标所在的一侧向后（远离视线）倾斜，中心点保持不动
  const rotateY = x * MAX_TILT
  const rotateX = -y * MAX_TILT
  el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function onScreenshotLeave() {
  const el = screenshot.value
  if (el) el.style.transform = ''
}

</script>
