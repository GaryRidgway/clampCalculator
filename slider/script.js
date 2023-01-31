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



$(function() {

  const sliders = $('[id^=slider-range]');

  // Initiate Slider
  initSliders(sliders);

  // Move the range wrapper into the generated divs
  sliders.find('.ui-slider-range').each(function() {
    $(this).append($(this).parent().find('.range-wrapper'));
  });
  
  
  sliders.each(function() {
    setAndInitialize($(this), 0);
    setAndInitialize($(this), 1);
  });
  
  // Show the gears on press of the handles
  $('.ui-slider-handle, .ui-slider-range').on('mousedown', function() {
    $(this).parent().find('.gear-large').addClass('active');
  });

  // Hide the gears when the mouse is released
  // Done on document just incase the user hovers off of the handle
  $('.ui-slider-handle, .ui-slider-range').on('mouseup', function() {
    if ($(this).parent().find('.gear-large').hasClass('active')) {
      $(this).parent().find('.gear-large').removeClass('active');
    }
  });

  sliders.find('.gear-one').css('transform', 'rotate(0deg)');
  sliders.find('.gear-two').css('transform', 'rotate(0deg)');

  sliders.slider({
    slide: function(event, ui) {

      doSlide($(this), ui);
    }
  });
});