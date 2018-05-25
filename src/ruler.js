const styles = {
  maxWidth: "none",
  display: "inline-block",
  position: "absolute",
  height: "100%",
  width: "100%",
  overflow: "scroll",
  fontSize: "16px"
};

const collapsibleInnerStyles = {
  display: "inline-block",
  height: "200%",
  width: "200%",
  fontSize: "16px",
  maxWidth: "none"
};

const fontStyle = {
  maxWidth: "none",
  minWidth: "20px",
  minHeight: "20px",
  display: "inline-block",
  overflow: "hidden",
  position: "absolute",
  width: "auto",
  margin: "0",
  padding: "0",
  top: "-999px",
  whiteSpace: "nowrap",
  fontSynthesis: "none"
};

class Ruler {
  /**
   *
   * @param {string} text
   */
  constructor(text) {
    this.element = document.createElement("div");
    this.element.setAttribute("aria-hidden", "true");

    this.element.appendChild(document.createTextNode(text));

    this.collapsible = document.createElement("span");
    this.expandable = document.createElement("span");
    this.collapsibleInner = document.createElement("span");
    this.expandableInner = document.createElement("span");

    this.lastOffsetWidth = -1;

    Object.assign(this.collapsible.style, styles);
    Object.assign(this.expandable.style, styles);
    Object.assign(this.expandableInner.style, styles);
    Object.assign(this.collapsibleInner.style, collapsibleInnerStyles);

    this.collapsible.appendChild(this.collapsibleInner);
    this.expandable.appendChild(this.expandableInner);

    this.element.appendChild(this.collapsible);
    this.element.appendChild(this.expandable);
  }

  /**
   * @return {Element}
   */
  getElement() {
    return this.element;
  }

  /**
   * @param {string} font
   */
  setFont(font) {
    Object.assign(this.element.style, { ...fontStyle, font });
  }

  /**
   * @return {number}
   */
  getWidth() {
    return this.element.offsetWidth;
  }

  /**
   * @param {string} width
   */
  setWidth(width) {
    this.element.style.width = width + "px";
  }

  /**
   * @private
   *
   * @return {boolean}
   */
  reset() {
    const offsetWidth = this.getWidth();
    const width = offsetWidth + 100;

    this.expandableInner.style.width = width + "px";
    this.expandable.scrollLeft = width;
    this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;

    if (this.lastOffsetWidth !== offsetWidth) {
      this.lastOffsetWidth = offsetWidth;
      return true;
    } else {
      return false;
    }
  }

  /**
   * @private
   * @param {function(number)} callback
   */
  onScroll(callback) {
    if (this.reset() && this.element.parentNode !== null) {
      callback(this.lastOffsetWidth);
    }
  }

  /**
   * @param {function(number)} callback
   */
  onResize(callback) {
    var that = this;

    function onScroll() {
      that.onScroll(callback);
    }

    this.collapsible.addEventListener("scroll", onScroll);
    this.expandable.addEventListener("scroll", onScroll);
    this.reset();
  }
}

export default Ruler;
