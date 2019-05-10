
import QRCode from 'qrcode';

export function createShareCard (url) {
  QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 0,
    width: 240,
    color: {
      dark: '#ccccccff',
      light: '#00000000'
    }
  })
    .then(url => {
      console.log(url)
    })
}
