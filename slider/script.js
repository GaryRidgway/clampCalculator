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

  // Rotate the gears
  var gearOneAngle = 0,
    gearTwoAngle = 0;

  sliders.find('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
  sliders.find('.gear-two').css('transform', 'rotate(' + gearTwoAngle + 'deg)');

  sliders.slider({
    slide: function(event, ui) {

      // Update the range container values upon sliding
      setSliderInputValue($(this), 0);
      setSliderInputValue($(this), 1);

      // Get old value
      var previousVal = parseFloat($(this).data('value'));

      // Save new value
      $(this).data({
        'value': parseFloat(ui.value)
      });

      // Figure out which handle is being used
      if (ui.values[0] == ui.value) {

        // Left handle
        if (previousVal > parseFloat(ui.value)) {
          // value decreased
          gearOneAngle -= 7;
          $('.gear-one').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        } else {
          // value increased
          gearOneAngle += 7;
          $('.gear-one').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        }

      } else {

        // Right handle
        if (previousVal > parseFloat(ui.value)) {
          // value decreased
          gearOneAngle -= 7;
          $(this).find('.gear-two').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        } else {
          // value increased
          gearOneAngle += 7;
          $(this).find('.gear-two').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        }

      }
    }
  });
  
  function timedSetSliderVariables(JQSelector, handleIndex) {
    const sliderRange = JQSelector.find('.ui-slider-range');
    const sliderHandles = JQSelector.find('.ui-slider-handle');
    sliderRange.addClass('sliding');
    sliderHandles.addClass('sliding');
    sliderTimer(JQSelector, true);

    let sliderData = sliderTimers.sliderData[JQSelector.attr('id')];

    if (!sliderData.sliderAdjustIsTiming) {
      sliderTimers.sliderData[JQSelector.attr('id')].sliderAdjustIsTiming = true;
      waitTriggerSliderAdjust(JQSelector, handleIndex);
    }
  
    if (!sliderData.removeIsTiming) {
      sliderTimers.sliderData[JQSelector.attr('id')].removeIsTiming = true;
      waitRemove(sliderRange.parent());
      waitRemove(sliderHandles.parent());
    }
  }
  
  function setSliderInputValue(JQSelector, handleIndex) {
    const sliderValueAsInt = JQSelector.slider("values")[handleIndex];
    const handle = JQSelector.find('.range-value.v' + handleIndex + ' input');
    handle.val(valAsDollars(JQSelector, sliderValueAsInt));
    modWidthMachine(JQSelector);
  }

  function modWidthMachine(JQSelector) {
    const input0 = JQSelector.find('.range-value.v0 input');
    const widthMachine0 = JQSelector.find('.range-value.v0 .input-wrap .width-machine');
    const input1 = JQSelector.find('.range-value.v1 input');
    const widthMachine1 = JQSelector.find('.range-value.v1 .input-wrap .width-machine');

    const finalValue = valAsDollars(JQSelector, 
      valAsDollars(JQSelector, input0.val()).length > valAsDollars(JQSelector, input1.val()).length 
      ? 
      input0.val() : input1.val()
    );

    widthMachine0.html(finalValue);
    widthMachine1.html(finalValue);
  }

  function setAndInitialize(JQSelector, handleIndex) {
    initSliderData(JQSelector);
    const input = JQSelector.find('.range-value.v' + handleIndex + ' input');
    modWidthMachine(JQSelector);
    setSliderVariables(JQSelector, handleIndex, null, true);
    input[0].addEventListener('input', function() {
      timedSetSliderVariables(JQSelector, handleIndex);
    });
  }
});