// Taken from https://gist.github.com/hsablonniere/2581101
if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded, bubbleUp, parent) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    var parent = parent || this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom,
        hasScrolled = false;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
      hasScrolled = true;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
      hasScrolled = true;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
      hasScrolled = true;
    }

    if (!hasScrolled && bubbleUp) {
      this.scrollIntoViewIfNeeded.call(this, centerIfNeeded, bubbleUp, parent.parentNode);
    }
  };
}