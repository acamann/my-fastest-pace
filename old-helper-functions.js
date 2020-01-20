function getMinimumDate() {
    let minDate = new Date();
    for (let i=0; i<raceData.length; i++) {
        minDate = (Date.parse(minDate) < Date.parse(raceData[i].date)) ? minDate : raceData[i].date;
    }
    return minDate;
}

function getMaximumDate() {
    let maxDate = raceData[0].date;
    for (let i=1; i<raceData.length; i++) {
        maxDate = (Date.parse(maxDate) > Date.parse(raceData[i].date)) ? maxDate : raceData[i].date;
    }
    return maxDate;
}

function calculateDateAsPercentageWithinRange(currentDate, min, max) {
    return ((Date.parse(currentDate) - Date.parse(min)) / (Date.parse(max) - Date.parse(min)));
}

function getFastestPaceInSeconds() {
    let fastestPace = convertPaceStringToSeconds(raceData[0].pace);
    for (let i=1; i<raceData.length; i++) {
        fastestPace = (fastestPace < convertPaceStringToSeconds(raceData[i].pace)) ? fastestPace : convertPaceStringToSeconds(raceData[i].pace);
    }
    return fastestPace;
}

function getSlowestPaceInSeconds() {
    let slowestPace = convertPaceStringToSeconds(raceData[0].pace);
    for (let i=1; i<raceData.length; i++) {
        slowestPace = (slowestPace > convertPaceStringToSeconds(raceData[i].pace)) ? slowestPace : convertPaceStringToSeconds(raceData[i].pace);
    }
    return slowestPace;
}

function calculatePaceAsPercentOfSlowestAndFastest(pace, min, max) {
    return (convertPaceStringToSeconds(pace) - min) / (max - min);
}