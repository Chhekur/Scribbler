//Libs & Components
const PreferencesStorage = require("electron-store");
const  remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const NotificationManager = require("../Components/NotificationManager");
//Main UI
var prefTheme = document.getElementById("selectTheme");
var prefFontSize = document.getElementById("selectFontSize");
var prefBoxShadow = document.getElementById("selectBoxShadow");

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
/**
 * 
 */
function SetBoxShadow(){
  prefBoxShadow.addEventListener("change",function(){

  })
}

setTheme();
