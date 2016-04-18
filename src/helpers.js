
// Convert an array-like (e.g., nodeList) to an array
function toArr(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}

// Get element by id
function $i(selector) {
  return document.getElementById(selector);
}

// Get elements by class name
function $c(selector) {
  return document.getElementsByClassName(selector);
}

// Get element by query selector
function $q(selector) {
  return document.querySelector(selector);
}

// Get elements by query selector
function $qa(selector) {
  return document.querySelectorAll(selector);
}

function isChildOf(maybeChild, maybeParent) {
  if (maybeChild === null) { return false; }
  if (maybeChild.parentNode === maybeParent) {
    return true;
  } else {
    return isChildOf(maybeChild.parentNode, maybeParent);
  }
}
