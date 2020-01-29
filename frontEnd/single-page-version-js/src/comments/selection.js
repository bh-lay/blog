/**
 * @author bh-lay
 *
 * @github: https://github.com/bh-lay/Selection
 *
 * @modified 2014-12-29 15:32
 *
 */
// set
let setPosition = (function () {
  let textarea = document.createElement('textarea');
  if (textarea.setSelectionRange) {
    return function (tarea, start, len) {
      len = len || 0;
      setTimeout(function () {
        tarea.focus();
        tarea.setSelectionRange(start, start + len);
      });
    }
  } else if (textarea.createTextRange) {
    // IE
    return function (tarea, start, len) {
      len = len || 0;
      tarea.focus();
      let strLen = tarea.value.length;
      let rng = tarea.createTextRange();
      rng.moveStart('character', start);
      rng.moveEnd('character', start + len - strLen);
      rng.select();
    }
  }
})();
// get
let getPosition = (function () {
  let textarea = document.createElement('textarea');
  if (typeof textarea.selectionStart === 'number') {
    // not IE
    return function (tarea) {
      return [tarea.selectionStart, tarea.selectionEnd, tarea.value.slice(tarea.selectionStart, tarea.selectionEnd)];
    }
  } else {
    // IE
    return function (tarea) {
      let start = 0;
      let end = 0;
      tarea.focus();
      let sTextRange = document.selection.createRange();

      if (tarea.tagName === 'TEXTAREA') {
        let oTextRange = document.body.createTextRange();
        oTextRange.moveToElementText(tarea);
        for (start = 0; oTextRange.compareEndPoints('StartToStart', sTextRange) < 0; start++) {
          oTextRange.moveStart('character', 1);
        }
        for (let i = 0; i <= start; i++) {
          if (tarea.value.charAt(i) === '\n') {
            start++;
          }
        }
        oTextRange.moveToElementText(tarea);
        for (end = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; end++) {
          oTextRange.moveStart('character', 1);
        }
        for (let i = 0; i <= end; i++) {
          if (tarea.value.charAt(i) === '\n') {
            end++;
          }
        }
      }
      return [start, end, tarea.value.slice(start, end)];
    }
  }
})();

/**
 * @method Selection set or get texarea position
 * @param {Object} textarea jquery dom
 * @param {Number} [start]
 * @param {Number} [end]
 *
 **/
function Selection () {
  let tarea = arguments[0];
  if (tarea.tagName !== 'TEXTAREA') {
    return
  }
  if (arguments['length'] > 1) {
    setPosition(tarea, arguments[1], arguments[2]);
  } else {
    return getPosition(tarea);
  }
}

/**
 * @method insertTxt
 * @param {Object} tarea element node
 * @param {String} txt
 * @param {Number} [start]
 * @param {Number} [end]
 *
 **/
function insertTxt (tarea, txt, start, end) {
  if (tarea.tagName !== 'TEXTAREA' || typeof txt === 'undefined') {
    return
  }
  txt = txt.toString();
  let thisStart;
  let thisEnd;
  if (typeof start === 'undefined') {
    let pos = getPosition(tarea);

    thisStart = pos[0];
    thisEnd = pos[1];
  } else {
    thisStart = parseInt(start);
    thisEnd = end || thisStart;
  }

  let allTxt = tarea.value;
  let frontTxt = allTxt.slice(0, thisStart)
  let endTxt = allTxt.slice(thisEnd);
  tarea.value = frontTxt + txt + endTxt;

  setPosition(tarea, frontTxt.length + txt.length, 0);
}

// exports
export default {insertTxt, Selection, setPosition, getPosition};
