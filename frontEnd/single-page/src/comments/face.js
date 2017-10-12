import utils from '../js/Base.js'
import juicer from '../js/juicer.js'
import UI from '../js/dialog.js'

let faceConfig = 'smile grinning smiley blush relaxed wink heart_eyes kissing_heart kissing_heart kissing flushed grin pensive relieved cry scream angry mask tired_face sleeping hushed smirk 1 -1 two_men_holding_hands heart broken_heart gun';
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
    width: 300,
    html: html
  });
  utils.bind(pop.cntDom, 'click', 'a', function () {
    param.onSelect && param.onSelect(this.getAttribute('title'));
    pop.close();
  });
}

export default face;
