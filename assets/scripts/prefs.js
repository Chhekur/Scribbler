//Imports
var remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
var prefOptions = document.getElementById("select");
var applyPrefs = document.getElementById("applyPreferences");
//Preferences 
let prefs  = {};

//Save preferences
function savePrefs(){
  
}

//Change Theme
function setTheme(){
  var selectedTheme = prefOptions.options[prefOptions.selectedIndex].textContent;
  ipcRenderer.send('selected-theme',selectedTheme);
}

//Change font-size
//Change info-bar color
//Change View

