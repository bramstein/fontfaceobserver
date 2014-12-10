# Font Face Observer

Font Face Observer is a small `@font-face` loader and monitor (3.5Kb minified and 1.4Kb gzipped) compatible with any web-font service. It will monitor when a web font is applied to the page and notify you. It does not limit you in any way in where, when, or how you load your web fonts. Unlike the [Web Font Loader](https://github.com/typekit/webfontloader) Font Face Observer uses scroll events to detect font loads efficiently and with minimum overhead.

## How to use

Include your `@font-face` rules as usual. Fonts can be supplied by either a font service such as [Google Webfonts](http://www.google.com/webfonts), [Typekit](http://typekit.com), and [Webtype](http://webtype.com) or be self-hosted. It doesn't matter where, when, or how you load your fonts. You can set up monitoring for a single font family at a time:

    var observer = new FontFaceObserver('My Family', {
      weight: 400
    });

    observer.check().then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

The `FontFaceObserver` constructor takes two (required) arguments: the font family name and an object describing the variation. The object can contain `weight`, `style`, `stretch`, `variant`, and `featureSettings` properties. If a property is not present it will default to `normal`. To start observing font loads, call the `check` method. It'll immediately return a new Promise that resolves when the font is available and rejected when the font is not available.

If your font doesn't contain latin characters you can pass a custom test string to the `check` method.

    var observer = new FontFaceObserver('My Family', {});

    observer.check('中国').then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

## Browser support

FontFaceObserver has been tested and works on the following browsers:

* Chrome (desktop & Android)
* Firefox
* Opera
* Safari (desktop & iOS)
* IE9+
* Android WebKit

## License

FontFaceObserver is licensed under the BSD License. Copyright 2014 Bram Stein. All rights reserved.
