var currentView = 'racesView';

// set up elements with event handlers:
function addEventListeners() {
    document.getElementById('racesLink').addEventListener("click", 
        function() { changeView(event, 'racesView'); });
    document.getElementById('addRaceLink').addEventListener("click", 
        function() { changeView(event, 'addRaceView'); });
    document.getElementById('userLink').addEventListener("click", 
        function() { changeView(event, 'userView'); });
}

function changeView(event, desiredView) {
    event.preventDefault();
    if (currentView != desiredView) {
        hide(currentView);
        show(desiredView);
        currentView = desiredView;
    }
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