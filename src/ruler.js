goog.provide('fontface.Ruler');

goog.require('dom');

goog.scope(function () {
  /**
   * @constructor
   * @param {string} text
   */
  fontface.Ruler = function (text) {
    var style = 'display:inline-block;' +
                'position:absolute;' +
                'height:100%;' +
                'width:100%;' +
                'overflow:scroll;font-size:16px;';

    this.element = dom.createElement('div');
    this.element.setAttribute('aria-hidden', 'true');

    dom.append(this.element, dom.createText(text));

    this.collapsible = dom.createElement('span');
    this.expandable = dom.createElement('span');
    this.collapsibleInner = dom.createElement('span');
    this.expandableInner = dom.createElement('span');

    this.lastOffsetWidth = -1;

    dom.style(this.collapsible, style);
    dom.style(this.expandable, style);
    dom.style(this.expandableInner, style);
    dom.style(this.collapsibleInner, 'display:inline-block;width:200%;height:200%;font-size:16px;');

    dom.append(this.collapsible, this.collapsibleInner);
    dom.append(this.expandable, this.expandableInner);

    dom.append(this.element, this.collapsible);
    dom.append(this.element, this.expandable);
  };

  var Ruler = fontface.Ruler;

  /**
   * @return {Element}
   */
  Ruler.prototype.getElement = function () {
    return this.element;
  };

  /**
   * @param {string} family
   * @param {string} description
   */
  Ruler.prototype.setFont = function (family, description) {
    dom.style(this.element, 'min-width:20px;' +
                            'min-height:20px;' +
                            'display:inline-block;' +
                            'overflow:hidden;' +
                            'position:absolute;' +
                            'width:auto;' +
                            'margin:0;' +
                            'padding:0;' +
                            'top:-999px;' +
                            'left:-999px;' +
                            'white-space:nowrap;' +
                            'font-size:100px;' +
                            'font-family:' + family + ';' +
                            description);
  };

  /**
   * @return {number}
   */
  Ruler.prototype.getWidth = function () {
    return this.element.offsetWidth;
  };

  /**
   * @param {string} width
   */
  Ruler.prototype.setWidth = function (width) {
    this.element.style.width = width + 'px';
  };

  /**
   * @private
   *
   * @return {boolean}
   */
  Ruler.prototype.reset = function () {
    var offsetWidth = this.getWidth(),
        width = offsetWidth + 100;

    this.expandableInner.style.width = width + 'px';
    this.expandable.scrollLeft = width;
    this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;

    if (this.lastOffsetWidth !== offsetWidth) {
      this.lastOffsetWidth = offsetWidth;
      return true;
    } else {
      return false;
    }
  };

  /**
   * @private
   * @param {function(number)} callback
   */
  Ruler.prototype.onScroll = function (callback) {
    if (this.reset() && this.element.parentNode !== null) {
      callback(this.lastOffsetWidth);
    }
  };

  /**
   * @param {function(number)} callback
   */
  Ruler.prototype.onResize = function (callback) {
    var that = this;

    this.collapsible.addEventListener('scroll', function () {
      that.onScroll(callback);
    }, false);
    this.expandable.addEventListener('scroll', function () {
      that.onScroll(callback);
    }, false);
    this.reset();
  };
});
