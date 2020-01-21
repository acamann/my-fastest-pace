var raceData = [];

function loadRaceData() {
    fetch('/data/race-data.json')
    .then(response => response.json())
    .then(data => {
        raceData = data.races;   
        displayPaceGraph();
        createCheckBoxes();
    })
}

function displayPaceGraph() {
    
    const width = 500;
    const height = 300;
    const padding = 30;

    const xScale = d3.scaleLinear()
                        .domain([d3.min(raceData, (race) => Date.parse(race.date)), d3.max(raceData, (race) => Date.parse(race.date))])
                        .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d3.timeFormat("%-m/%Y"));
    
    const yScale = d3.scaleLinear()
                        .domain([d3.min(raceData, (race) => convertPaceStringToSeconds(race.pace)), d3.max(raceData, (race) => convertPaceStringToSeconds(race.pace))])
                        .range([height - padding, padding]);
    const yAxis = d3.axisLeft(yScale)
                        .tickFormat(function(d) {
                                return d3.timeFormat("%-M:%S")( new Date(0).setSeconds(d))
                        });

    d3.select("#pace-graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + width + " " + height)
        .selectAll("circle")
        .data(raceData)
        .enter()
        .append("circle")
        .attr("cx", (race) => xScale(Date.parse(race.date)))
        .attr("cy", (race) => yScale(convertPaceStringToSeconds(race.pace)))
        .attr("r", 2)
        .attr("class", (race) => race.distanceName + " race-data")
        .append("title")
        .text((race) => race.raceName + ", " + race.date);

    d3.select("svg")
        .selectAll("text")
        .data(raceData)
        .enter()
        .append("text")
        .attr("class", "data-label")
        .text((race) => race.pace)
        .attr("x", (race) => xScale(Date.parse(race.date)) + 7)
        .attr("y", (race) => yScale(convertPaceStringToSeconds(race.pace)) + 3);


    d3.select("svg")
        .append("g")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

}

function createCheckBoxes() {    
    d3.select("#race-type-toggle")
        .selectAll("label")
        .data(d3.map(raceData, function(d) { return d.distanceName; }).keys())
        .enter()
        .append("label")
        .attr("for", (d) => d)
        .text((d) => d)
        .append("input")
        .attr("type", "checkbox")
        .attr("name", (d) => d)
        .attr("value", (d) => d)
        .attr("class", (d) => d)
        .attr("checked", "checked");
}


function convertPaceStringToSeconds(time) {
    let msArray = time.split(':');
    return ((+msArray[0]) * 60) + (+msArray[1]);
}