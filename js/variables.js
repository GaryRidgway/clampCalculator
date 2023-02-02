const delayInstance = ms => new Promise(res => setTimeout(res, ms));

// Calc rule.
const remFactor = 16;
let queryString;
let urlParams;
let paramKeys;
let waitQueryReplaceData = {
    patience: 500,
    timer: 0,
    queryString: ''
};

queryString = window.location.search;
urlParams = new URLSearchParams(queryString);
paramKeys = Array.from(urlParams.keys());

// Graph.
const a11yTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
const a11yBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--prbg-border-color');
const a11yBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bacg-color');
const aspectRatio = getComputedStyle(document.documentElement).getPropertyValue('--aspect-ratio');
const ARX = parseInt('16 / 9'.split('/')[0]);
const ARY = parseInt('16 / 9'.split('/')[1]);

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
    dimX: ARX * 50,
    dimY: ARY * 50,
}

let divs = {
    left: null,
    right: null,
    bLeft: null,
    bRight: null,
}

// Sliders.
const sliders = $('[id^=slider-range]');

let sliderTimers = {
    sliderPatience: 500,
    sliderData: {}
};