// Calc rule.
remFactor = 16;
let queryString;
let urlParams;
let paramKeys;

// Graph.
let fontSize = {
    min: null,
    max: null,
}

let windowSize = {
    min: null,
    max: null,
}

let graphConfig = {
    widthMax: null,
    dimX: 400,
    dimY: 270,
}

// Sliders.
// Sliders.
const sliders = $('[id^=slider-range]');

let sliderTimers = {
    sliderPatience: 500,
    sliderData: {}
};