function setSliderVariables(JQSelector, handleIndex, instantReplace = false) {
  let sliderInput = JQSelector.find('.range-value.v' + handleIndex + ' input');
  let sliderData = sliderTimers.sliderData[JQSelector.attr('id')];
  
  
  let newSliderInputVal = valAsDollars(JQSelector, sliderInput.val());
  if (sliderData.type === 'px') {
    
    newSliderInputVal = valAsDollars(JQSelector, sliderInput.val());
  }
  else if(sliderData.type === 'rem') {
    const valAsRaw = parseFloat(sliderInput.val().replace(/,/g, ''), 10);
    newSliderInputVal = floatStringWithExplicitPlaces(valAsRaw, 3);
  }
  else {
    console.log('???????????????????');
  }

  JQSelector.find('.range-value.v' + handleIndex + ' input').val(newSliderInputVal.replace(/[^0-9 \,\.]/, ''));
  let valAsRaw = parseFloat(newSliderInputVal.replace(/,/g, ''), 10);

  valAsRaw = valAsRaw ? valAsRaw : 0;
  setInputWithFormatting(sliderInput, valAsRaw);

  sliderTimers.sliderData[JQSelector.attr('id')].delayedSliderAdjustData[handleIndex].valAsRaw = valAsRaw;

  if (instantReplace) {
    JQSelector.slider(
      "values",
      handleIndex,
      sliderData.delayedSliderAdjustData[handleIndex].valAsRaw
    );
    resetDelayedSliderAdjustData(JQSelector);
  }
}

const waitRemove = async (JQSelector) => {
    await delayInstance(sliderTimers.sliderPatience);
    const slideSelector = JQSelector.find('.ui-slider-handle, .ui-slider-range')
    if (Date.now() > sliderTimer(JQSelector) + sliderTimers.sliderPatience) {
        slideSelector.removeClass('sliding');
        sliderTimers.sliderData[JQSelector.attr('id')].removeIsTiming = false;
    }
    else {
        waitRemove(JQSelector);
    }
};

const waitTriggerSliderAdjust = async (JQSelector, handleIndex) => {
    await delayInstance(sliderTimers.sliderPatience/2);
    
    if (Date.now() > sliderTimer(JQSelector) + sliderTimers.sliderPatience/2) {
        setSliderVariables(JQSelector, handleIndex);
        const handleRef = JQSelector.find('.range-value.v' + handleIndex + ' input');
        const sliderData = sliderTimers.sliderData[JQSelector.attr('id')];
        let slidervalAsRaw = handleRef.attr('data-val-raw');
        if (slidervalAsRaw === null) {
            return;
        }

        slidervalAsRaw = slidervalAsRaw ? slidervalAsRaw : 0;
        let initOtherHandleVal = JQSelector.find('.range-value.v' + (handleIndex + 1)%2 + ' input').val();
        let otherHandleVal = parseFloat(initOtherHandleVal.replace(/,/g, ''), 10);
        otherHandleVal = otherHandleVal ? otherHandleVal : 0;
        
        // VALIDATION
        // On the low.
        const min = JQSelector.slider("option", "min");
        if (slidervalAsRaw < min) {
            slidervalAsRaw = min;
        }
        
        // On the high.
        const max = JQSelector.slider("option", "max");
        if (slidervalAsRaw > max) {
            slidervalAsRaw = max;
        }

        // On the collision.
        if (handleIndex < 1) {
            if (slidervalAsRaw > otherHandleVal) {
                if (sliderData.type === 'rem') {
                    slidervalAsRaw = otherHandleVal - 0.001;
                }
                else if (sliderData.type === 'px') {
                    slidervalAsRaw = otherHandleVal - 1;
                }
            }
        }
        else {
            if (slidervalAsRaw < otherHandleVal) {
                if (sliderData.type === 'rem') {
                    slidervalAsRaw = otherHandleVal + 0.001;
                }
                else if (sliderData.type === 'px') {
                    slidervalAsRaw = otherHandleVal + 1;
                }
            }
        }

        sliderTimers.sliderData[JQSelector.attr('id')].delayedSliderAdjustData.valAsRaw = slidervalAsRaw;
        setInputWithFormatting(handleRef, slidervalAsRaw);
        JQSelector.slider(
            "values",
            handleIndex,
            slidervalAsRaw
        );

        resetDelayedSliderAdjustData(JQSelector);
        
        sliderTimers.sliderData[JQSelector.attr('id')].sliderAdjustIsTiming = false;
      }
    else {
        waitTriggerSliderAdjust(JQSelector,handleIndex) ;
    }
};

function setInputWithFormatting(sliderInput, resetDataVal = null, rawOnly = false) {
  if (resetDataVal != null) {
    sliderInput.attr(
      'data-val-raw',
      resetDataVal ? resetDataVal : 0
    );
  }

  if (!rawOnly) {
    sliderInput.val(valAsDollars(sliderInput.closest('[id^=slider-range]'), sliderInput.attr('data-val-raw')));
  }
}

function blankSliderData(JQSelector) {
    return {
        type: JQSelector.attr('data-slider-type'),
        min: null,
        max: null,
        gearOneAngle: 0,
        gearTwoAngle: 0,
        timer: Date.now(),
        removeIsTiming: false,
        sliderAdjustIsTiming: false,
        delayedSliderAdjustData: resetDelayedSliderAdjustData()
    };
}

function resetDelayedSliderAdjustData(JQSelector = null) {
    if (JQSelector) {
        sliderTimers.sliderData[JQSelector.attr('id')].delayedSliderAdjustData = resetDelayedSliderAdjustData()
    }
    else {
        return [
            {
                valAsRaw: null
            },
            {
                valAsRaw: null
            }
        ]
    }
}

function sliderTimer(JQSelector, set = false) {
    const selector = JQSelector.parent();
    let sliderData = sliderTimers.sliderData[selector.attr('id')];
    // Init slider data if not there.
    if (!sliderData) {   
        initSliderData(selector);
        sliderData = sliderTimers.sliderData[selector.attr('id')];
    }

    // Setter function.
    if (set) {
        sliderTimers.sliderData[selector.attr('id')].timer = Date.now();
        return;
    }

    // Getter function.
    return sliderTimers.sliderData[selector.attr('id')].timer;
}

function valAsDollars(JQSelector, val) {
    if(
      JQSelector &&
      sliderTimers.sliderData[JQSelector.attr('id')] &&
      sliderTimers.sliderData[JQSelector.attr('id')].type === 'rem'
    ) {
        return floatStringWithExplicitPlaces(val, 3);
    }

    if (typeof(val) === 'number') {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  
    return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function initSliderData(JQSelector) {
    if(!sliderTimers.sliderData[JQSelector.attr('id')]) {
        sliderTimers.sliderData[JQSelector.attr('id')] = blankSliderData(JQSelector);
    }
}

function initSliders(sliders) {
    sliders.each(function() {
        if ($(this).attr('data-slider-type') === 'px') {
            $(this).slider({
                range: true,
                min: 0,
                max: 2200,
                step: 5,
                values: [600, 1310]
            });
        }
        else 

        if ($(this).attr('data-slider-type') === 'rem') {
            $(this).slider({
                range: true,
                min: 0,
                max: 4,
                step: 0.025,
                values: [1.75, 2.525]
            });
        }
    });
}

function floatStringWithExplicitPlaces(float, places) {
    const multiplier = Math.pow(10, places);
    const roundValToPlaces = Math.round(float * multiplier) / multiplier;
    const placesModifier = parseFloat('0.' + '0'.repeat(3) + '1');
    const valToPlaces = roundValToPlaces + placesModifier;
    const stringAtPlaces = valToPlaces.toString().slice(0,places+2);
    return stringAtPlaces;
}
  
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

function setSliderInputValue(JQSelector, handleIndex, explicitValue = null) {
  let sliderValueAsInt;
  if (explicitValue) {
    sliderValueAsInt = explicitValue;
  }
  else {
    sliderValueAsInt = JQSelector.slider("values")[handleIndex];
  }

  JQSelector.find('.range-value.v' + handleIndex + ' input').val(valAsDollars(JQSelector, sliderValueAsInt));
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
  setSliderVariables(JQSelector, handleIndex, true);
  const input = JQSelector.find('.range-value.v' + handleIndex + ' input');
  modWidthMachine(JQSelector);
  setSliderVariables(JQSelector, handleIndex, null, true);
  input[0].addEventListener('input', function() {
    timedSetSliderVariables(JQSelector, handleIndex);
  });

  // Remove the ability to tab to a handle for accessibility.
  JQSelector.find('.ui-slider-handle').removeAttr('tabindex');
}

// https://forum.jquery.com/topic/slider-value-incorrect.
function doSlide(JQSelector, ui) {
  // Update the range container values upon sliding
  const handle = $(ui.handle).index() - 1;
  setSliderInputValue(JQSelector, handle, ui.value);

  // Get old value
  var previousVal = parseFloat(JQSelector.data('value'));

  // Do we need this?
  // Save new value
  // const dataHandle = 'data' + handle;
  // JQSelector.data({
  //   dataHandle : parseFloat(JQSelector.slider('values')[handle])
  // }[dataHandle]);

  // Figure out which handle is being used
  if (handle === 0) {

    // Left handle
    if (previousVal > parseFloat(ui.value)) {
      // value decreased
      sliderTimers.sliderData[JQSelector.attr('id')].gearOneAngle -= 7;
      $('.gear-one').css('transform', 'rotate('
      + sliderTimers.sliderData[JQSelector.attr('id')].gearOneAngle/6 +
      'deg)');
    } else {
      // value increased
      sliderTimers.sliderData[JQSelector.attr('id')].gearOneAngle += 7;
      $('.gear-one').css('transform', 'rotate('
      + sliderTimers.sliderData[JQSelector.attr('id')].gearOneAngle/6 +
      'deg)');
    }

  } else {

    // Right handle
    if (previousVal > parseFloat(ui.value)) {
      // value decreased
      sliderTimers.sliderData[JQSelector.attr('id')].gearTwoAngle -= 7;
      JQSelector.find('.gear-two').css('transform', 'rotate('
      + sliderTimers.sliderData[JQSelector.attr('id')].gearTwoAngle/6 +
      'deg)');
    } else {
      // value increased
      sliderTimers.sliderData[JQSelector.attr('id')].gearTwoAngle += 7;
      JQSelector.find('.gear-two').css('transform', 'rotate('
      + sliderTimers.sliderData[JQSelector.attr('id')].gearTwoAngle/6 +
      'deg)');
    }
  }

  triggerDataRebuild();
}


// This gets the necessary data from sliders.
// This is not a flexible function.
function getSliderValues() {
  let fontSize = {
    min: parseFloat($('#slider-range1').find('.v0 input').val().replace(/,/g, '')),
    max: parseFloat($('#slider-range1').find('.v1 input').val().replace(/,/g, '')),
  };
  let windowSize = {
    min: parseFloat($('#slider-range0').find('.v0 input').val().replace(/,/g, '')),
    max: parseFloat($('#slider-range0').find('.v1 input').val().replace(/,/g, '')),
  };

  return {
    fontSize: fontSize,
    windowSize: windowSize
  };
}