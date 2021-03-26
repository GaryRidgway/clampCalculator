remFactor = 16;

function calcSlope() {
  let minwidth = document.getElementById('minwidth').value;
  let maxwidth = document.getElementById('maxwidth').value;
  let minfont_size = document.getElementById('minfont-size').value * remFactor;
  let maxfont_size = document.getElementById('maxfont-size').value * remFactor;

  let slope = (maxfont_size - minfont_size)/(maxwidth - minwidth);

  return slope;
}

function calcIntercept() {
  let minwidth = document.getElementById('minwidth').value;
  let maxwidth = document.getElementById('maxwidth').value;
  let minfont_size = document.getElementById('minfont-size').value * remFactor;
  let maxfont_size = document.getElementById('maxfont-size').value * remFactor;

  let slope = calcSlope();
  let intercept = (minfont_size - (slope * minwidth)) / remFactor;

  return intercept;
}

function calcRule() {
  let slopeAtWidth = Math.round(calcSlope()*100 * 10000) / 10000;
  let intercept = Math.round(calcIntercept() * 10000) / 10000;
  let operator = (intercept<0) ? '+' : '-';

  let prefVal = 'calc(' + slopeAtWidth + 'vw ' + operator + ' ' + Math.abs(intercept) +'rem)';
  let minVal = document.getElementById('minfont-size').value;
  let maxVal = document.getElementById('maxfont-size').value;

  let clampRule =  'clamp(' + minVal + 'rem, ' + prefVal + ', ' + maxVal + 'rem);';

  document.getElementById('output').innerHTML = clampRule;
}