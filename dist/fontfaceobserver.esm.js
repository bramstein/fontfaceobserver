/* Font Face Observer v3.2.0 - © Bram Stein - Damien Seguin. License: BSD-3-Clause */
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var styles = {
  maxWidth: "none",
  display: "inline-block",
  position: "absolute",
  height: "100%",
  width: "100%",
  overflow: "scroll",
  fontSize: "16px"
};

var collapsibleInnerStyles = {
  display: "inline-block",
  height: "200%",
  width: "200%",
  fontSize: "16px",
  maxWidth: "none"
};

var fontStyle = {
  maxWidth: "none",
  minWidth: "20px",
  minHeight: "20px",
  display: "inline-block",
  overflow: "hidden",
  position: "absolute",
  width: "auto",
  margin: "0",
  padding: "0",
  top: "-999px",
  whiteSpace: "nowrap",
  fontSynthesis: "none"
};

var Ruler = function () {
  /**
   *
   * @param {string} text
   */
  function Ruler(text) {
    classCallCheck(this, Ruler);

    this.element = document.createElement("div");
    this.element.setAttribute("aria-hidden", "true");

    this.element.appendChild(document.createTextNode(text));

    this.collapsible = document.createElement("span");
    this.expandable = document.createElement("span");
    this.collapsibleInner = document.createElement("span");
    this.expandableInner = document.createElement("span");

    this.lastOffsetWidth = -1;

    Object.assign(this.collapsible.style, styles);
    Object.assign(this.expandable.style, styles);
    Object.assign(this.expandableInner.style, styles);
    Object.assign(this.collapsibleInner.style, collapsibleInnerStyles);

    this.collapsible.appendChild(this.collapsibleInner);
    this.expandable.appendChild(this.expandableInner);

    this.element.appendChild(this.collapsible);
    this.element.appendChild(this.expandable);
  }

  /**
   * @return {Element}
   */


  createClass(Ruler, [{
    key: "getElement",
    value: function getElement() {
      return this.element;
    }

    /**
     * @param {string} font
     */

  }, {
    key: "setFont",
    value: function setFont(font) {
      Object.assign(this.element.style, _extends({}, fontStyle, { font: font }));
    }

    /**
     * @return {number}
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.element.offsetWidth;
    }

    /**
     * @param {string} width
     */

  }, {
    key: "setWidth",
    value: function setWidth(width) {
      this.element.style.width = width + "px";
    }

    /**
     * @private
     *
     * @return {boolean}
     */

  }, {
    key: "reset",
    value: function reset() {
      var offsetWidth = this.getWidth();
      var width = offsetWidth + 100;

      this.expandableInner.style.width = width + "px";
      this.expandable.scrollLeft = width;
      this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;

      if (this.lastOffsetWidth !== offsetWidth) {
        this.lastOffsetWidth = offsetWidth;
        return true;
      } else {
        return false;
      }
    }

    /**
     * @private
     * @param {function(number)} callback
     */

  }, {
    key: "onScroll",
    value: function onScroll(callback) {
      if (this.reset() && this.element.parentNode !== null) {
        callback(this.lastOffsetWidth);
      }
    }

    /**
     * @param {function(number)} callback
     */

  }, {
    key: "onResize",
    value: function onResize(callback) {
      var that = this;

      function onScroll() {
        that.onScroll(callback);
      }

      this.collapsible.addEventListener("scroll", onScroll);
      this.expandable.addEventListener("scroll", onScroll);
      this.reset();
    }
  }]);
  return Ruler;
}();

function onReady(callback) {
  document.body ? callback() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function c() {
    document.removeEventListener("DOMContentLoaded", c);
    callback();
  }) : document.attachEvent("onreadystatechange", function k() {
    if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", k), callback();
  });
}

/** Class for FontFaceObserver. */

var FontFaceObserver = function () {
  createClass(FontFaceObserver, null, [{
    key: "getUserAgent",


    /**
     * @return {string}
     */


    /**
     * @type {null|boolean}
     */


    /**
     * @type {null|boolean}
     */
    value: function getUserAgent() {
      return window.navigator.userAgent;
    }

    /**
     * @return {string}
     */


    /**
     * @type {number}
     */


    /**
     * @type {null|boolean}
     */


    /**
     * @type {null|boolean}
     */

  }, {
    key: "getNavigatorVendor",
    value: function getNavigatorVendor() {
      return window.navigator.vendor;
    }

    /**
     * Returns true if this browser is WebKit and it has the fallback bug which is
     * present in WebKit 536.11 and earlier.
     *
     * @return {boolean}
     */

  }, {
    key: "hasWebKitFallbackBug",
    value: function hasWebKitFallbackBug() {
      if (FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG === null) {
        var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(FontFaceObserver.getUserAgent());

        FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG = !!match && (parseInt(match[1], 10) < 536 || parseInt(match[1], 10) === 536 && parseInt(match[2], 10) <= 11);
      }
      return FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG;
    }

    /**
     * Returns true if the browser has the Safari 10 bugs. The native font load
     * API in Safari 10 has two bugs that cause the document.fonts.load and
     * FontFace.prototype.load methods to return promises that don't reliably get
     * settled.
     *
     * The bugs are described in more detail here:
     *  - https://bugs.webkit.org/show_bug.cgi?id=165037
     *  - https://bugs.webkit.org/show_bug.cgi?id=164902
     *
     * If the browser is made by Apple, and has native font loading support, it is
     * potentially affected. But the API was fixed around AppleWebKit version 603,
     * so any newer versions that that does not contain the bug.
     *
     * @return {boolean}
     */

  }, {
    key: "hasSafari10Bug",
    value: function hasSafari10Bug() {
      if (FontFaceObserver.HAS_SAFARI_10_BUG === null) {
        if (FontFaceObserver.supportsNativeFontLoading() && /Apple/.test(FontFaceObserver.getNavigatorVendor())) {
          var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(FontFaceObserver.getUserAgent());

          FontFaceObserver.HAS_SAFARI_10_BUG = !!match && parseInt(match[1], 10) < 603;
        } else {
          FontFaceObserver.HAS_SAFARI_10_BUG = false;
        }
      }
      return FontFaceObserver.HAS_SAFARI_10_BUG;
    }

    /**
     * Returns true if the browser supports the native font loading API.
     *
     * @return {boolean}
     */

  }, {
    key: "supportsNativeFontLoading",
    value: function supportsNativeFontLoading() {
      if (FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING === null) {
        FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING = !!document["fonts"];
      }
      return FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING;
    }

    /**
     * Returns true if the browser supports font-style in the font short-hand
     * syntax.
     *
     * @return {boolean}
     */

  }, {
    key: "supportStretch",
    value: function supportStretch() {
      if (FontFaceObserver.SUPPORTS_STRETCH === null) {
        var div = document.createElement("div");

        try {
          div.style.font = "condensed 100px sans-serif";
        } catch (e) {}
        FontFaceObserver.SUPPORTS_STRETCH = div.style.font !== "";
      }

      return FontFaceObserver.SUPPORTS_STRETCH;
    }

    /**
     * @typedef {Object} Descriptors
     * @property {string|undefined} style
     * @property {string|undefined} weight
     * @property {string|undefined} stretch
     */
    /**
     *
     * @param {string} family font-family name (required)
     * @param {Descriptors} descriptors an object describing the variation
     * (optional). The object can contain `weight`, `style`, and `stretch`
     * properties. If a property is not present it will default to `normal`.
     */

  }]);

  function FontFaceObserver(family) {
    var descriptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, FontFaceObserver);

    this.family = family;

    this.style = descriptors.style || "normal";
    this.weight = descriptors.weight || "normal";
    this.stretch = descriptors.stretch || "normal";

    return this;
  }

  /**
   * @param {string=} text Optional test string to use for detecting if a font
   * is available.
   * @param {number=} timeout Optional timeout for giving up on font load
   * detection and rejecting the promise (defaults to 3 seconds).
   * @return {Promise.<FontFaceObserver>}
   */


  createClass(FontFaceObserver, [{
    key: "load",
    value: function load(text, timeout) {
      var that = this;
      var testString = text || "BESbswy";
      var timeoutId = 0;
      var timeoutValue = timeout || FontFaceObserver.DEFAULT_TIMEOUT;
      var start = that.getTime();

      return new Promise(function (resolve, reject) {
        if (FontFaceObserver.supportsNativeFontLoading() && !FontFaceObserver.hasSafari10Bug()) {
          var loader = new Promise(function (resolve, reject) {
            var check = function check() {
              var now = that.getTime();

              if (now - start >= timeoutValue) {
                reject();
              } else {
                document.fonts.load(that.getStyle('"' + that["family"] + '"'), testString).then(function (fonts) {
                  if (fonts.length >= 1) {
                    resolve();
                  } else {
                    setTimeout(check, 25);
                  }
                }, function () {
                  reject();
                });
              }
            };
            check();
          });

          var timer = new Promise(function (resolve, reject) {
            timeoutId = setTimeout(reject, timeoutValue);
          });

          Promise.race([timer, loader]).then(function () {
            clearTimeout(timeoutId);
            resolve(that);
          }, function () {
            reject(that);
          });
        } else {
          onReady(function () {
            var rulerA = new Ruler(testString);
            var rulerB = new Ruler(testString);
            var rulerC = new Ruler(testString);

            var widthA = -1;
            var widthB = -1;
            var widthC = -1;

            var fallbackWidthA = -1;
            var fallbackWidthB = -1;
            var fallbackWidthC = -1;

            var container = document.createElement("div");

            /**
             * @private
             */
            function removeContainer() {
              if (container.parentNode !== null) {
                container.parentNode.removeChild(container);
              }
            }

            /**
             * @private
             *
             * If metric compatible fonts are detected, one of the widths will be
             * -1. This is because a metric compatible font won't trigger a scroll
             * event. We work around this by considering a font loaded if at least
             * two of the widths are the same. Because we have three widths, this
             * still prevents false positives.
             *
             * Cases:
             * 1) Font loads: both a, b and c are called and have the same value.
             * 2) Font fails to load: resize callback is never called and timeout
             *    happens.
             * 3) WebKit bug: both a, b and c are called and have the same value,
             *    but the values are equal to one of the last resort fonts, we
             *    ignore this and continue waiting until we get new values (or a
             *    timeout).
             */
            function check() {
              if (widthA != -1 && widthB != -1 || widthA != -1 && widthC != -1 || widthB != -1 && widthC != -1) {
                if (widthA == widthB || widthA == widthC || widthB == widthC) {
                  // All values are the same, so the browser has most likely
                  // loaded the web font

                  if (FontFaceObserver.hasWebKitFallbackBug()) {
                    // Except if the browser has the WebKit fallback bug, in which
                    // case we check to see if all values are set to one of the
                    // last resort fonts.

                    if (widthA == fallbackWidthA && widthB == fallbackWidthA && widthC == fallbackWidthA || widthA == fallbackWidthB && widthB == fallbackWidthB && widthC == fallbackWidthB || widthA == fallbackWidthC && widthB == fallbackWidthC && widthC == fallbackWidthC) {
                      // The width we got matches some of the known last resort
                      // fonts, so let's assume we're dealing with the last resort
                      // font.
                      return;
                    }
                  }
                  removeContainer();
                  clearTimeout(timeoutId);
                  resolve(that);
                }
              }
            }

            // This ensures the scroll direction is correct.
            container.dir = "ltr";

            rulerA.setFont(that.getStyle("sans-serif"));
            rulerB.setFont(that.getStyle("serif"));
            rulerC.setFont(that.getStyle("monospace"));

            container.appendChild(rulerA.getElement());
            container.appendChild(rulerB.getElement());
            container.appendChild(rulerC.getElement());

            document.body.appendChild(container);

            fallbackWidthA = rulerA.getWidth();
            fallbackWidthB = rulerB.getWidth();
            fallbackWidthC = rulerC.getWidth();

            function checkForTimeout() {
              var now = that.getTime();

              if (now - start >= timeoutValue) {
                removeContainer();
                reject(that);
              } else {
                var hidden = document["hidden"];
                if (hidden === true || hidden === undefined) {
                  widthA = rulerA.getWidth();
                  widthB = rulerB.getWidth();
                  widthC = rulerC.getWidth();
                  check();
                }
                timeoutId = setTimeout(checkForTimeout, 50);
              }
            }

            checkForTimeout();

            rulerA.onResize(function (width) {
              widthA = width;
              check();
            });

            rulerA.setFont(that.getStyle('"' + that["family"] + '",sans-serif'));

            rulerB.onResize(function (width) {
              widthB = width;
              check();
            });

            rulerB.setFont(that.getStyle('"' + that["family"] + '",serif'));

            rulerC.onResize(function (width) {
              widthC = width;
              check();
            });

            rulerC.setFont(that.getStyle('"' + that["family"] + '",monospace'));
          });
        }
      });
    }

    /**
     * @private
     *
     * @param {string} family
     * @return {string}
     */

  }, {
    key: "getStyle",
    value: function getStyle(family) {
      return [this.style, this.weight, FontFaceObserver.supportStretch() ? this.stretch : "", "100px", family].join(" ");
    }
    /**
     * @private
     *
     * @return {number}
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return new Date().getTime();
    }
  }]);
  return FontFaceObserver;
}();

FontFaceObserver.Ruler = Ruler;
FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG = null;
FontFaceObserver.HAS_SAFARI_10_BUG = null;
FontFaceObserver.SUPPORTS_STRETCH = null;
FontFaceObserver.SUPPORTS_NATIVE_FONT_LOADING = null;
FontFaceObserver.DEFAULT_TIMEOUT = 3000;

export default FontFaceObserver;
