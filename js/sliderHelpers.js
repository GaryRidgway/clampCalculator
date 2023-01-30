
let sliderTimers = {
    sliderPatience: 500,
    sliderData: {}
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const waitRemove = async (JQSelector) => {
    await delay(sliderTimers.sliderPatience);
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
    await delay(sliderTimers.sliderPatience/2);
    
    if (Date.now() > sliderTimer(JQSelector) + sliderTimers.sliderPatience/2) {
        const handleRef = JQSelector.find('.range-value.v' + handleIndex + ' input');
        let slidervalAsRaw = handleRef.attr('data-val-raw');
        if (slidervalAsRaw === null) {
            return;
        }

        slidervalAsRaw = slidervalAsRaw ? slidervalAsRaw : 0;
        let initOtherHandleVal = JQSelector.find('.range-value.v' + (handleIndex + 1)%2 + ' input').val();
        let otherHandleVal = parseFloat(initOtherHandleVal.replace(/,/g, ''), 10);
        otherHandleVal = otherHandleVal ? otherHandleVal : 0;
        
        // VALIDATION
        if (handleIndex < 1) {
            if (slidervalAsRaw > otherHandleVal) {
            slidervalAsRaw = otherHandleVal - 1;
            }
        }
        else {
            if (slidervalAsRaw < otherHandleVal) {
            slidervalAsRaw = otherHandleVal + 1;
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

function setInputWithFormatting(sliderInput, resetDataVal = -1) {
    if (resetDataVal > -1) {
      sliderInput.attr(
        'data-val-raw',
        resetDataVal ? resetDataVal : 0
      );
    }

    sliderInput.val(valAsDollars(sliderInput.closest('[id^=slider-range]'), sliderInput.attr('data-val-raw')));
  }

function blankSliderData(JQSelector) {
    return {
        type: JQSelector.attr('data-slider-type'),
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
    if(sliderTimers.sliderData[JQSelector.attr('id')].type !== 'px') {
        return val.toString();
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
                max: 4000,
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