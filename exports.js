goog.require('fontface.Observer');

if (typeof module !== 'undefined') {
  module.exports = fontface.Observer;
} else {
  window['FontFaceObserver'] = fontface.Observer;
  window['FontFaceObserver']['prototype']['load'] = fontface.Observer.prototype.load;
}
