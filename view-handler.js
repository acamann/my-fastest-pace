var currentView = 'racesView';

// set up elements with event handlers:
function addEventListeners() {
    document.getElementById('racesLink').addEventListener("click", 
        function() { clickViewLink(event, 'racesView'); });
    document.getElementById('addRaceLink').addEventListener("click", 
        function() { clickViewLink(event, 'addRaceView'); });
    document.getElementById('userLink').addEventListener("click", 
        function() { clickViewLink(event, 'userView'); });
}

function clickViewLink(event, desiredView) {
    event.preventDefault();
    changeView(desiredView);
}

function changeView(desiredView) {
    if (currentView != desiredView) {
        hide(currentView);
        show(desiredView);
        currentView = desiredView;
    }
}

function displayMainView() {
    changeView('racesView');
}

function hide(elementID) {
    document.getElementById(elementID).classList.remove('visible');
    document.getElementById(elementID).classList.add('invisible');
}

function show(elementID) {
    document.getElementById(elementID).classList.remove('invisible');
    document.getElementById(elementID).classList.add('visible');
}

window.addEventListener("load", addEventListeners);