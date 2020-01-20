// const raceData = [
//     {date:"2017-02-03", distanceName:"half-marathon", raceName:"Katy Half Marathon", distanceMiles:13.1, time:"2:05:11", pace:"9:33"},
//     {date:"2014-02-09", distanceName:"half-marathon", raceName:"Rhythm & Blues Half Marathon", distanceMiles:13.1, time:"2:19:06", pace:"10:37"},
//     {date:"2019-04-27", distanceName:"five-k", raceName:"Every Village 5K", distanceMiles:3.1, time:"0:29:47", pace:"9:35"},
//     {date:"2013-11-28", distanceName:"five-mile", raceName:"Festival Foods Turkey Trot", distanceMiles:5, time:"0:50:49", pace:"10:10"},
//     {date:"2013-05-04", distanceName:"half-marathon", raceName:"Prairie du Chien Half Marathon", distanceMiles:13.1, time:"2:03:43", pace:"9:27"},
//     {date:"2013-04-07", distanceName:"half-marathon", raceName:"Angie's Half Crazy Half Marathon", distanceMiles:13.1, time:"2:14:47", pace:"10:17"},
//     {date:"2008-11-27", distanceName:"five-mile", raceName:"Festival Foods Turkey Trot", distanceMiles:5, time:"0:46:52", pace:"9:22"},
//     {date:"2009-04-25", distanceName:"five-mile", raceName:"Crazy Legs Classic", distanceMiles:5, time:"0:49:31", pace:"9:54"},
//     {date:"2013-01-13", distanceName:"half-marathon", raceName:"Aramco Houston Half Marathon", distanceMiles:13.1, time:"2:22:48", pace:"10:54"},
//     {date:"2011-01-30", distanceName:"marathon", raceName:"Chevron Houston Marathon", distanceMiles:26.2, time:"4:58:24", pace:"10:54"},
//     {date:"2012-11-22", distanceName:"ten-k", raceName:"TXU Energy Turkey Trot 10K", distanceMiles:6.2, time:"1:01:51", pace:"9:57"},
//     {date:"2010-02-27", distanceName:"ten-k", raceName:"ConocoPhillips Rodeo Run 10K", distanceMiles:6.2, time:"0:58:18", pace:"9:23"},
//     {date:"2008-06-28", distanceName:"five-k", raceName:"Time To Fly Run", distanceMiles:3.1, time:"0:27:50", pace:"8:58"},
//     {date:"2020-01-19", distanceName:"half-marathon", raceName:"Aramco Houston Half Marathon", distanceMiles:13.1, time:"2:06:46", pace:"9:41"}
// ];
let raceData = [];

function loadRaceData() {
    fetch('/data/race-data.json')
    .then(response => response.json())
    .then(data => {
        raceData = data.races;   
        displayRaceData();
    })
}

function displayRaceData() {
    
    const width = 500;
    const height = 300;
    const padding = 30;

    //d3.select("#pace-graph-container")
    //    .append("p").text("Min Date: " + minDate + "; Max Date: " + maxDate + "; Fastest Pace: " + fastestPaceInSeconds + "; Slowest Pace: " + slowestPaceInSeconds);

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



function convertPaceStringToSeconds(time) {
    let msArray = time.split(':');
    return ((+msArray[0]) * 60) + (+msArray[1]);
}