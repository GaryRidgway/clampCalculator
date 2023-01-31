function triggerDataRebuild() {
    const values = getSliderValues();
    setGraphVars(
        values.fontSize.min,
        values.fontSize.max,
        values.windowSize.min,
        values.windowSize.max,
    );
}