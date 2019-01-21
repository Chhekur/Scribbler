//Libs & Components
const PreferencesStorage = require("electron-store");
const  remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const NotificationManager = require("../Components/NotificationManager");
//Main UI
var prefTheme = document.getElementById("selectTheme");
var prefFontSize = document.getElementById("selectFontSize");
var prefBoxShadow = document.getElementById("selectBoxShadow");
var prefSideBarBackground = document.getElementById("selectSidebarBackground");
var prefAutoPairing = document.getElementById("selectAutoPairing");
var prefBracketHighlighting  = document.getElementById("selectBracketHighlighting");
//Preferences 
const PreferencesSettings = new PreferencesStorage();
//Setting vars
var boxShadowSetting = "settings.box-shadow-settings";
var SideBarBackgroundSetting = "settings.sideBarBackground";
var ColorThemeSetting = "settings.color-theme-settings"
var FontSizeSetting = "settings.font-size";
var AutoPairingSetting = "settings.auto-pairing";
var BracketHighlightingSetting  = "settings.bracket-highlighting";
//Default Settings
var boxShadowNull = "0px 1px 2px 0 rgba(34, 36, 38, 0.15)";
var boxShadowDefault = "0px 0px 20px rgba(34, 36, 38, 0.15)";
var SideBarBackgroundDefault = "#fff";
var AutoPairingDefault = true;
var BracketHighlightingDefault = true;
/**
 * 
 */
function setTheme(){
  prefTheme.value = PreferencesSettings.get(ColorThemeSetting);
  prefTheme.addEventListener("change",function(){
    var selectedTheme = prefTheme.options[prefTheme.selectedIndex].textContent;
    PreferencesSettings.set(ColorThemeSetting,selectedTheme);
  ipcRenderer.send('selected-theme',selectedTheme);
  NotificationManager.displayProgressNotification("Just one second...","Changing the settings, please wait...","notched circle loading icon");
  NotificationManager.progressWrapper.style.visibility =" hidden";
  });  
}
/**
 * 
 */
function setFontSize(){
  var selectedFontSize = prefFontSize.options[prefFontSize.selectedIndex].textContent;
  ipcRenderer.send("selected-font-size",selectedFontSize);
}
/**
 * Listen for ENTER
 */
function SetBoxShadow(){
  if(prefBoxShadow.value == undefined || PreferencesSettings.get(boxShadowSetting) == undefined){
    //Reset to default
    PreferencesSettings.set(boxShadowSetting,boxShadowDefault);
  }
  prefBoxShadow.value = PreferencesSettings.get(boxShadowSetting);
  prefBoxShadow.onkeypress = function(e){
    var keycode = e.keyCode || e.which;
    if(keycode == "13"){
      PreferencesSettings.set(boxShadowSetting,prefBoxShadow.value);
    }
  }
}
function SetSideBarBackgroundColor(){
  if(prefSideBarBackground.value == undefined || prefSideBarBackground == "" || PreferencesSettings.get(SideBarBackgroundSetting) == undefined){
    //Reset to default
    PreferencesSettings.set(SideBarBackgroundSetting,SideBarBackgroundDefault);
  }else{
    prefSideBarBackground.value = PreferencesSettings.get(SideBarBackgroundSetting);
    prefSideBarBackground.onkeypress = function(e){
      var keycode = e.keyCode || e.which;
      if(keycode == "13"){
        PreferencesSettings.set(SideBarBackgroundSetting,prefSideBarBackground.value);
      }
    }
  }
}
/**
 * 
 */
function SetAutoPairing(){
  //Set the value to whatever the editor is 
  prefAutoPairing.value = PreferencesSettings.get(AutoPairingSetting);
  prefAutoPairing.onkeypress = function(e){
    var keycode = e.keyCode || e.which;
    if(keycode == "13"){
      PreferencesSettings.set(AutoPairingSetting,prefAutoPairing.value);
    }
  }

  
}
/**
 * 
 */
function SetBracketHighlighting(){
  //Set the value to whatever the editor is 
  prefBracketHighlighting.value = PreferencesSettings.get(BracketHighlightingSetting);
  prefBracketHighlighting.onkeypress = function(e){
    var keycode = e.keyCode || e.which;
    if(keycode == "13"){
      PreferencesSettings.set(BracketHighlightingSetting,prefBracketHighlighting.value);
    }
  }
} 
/**
 * Detect changes and reload the window
 */
function DetectChange(){
  document.addEventListener('DOMContentLoaded', () => {
    PreferencesSettings.onDidChange('settings', (newValue, oldValue) => {
      ipcRenderer.send("settings-changed","reload");
    })
  })
}

DetectChange();
setTheme();
SetBoxShadow();
SetSideBarBackgroundColor();
SetAutoPairing();
SetBracketHighlighting();