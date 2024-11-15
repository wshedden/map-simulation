let setCurrentYear, getCurrentYear;

export function setupSlider(setCurrentYear, getCurrentYear) {
    setCurrentYear = setCurrentYear;
    getCurrentYear = getCurrentYear;
    const slider = document.getElementById('slider');
    noUiSlider.create(slider, {
        start: [getCurrentYear()],
        step: 1,
        range: {
            'min': [1970],
            'max': [2022]
        },
        format: {
            to: value => Math.round(value),
            from: value => Math.round(value)
        },
    });

    slider.noUiSlider.on('update', function (values, handle) {
        const year = values[handle];
        d3.select("#slider-value").text(`Year: ${year}`);
        setCurrentYear(year);
    });

    autoScrollSlider(slider, setCurrentYear);
}

function autoScrollSlider(slider, setCurrentYear) {
    let year = 1970;
    const interval = setInterval(() => {
        if (year > 2022) {
            year = 1970;
        }
        slider.noUiSlider.set(year);
        setCurrentYear(year);
        year++;
    }, 500);
}