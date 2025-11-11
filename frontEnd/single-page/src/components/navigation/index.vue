<style lang="scss" scoped>
.navigation {
  height: 56px;
  --highlight-color: #09f;
  --text-color: #111317;
}
.navigation .navigation-body {
  position: fixed;
  width: 100%;
  height: 56px;
  top: 0;
  left: 0;
  z-index: 10000;
  background: #fff;
}
.navigation .nav-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  margin: 0 -10px;
  background: #fff;
}
.navigation .nav-logo {
  position: relative;
  height: 56px;
  padding: 0 24px 0 18px;
  line-height: 56px;
  transition: 0.3s;
}
.navigation .nav-logo svg {
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  margin-right: 2px;
  fill: var(--highlight-color);
}
.navigation .nav-logo span {
  display: inline-block;
  vertical-align: middle;
  padding-left: 8px;
  line-height: 30px;
  font-weight: 900;
  font-size: 16px;
  color: var(--text-color);
}
.navigation .nav-logo:hover {
  background: #e2e6e9;
}
.navigation .nav-more-btn {
  display: none;
}
.navigation .nav-list {
  padding-right: 15px;
}
.navigation .nav-list a {
  position: relative;
  display: inline-block;
  width: 80px;
  line-height: 56px;
  text-align: center;
  font-size: 14px;
  font-weight: 900;
  color: var(--text-color);
  text-decoration: none;
  transition: 0.2s;
}
.navigation .nav-list a:after {
  content: '';
  position: absolute;
  bottom: 12px;
  left: 18%;
  width: 0;
  height: 2px;
  background: var(--highlight-color);
  transition: 0.4s;
}
.navigation .nav-list a:hover:after {
  width: 30%;
}
.navigation .nav-list a.sub-page.router-link-active,
.navigation .nav-list a.index-page.router-link-exact-active {
  opacity: 1;
}
.navigation .nav-list a.sub-page.router-link-active:after,
.navigation .nav-list a.index-page.router-link-exact-active:after {
  transition: 1.2s 0.5s;
  width: 64%;
}
@media screen and (max-width: 750px) {
  .navigation .nav-list a {
    width: 60px;
    font-size: 13px;
  }
}
@media screen and (min-width: 600px) {
  :global(.navigation-shadow:after) {
    content: '';
    position: absolute;
    width: 100%;
    height: 240px;
    top: 0;
    left: 0;
    backdrop-filter: blur(2px) contrast(0.75);
    mask-image: linear-gradient(180deg, #000 80px, transparent);
    -webkit-backdrop-filter: blur(2px) contrast(0.5);
    -webkit-mask-image: linear-gradient(180deg, #000 80px, transparent);
    pointer-events: none;
  }
  .navigation {
    height: 0;
  }
  @supports (animation-range: 0 260px) {
    .navigation .navigation-body {
      transform: translateY(20px);
      background: transparent;
      animation: sticky-navigation-move linear forwards;
      animation-timeline: scroll();
      animation-range: 0 260px;
    }
    .navigation .nav-inner {
      background: transparent;
      overflow: hidden;
    }
  }
}
@media screen and (max-width: 600px) {
  .navigation .nav-inner {
    margin-left: -10px;
    box-shadow: 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125);
  }
  .navigation .nav-list-body {
    position: absolute;
    top: 60px;
    right: 10px;
    width: 200px;
    background: #fff;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1), 1px 1px 2px rgba(0,0,0,0.2);
    transition: 0.2s ease-in-out;
    visibility: hidden;
    opacity: 0;
  }
  .navigation .nav-list a {
    display: block;
    width: 100%;
  }
  .navigation .nav-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
    transition: 0.2s ease-in-out;
    visibility: hidden;
    opacity: 0;
  }
  .navigation .nav-more-btn {
    position: absolute;
    display: block;
    width: 44px;
    height: 44px;
    top: 7px;
    right: 10px;
    border: none;
    cursor: default;
    background: #fff;
  }
  .navigation .nav-more-btn i {
    display: block;
    position: absolute;
    width: 26px;
    height: 4px;
    left: 9px;
    border-radius: 4px;
    background: #444;
    transition: 0.2s ease-in-out;
  }
  .navigation .nav-more-btn i:nth-child(1) {
    top: 10px;
  }
  .navigation .nav-more-btn i:nth-child(2) {
    top: 19px;
  }
  .navigation .nav-more-btn i:nth-child(3) {
    top: 28px;
  }
  .nav-slidedown .nav-more-btn i:nth-child(1) {
    transform: translateY(9px) rotate(-45deg);
  }
  .nav-slidedown .nav-more-btn i:nth-child(2) {
    opacity: 0;
  }
  .nav-slidedown .nav-more-btn i:nth-child(3) {
    transform: translateY(-9px) rotate(45deg);
  }
  .nav-slidedown .nav-list-body,
  .nav-slidedown .nav-mask {
    visibility: visible;
    opacity: 1;
  }
}
@-moz-keyframes sticky-navigation-move {
  0% {
    transform: translateY(20px);
    background: transparent;
    box-shadow: none;
  }
  40% {
    background: transparent;
  }
  50% {
    transform: translateY(0);
    box-shadow: none;
  }
  100% {
    transform: translateY(0);
    background: #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125);
  }
}
@-webkit-keyframes sticky-navigation-move {
  0% {
    transform: translateY(20px);
    background: transparent;
    box-shadow: none;
  }
  40% {
    background: transparent;
  }
  50% {
    transform: translateY(0);
    box-shadow: none;
  }
  100% {
    transform: translateY(0);
    background: #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125);
  }
}
@-o-keyframes sticky-navigation-move {
  0% {
    transform: translateY(20px);
    background: transparent;
    box-shadow: none;
  }
  40% {
    background: transparent;
  }
  50% {
    transform: translateY(0);
    box-shadow: none;
  }
  100% {
    transform: translateY(0);
    background: #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125);
  }
}
@keyframes sticky-navigation-move {
  0% {
    transform: translateY(20px);
    background: transparent;
    box-shadow: none;
  }
  40% {
    background: transparent;
  }
  50% {
    transform: translateY(0);
    box-shadow: none;
  }
  100% {
    transform: translateY(0);
    background: #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.063), 0 0 10px rgba(0,0,0,0.125);
  }
}
</style>
<template>
	<div
		class="navigation"
		:class="{
			'nav-slidedown': navSlidedown
		}"
	>
		<div class="navigation-body">
			<Container>
				<div class="nav-inner">
					<router-link
						to="/"
						class="nav-logo"
					>
						<svg viewBox="150 50 1700 1700" xmlns="http://www.w3.org/2000/svg">
							<path d="m1636.55 1484.58a211.6 211.6 0 0 1 -250.18 54.76 801.031 801.031 0 0 0 -775.466 1.51 211.855 211.855 0 0 1 -247.233-55.97 796.437 796.437 0 0 1 -163.671-484.88c0-441.828 358.172-800 800-800s800 358.172 800 800a796.409 796.409 0 0 1 -163.45 484.58zm-636.55-884.58c-220.914 0-400 179.086-400 400s179.086 400 400 400 400-179.09 400-400-179.09-400-400-400z"/>
						</svg>
						<span>小剧客栈</span>
					</router-link>
					<div class="nav-list">
						<Button class="nav-more-btn" @click="navSlidedown = !navSlidedown"><i></i><i></i><i></i></Button>
						<div class="nav-mask" @click="navSlidedown = false"></div>
						<div class="nav-list-body">
							<router-link
								to="/"
								class="index-page"
							>首页</router-link>
							<router-link
								v-for="nav in navList"
								:key="nav.type"
								:to="nav.href"
								class="sub-page"
							>{{nav.label}}</router-link>
						</div>
					</div>
				</div>
			</Container>
		</div>
	</div>
</template>

<script>

export default {
	name: 'navigation',
	data () {
		return {
			navList: Object.freeze([
				{
					label: '博文',
					href: '/blog',
					type: 'blog'
				},
				{
					label: '实验室',
					href: '/labs/',
					type: 'labs'
				},
				{
					label: '全景',
					href: '/720/',
					type: '720'
				},
				{
					label: '摄影',
					href: '/photography',
					type: 'photography'
				},
				{
					label: '留言',
					href: '/bless',
					type: 'bless'
				}
			]),
			navSlidedown: false
		}
	},
	watch: {
		$route () {
			this.navSlidedown = false
		}
	}
}
</script>
