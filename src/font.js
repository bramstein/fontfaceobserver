goog.provide('fontface.Font');

goog.scope(function () {
  /**
   * @constructor
   *
   * @param {string} family
   * @param {fontface.Descriptors=} opt_descriptors
   */
  fontface.Font = function (family, opt_descriptors) {
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
  };

  var Font = fontface.Font;

  /**
   * @return {string}
   */
  Font.prototype.getStyle = function () {
    return 'font-style:' + this['style'] + ';' +
           'font-variant:' + this['variant'] + ';' +
           'font-weight:' + this['weight'] + ';' +
           'font-stretch:' + this['stretch'] + ';' +
           'font-feature-settings:' + this['featureSettings'] + ';' +
           '-moz-font-feature-settings:' + this['featureSettings'] + ';' +
           '-webkit-font-feature-settings:' + this['featureSettings'] + ';';
  };
});
