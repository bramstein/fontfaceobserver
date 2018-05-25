import Ruler from "./Ruler.js";
import { onReady } from "./dom.js";

/** Class for FontFaceObserver. */
class FontFaceObserver {
  static Ruler = Ruler;

  /**
   * @type {null|boolean}
   */
  static HAS_WEBKIT_FALLBACK_BUG = null;

  /**
   * @type {null|boolean}
   */
  static HAS_SAFARI_10_BUG = null;

  /**
   * @type {null|boolean}
   */
  static SUPPORTS_STRETCH = null;

  /**
   * @type {null|boolean}
   */
  static SUPPORTS_NATIVE_FONT_LOADING = null;

  /**
   * @type {number}
   */
  static DEFAULT_TIMEOUT = 3000;

  /**
   * @return {string}
   */
  static getUserAgent() {
    return window.navigator.userAgent;
  }

  /**
   * @return {string}
   */
  static getNavigatorVendor() {
    return window.navigator.vendor;
  }

  /**
   * Returns true if this browser is WebKit and it has the fallback bug which is
   * present in WebKit 536.11 and earlier.
   *
   * @return {boolean}
   */
  static hasWebKitFallbackBug() {
    if (FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG === null) {
      const match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(
        FontFaceObserver.getUserAgent()
      );

      FontFaceObserver.HAS_WEBKIT_FALLBACK_BUG =
        !!match &&
        (parseInt(match[1], 10) < 536 ||
          (parseInt(match[1], 10) === 536 && parseInt(match[2], 10) <= 11));
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
  static hasSafari10Bug() {
    if (FontFaceObserver.HAS_SAFARI_10_BUG === null) {
      if (
        FontFaceObserver.supportsNativeFontLoading() &&
        /Apple/.test(FontFaceObserver.getNavigatorVendor())
      ) {
        const match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(
          FontFaceObserver.getUserAgent()
        );

        FontFaceObserver.HAS_SAFARI_10_BUG =
          !!match && parseInt(match[1], 10) < 603;
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
  static supportsNativeFontLoading() {
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
  static supportStretch() {
    if (FontFaceObserver.SUPPORTS_STRETCH === null) {
      const div = document.createElement("div");

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
  constructor(family, descriptors = {}) {
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
  load(text, timeout) {
    const that = this;
    const testString = text || "BESbswy";
    let timeoutId = 0;
    const timeoutValue = timeout || FontFaceObserver.DEFAULT_TIMEOUT;
    const start = that.getTime();

    return new Promise(function(resolve, reject) {
      if (
        FontFaceObserver.supportsNativeFontLoading() &&
        !FontFaceObserver.hasSafari10Bug()
      ) {
        const loader = new Promise(function(resolve, reject) {
          const check = function() {
            const now = that.getTime();

            if (now - start >= timeoutValue) {
              reject();
            } else {
              document.fonts
                .load(that.getStyle('"' + that["family"] + '"'), testString)
                .then(
                  function(fonts) {
                    if (fonts.length >= 1) {
                      resolve();
                    } else {
                      setTimeout(check, 25);
                    }
                  },
                  function() {
                    reject();
                  }
                );
            }
          };
          check();
        });

        const timer = new Promise(function(resolve, reject) {
          timeoutId = setTimeout(reject, timeoutValue);
        });

        Promise.race([timer, loader]).then(
          function() {
            clearTimeout(timeoutId);
            resolve(that);
          },
          function() {
            reject(that);
          }
        );
      } else {
        onReady(function() {
          const rulerA = new Ruler(testString);
          const rulerB = new Ruler(testString);
          const rulerC = new Ruler(testString);

          let widthA = -1;
          let widthB = -1;
          let widthC = -1;

          let fallbackWidthA = -1;
          let fallbackWidthB = -1;
          let fallbackWidthC = -1;

          const container = document.createElement("div");

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
            if (
              (widthA != -1 && widthB != -1) ||
              (widthA != -1 && widthC != -1) ||
              (widthB != -1 && widthC != -1)
            ) {
              if (widthA == widthB || widthA == widthC || widthB == widthC) {
                // All values are the same, so the browser has most likely
                // loaded the web font

                if (FontFaceObserver.hasWebKitFallbackBug()) {
                  // Except if the browser has the WebKit fallback bug, in which
                  // case we check to see if all values are set to one of the
                  // last resort fonts.

                  if (
                    (widthA == fallbackWidthA &&
                      widthB == fallbackWidthA &&
                      widthC == fallbackWidthA) ||
                    (widthA == fallbackWidthB &&
                      widthB == fallbackWidthB &&
                      widthC == fallbackWidthB) ||
                    (widthA == fallbackWidthC &&
                      widthB == fallbackWidthC &&
                      widthC == fallbackWidthC)
                  ) {
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
            const now = that.getTime();

            if (now - start >= timeoutValue) {
              removeContainer();
              reject(that);
            } else {
              const hidden = document["hidden"];
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

          rulerA.onResize(function(width) {
            widthA = width;
            check();
          });

          rulerA.setFont(that.getStyle('"' + that["family"] + '",sans-serif'));

          rulerB.onResize(function(width) {
            widthB = width;
            check();
          });

          rulerB.setFont(that.getStyle('"' + that["family"] + '",serif'));

          rulerC.onResize(function(width) {
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
  getStyle(family) {
    return [
      this.style,
      this.weight,
      FontFaceObserver.supportStretch() ? this.stretch : "",
      "100px",
      family
    ].join(" ");
  }
  /**
   * @private
   *
   * @return {number}
   */
  getTime() {
    return new Date().getTime();
  }
}

export default FontFaceObserver;
