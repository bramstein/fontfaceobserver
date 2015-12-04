goog.provide('fontface.Observer');

goog.require('fontface.Ruler');
goog.require('dom');

goog.scope(function () {
  var Ruler = fontface.Ruler;

  /**
   * @constructor
   *
   * @param {string} family
   * @param {fontface.Descriptors=} opt_descriptors
   */
  fontface.Observer = function (family, opt_descriptors) {
    var descriptors = opt_descriptors || {};

    /**
     * @type {string}
     */
    this['family'] = family;

    /**
     * @type {string}
     */
    this['style'] = descriptors.style || 'normal';

    /**
     * @type {string}
     */
    this['variant'] = descriptors.variant || 'normal';

    /**
     * @type {string}
     */
    this['weight'] = descriptors.weight || 'normal';

    /**
     * @type {string}
     */
    this['stretch'] = descriptors.stretch || 'normal';

    /**
     * @type {string}
     */
    this['featureSettings'] = descriptors.featureSettings || 'normal';

    /**
     * @type {number|null}
     */
    this.timeoutId = null;
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
   * @return {string}
   */
  Observer.prototype.getStyle = function () {
    return 'font-style:' + this['style'] + ';' +
           'font-variant:' + this['variant'] + ';' +
           'font-weight:' + this['weight'] + ';' +
           'font-stretch:' + this['stretch'] + ';' +
           'font-feature-settings:' + this['featureSettings'] + ';' +
           '-moz-font-feature-settings:' + this['featureSettings'] + ';' +
           '-webkit-font-feature-settings:' + this['featureSettings'] + ';';
  };

  /**
   * @param {string=} text Optional test string to use for detecting if a font is available.
   * @param {number=} timeout Optional timeout for giving up on font load detection and rejecting the promise (defaults to 3 seconds).
   * @return {Promise.<fontface.Observer>}
   */
  Observer.prototype.check = function (text, timeout) {
    var testString = text || 'BESbswy',
        timeoutValue = timeout || Observer.DEFAULT_TIMEOUT,
        style = this.getStyle(),
        container = dom.createElement('div'),

        rulerA = new Ruler(testString),
        rulerB = new Ruler(testString),
        rulerC = new Ruler(testString),

        widthA = -1,
        widthB = -1,
        widthC = -1,

        fallbackWidthA = -1,
        fallbackWidthB = -1,
        fallbackWidthC = -1,

        that = this;

    return new Promise(function (resolve, reject) {
      /**
       * @private
       */
      function removeContainer() {
        if (container.parentNode !== null) {
          dom.remove(container.parentNode, container);
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
                removeContainer();
                clearTimeout(that.timeoutId);
                resolve(that);
              }
            } else {
              removeContainer();
              clearTimeout(that.timeoutId);
              resolve(that);
            }
          }
        }
      }

      dom.waitForBody(function () {
        var start = Date.now();

        rulerA.setFont('sans-serif', style);
        rulerB.setFont('serif', style);
        rulerC.setFont('monospace', style);

        dom.append(container, rulerA.getElement());
        dom.append(container, rulerB.getElement());
        dom.append(container, rulerC.getElement());

        dom.append(document.body, container);

        fallbackWidthA = rulerA.getWidth();
        fallbackWidthB = rulerB.getWidth();
        fallbackWidthC = rulerC.getWidth();

        function checkForTimeout() {
          var now = Date.now();

          if (now - start >= timeoutValue) {
            removeContainer();
            reject(that);
          } else {
            var hidden = document['hidden'];
            if (hidden === true || hidden === undefined) {
              widthA = rulerA.getWidth();
              widthB = rulerB.getWidth();
              widthC = rulerC.getWidth();
              check();
            }
            that.timeoutId = setTimeout(checkForTimeout, 50);
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
    });
  };
});
