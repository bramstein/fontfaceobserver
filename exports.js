goog.require('fontface.Observer');

/**
 * @define {boolean} DEBUG
 */
var DEBUG = true;

if (typeof module !== 'undefined') {
  module.exports = fontface.Observer;
  module.exports.prototype.check = fontface.Observer.prototype.check;
} else {
  window['FontFaceObserver'] = fontface.Observer;
  window['FontFaceObserver']['prototype']['check'] = fontface.Observer.prototype.check;
}
