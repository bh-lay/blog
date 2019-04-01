import utils from '../js/Base.js'
import juicer from '../js/juicer.js'
import UI from '../js/dialog.js'

let faceConfig = '😀 😂 🤣 😃 😅 😆 😇 😉 😊 🙃 😋 😌 😍 😘 😗 😙 😚 🤪 🤨 😝 😛 🤑 🤓 😎 🤩 🤗 😏 😐 🙄 🤔 🤥 🤫 🤬 🤯 😳 😞 😟 😠 😡 😔 😕 😣 😖 😫 😤 😱 😧 😢 🤤 😪 😓 😭 😵 😲 🤐 🤧 🤮 😷 😴 💩';
let faceTpl = require('./face-list.html');

function face (param) {
  let configArr = faceConfig.split(/\s/);
  let html = juicer(faceTpl, {
    list: configArr
  });

  let pop = UI.pop({
    title: '贱萌的emoji表情',
    top: param.top,
    left: param.left,
    width: 600,
    html: html
  });
  utils.bind(pop.cntDom, 'click', 'a', function () {
    param.onSelect && param.onSelect(this.getAttribute('title'));
    pop.close();
  });
}

export default face;
