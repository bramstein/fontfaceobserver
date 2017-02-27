describe('Observer', function () {
  var Observer = fontface.Observer,
      Ruler = fontface.Ruler;

  describe('#constructor', function () {
    it('creates a new instance with the correct signature', function () {
      var observer = new Observer('my family', {});
      expect(observer, 'not to be', null);
      expect(observer.load, 'to be a function');
    });

    it('parses descriptors', function () {
      var observer = new Observer('my family', {
        weight: 'bold'
      });

      expect(observer.family, 'to equal', 'my family');
      expect(observer.weight, 'to equal', 'bold');
    });

    it('defaults descriptors that are not given', function () {
      var observer = new Observer('my family', {
        weight: 'bold'
      });

      expect(observer.style, 'to equal', 'normal');
    });
  });

  describe('#getStyle', function () {
    it('creates the correct default style', function () {
      var observer = new Observer('my family', {});

      if (Observer.supportStretch()) {
        expect(observer.getStyle('sans-serif'), 'to equal', 'normal normal normal 100px sans-serif');
      } else {
        expect(observer.getStyle('sans-serif'), 'to equal', 'normal normal  100px sans-serif');
      }
    });

    it('passes through all descriptors', function () {
      var observer = new Observer('my family', {
        style: 'italic',
        weight: 'bold',
        stretch: 'condensed'
      });

      if (Observer.supportStretch()) {
        expect(observer.getStyle('sans-serif'), 'to equal', 'italic bold condensed 100px sans-serif');
      } else {
        expect(observer.getStyle('sans-serif'), 'to equal', 'italic bold  100px sans-serif');
      }
    });
  });

  describe('#load', function () {
    this.timeout(5000);

    it('finds a font and resolve the promise', function (done) {
      var observer = new Observer('observer-test1', {}),
          ruler = new Ruler('hello');

      document.body.appendChild(ruler.getElement());

      ruler.setFont('monospace', '');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test1, monospace');
      observer.load(null, 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);
          document.body.removeChild(ruler.getElement());
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('finds a font and resolves the promise even though the @font-face rule is not in the CSSOM yet', function (done) {
      var observer = new Observer('observer-test9', {}),
          ruler = new Ruler('hello');

      document.body.appendChild(ruler.getElement());

      ruler.setFont('monospace', '');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test9, monospace');
      observer.load(null, 10000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);
          document.body.removeChild(ruler.getElement());
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });

      // We don't use a style element here because IE9/10 have issues with
      // dynamically inserted @font-face rules.
      var link = document.createElement('link');

      link.rel = 'stylesheet';
      link.href = 'assets/late.css';

      document.head.appendChild(link);
    });

    it('finds a font and resolve the promise even when the page is RTL', function (done) {
      var observer = new Observer('observer-test8', {}),
          ruler = new Ruler('hello');

      document.body.dir = 'rtl';
      document.body.appendChild(ruler.getElement());

      ruler.setFont('monospace', '');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test1, monospace');
      observer.load(null, 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);
          document.body.removeChild(ruler.getElement());
          document.body.dir = 'ltr';
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });


    it('finds a font with spaces in the name and resolve the promise', function (done) {
      var observer = new Observer('Trebuchet W01 Regular', {}),
          ruler = new Ruler('hello');

      document.body.appendChild(ruler.getElement());

      ruler.setFont('100px monospace');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px "Trebuchet W01 Regular", monospace');
      observer.load(null, 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);
          document.body.removeChild(ruler.getElement());
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('loads a font with spaces and numbers in the name and resolve the promise', function (done) {
      var observer = new Observer('Neue Frutiger 1450 W04', {}),
          ruler = new Ruler('hello');

      document.body.appendChild(ruler.getElement());

      ruler.setFont('100px monospace');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px "Neue Frutiger 1450 W04", monospace');
      observer.load(null, 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);
          document.body.removeChild(ruler.getElement());
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('fails to find a font and reject the promise', function (done) {
      var observer = new Observer('observer-test2', {});

      observer.load(null, 50).then(function () {
        done(new Error('Should not resolve'));
      }, function () {
        done();
      });
    });

    it('finds the font even if it is already loaded', function (done) {
      var observer = new Observer('observer-test3', {});

      observer.load(null, 5000).then(function () {
        observer.load(null, 5000).then(function () {
          done();
        }, function () {
          done(new Error('Second call failed'));
        });
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('finds a font with a custom unicode range within ASCII', function (done) {
      var observer = new Observer('observer-test4', {}),
          ruler = new Ruler('\u0021');

      ruler.setFont('monospace', '');
      document.body.appendChild(ruler.getElement());

      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test4,monospace');

      observer.load('\u0021', 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);

          document.body.removeChild(ruler.getElement());
          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('finds a font with a custom unicode range outside ASCII (but within BMP)', function (done) {
      var observer = new Observer('observer-test5', {}),
          ruler = new Ruler('\u4e2d\u56fd');

      ruler.setFont('100px monospace');
      document.body.appendChild(ruler.getElement());

      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test5,monospace');

      observer.load('\u4e2d\u56fd', 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);

          document.body.removeChild(ruler.getElement());

          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('finds a font with a custom unicode range outside the BMP', function (done) {
      var observer = new Observer('observer-test6', {}),
          ruler = new Ruler('\udbff\udfff');

      ruler.setFont('100px monospace');
      document.body.appendChild(ruler.getElement());

      var beforeWidth = ruler.getWidth();

      ruler.setFont('100px observer-test6,monospace');

      observer.load('\udbff\udfff', 5000).then(function () {
        var activeWidth = ruler.getWidth();

        expect(activeWidth, 'not to equal', beforeWidth);

        setTimeout(function () {
          var afterWidth = ruler.getWidth();

          expect(afterWidth, 'to equal', activeWidth);
          expect(afterWidth, 'not to equal', beforeWidth);

          document.body.removeChild(ruler.getElement());

          done();
        }, 0);
      }, function () {
        done(new Error('Timeout'));
      });
    });

    it('fails to find the font if it is available but does not contain the test string', function (done) {
      var observer = new Observer('observer-test7', {});

      observer.load(null, 50).then(function () {
        done(new Error('Should not be called'));
      }, function () {
        done();
      });
    });

    xit('finds a locally installed font', function (done) {
      var observer = new Observer('sans-serif', {});

      observer.load(null, 50).then(function () {
        done();
      }, function () {
        done(new Error('Did not detect local font'));
      });
    });

    xit('finds a locally installed font with the same metrics as the a fallback font (on OS X)', function (done) {
      var observer = new Observer('serif', {});

      observer.load(null, 50).then(function () {
        done();
      }, function () {
        done(new Error('Did not detect local font'));
      });
    });
  });

  describe('hasSafari10Bug', function () {
    var getUserAgent = null;
    var getNavigatorVendor = null;
    var supportsNativeFontLoading = null;

    beforeEach(function () {
      Observer.HAS_SAFARI_10_BUG = null;

      getUserAgent = sinon.stub(Observer, 'getUserAgent');
      getNavigatorVendor = sinon.stub(Observer, 'getNavigatorVendor');
      supportsNativeFontLoading = sinon.stub(Observer, 'supportsNativeFontLoading');
    });

    afterEach(function () {
      getUserAgent.restore();
      getNavigatorVendor.restore();
      supportsNativeFontLoading.restore();
    });

    it('returns false when the user agent is not WebKit', function () {
      getUserAgent.returns('Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0');
      getNavigatorVendor.returns('Google');
      supportsNativeFontLoading.returns(true);

      expect(Observer.hasSafari10Bug(), 'to be false');
    });

    it('returns true if the browser is an affected version of Safari 10', function () {
      getUserAgent.returns('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14');
      getNavigatorVendor.returns('Apple');
      supportsNativeFontLoading.returns(true);

      expect(Observer.hasSafari10Bug(), 'to be true');
    });

    it('returns true if the browser is an WebView with an affected version of Safari 10', function () {
      getUserAgent.returns('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/602.2.14 (KHTML, like Gecko) FxiOS/6.1 Safari/602.2.14');
      getNavigatorVendor.returns('Apple');
      supportsNativeFontLoading.returns(true);

      expect(Observer.hasSafari10Bug(), 'to be true');
    });

    it('returns false in older versions of Safari', function () {
      getUserAgent.returns('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/9.3.2 Safari/537.75.14');
      getNavigatorVendor.returns('Apple');
      supportsNativeFontLoading.returns(false);

      expect(Observer.hasSafari10Bug(), 'to be false');
    });

    it('returns false in newer versions of Safari', function () {
      getUserAgent.returns('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.20 (KHTML, like Gecko) Version/10.1 Safari/603.1.20');
      getNavigatorVendor.returns('Apple');
      supportsNativeFontLoading.returns(true);

      expect(Observer.hasSafari10Bug(), 'to be false');
    });
  });

  describe('hasWebKitFallbackBug', function () {
    var getUserAgent = null;

    beforeEach(function () {
      Observer.HAS_WEBKIT_FALLBACK_BUG = null;

      getUserAgent = sinon.stub(Observer, 'getUserAgent');
    });

    afterEach(function () {
      getUserAgent.restore();
    });

    it('returns false when the user agent is not WebKit', function () {
      getUserAgent.returns('Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0');

      expect(Observer.hasWebKitFallbackBug(), 'to be false');
    });

    it('returns false when the user agent is WebKit but the bug is not present', function () {
      getUserAgent.returns('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.12 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/536.12');

      expect(Observer.hasWebKitFallbackBug(), 'to be false');
    });

    it('returns true when the user agent is WebKit and the bug is present', function () {
      getUserAgent.returns('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/536.11');

      expect(Observer.hasWebKitFallbackBug(), 'to be true');
    });

    it('returns true when the user agent is WebKit and the bug is present in an old version', function () {
      getUserAgent.returns('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/535.19');

      expect(Observer.hasWebKitFallbackBug(), 'to be true');
    });

    it('caches the results', function () {
      getUserAgent.returns('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/536.11');

      expect(Observer.hasWebKitFallbackBug(), 'to be true');

      getUserAgent.returns('Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0');

      expect(Observer.hasWebKitFallbackBug(), 'to be true');
    });
  });
});
