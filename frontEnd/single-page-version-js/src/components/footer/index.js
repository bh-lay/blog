import UI from '../../js/dialog.js';
import utils from '../../js/Base.js'
let template = require('./index.html')

function Init (dom) {
  let newDom = utils.createDom(template)
  let nodes = utils.queryAll('.switch-version', newDom)
  utils.each(nodes, function(node){
    let version = node.getAttribute('data-version')
    utils.bind(node, 'click', function (e) {
      document.cookie = 'ui_version=' + version + ';path=/;'
      window.location.reload()
    })
  });
  dom.appendChild(newDom)
}

export default Init