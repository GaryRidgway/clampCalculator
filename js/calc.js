remFactor = 16;
let queryString;
let urlParams;
let paramKeys;

document.addEventListener('DOMContentLoaded', function () {
  queryString = window.location.search;
  urlParams = new URLSearchParams(queryString);
  paramKeys = Array.from(urlParams.keys());
  paramKeys.forEach((element) => {
    replace(element);
  });

  // If we have all the right entries, declare a yeehaw.
  if (
    paramKeys.indexOf('minWidth') >= 0 &&
    paramKeys.indexOf('maxWidth') >= 0 &&
    paramKeys.indexOf('minFont') >= 0 &&
    paramKeys.indexOf('maxFont') >= 0
  ) {
    console.log ('yeehaw.');
    // And calculate the rule.
    calcRule();
  }
}, false);

function calcSlope() {
  let minWidth = document.getElementById('minWidth').value;
  let maxWidth = document.getElementById('maxWidth').value;
  let minfont_size = document.getElementById('minFont').value * remFactor;
  let maxfont_size = document.getElementById('maxFont').value * remFactor;

  let slope = (maxfont_size - minfont_size)/(maxWidth - minWidth);

  return slope;
}

function calcIntercept() {
  let minWidth = document.getElementById('minWidth').value;
  let maxWidth = document.getElementById('maxWidth').value;
  let minfont_size = document.getElementById('minFont').value * remFactor;
  let maxfont_size = document.getElementById('maxFont').value * remFactor;

  let slope = calcSlope();
  let intercept = (minfont_size - (slope * minWidth)) / remFactor;

  return intercept;
}

function calcRule() {
  let slopeAtWidth = Math.round(calcSlope()*100 * 10000) / 10000;
  let intercept = Math.round(calcIntercept() * 10000) / 10000;
  let operator = (intercept<0) ? '-' : '+';

  let prefVal = 'calc(' + slopeAtWidth + 'vw ' + operator + ' ' + Math.abs(intercept) +'rem)';
  let minVal = document.getElementById('minFont').value;
  let maxVal = document.getElementById('maxFont').value;

  let clampRule =  'clamp(' + minVal + 'rem, ' + prefVal + ', ' + maxVal + 'rem);';

  document.getElementById('output').innerHTML = clampRule;
  navigator.clipboard.writeText(clampRule);
}

function replace(key) {
  // Check there's nothing wonky happening.
  if (paramKeys && paramKeys.indexOf(key) >= 0) {

    // Check that the dom contains one of these elements, and that the element is changeable.
    let element = document.getElementById(key);
    if (element && element.getAttribute('data-js-changeable') === 'true') {

      // If all is well, do the thing.
      document.getElementById(key).value = urlParams.get(key);
    }
  }
}