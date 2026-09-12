<style lang="scss" scoped>
@use "../../common/styles/variables" as *;
.friends-page {
  background-color: #eef0f1;
}
.friends-page-header {
  position: relative;
  height: 768px;
  background: url('./images/home-chat.webp') no-repeat center #aab;
  background-size: cover;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(rgba(238, 240, 241, .1), rgba(238, 240, 241, 1));
    backdrop-filter: blur(1px);
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    left: 0;
    bottom: -2px;
    background: rgb(238, 240, 241);
  }
  .friends-slogan {
    position: relative;
    padding: 140px 20px;
    h1 {
      margin: 0;
      font-size: 40px;
      font-weight: normal;
      color: #171a1c
    }
    p {
      font-size: 18px;
      color: #171a1c
    }
  }
}
.main-friend-list-container {
  position: relative;
  margin-top: -320px !important;
}
.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #171a1c
}
.active-friend-list {
  --grid-size: 72px;
  --grid-gap: 8px;
  min-height: 400px;
  padding: 20px 0 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--grid-size));
  grid-template-rows: repeat(auto-fill, var(--grid-size));
  grid-auto-flow: dense;
  gap: var(--grid-gap);
}
.friend-avatar {
  aspect-ratio: 1;
  border-radius: 100%;
  background: no-repeat center center #333;
  background-size: cover;
}
.friend-name {
  padding-left: 2px;
  font-weight: bold;
  color: #1e2529
}
.friend-links {
  display: flex;
  gap: 12px;
  a {
    width: 18px;
    height: 18px;
    padding: 6px;
    border-radius: 100%;
    font-size: 14px;
    color: #103858;
    transition: .08s ease-in-out;
    svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    &:hover {
      background-color: #eef0f1
    }
  }
}
.friend-desc {
  color: #495b65
}
.friend-item {
  display: block;
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
  background: rgba(255, 255, 255, .4);
  overflow: hidden;
  transition: .4s ease-in-out;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 30%;
    left: 0;
    bottom: 0;
    background: linear-gradient(0deg, #fff, transparent);
    pointer-events: none;
  }
  &:hover {
    cursor: default;
    background-color: #fff;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1), 4px 4px 18px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  &-lg {
    grid-area: span 6 /span 4 /auto;
    width: calc(var(--grid-size) * 4 + var(--grid-gap) * 3);
    height: calc(var(--grid-size) * 6 + var(--grid-gap) * 5);
    padding: calc(var(--grid-size) * 0.6) calc(var(--grid-size) * 0.4) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--grid-size) * 0.15);
    .friend-avatar {
      width: calc(var(--grid-size) * 2)
    }
    .friend-name {
      font-size: 22px;
    }
    .friend-desc {
      padding-top: calc(var(--grid-size) * 0.1);
      line-height: 1.5;
      font-size: 16px;
    }
  }
  &-md {
    grid-area: span 3 /span 4 /auto;
    width: calc(var(--grid-size) * 4 + var(--base-gap) * 3);
    height: calc(var(--grid-size) * 3 + var(--base-gap) * 2);
    padding: calc(var(--grid-size) * 0.3) calc(var(--grid-size) * 0.4) 0;
    display: grid;
    grid-template-columns: calc(var(--grid-size) * 1) 1fr;
    grid-template-rows: calc(var(--grid-size) * 0.6) calc(var(--grid-size) * 0.4)  calc(var(--grid-size) * 1.8);
    grid-column-gap: calc(var(--grid-size) * 0.3);
    grid-row-gap: 0px;
    .friend-avatar {
      grid-area: 1 / 1 / 3 / 2;
      width: calc(var(--grid-size) * 1)
    }
    .friend-name {
      grid-area: 1 / 2 / 2 / 3;
      line-height: calc(var(--grid-size) * 0.6);
      font-size: 18px;
    }
    .friend-links { grid-area: 2 / 2 / 3 / 3; }
    .friend-desc {
      grid-area: 3 / 1 / 3 / 3;
      padding-top: calc(var(--grid-size) * 0.3);
      font-size: 14px;
    }
  }
  &-sm {
    grid-area: span 3 /span 2 /auto;
    width: calc(var(--grid-size) * 2 + var(--grid-gap) * 1);
    height: calc(var(--grid-size) * 3 + var(--grid-gap) * 2);
    padding: calc(var(--grid-size) * 0.3) calc(var(--grid-size) * 0.2) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--grid-size) * 0.1);
    .friend-avatar {
      width: calc(var(--grid-size) * 0.7);
      flex-shrink: 0;
    }
    .friend-name {
      font-size: 14px;
    }
    .friend-desc {
      font-size: 12px;
    }
  }
}
@media screen and (max-width: $laptop-big-width) {
  .active-friend-list {
    --grid-size: 77px;
  }
}
@media screen and (max-width: $laptop-small-width) {
  .active-friend-list {
    --grid-size: 89px;
  }
}

@media screen and (max-width: $pad-portrait-width) {
  .active-friend-list {
    --grid-size: calc((100vw - 80px) / 9 - var(--grid-gap) / 2);
  }
}
@media screen and (max-width: $pad-landscape-width) {
  .active-friend-list {
    --grid-size: calc((100vw - 20px) / 8.5 - var(--grid-gap) / 2);
  }
}

@media screen and (max-width: $max-mobile-width) {
  .active-friend-list {
    --grid-size: calc((100vw - 20px) / 4.2 - var(--grid-gap) / 2);;
    width: 100%;
  }
}

.miss-connect-friend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px 0 40px
}
.miss-friend-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 55px;
  border-radius: 4px;
  border: 1px solid #fff;
  cursor: default;
}

.blog-group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px 0 100px;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 55px;
    border-radius: 4px;
    border: 1px solid #fff;
    transition: .2s;
    &:hover {
      background-color: #fff;
    }
  }
  img {
    display: block;
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
}
</style>
<template>
<div class="friends-page">
  <div class="friends-page-header">
    <Container>
      <div class="friends-slogan">
        <h1>剧中人朋友圈</h1>
        <p>汇集小剧线下、网络中的同好挚友</p>
      </div>
    </Container>
  </div>
	<Container class="main-friend-list-container">
    <div class="section-title">活跃好友</div>
    <div class="active-friend-list" v-loading="isLoading">
      <div
        class="friend-item"
        v-for="(item, index) in friendsList"
        :key="index"
        :class="{
          'friend-item-lg': item.isLarge,
          'friend-item-md': item.isMedium,
          'friend-item-sm': item.isSmall,
        }"
        :style="{
          order: item.order
        }"
      >
        <div
          class="friend-avatar"
          :style="{
            backgroundImage: `url(${createImgRobber(item.avatar)})`
          }"
        >
        </div>
        <div class="friend-name">
          {{item.title}}
        </div>
        <div class="friend-links">
          <a v-if="item.url" target="_blank" class="blog" :href="siteUrlTransform(item.url)">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path d="M704 512c0 44.4-2.4 87.2-6.6 128H326.6c-4.4-40.8-6.6-83.6-6.6-128s2.4-87.2 6.6-128h370.8c4.4 40.8 6.6 83.6 6.6 128z m57.6-128h246.2c10.6 41 16.2 83.8 16.2 128s-5.6 87-16.2 128H761.6c4.2-41.2 6.4-84 6.4-128s-2.2-86.8-6.4-128z m225.2-64H753.4c-20-127.8-59.6-234.8-110.6-303.2 156.6 41.4 284 155 343.8 303.2z m-298.2 0H335.4c12.2-72.8 31-137.2 54-189.4 21-47.2 44.4-81.4 67-103C478.8 6.4 497.4 0 512 0s33.2 6.4 55.6 27.6c22.6 21.6 46 55.8 67 103 23.2 52 41.8 116.4 54 189.4z m-418 0H37.2c60-148.2 187.2-261.8 344-303.2-51 68.4-90.6 175.4-110.6 303.2zM16.2 384h246.2c-4.2 41.2-6.4 84-6.4 128s2.2 86.8 6.4 128H16.2C5.6 599 0 556.2 0 512s5.6-87 16.2-128z m373.2 509.2c-23.2-52-41.8-116.4-54-189.2h353.2c-12.2 72.8-31 137.2-54 189.2-21 47.2-44.4 81.4-67 103-22.4 21.4-41 27.8-55.6 27.8s-33.2-6.4-55.6-27.6c-22.6-21.6-46-55.8-67-103zM270.6 704c20 127.8 59.6 234.8 110.6 303.2-156.8-41.4-284-155-344-303.2h233.4z m716.2 0c-60 148.2-187.2 261.8-343.8 303.2 51-68.4 90.4-175.4 110.6-303.2h233.2z" ></path>
            </svg>
          </a>
          <a
            v-if="item.github_username"
            target="_blank"
            class="github"
            :href="siteUrlTransform('https://github.com/' + item.github_username)"
          >
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path d="M512 12.672c-282.88 0-512 229.248-512 512 0 226.261333 146.688 418.133333 350.08 485.76 25.6 4.821333 34.986667-11.008 34.986667-24.618667 0-12.16-0.426667-44.373333-0.64-87.04-142.421333 30.890667-172.458667-68.693333-172.458667-68.693333C188.672 770.986667 155.008 755.2 155.008 755.2c-46.378667-31.744 3.584-31.104 3.584-31.104 51.413333 3.584 78.421333 52.736 78.421333 52.736 45.653333 78.293333 119.850667 55.68 149.12 42.581333 4.608-33.109333 17.792-55.68 32.426667-68.48-113.706667-12.8-233.216-56.832-233.216-253.013333 0-55.893333 19.84-101.546667 52.693333-137.386667-5.76-12.928-23.04-64.981333 4.48-135.509333 0 0 42.88-13.738667 140.8 52.48 40.96-11.392 84.48-17.024 128-17.28 43.52 0.256 87.04 5.888 128 17.28 97.28-66.218667 140.16-52.48 140.16-52.48 27.52 70.528 10.24 122.581333 5.12 135.509333 32.64 35.84 52.48 81.493333 52.48 137.386667 0 196.693333-119.68 240-233.6 252.586667 17.92 15.36 34.56 46.762667 34.56 94.72 0 68.522667-0.64 123.562667-0.64 140.202666 0 13.44 8.96 29.44 35.2 24.32C877.44 942.592 1024 750.592 1024 524.672c0-282.752-229.248-512-512-512"></path>
            </svg>
          </a>
        </div>
        <div class="friend-desc">{{item.discription}}</div>
      </div>
    </div>
    <Pagination
      :total="page.total"
      :size="page.pageItemCount"
      :current.sync="page.pageIndex"
    />
    <div class="section-title">静默好友</div>
    <div class="section-desc">站点已无法访问，或者博客已停更多年的好友。</div>
    <div class="miss-connect-friend-list">
      <div
        class="miss-friend-item"
        v-for="item in missConnectFriends"
        :key="item.id"
      >{{ item.title }}</div>
    </div>
    <div class="section-title">站群</div>
    <div class="blog-group-list">
      <a :href="siteUrlTransform('https://www.boyouquan.com/home')">
        <img src="https://www.boyouquan.com/assets/images/sites/logo/logo.svg" alt="">
      </a>
      <a :href="siteUrlTransform('https://www.foreverblog.cn/')" target="_blank" >
        <img src="https://foreverblog.cn/assets/logo/logo_en_default.png" alt="">
      </a>
      <a :href="siteUrlTransform('https://bloginc.cn')">
        <img src="https://bloginc.cn/img/logo_bloginc_all.svg" alt="">
      </a>
    </div>
  </Container>
	<Footer />
</div>
</template>

<script>
import { createExternalSiteUrl } from '@/common/js/cross-site-utils.js'
import { imgRobber } from '@/common/js/img-robber.js'
export default {
	name: 'blogPageArchives',
	components: {},
	data () {
		return {
			page: {
				total: 0,
				pageItemCount: 60,
				pageIndex: parseInt(this.$route.query.page) || 1
			},
			friendsList: [],
      missConnectFriends: [],
			getListTimer: null,

			replyMode: false,
			isLoading: false
		}
	},
	mounted () {
		this.getList()
	},
	methods: {
    createImgRobber(imgUrl) {
      if (!imgUrl) {
        return ''
      }
      return imgRobber(imgUrl)
    },
		getList () {
			this.isLoading = true
			clearTimeout(this.getListTimer)
			this.getListTimer = setTimeout(() => {
				this.forceGetList()
					.then(() => {
						this.isLoading = false
					})
			})
		},
		forceGetList () {
			let skip = (this.page.pageIndex - 1) * this.page.pageItemCount
			return fetch(`/api/moment/friend/?skip=${skip}&limit=${this.page.pageItemCount}`)
				.then(response => response.json())
				.then(data => {
					this.page.total = data.count
          const activeFriends = []
          const missConnectFriends = [];
					(data.list || []).forEach(item => {
            if (item.isShow) {
              const isLarge = item.score > 14
              const isMedium = item.score > 10 && item.score <= 14
              const isSmall = item.score <= 10
              activeFriends.push({
                ...item,
                isLarge,
                isMedium,
                isSmall,
                order: Math.ceil(Math.random() * (isLarge ? 10 : 100))
              })
            } else {
              missConnectFriends.push(item)
            }
          })
          this.friendsList = activeFriends
          this.missConnectFriends = missConnectFriends
				})
				.catch(() => {
          debugger
        })
		},
		replacePath () {
			let query = {
				page: this.page.pageIndex
			}
			this.$router.replace({
				path: '/friends/',
				query
			})
		},

		siteUrlTransform(url) {
			return createExternalSiteUrl(url)
		},
	},
	watch: {
		'page.pageIndex' () {
			this.replacePath()
			this.getList()
		}
	}
}
</script>
