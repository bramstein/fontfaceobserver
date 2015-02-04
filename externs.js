/**
 * @constructor
 *
 * @param {string} family
 * @param {Object} descriptors
 */
var FontFaceObserver = function (family, descriptors) {};

/**
 * @param {string=} opt_text
 *
 * @return {Promise.<FontFaceObserver>}
 */
FontFaceObserver.prototype.check = function (opt_text) {};

/**
 * @param {string=} opt_text
 *
 * @return {Promise.<number>}
 */
FontFaceObserver.prototype.available = function (opt_text) {};
