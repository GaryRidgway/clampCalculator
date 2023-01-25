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

  // And calculate the rule.
  let userAuto = false;
  if (paramKeys.indexOf('auto') >= 0) {
    userAuto = true;
  }

  calcRule(true, false, userAuto);
}, false);

function getReferences() {
  let minWidth = document.getElementById('minWidth').value;
  let maxWidth = document.getElementById('maxWidth').value;
  let minFontSize = document.getElementById('minFontSize').value;
  let maxFontSize = document.getElementById('maxFontSize').value;
  let minFontSizePix = minFontSize * remFactor;
  let maxFontSizePix = maxFontSize * remFactor;

  let refs = {
    minWidth:       minWidth,
    maxWidth:       maxWidth,
    minFontSize:    minFontSize,
    maxFontSize:    maxFontSize,
    minFontSizePix: minFontSizePix,
    maxFontSizePix: maxFontSizePix
  };

  return refs;
}

function calcRule(auto=false, doAlert = true, userAuto = false) {
  const refs = getReferences();

  // !!!!
  if (
    auto &&
    !(
      paramKeys.indexOf('minWidth') >= 0 &&
      paramKeys.indexOf('minWidth') >= 0 &&
      paramKeys.indexOf('maxWidth') >= 0 &&
      paramKeys.indexOf('maxWidth') >= 0 &&
      urlParams.get('minFontSize') !== '' &&
      urlParams.get('minFontSize') !== '' &&
      urlParams.get('maxFontSize') !== '' &&
      urlParams.get('maxFontSize') !== ''
    )
  ) {
    return;
  }

  // !!!!!
  let valid = true;
  Object.keys(refs).forEach((element) => {
    const val = refs[element];
    const valueExists = (val !== '' && val !== 0);

    valid = valid && valueExists
  });

  if (
    !auto && !valid
  ) {
    if(doAlert) {
      swal(
        'Incorrect values',
        'The values entered are not complete, please ensure you have filled them all out correctly.',
        'error'
      );
    }

    return;
  }

  // And calculate the rule.
  const slope = calcSlope(refs.minWidth, refs.maxWidth, refs.minFontSizePix, refs.maxFontSizePix);
  const slopeAtWidth = Math.round(slope*100 * 10000) / 10000;
  const intercept = calcIntercept(slope, refs.minWidth, refs.minFontSizePix);
  const rIntercept = Math.round(intercept * 10000) / 10000;
  const operator = (intercept<0) ? '-' : '+';

  const prefVal = 'calc(' + slopeAtWidth + 'vw ' + operator + ' ' + Math.abs(rIntercept) +'rem)';
  const minFontVal = refs.minFontSize;
  const maxFontVal = refs.maxFontSize;

  const clampRule =  'clamp(' + minFontVal + 'rem, ' + prefVal + ', ' + maxFontVal + 'rem);';

  document.getElementById('output').innerHTML = clampRule;

  if (!auto || userAuto) {
    // https://stackoverflow.com/questions/56306153/domexception-on-calling-navigator-clipboard-readtext
    navigator.clipboard.writeText(clampRule).then(function(x) {
      const rule = document.createElement('div');
      rule.classList.add('preformatted');
      rule.textContent = clampRule;
      swal({
        title: 'Clamp rule copied to clipboard',
        content: rule,
        icon: 'success'
      });
    });
  }

  const refKeys = Object.keys(refs);

  let queryString = 
    '/?' + refKeys[0] + '=' + refs[refKeys[0]] + '&' +
    refKeys[1] + '=' + refs[refKeys[1]] + '&' +
    refKeys[2] + '=' + refs[refKeys[2]] + '&' +
    refKeys[3] + '=' + refs[refKeys[3]]
  ;

  if (paramKeys.indexOf('auto') >= 0 && (userAuto || !auto)) {
    queryString += '&auto';
  }

  window.history.pushState('', '', queryString);
}

function calcSlope(minWidth, maxWidth, minFontSize, maxFontSize) {
  let slope = (maxFontSize - minFontSize)/(maxWidth - minWidth);

  return slope;
}

function calcIntercept(slope, minWidth, minFontSize) {
  let intercept = (minFontSize - (slope * minWidth)) / remFactor;

  return intercept;
}



function replace(key) {
  // Check there's nothing wonky happening.
  if (paramKeys && paramKeys.indexOf(key) >= 0) {

    // Check that the dom contains one of these elements, and that the element is changeable.
    const element = document.getElementById(key);
    if (element && element.getAttribute('data-js-changeable') === 'true') {

      // If all is well, do the thing.
      document.getElementById(key).value = urlParams.get(key);
    }
  }
}