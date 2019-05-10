
import QRCode from 'qrcode';
// 卡片宽度
const cardWidth = 800
const footerHeight = 250
const pixelRatio = window.devicePixelRatio || 1

function buildCanvas (width, height) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
  return {canvas, context}
}

function loadImg (src, onload) {
  var img = new Image()
  img.onload = function () {
    onload(img)
  }
  img.src = src
}

const buildFooterImageDataUrl = (title, intro) => {
  let svgText = `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="200" fill="#fff" x="0" y="50"></rect><path transform="translate(30, 84) scale(0.03)" d="M2.221258 1024V535.32321c-2.221258-68.859002 6.663774-135.496746 28.876356-197.691974s55.531453-115.505423 95.5141-162.151843 88.850325-86.629067 144.381778-115.505423c55.531453-31.097614 117.726681-51.088937 184.364426-59.97397v211.019523c-82.186551 26.655098-137.718004 68.859002-166.594361 122.169197s-44.425163 119.947939-44.425162 199.913232h211.019523v490.898048H2.221258z m679.704989 0V535.32321c-2.221258-68.859002 6.663774-135.496746 28.876356-197.691974s53.310195-115.505423 95.5141-162.151843c39.982646-46.646421 88.850325-86.629067 144.381779-115.505423 55.531453-31.097614 117.726681-51.088937 184.364425-59.97397v211.019523c-82.186551 26.655098-137.718004 68.859002-166.59436 122.169197-31.097614 53.310195-44.425163 119.947939-44.425163 199.913232h211.019523v490.898048H681.926247z" fill="#e8e8e8"/><text dx="85" dy="110" font-size="30" text-anchor="start">${title}</text><circle r="180" cx="650" cy="180" fill="#fff" /><rect width="120" height="120" fill="#ddd" x="590" y="70" /><text dx="650" dy="220" font-size="16" text-anchor="middle" fill="#ddd">长按看全文</text><foreignObject width="500" height="80" x="50" y="150" style="pointer-events: none;"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 15px;color: #666;">${intro}</div></foreignObject></svg>`

  return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgText)))
}
const buildQRCode = (url) => {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 0,
    width: 240,
    color: {
      dark: '#ccccccff',
      light: '#00000000'
    }
  })
}
export function createShareCard ({title, intro, url, coverUrl}) {
  // 加载封面图
  loadImg(coverUrl, coverImg => {
    let newImageHeight = cardWidth * coverImg.height / coverImg.width
    let {canvas, context} = buildCanvas(cardWidth, newImageHeight + footerHeight)
    // 将封面填入 canvas
    context.drawImage(coverImg, 0, 0, canvas.width, newImageHeight * pixelRatio)

    // 构建页脚图片
    let footerDataUrl = buildFooterImageDataUrl(title, intro)
    // 加载页脚图片
    loadImg(footerDataUrl, footerImg => {
      // 将页脚插入 canvas
      context.drawImage(footerImg, 0, (newImageHeight - 50) * pixelRatio, canvas.width, pixelRatio * footerHeight)
      // 创建二维码
      buildQRCode(url).then(QRCodeUrl => {
        // 生成二维码 image 图片
        loadImg(QRCodeUrl, QRCodeImg => {
          let QRCodeWidth = 120 * pixelRatio
          // 将二维码绘制进 canvas
          context.drawImage(QRCodeImg, 590 * pixelRatio, (newImageHeight + 20) * pixelRatio, QRCodeWidth, QRCodeWidth)

          document.body.appendChild(canvas)
        })
      })
    })
  })
}
