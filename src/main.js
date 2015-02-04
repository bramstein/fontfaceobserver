goog.require('fontface.Observer');

/**
 * @define {boolean} DEBUG
 */
var DEBUG = true;

window['FontFaceObserver'] = fontface.Observer;
window['FontFaceObserver']['prototype']['check'] = fontface.Observer.prototype.check;
window['FontFaceObserver']['prototype']['available'] = fontface.Observer.prototype.available;
