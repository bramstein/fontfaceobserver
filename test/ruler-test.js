describe('Ruler', function () {
  var Ruler = fontface.Ruler,
      ruler = null;

  beforeEach(function () {
    ruler = new Ruler('hello');
    ruler.setFont('', '');
    ruler.setWidth(100);
    document.body.appendChild(ruler.getElement());
  });

  afterEach(function () {
    document.body.removeChild(ruler.getElement());
    ruler = null;
  });

  describe('#constructor', function () {
    it('creates a new instance with the correct signature', function () {
      expect(ruler, 'not to be', null);
      expect(ruler.onResize, 'to be a function');
      expect(ruler.setFont, 'to be a function');
    });
  });

  describe('#onResize', function () {
    it('detects expansion', function (done) {
      ruler.onResize(function (width) {
        expect(width, 'to equal', 200);
        done();
      });

      ruler.setWidth(200);
    });

    it('detects multiple expansions', function (done) {
      var first = true;

      ruler.onResize(function (width) {
        if (first) {
          expect(width, 'to equal', 200);
          ruler.setWidth(300);
          first = false;
        } else {
          expect(width, 'to equal', 300);
          done();
        }
      });

      ruler.setWidth(200);
    });

    it('detects collapse', function (done) {
      ruler.onResize(function (width) {
        expect(width, 'to equal', 50);
        done();
      });

      ruler.setWidth(50);
    });

    it('detects multiple collapses', function (done) {
      var first = true;

      ruler.onResize(function (width) {
        if (first) {
          expect(width, 'to equal', 70);
          ruler.setWidth(50);
          first = false;
        } else {
          expect(width, 'to equal', 50);
          done();
        }
      });

      ruler.setWidth(70);
    });

    it('detects a collapse and an expansion', function (done) {
      var first = true;

      ruler.onResize(function (width) {
        if (first) {
          expect(width, 'to equal', 70);
          ruler.setWidth(100);
          first = false;
        } else {
          expect(width, 'to equal', 100);
          done();
        }
      });

      ruler.setWidth(70);
    });

    it('detects an expansion and a collapse', function (done) {
      var first = true;

      ruler.onResize(function (width) {
        if (first) {
          expect(width, 'to equal', 200);
          ruler.setWidth(100);
          first = false;
        } else {
          expect(width, 'to equal', 100);
          done();
        }
      });

      ruler.setWidth(200);
    });
  });
});
