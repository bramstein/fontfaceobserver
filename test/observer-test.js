describe('Observer', function () {
  var Observer = fontface.Observer,
      Ruler = fontface.Ruler;

  describe('#constructor', function () {
    it('creates a new instance with the correct signature', function () {
      var observer = new Observer('my family', {});
      expect(observer, 'not to be', null);
      expect(observer.check, 'to be a function');
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

      expect(observer.variant, 'to equal', 'normal');
    });
  });

  describe('#getStyle', function () {
    it('creates the correct default style', function () {
      var observer = new Observer('my family', {});

      expect(observer.getStyle(), 'to equal', 'font-style:normal;font-variant:normal;font-weight:normal;font-stretch:stretch;font-feature-settings:normal;-moz-font-feature-settings:normal;-webkit-font-feature-settings:normal;');
    });

    it('passes through all descriptors', function () {
      var observer = new Observer('my family', {
        style: 'italic',
        variant: 'small-caps',
        weight: 'bold',
        stretch: 'condensed',
        featureSettings: '"kern" 1'
      });

      expect(observer.getStyle(), 'to equal', 'font-style:italic;font-variant:small-caps;font-weight:bold;font-stretch:condensed;font-feature-settings:"kern" 1;-moz-font-feature-settings:"kern" 1;-webkit-font-feature-settings:"kern" 1;');
    });
  });

  describe('#check', function () {
    this.timeout(5000);

    it('finds a font and resolve the promise', function (done) {
      var observer = new Observer('observer-test1', {}),
          ruler = new Ruler('hello');

      document.body.appendChild(ruler.getElement());

      ruler.setFont('monospace', '');
      var beforeWidth = ruler.getWidth();

      ruler.setFont('observer-test1, monospace', '');
      observer.check(null, 5000).then(function () {
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

      observer.check(null, 50).then(function () {
        done(new Error('Should not resolve'));
      }, function () {
        done();
      });
    });

    it('finds the font even if it is already loaded', function (done) {
      var observer = new Observer('observer-test3', {});

      observer.check(null, 5000).then(function () {
        observer.check(null, 5000).then(function () {
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

      ruler.setFont('observer-test4,monospace', '');

      observer.check('\u0021', 5000).then(function () {
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

      ruler.setFont('monospace', '');
      document.body.appendChild(ruler.getElement());

      var beforeWidth = ruler.getWidth();

      ruler.setFont('observer-test5,monospace', '');

      observer.check('\u4e2d\u56fd', 5000).then(function () {
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

      ruler.setFont('monospace', '');
      document.body.appendChild(ruler.getElement());

      var beforeWidth = ruler.getWidth();

      ruler.setFont('observer-test6,monospace', '');

      observer.check('\udbff\udfff', 5000).then(function () {
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

      observer.check(null, 50).then(function () {
        done(new Error('Should not be called'));
      }, function () {
        done();
      });
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
