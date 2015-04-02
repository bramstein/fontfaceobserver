goog.provide('fontface.dom');

goog.scope(function () {
  var dom = fontface.dom;

  /**
   * @param {string} name
   * @return {Element}
   */
  dom.createElement = function (name) {
    return document.createElement(name);
  };

  /**
   * @param {string} text
   * @return {Text}
   */
  dom.createText = function (text) {
    return document.createTextNode(text);
  };

  /**
   * @param {Element} element
   * @param {string} style
   */
  dom.style = function (element, style) {
    element.style.cssText = style;
  };

  /**
   * @param {Node} parent
   * @param {Node} child
   */
  dom.append = function (parent, child) {
    parent.appendChild(child);
  };

  /**
   * @param {Node} parent
   * @param {Node} child
   */
  dom.remove = function (parent, child) {
    parent.removeChild(child);
  };

  /**
   * @param {function()} callback
   */
  dom.waitForBody = function (callback) {
    function check() {
      if (document.body) {
        callback();
      } else {
        setTimeout(check, 0);
      }
    }
    check();
  };
});
