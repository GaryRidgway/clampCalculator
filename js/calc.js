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

