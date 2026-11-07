const baseTitle = '小剧客栈-剧中人的个人博客 网页设计师博客 前端工程师 互动设计学习者！'
let globalTitle = baseTitle

// 会变的 title
function titleTick () {
	document.addEventListener('visibilitychange', function () {
		document.title = document.hidden ? '出BUG了，快看！' : globalTitle
	})
}

// 设置页面 title
export function setTitle (title: string, desc?: string, img?: string) {
	globalTitle = title !== '首页' ? `${title} | ${baseTitle}` : baseTitle
	document.title = globalTitle
}

function copyPrefix () {
	// 复制超过18个字，改变被复制文字
	document.body.addEventListener('copy', function (event: ClipboardEvent) {
		const clipboardData = event.clipboardData || (window as any).clipboardData
		const innerText = window.getSelection()?.toString()
		if (!clipboardData || !innerText || innerText.length < 18) {
			return
		}
		event.preventDefault()
		const data = [
			'作者：剧中人',
			'来自：小剧客栈',
			'链接：' + window.location.href,
			'',
			innerText
		]
		clipboardData.setData('text/html', data.join('<br>'))
		clipboardData.setData('text/plain', data.join('\n'))
	})
}

// 控制台输出
function consolePrint () {
	try {
		console.log(
			`
%c 小剧客栈 %c 剧中人的个人博客 %c

一个人到底多无聊
  才会拿 console 当玩具
一个人究竟多堕落
  才会把大好青春荒废在博客上

%cFollow me %c https://github.com/bh-lay`,
			'background:#35495e ; padding: 5px; border-radius: 4px 0 0 4px;  color: #fff;',
			'background:#41b883 ; padding: 5px; border-radius: 0 4px 4px 0;  color: #fff;',
			'font-size: 12px',
			'color:red',
			'color:green'
		)
	} catch (e) {}
}

export default {
	setTitle,
	init () {
		titleTick()
		copyPrefix()
		consolePrint()
	}
}
