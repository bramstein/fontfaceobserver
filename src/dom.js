export function onReady(callback) {
  document.body
    ? callback()
    : document.addEventListener
    ? document.addEventListener("DOMContentLoaded", function c() {
        document.removeEventListener("DOMContentLoaded", c);
        callback();
      })
    : document.attachEvent("onreadystatechange", function k() {
        if (
          "interactive" == document.readyState ||
          "complete" == document.readyState
        )
          document.detachEvent("onreadystatechange", k), callback();
      });
}
