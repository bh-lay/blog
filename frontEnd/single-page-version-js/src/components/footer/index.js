import UI from '../../js/dialog.js';
import utils from '../../js/Base.js'
let template = require('./index.html')

function Init (dom) {
  let newDom = utils.createDom(template)
  utils.bind(utils.query('.backToOldVersion', newDom), 'click', function () {
    UI.confirm({
      text: '想看看屌丝版 ？',
      callback: function () {
        document.cookie = 'ui_version=html;path=/;'
        window.location.reload()
      }
    })
  })
  dom.appendChild(newDom)
}

export default Init