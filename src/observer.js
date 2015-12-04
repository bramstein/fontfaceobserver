goog.provide('fontface.Observer');

goog.require('fontface.Ruler');
goog.require('dom');

goog.scope(function () {
  var Ruler = fontface.Ruler;

  /**
   * @constructor
   *
   * @param {string=} text Optional test string to use for detecting if a font is available.
   * @param {number=} timeout Optional timeout for giving up on font load detection and rejecting the promise (defaults to 3 seconds).
   */
  fontface.Observer = function (opt_text, opt_timeout) {
    /**
     * @type {string}
     */
    this.text = opt_text || 'BESbswy';

    /**
     * @type {number}
     */
    this.timeout = opt_timeout || Observer.DEFAULT_TIMEOUT;
  };

  var Observer = fontface.Observer;

  /**
   * @type {null|boolean}
   */
  Observer.HAS_WEBKIT_FALLBACK_BUG = null;

  /**
   * @type {number}
   */
  Observer.DEFAULT_TIMEOUT = 3000;

  /**
   * @return {string}
   */
  Observer.getUserAgent = function () {
    return window.navigator.userAgent;
  };

  /**
   * Returns true if this browser is WebKit and it has the fallback bug
   * which is present in WebKit 536.11 and earlier.
   *
   * @return {boolean}
   */
  Observer.hasWebKitFallbackBug = function () {
    if (Observer.HAS_WEBKIT_FALLBACK_BUG === null) {
      var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(Observer.getUserAgent());

      Observer.HAS_WEBKIT_FALLBACK_BUG = !!match &&
                                          (parseInt(match[1], 10) < 536 ||
                                           (parseInt(match[1], 10) === 536 &&
                                            parseInt(match[2], 10) <= 11));
    }
    return Observer.HAS_WEBKIT_FALLBACK_BUG;
  };

  /**
   * @private
   *
   * @param {number} widthA
   * @param {number} widthB
   * @param {number} widthC
   * @param {number} fallbackWidthA
   * @param {number} fallbackWidthB
   * @param {number} fallbackWidthC
   *
   * @return {boolean}
   */
  Observer.prototype.check = function (widthA, widthB, widthC, fallbackWidthA, fallbackWidthB, fallbackWidthC) {
    if ((widthA !== -1 && widthB !== -1) || (widthA !== -1 && widthC !== -1) || (widthB !== -1 && widthC !== -1)) {
      if (widthA === widthB || widthA === widthC || widthB === widthC) {
        // All values are the same, so the browser has most likely loaded the web font

        if (Observer.hasWebKitFallbackBug()) {
          // Except if the browser has the WebKit fallback bug, in which case we check to see if all
          // values are set to one of the last resort fonts.

          if (!((widthA === fallbackWidthA && widthB === fallbackWidthA && widthC === fallbackWidthA) ||
                (widthA === fallbackWidthB && widthB === fallbackWidthB && widthC === fallbackWidthB) ||
                (widthA === fallbackWidthC && widthB === fallbackWidthC && widthC === fallbackWidthC))) {
            // The width we got doesn't match any of the known last resort fonts, so let's assume fonts are loaded.
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * @param {Array.<fontface.Font>} fonts
   * @param {function((Error|null), fontface.Observer)} callback
   */
  Observer.prototype.load = function (fonts, callback) {
    var container = dom.createElement('div');
    var self = this;

    dom.waitForBody(function () {
      var start = Date.now();

      // Set up all the rulers
      for (var i = 0; i < fonts.length; i++) {
        var font = fonts[i];
        var style = font.getStyle();

        var rulerA = new Ruler(this.text, '"' + font['family'] + '",sans-serif', style);
        var rulerB = new Ruler(this.text, '"' + font['family'] + '",serif', style);
        var rulerC = new Ruler(this.text, '"' + font['family'] + '",monospace', style);

        var fallbackRulerA = new Ruler(this.text, 'sans-serif', style);
        var fallbackRulerB = new Ruler(this.text, 'serif', style);
        var fallbackRulerC = new Ruler(this.text, 'monospace', style);

        var widthA = -1;
        var widthB = -1;
        var widthC = -1;

        var fallbackWidthA = -1;
        var fallbackWidthB = -1;
        var fallbackWidthC = -1;

        dom.append(container, rulerA.getElement());
        dom.append(container, rulerB.getElement());
        dom.append(container, rulerC.getElement());

        dom.append(container, fallbackRulerA.getElement());
        dom.append(container, fallbackRulerB.getElement());
        dom.append(container, fallbackRulerC.getElement());

        rulerA.onResize(function (width) {
          widthA = width;
          self.check();
        });

        rulerB.onResize(function (width) {
          widthB = width;
          check();
        });

        rulerC.onResize(function (width) {
          widthC = width;
          check();
        });
      }

      // Add everything to the DOM
      dom.append(document.body, container);


    });

    var style = this.getStyle(),
        container = dom.createElement('div'),

        rulerA = new Ruler(this.text),
        rulerB = new Ruler(this.text),
        rulerC = new Ruler(this.text),

        widthA = -1,
        widthB = -1,
        widthC = -1,

        fallbackWidthA = -1,
        fallbackWidthB = -1,
        fallbackWidthC = -1,

        that = this,

        settled = false;

    /**
     * @private
     */
    function settle(success) {
      if (!settled) {
        settled = true;

        if (container.parentNode !== null) {
          dom.remove(container.parentNode, container);
        }
        callback(success === true ? null : new Error('Timeout'), that);
      }
    }

    /**
     * @private
     *
     * If metric compatible fonts are detected, one of the widths will be -1. This is
     * because a metric compatible font won't trigger a scroll event. We work around
     * this by considering a font loaded if at least two of the widths are the same.
     * Because we have three widths, this still prevents false positives.
     *
     * Cases:
     * 1) Font loads: both a, b and c are called and have the same value.
     * 2) Font fails to load: resize callback is never called and timeout happens.
     * 3) WebKit bug: both a, b and c are called and have the same value, but the
     *    values are equal to one of the last resort fonts, we ignore this and
     *    continue waiting until we get new values (or a timeout).
     */
    function check() {
      if ((widthA !== -1 && widthB !== -1) || (widthA !== -1 && widthC !== -1) || (widthB !== -1 && widthC !== -1)) {
        if (widthA === widthB || widthA === widthC || widthB === widthC) {
          // All values are the same, so the browser has most likely loaded the web font

          if (Observer.hasWebKitFallbackBug()) {
            // Except if the browser has the WebKit fallback bug, in which case we check to see if all
            // values are set to one of the last resort fonts.

            if (!((widthA === fallbackWidthA && widthB === fallbackWidthA && widthC === fallbackWidthA) ||
                  (widthA === fallbackWidthB && widthB === fallbackWidthB && widthC === fallbackWidthB) ||
                  (widthA === fallbackWidthC && widthB === fallbackWidthC && widthC === fallbackWidthC))) {
              // The width we got doesn't match any of the known last resort fonts, so let's assume fonts are loaded.
              settle(true);
            }
          } else {
            settle(true);
          }
        }
      }
    }

    dom.waitForBody(function () {
      var start = Date.now();

      rulerA.setFont('sans-serif', style);
      rulerB.setFont('serif', style);
      rulerC.setFont('monospace', style);

      dom.append(document.body, container);

      fallbackWidthA = rulerA.getWidth();
      fallbackWidthB = rulerB.getWidth();
      fallbackWidthC = rulerC.getWidth();

      function checkForTimeout() {
        var now = Date.now();

        if (now - start >= that.timeout) {
          settle(false);
        } else {
          var hidden = document['hidden'];
          if (hidden === true || hidden === undefined) {
            widthA = rulerA.getWidth();
            widthB = rulerB.getWidth();
            widthC = rulerC.getWidth();
            check();
          }
          setTimeout(checkForTimeout, 50);
        }
      }

      checkForTimeout();

      rulerA.onResize(function (width) {
        widthA = width;
        check();
      });

      rulerA.setFont('"' + that['family'] + '",sans-serif', style);

      rulerB.onResize(function (width) {
        widthB = width;
        check();
      });

      rulerB.setFont('"' + that['family'] + '",serif', style);

      rulerC.onResize(function (width) {
        widthC = width;
        check();
      });

      rulerC.setFont('"' + that['family'] + '",monospace', style);
    });
  };
});
