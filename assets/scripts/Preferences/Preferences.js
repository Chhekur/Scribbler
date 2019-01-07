//Imports
var remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
var prefTheme = document.getElementById("selectTheme");
var prefFontSize = document.getElementById("selectFontSize");
var applyPrefs = document.getElementById("applyPreferences");
const NotificationManager = require("../Components/NotificationManager");
//Preferences 
var prefs = {};

//Change Theme
function setTheme(){
  prefTheme.addEventListener("change",function(){
    var selectedTheme = prefTheme.options[prefTheme.selectedIndex].textContent;
  ipcRenderer.send('selected-theme',selectedTheme);
  NotificationManager.displayProgressNotification("Just one second...","Changing the settings, please wait...","notched circle loading icon");
  NotificationManager.progressWrapper.style.visibility =" hidden";
  });  
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

setTheme();