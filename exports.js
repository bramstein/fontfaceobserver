goog.require('fontface.Observer');

/**
 * @define {boolean} DEBUG
 */
var DEBUG = true;

window['FontFaceObserver'] = fontface.Observer;
window['FontFaceObserver']['prototype']['check'] = fontface.Observer.prototype.check;

if (typeof module !== 'undefined') {
  module.exports = window['FontFaceObserver'];
}

