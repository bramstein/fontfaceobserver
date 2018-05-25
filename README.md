# Font Face Observer

[![Build Status](https://travis-ci.org/dmnsgn/fontfaceobserver.svg?branch=master)](https://travis-ci.org/dmnsgn/fontfaceobserver)
[![npm version](https://badge.fury.io/js/fontfaceobserver.svg)](https://www.npmjs.com/package/fontfaceobserver-es)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Font Face Observer is a small `@font-face` loader and monitor (3.5KB minified and 1.3KB gzipped) compatible with any webfont service. It will monitor when a webfont is loaded and notify you. It does not limit you in any way in where, when, or how you load your webfonts. Unlike the [Web Font Loader](https://github.com/typekit/webfontloader) Font Face Observer uses scroll events to detect font loads efficiently and with minimum overhead.

## Documentation

For details on how to use, check out the [documentation](https://dmnsgn.github.io/fontfaceobserver/).

## Installation

Font Face Observer comes with three bundles:

* A CommonJS bundle (`dist/fontfaceobserver.cjs.js`) for use in NodeJS:

```shell
npm install fontfaceobserver-es
```

```js
var FontFaceObserver = require("fontfaceobserver-es");

var font = new FontFaceObserver("My Family");

font.load().then(function() {
  console.log("My Family has loaded");
});
```

* An ES module bundle (`dist/fontfaceobserver.esm.js`) for the above and also directly in the browser:

```html
<script type="module" src="https://unpkg.com/fontfaceobserver-es@3.0.0/dist/fontfaceobserver.esm.js"></script>
```

```js
import FontFaceObserver from "fontfaceobserver-es";

const font = new FontFaceObserver("My Family");

font.load().then(function() {
  console.log("My Family has loaded");
});
```

* A UMD build (`dist/fontfaceobserver.umd.js`) mainly for browser without ES module support:

```js
<script src="https://unpkg.com/fontfaceobserver-es@3.0.0/dist/fontfaceobserver.umd.js"></script>
<script>
const font = new FontFaceObserver("My Family");

font.load().then(function() {
  console.log("My Family has loaded");
});
</script>
```

You'll need to include the required Polyfill for Promise support. See [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) and [core-js](https://github.com/zloirock/core-js#commonjs).

## Usage

Include your `@font-face` rules as usual. Fonts can be supplied by either a font service such as [Google Fonts](http://www.google.com/fonts), [Typekit](http://typekit.com), and [Webtype](http://webtype.com) or be self-hosted. You can set up monitoring for a single font family at a time:

```js
const font = new FontFaceObserver("My Family", {
  weight: 400
});

font.load().then(
  function() {
    console.log("Font is available");
  },
  function() {
    console.log("Font is not available");
  }
);
```

The `FontFaceObserver` constructor takes two arguments: the font-family name (required) and an object describing the variation (optional). The object can contain `weight`, `style`, and `stretch` properties. If a property is not present it will default to `normal`. To start loading the font, call the `load` method. It'll immediately return a new Promise that resolves when the font is loaded and rejected when the font fails to load.

If your font doesn't contain at least the latin "BESbwy" characters you must pass a custom test string to the `load` method.

```js
const font = new FontFaceObserver("My Family");

font.load("中国").then(
  function() {
    console.log("Font is available");
  },
  function() {
    console.log("Font is not available");
  }
);
```

The default timeout for giving up on font loading is 3 seconds. You can increase or decrease this by passing a number of milliseconds as the second parameter to the `load` method.

```js
var font = new FontFaceObserver("My Family");

font.load(null, 5000).then(
  function() {
    console.log("Font is available");
  },
  function() {
    console.log("Font is not available after waiting 5 seconds");
  }
);
```

Multiple fonts can be loaded by creating a `FontFaceObserver` instance for each.

```js
var fontA = new FontFaceObserver("Family A");
var fontB = new FontFaceObserver("Family B");

fontA.load().then(function() {
  console.log("Family A is available");
});

fontB.load().then(function() {
  console.log("Family B is available");
});
```

You may also load both at the same time, rather than loading each individually.

```js
var fontA = new FontFaceObserver("Family A");
var fontB = new FontFaceObserver("Family B");

Promise.all([fontA.load(), fontB.load()]).then(function() {
  console.log("Family A & B have loaded");
});
```

The following example emulates FOUT with Font Face Observer for `My Family`.

```js
var font = new FontFaceObserver("My Family");

font.load().then(function() {
  document.documentElement.className += " fonts-loaded";
});
```

```css
.fonts-loaded {
  body {
    font-family: My Family, sans-serif;
  }
}
```

## Browser support

FontFaceObserver has been tested and works on the following browsers:

* Chrome (desktop & Android)
* Firefox
* Opera
* Safari (desktop & iOS)
* IE8+
* Android WebKit

## License

Font Face Observer is licensed under the BSD License. Copyright 2014-2017 Bram Stein and Damien Seguin. All rights reserved.
