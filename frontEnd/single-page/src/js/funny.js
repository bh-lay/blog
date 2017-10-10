/**
 * 一些好玩的东西
 *
 **/
export default function () {
  // 会变的 title
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? '出BUG了，快看！' : '小剧客栈，剧中人的个人博客！';
  });

  // 复制超过18个字，改变被复制文字
  document.body.addEventListener('copy', function (event) {
    let clipboardData = event.clipboardData || window.clipboardData;
    let innerText = window.getSelection().toString();

    if (!clipboardData || !innerText || innerText.length < 18) {
      return;
    }
    event.preventDefault();
    let data = [
      '作者：剧中人',
      '来自：小剧客栈',
      '链接：' + window.location.href,
      '',
      innerText
    ];
    clipboardData.setData('text/html', data.join('<br>'));
    clipboardData.setData('text/plain', data.join('\n'));
  });

  // 控制台
  try {
    console.log('一个人到底多无聊\r\n 才会把 console 当成玩具\r\n一个人究竟多堕落\r\n 才会把大好青春荒废在博客上\r\n\r\n\r\n%cfollow me %c https://github.com/bh-lay', 'color:red', 'color:green');
  } catch (e) {
  }
}
