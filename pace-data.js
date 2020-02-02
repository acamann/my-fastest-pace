var raceData = [];
var apiBaseURL = 'https://myfastestpace-server.herokuapp.com/';

function loadRaceData() {
    fetch(apiBaseURL+'races/')
        .then(checkStatus)
        .then(getJSON)
        .then(data => {
            raceData = data;
            sortTableByColumnName('date');   // this also displays the table, refactor for clarity
            displayPaceGraph();
            createCheckBoxes();
        })
        .catch((error) => {
            console.log(error);
        });
}


function checkStatus(response) {
    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(
            new Error(response.statusText)
        );
    }
}

function getJSON(response) {
    return response.json();
}

function sortTableByColumnName(column) {
    raceData = raceData.sort(function(a, b) {
        return d3.descending(a[column], b[column]);
    });
    displayRaceTableData();
}

function displayPaceGraph() {
    
    const width = 500;
    const height = 300;
    const padding = 40;
    const seconds_scale_padding = 10;
    const date_scale_padding = 1000 * 60 * 60 * 24 * 200;

    const xScale = d3.scaleLinear()
                        .domain([d3.min(raceData, (race) => Date.parse(race.date)) - date_scale_padding, d3.max(raceData, (race) => Date.parse(race.date)) + date_scale_padding])
                        .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d3.timeFormat("%-m/%Y"));
    
    const yScale = d3.scaleLinear()
                        .domain([d3.min(raceData, (race) => convertPaceStringToSeconds(race.pace)) - seconds_scale_padding, d3.max(raceData, (race) => convertPaceStringToSeconds(race.pace)) + seconds_scale_padding])
                        .range([height - padding, padding]);
    const yAxis = d3.axisLeft(yScale)
                        .tickFormat(function(d) {
                                return d3.timeFormat("%-M:%S")( new Date(0).setSeconds(d))
                        });

    var svg = d3.select("#pace-graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + width + " " + height);

    var circles = svg.selectAll("circle")
        .data(raceData)
        .enter()
        .append("circle")
        .attr("cx", (race) => xScale(Date.parse(race.date)))
        .attr("cy", (race) => yScale(convertPaceStringToSeconds(race.pace)))
        .attr("r", 2)
        .attr("class", (race) => race.distanceName + " race-data");

    circles.append("title")
        .text((race) => race.raceName + ", " + race.date);
    
    svg.selectAll("text")
        .data(raceData)
        .enter()
        .append("text")
        .attr("class", (race) => race.distanceName + " data-label")
        .text((race) => race.pace)
        .attr("x", (race) => xScale(Date.parse(race.date)) + 4)
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
        .attr("class", (d) => d)
        .text((d) => cleanRaceName(d))
        .append("input")
        .attr("type", "checkbox")
        .attr("name", (d) => d)
        .attr("value", (d) => d)
        .attr("checked", "checked")
        .on("click", function(){
            toggleCheckBox(this);
        });
}

function toggleCheckBox(element) {
    // Determine if current type is visible
    var active   = element.checked;           
    newOpacity = active ? 1 : 0;

    // Hide or show the elements
    d3.selectAll("circle." + element.name).style("opacity", newOpacity);
    d3.selectAll("text." + element.name).style("opacity", newOpacity);
}

function displayRaceTableData() {
    d3.selectAll("#race-table-container > *").remove();
    addTableToDOM(raceData, ['date', 'raceName', 'distanceMiles', 'time', 'pace']);
}

function addTableToDOM(data, columns) {
    var table = d3.select('#race-table-container')
        .append('table')
    var thead = table.append('thead')
    var	tbody = table.append('tbody');

    table.attr("id", "race-table");

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
        .append('a')
        .attr("href", "#")
        .attr("id", function (column) { return column; })
        .attr("onclick", function (column) {
            return "sortTableByColumnName('" + column + "')";
        })
        .text(function (column) { 
            return cleanColumnName(column); 
        });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .attr('class', function (column) { return column.distanceName; });

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
            if (column=="date") {
                return { column: column, value: cleanDate(row[column]) };
            } else {                
                return { column: column, value: row[column] };
            }
        });
      })
      .enter()
      .append('td')
        .text(function (d) { return d.value; });

  return table;
}


function addRace(event) {
    event.preventDefault();

    const form = document.getElementById('addRaceForm');

    const race = {
        date: form.date.value,
        distanceName: form.distance.options[form.distance.options.selectedIndex].getAttribute('distance-name'),
        raceName: form.raceName.value,
        distanceMiles: Number(form.distance.options[form.distance.options.selectedIndex].value),
        time: form.time.value,
        pace: form.pace.value,
        username: 'acamann'
    }

    // how to store and access currently logged-in username in session?
    
    console.log(race);

    fetch(apiBaseURL + 'races/add', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(race)
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data);
          });

    raceData.push(race);
    displayRaceTableData();
    displayMainView();
}


function convertPaceStringToSeconds(time) {
    let msArray = time.split(':');
    return ((+msArray[0]) * 60) + (+msArray[1]);
}

function cleanColumnName(column) {
    switch (column) {
        case "date": return "Date";
        case "distanceMiles" : return "Dist";
        case "raceName" : return "Race";
        case "pace" : return "Pace";
        case "time" : return "Time";
        default: return column;
    }
}

function cleanRaceName(name) {
    switch (name) {
        case "five-k": return "5K";
        case "half-marathon" : return "Half Marathon";
        case "marathon" : return "Marathon";
        case "ten-k" : return "10K";
        case "fifteen-k" : return "15K";
        case "five-mile" : return "5 Mile";
        default: return name;
    }
}

function cleanDate(d) {
    const date = new Date(d);
    return date.toDateString();
}