function triggerDataRebuild(graphVars = true, graphText = true) {
    const values = getSliderValues();
    if (graphVars) {
        setGraphVars(
            values.fontSize.min,
            values.fontSize.max,
            values.windowSize.min,
            values.windowSize.max,
        );
    }

    if (graphText && document.querySelector('#graphParent .left')) {

        const left = document.querySelector('#graphParent .left');
        const right = document.querySelector('#graphParent .right');
        const bLeft = document.querySelector('#graphParent .bLeft');
        const bRight = document.querySelector('#graphParent .bRight');
        const leftDataPoint = left.querySelector('.left .data-display');
        const rightDataPoint = right.querySelector('.right .data-display');
        const bLeftDataPoint = bLeft.querySelector('.bLeft .data-display');
        const bRightDataPoint = bRight.querySelector('.bRight .data-display');
        
        leftDataPoint.innerHTML = floatStringWithExplicitPlaces(values.fontSize.min, 3) + 'rem';
        rightDataPoint.innerHTML = floatStringWithExplicitPlaces(values.fontSize.max, 3) + 'rem';
        bLeftDataPoint.innerHTML = valAsDollars(null, values.windowSize.min) + 'px';
        bRightDataPoint.innerHTML = valAsDollars(null, values.windowSize.max) + 'px';

        const leftYPer = ((graphConfig.dimY - scaleToY(fontSize.min))/ graphConfig.dimY) * 100;
        left.style.top = 'calc(' + leftYPer + '% - 2px)';

        const bLeftYPer = (scaleToX(windowSize.min)/ graphConfig.dimX) * 100;
        bLeft.style.left = 'calc(' + bLeftYPer + '%)';

        const bRightYPer = (scaleToX(windowSize.max)/ graphConfig.dimX) * 100;
        bRight.style.left = 'calc(' + bRightYPer + '%)';

        const rightYPer = ((graphConfig.dimY - scaleToY(fontSize.max))/ graphConfig.dimY) * 100;
        right.style.top = 'calc(' + rightYPer + '% - 2px)';
    }

    calcRule(true, false, false);
}