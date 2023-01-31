function setup() {
    const canvas = createCanvas(graphConfig.dimX, graphConfig.dimY);
    // https://p5js.org/reference/#/p5.Element/parent
    canvas.parent('graphParent');
    setGraphVars(1.75, 2.525, 600, 1310);
    const a11yColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-color');
    stroke(a11yColor);
}
  
function draw() {
    clear();
    translate(0, graphConfig.dimY);
    scale(1, -1);
    noFill();
    strokeWeight(2);


    line(
        0, scaleToY(fontSize.min),
        scaleToX(windowSize.min), scaleToY(fontSize.min)
    );

    line(
        scaleToX(windowSize.max), scaleToY(fontSize.max),
        scaleToX(windowSize.min), scaleToY(fontSize.min)
    );
    line(
        scaleToX(graphConfig.widthMax), scaleToY(fontSize.max),
        scaleToX(windowSize.max), scaleToY(fontSize.max)
    );
    strokeWeight(1.3);
    const pWidth = 7;
    circle (
        0, scaleToY(fontSize.min),
        pWidth
    );
    circle (
        scaleToX(windowSize.min), scaleToY(fontSize.min),
        pWidth
    );
    circle (
        scaleToX(windowSize.max), scaleToY(fontSize.max),
        pWidth
    );
    circle (
        scaleToX(graphConfig.widthMax), scaleToY(fontSize.max),
        pWidth
    );
}

function scaleToX(number) {
    return scaleMap(number, 0, graphConfig.widthMax, 0, graphConfig.dimX);
}

function scaleToY(number) {
    return scaleMap(number, 0, graphConfig.fontMax, 0, graphConfig.dimY);
}

function scaleMap (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function setGraphVars(fontMin, fontMax, widthMin, widthMax) {
    fontSize.min = fontMin;
    fontSize.max = fontMax;
    windowSize.min = widthMin;
    windowSize.max = widthMax;

    graphConfig.widthMax = Math.max(Math.max(windowSize.min - 400, 200) + windowSize.max, 2000);
    graphConfig.fontMax = fontSize.min + fontSize.max;
}