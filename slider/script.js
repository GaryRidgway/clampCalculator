// https://codepen.io/chriscoyier/pen/XWbqpzP
// https://codepen.io/MarioD/pen/WwXbgr

$(function() {
  const sliderPatience = 500;
  let sliderTimer = 0;
  let removeIsTiming = false;

  let sliderAdjustIsTiming = false;
  let delayedSliderAdjustData; resetDelayedSliderAdjustData();

  // Initiate Slider
  $('#slider-range').slider({
    range: true,
    min: 0,
    max: 4000,
    step: 5,
    values: [600, 1310]
  });

  // Move the range wrapper into the generated divs
  $('.ui-slider-range').append($('.range-wrapper'));
  
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const waitRemove = async (JQSelector) => {
    await delay(sliderPatience);
    if (Date.now() > sliderTimer + sliderPatience) {
      JQSelector.removeClass('sliding');
      removeIsTiming = false;
    }
    else {
      waitRemove(JQSelector);
    }
  };

  const waitTriggerSliderAdjust = async () => {
    await delay(sliderPatience/2);
    if (Date.now() > sliderTimer + sliderPatience/2) {
      delayedSliderAdjustData.forEach((element, index) => {
        let sliderValAsInt = delayedSliderAdjustData[index].valAsInt;
        if (sliderValAsInt === null) {
          return;
        }

        sliderValAsInt = sliderValAsInt ? sliderValAsInt : 0;
        let otherHandleVal = parseInt(document.querySelector('.range-value.v' + (index + 1)%2 + ' input').value.replace(/,/g, ''), 10);
        otherHandleVal = otherHandleVal ? otherHandleVal : 0;
        
        // VALIDATION
        if (index < 1) {
          if (sliderValAsInt > otherHandleVal) {
            sliderValAsInt = otherHandleVal - 1;
          }
        }
        else {
          if (sliderValAsInt < otherHandleVal) {
            sliderValAsInt = otherHandleVal + 1;
          }
        }

        const handleRef = document.querySelector('.range-value.v' + index + ' input');
        setInputWithFormatting(handleRef, sliderValAsInt);
        $("#slider-range").slider(
          "values",
          index,
          sliderValAsInt
        );
      });

      resetDelayedSliderAdjustData();
      
      sliderAdjustIsTiming = false;
    }
    else {
      waitTriggerSliderAdjust() ;
    }
  };
  
  setAndInitialize(0);
  setAndInitialize(1);

  // Show the gears on press of the handles
  $('.ui-slider-handle, .ui-slider-range').on('mousedown', function() {
    $('.gear-large').addClass('active');
  });

  // Hide the gears when the mouse is released
  // Done on document just incase the user hovers off of the handle
  $(document).on('mouseup', function() {
    if ($('.gear-large').hasClass('active')) {
      $('.gear-large').removeClass('active');
    }
  });

  // Rotate the gears
  var gearOneAngle = 0,
    gearTwoAngle = 0,
    rangeWidth = $('.ui-slider-range').css('width');

  $('.gear-one').css('transform', 'rotate(' + gearOneAngle + 'deg)');
  $('.gear-two').css('transform', 'rotate(' + gearTwoAngle + 'deg)');

  $('#slider-range').slider({
    slide: function(event, ui) {

      // Update the range container values upon sliding
      setSliderInputValue(0);
      setSliderInputValue(1);

      // Get old value
      var previousVal = parseInt($(this).data('value'));

      // Save new value
      $(this).data({
        'value': parseInt(ui.value)
      });

      // Figure out which handle is being used
      if (ui.values[0] == ui.value) {

        // Left handle
        if (previousVal > parseInt(ui.value)) {
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
        if (previousVal > parseInt(ui.value)) {
          // value decreased
          gearOneAngle -= 7;
          $('.gear-two').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        } else {
          // value increased
          gearOneAngle += 7;
          $('.gear-two').css('transform', 'rotate(' + gearOneAngle/6 + 'deg)');
        }

      }

      if (ui.values[1] === 4000) {
        if (!$('.range-alert').hasClass('active')) {
          $('.range-alert').addClass('active');
        }
      } else {
        if ($('.range-alert').hasClass('active')) {
          $('.range-alert').removeClass('active');
        }
      }
    }
  });

  // Prevent the range container from moving the slider
  $('.range, .range-alert').on('mousedown', function(event) {
    event.stopPropagation();
  });

  function valAsDollars(val) {
    if (typeof(val) === 'number') {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  
    return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
  
  function setSliderVariables(handleIndex, sliderRef = null, instantReplace = false) {
    let sliderInput = sliderRef;
    if (sliderRef === null) {
      sliderInput = document.querySelector('.range-value.v' + handleIndex + ' input');
    }

    sliderInput.value = sliderInput.value.replace(/[^0-9 \,]/, '');
    let valAsInt = parseInt(sliderInput.value.replace(/,/g, ''), 10);

    sliderInput.setAttribute(
      'data-val-int',
      valAsInt ? valAsInt : 0
    );
    setInputWithFormatting(sliderInput);

    delayedSliderAdjustData[handleIndex].valAsInt = valAsInt;

    if (instantReplace) {
      $("#slider-range").slider(
        "values",
        handleIndex,
        delayedSliderAdjustData[handleIndex].valAsInt
      );
      resetDelayedSliderAdjustData();
    }
  }
  
  function timedSetSliderVariables(handleIndex, sliderRef = null) {
    const sliderRange = $("#slider-range").find('.ui-slider-range');
    const sliderHandles = $("#slider-range").find('.ui-slider-handle');
    sliderRange.addClass('sliding');
    sliderHandles.addClass('sliding');
    sliderTimer = Date.now();
  
    setSliderVariables(handleIndex, sliderRef);

    if (!sliderAdjustIsTiming) {
      sliderAdjustIsTiming = true;
      waitTriggerSliderAdjust();
    }
  
    if (!removeIsTiming) {
      removeIsTiming = true;
      waitRemove(sliderRange);
      waitRemove(sliderHandles);
    }
  }
  
  function setSliderInputValue(handleIndex) {
    const sliderValueAsInt = $("#slider-range").slider("values")[handleIndex];
    const handle = document.querySelector('.range-value.v' + handleIndex + ' input');
    handle.value = valAsDollars(sliderValueAsInt);
    modWidthMachine();
  }

  function setInputWithFormatting(sliderInput, resetDataVal = -1) {
    if (resetDataVal > -1) {
      sliderInput.setAttribute(
        'data-val-int',
        resetDataVal ? resetDataVal : 0
      );
    }

    sliderInput.value = valAsDollars(sliderInput.getAttribute('data-val-int'));
  }

  function resetDelayedSliderAdjustData() {
    delayedSliderAdjustData = [
      {
        valAsInt: null
      },
      {
        valAsInt: null
      }
    ];
  }

  function modWidthMachine() {
    const input0 = document.querySelector('.range-value.v0 input');
    const widthMachine0 = document.querySelector('.v0 .input-wrap .width-machine');
    const input1 = document.querySelector('.range-value.v1 input');
    const widthMachine1 = document.querySelector('.v1 .input-wrap .width-machine');

    const finalValue = valAsDollars(
      valAsDollars(input0.value).length > valAsDollars(input1.value).length 
      ? 
      input0.value : input1.value
    );

    widthMachine0.innerHTML = finalValue;
    widthMachine1.innerHTML = finalValue;
  }

  function setAndInitialize(handleIndex) {
    const input = document.querySelector('.range-value.v' + handleIndex + ' input');
    modWidthMachine();
    setSliderVariables(handleIndex, null, true);
    input.addEventListener('input', function() {
      timedSetSliderVariables(handleIndex, this);
    });
  }
});


