describe('dom', function () {
  var dom = fontface.dom;

  describe('createElement', function () {
    it('creates an element', function () {
      expect(dom.createElement('div'), 'not to be null');
      expect(dom.createElement('div').nodeName, 'to equal', 'DIV');
    });
  });

  describe('createText', function () {
    it('creates a text node', function () {
      expect(dom.createText('hello'), 'not to be null');
      expect(dom.createText('world').textContent, 'to equal', 'world');
    });
  });

  describe('style', function () {
    it('sets the style', function () {
      var el = dom.createElement('div');

      dom.style(el, 'font-size:12px');

      expect(el.style.fontSize, 'to equal', '12px');
    });
  });

  describe('append', function () {
    it('adds a child node', function () {
      var parent = dom.createElement('div');

      dom.append(parent, dom.createElement('div'));

      expect(parent.childNodes.length, 'to equal', 1);

      dom.append(parent, dom.createElement('div'));

      expect(parent.childNodes.length, 'to equal', 2);
    });
  });

  describe('remove', function () {
    it('removes child nodes', function () {
      var parent = dom.createElement('div'),
          child1 = dom.createElement('div'),
          child2 = dom.createElement('div');

      dom.append(parent, child1);
      dom.append(parent, child2);

      dom.remove(parent, child1);
      expect(parent.childNodes.length, 'to equal', 1);

      dom.remove(parent, child2);
      expect(parent.childNodes.length, 'to equal', 0);
    });
  });

  describe('waitForBody', function () {
    it('waits for the body', function (done) {
      dom.waitForBody(function () {
        expect(document.body, 'to be an object');
        done();
      });
    });
  });
});
