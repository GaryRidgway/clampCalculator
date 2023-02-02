// https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
let canvasHoverTooltip;

function setup() {
    const canvas = createCanvas(graphConfig.dimX, graphConfig.dimY);

    // https://p5js.org/reference/#/p5.Element/parent
    canvas.parent('graphMeasurementContainer');
    setGraphVars(1.75, 2.525, 600, 1310);
    stroke(a11yTextColor);
    divs.left = createDiv('<div class="data-display"></div>');
    divs.right = createDiv('<div class="data-display"></div>');
    divs.bLeft = createDiv('<div class="data-display"></div>');
    divs.bRight = createDiv('<div class="data-display"></div>');

    Object.keys(divs).forEach(function(div) {
        divs[div].addClass('positioner ' + div);
        divs[div].parent('graphMeasurementContainer');
    });
    canvasHoverTooltip = document.getElementById('canvasHoverTooltip');
    triggerDataRebuild();
}
  
function draw() {
    const strokeWeightMod = Number(canvas.style.width.replace(/px$/, '')) / canvas.clientWidth

    clear();
    translate(0, graphConfig.dimY);
    scale(1, -1);
    fill(a11yBackgroundColor);
    strokeWeight(2 * strokeWeightMod);

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

    // Mouse cursor Line.
    push();
        const mouseXPer = ((mouseX / graphConfig.dimX) * 100);
        const mouseYPer = ((mouseY / graphConfig.dimY) * 100);
        manageTooltip(mouseXPer, mouseYPer);
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
    strokeWeight(1.3 * strokeWeightMod);
    const pWidth = 7 * strokeWeightMod ;

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
        pWidth * 1.5
    );

    circle (
        scaleToX(graphConfig.widthMax), scaleToY(fontSize.max),
        pWidth * 1.5
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
    setSingleGraphVar('minWidth',     widthMin);
    setSingleGraphVar('maxWidth',     widthMax);
    setSingleGraphVar('minFontSize',  fontMin );
    setSingleGraphVar('maxFontSize',  fontMax );

    graphConfig.widthMax = $('#slider-range0').slider("option", "max");
    graphConfig.fontMax = $('#slider-range1').slider("option", "max");
}

function setSingleGraphVar(key, value) {
    switch(key) {
        case 'minWidth':
            windowSize.min = value;
            break;
        case 'maxWidth':
            windowSize.max = value;
            break;
        case 'minFontSize':
            fontSize.min = value;
            break;
        case 'maxFontSize':
            fontSize.max = value;
            break;
      }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function manageTooltip(mouseXPer, mouseYPer) {
    if (
        mouseXPer !== 0 &&
        mouseYPer !== 0
    ) {
        if (
            mouseXPer < 0 || mouseXPer > 100
            ||
            mouseYPer < 0 || mouseYPer > 100
        ) {
            canvasHoverTooltip.classList.add("hidden");
        }
        else {
            stroke('#35b2ff');
            line(mouseX, 0, mouseX, graphConfig.dimY);


            const refs = getReferences();
            let widthMax = $('#slider-range0').slider("option", "max");
            let fontMax = $('#slider-range1').slider("option", "max");
            const equationValues = getLinearEquationValues(refs, true);
            const simXVal = scaleMap(
                mouseXPer,
                0, 100,
                0,
                widthMax
            )

            const linearSize = ((simXVal * equationValues.slope) + (equationValues.rIntercept * remFactor));

            // Styles.
            const clampedRemSize = Math.min(
                Math.max(
                    refs.minFontSize,
                    linearSize
                ),
                refs.maxFontSize
            );

            const ratioRemSize = 100 - ((clampedRemSize / fontMax) * 100);

            canvasHoverTooltip.style.setProperty('--rem-size', clampedRemSize + 'rem');
            canvasHoverTooltip.style.top = ratioRemSize + '%';
            canvasHoverTooltip.style.left = mouseXPer + '%';

            canvasHoverTooltip.classList.remove("hidden");
        }
    }
}