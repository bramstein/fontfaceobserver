goog.require('fontface.Observer');

/**
 * @define {boolean} DEBUG
 */
var DEBUG = true;

window['FontFaceObserver'] = fontface.Observer;
window['FontFaceObserver']['prototype']['check'] = window['FontFaceObserver']['prototype']['load'] = fontface.Observer.prototype.load;

if (typeof module !== 'undefined') {
  module.exports = window['FontFaceObserver'];
}

