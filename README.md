# Font Face Observer

Font Face Observer is a small `@font-face` loader and monitor (3.1KB minified and 1.2KB gzipped) compatible with any web font service. It will monitor when a web font is applied to the page and notify you. It does not limit you in any way in where, when, or how you load your web fonts. Unlike the [Web Font Loader](https://github.com/typekit/webfontloader) Font Face Observer uses scroll events to detect font loads efficiently and with minimum overhead.

## How to use

Include your `@font-face` rules as usual. Fonts can be supplied by either a font service such as [Google Fonts](http://www.google.com/fonts), [Typekit](http://typekit.com), and [Webtype](http://webtype.com) or be self-hosted. It doesn't matter where, when, or how you load your fonts. You can set up monitoring for a single font family at a time:

    var observer = new FontFaceObserver('My Family', {
      weight: 400
    });

    observer.check().then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

The `FontFaceObserver` constructor takes two arguments: the font family name (required) and an object describing the variation (optional). The object can contain `weight`, `style`, `stretch`, `variant`, and `featureSettings` properties. If a property is not present it will default to `normal`. To start observing font loads, call the `check` method. It'll immediately return a new Promise that resolves when the font is available and rejected when the font is not available.

If your font doesn't contain latin characters you can pass a custom test string to the `check` method.

    var observer = new FontFaceObserver('My Family', {});

    observer.check('中国').then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

The default timeout for giving up on font loading is 3 seconds. You can increase or decrease this by passing a number of milliseconds as the second parameter to the `check` method.

    var observer = new FontFaceObserver('My Family', {});

    observer.check(null, 5000).then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available after waiting 5 seconds');
    });

## Installation

If you're using npm you can install Font Face Observer as a dependency:

    > npm install fontfaceobserver

You can then either include `fontfaceobserver.js` or `fontfaceobserver.standalone.js`. The former is Font Face Observer without dependencies. The latter includes a small [promise polyfill](https://github.com/bramstein/promis).

If you're not using npm, grab either `fontfaceobserver.js` or `fontfaceobserver.standalone.js` and include it in your project. 

## Browser support

FontFaceObserver has been tested and works on the following browsers:

* Chrome (desktop & Android)
* Firefox
* Opera
* Safari (desktop & iOS)
* IE9+
* Android WebKit

## License

FontFaceObserver is licensed under the BSD License. Copyright 2014-2015 Bram Stein. All rights reserved.
