goog.require('fontface.Observer');
goog.require('fontface.Font');

/**
 * @define {boolean} DEBUG
 */
var DEBUG = true;

window['Font'] = fontface.Font;
window['FontObserver'] = fontface.Observer;
window['FontObserver']['prototype']['load'] = fontface.Observer.prototype.load;
