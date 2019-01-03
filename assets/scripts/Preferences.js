//Imports
var remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
var prefTheme = document.getElementById("selectTheme");
var prefFontSize = document.getElementById("selectFontSize");
var applyPrefs = document.getElementById("applyPreferences");

//Preferences 
var prefs = {};
//Change Theme
function setTheme(){
  var selectedTheme = prefTheme.options[prefTheme.selectedIndex].textContent;
  ipcRenderer.send('selected-theme',selectedTheme);
}

//Change font-size
function setFontSize(){
  var selectedFontSize = prefFontSize.options[prefFontSize.selectedIndex].textContent;
  ipcRenderer.send("selected-font-size",selectedFontSize);
}
//Change info-bar color
//Change View
//Change font-family
function setFontFamily(){
  
}

