function setup() {
    const canvas = createCanvas(graphConfig.dimX, graphConfig.dimY);
    // https://p5js.org/reference/#/p5.Element/parent
    canvas.parent('graphParent');
    setGraphVars(1.75, 2.525, 600, 1310);
    stroke(a11yTextColor);
    divs.left = createDiv('<div class="data-display"></div>');
    divs.right = createDiv('<div class="data-display"></div>');
    divs.bLeft = createDiv('<div class="data-display"></div>');
    divs.bRight = createDiv('<div class="data-display"></div>');

    Object.keys(divs).forEach(function(div) {
        divs[div].addClass('positioner ' + div);
        divs[div].parent('graphParent');
    });
    triggerDataRebuild();
}
  
function draw() {
    background(a11yBackgroundColor);
    translate(0, graphConfig.dimY);
    scale(1, -1);
    fill(a11yBackgroundColor);
    strokeWeight(2);

    // Dashed vertical lines.
    push();
        stroke(a11yBorderColor);
        setLineDash([5, 5]);
        line(
            scaleToX(windowSize.min), 0,
            scaleToX(windowSize.min), graphConfig.dimY
        );

        line(
            scaleToX(windowSize.max), 0,
            scaleToX(windowSize.max), graphConfig.dimY
        );
    pop();

    // Calc rule lines.
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

    // Intersect circles.
    strokeWeight(1.3);
    const pWidth = 7;

    circle (
        scaleToX(windowSize.min), scaleToY(fontSize.min),
        pWidth
    );

    circle (
        scaleToX(windowSize.max), scaleToY(fontSize.max),
        pWidth
    );
    
    circle (
        0, scaleToY(fontSize.min),
        pWidth*1.5
    );

    circle (
        scaleToX(graphConfig.widthMax), scaleToY(fontSize.max),
        pWidth*1.5
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

    graphConfig.widthMax = $('#slider-range0').slider("option", "max");
    graphConfig.fontMax = $('#slider-range1').slider("option", "max");
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}