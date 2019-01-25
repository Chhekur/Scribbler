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
var BracketHighlightingPreferenceWrapper = document.getElementById("bracketHighlightingPreferences");
//Preferences 
const PreferencesSettings = new PreferencesStorage();
//Appearance Settings
var boxShadowSetting = "appearance.box-shadow-settings";
var SideBarBackgroundSetting = "appearance.sideBarBackground";
var ColorThemeSetting = "appearance.color-theme-settings"
var FontSizeSetting = "appearance.font-size";
//Code func Settings
var AutoPairingSetting = "settings.auto-pairing";
var BracketHighlightingSetting  = "settings.bracket-highlighting";
//Default Settings
var boxShadowDefault = "0px 0px 20px rgba(34, 36, 38, 0.15)";
var SideBarBackgroundDefault = "#fff";
var AutoPairingDefault = true;
var BracketHighlightingDefault = true;
var ColorThemeSettingDefault = "base16-light";
//Reset button
var resetSettingsButton = document.getElementById("resetSettings");
//Check the settings first 
SettingsManagement();
/**
 * Set the theme 
 */
function SetTheme(){
  if(prefTheme.value == null || prefTheme == undefined){
    PreferencesSettings.set(ColorThemeSetting,ColorThemeSettingDefault);
  }
  prefTheme.value = PreferencesSettings.get(ColorThemeSetting);
  prefTheme.addEventListener("change",function(){
    var selectedTheme = prefTheme.options[prefTheme.selectedIndex].textContent;
    PreferencesSettings.set(ColorThemeSetting,selectedTheme);
    ipcRenderer.send('selected-theme',selectedTheme);

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
      CheckBoxShadowInput(prefBoxShadow.value);
      ipcRenderer.send("box-shadow-settings",prefBoxShadow.value);
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
        ipcRenderer.send("changed-sideBar-background",prefSideBarBackground.value);
        PreferencesSettings.set(SideBarBackgroundSetting,prefSideBarBackground.value);
      }
    }
  }
}
/**
 * Auto create quotes and brackets
 */
function SetAutoPairing(){
  //Set the value to whatever the editor is 
  if(prefAutoPairing.value == null || prefAutoPairing.value == undefined){
  
  }
  prefAutoPairing.value = PreferencesSettings.get(AutoPairingSetting);
  prefAutoPairing.onkeypress = function(e){
    var keycode = e.keyCode || e.which;
    if(keycode == "13"){
      //Check the input 
      if(ValidatePreference(prefAutoPairing) == true){
        ipcRenderer.send("selected-auto-pairing",prefAutoPairing.value);
        PreferencesSettings.set(AutoPairingSetting,prefAutoPairing.value);  
      }
     
    }
  }

  
}
/**
 * Sets bracket highlighting 
 */
function SetBracketHighlighting(){
  //Set the value to whatever the editor is 
  prefBracketHighlighting.value = PreferencesSettings.get(BracketHighlightingSetting);
  //To complete the entry press enter 
  prefBracketHighlighting.onkeypress = function(e){
    var keycode = e.keyCode || e.which;
    if(keycode == "13"){
      //Check the input only change if the input is true or false
      if(ValidatePreference(prefBracketHighlighting) == true){
        PreferencesSettings.set(BracketHighlightingSetting,prefBracketHighlighting.value);
      }
    }
  }
} 
/**
 * 
 */
function DetectChange(){
  document.addEventListener('DOMContentLoaded', () => {
    //If a change in the code-functionality settings reload the window
    PreferencesSettings.onDidChange('settings', (newValue, oldValue) => {
      ipcRenderer.send("settings-changed","reload");
    })
  })
}
/**
 * Check if they have entered the correct syntax
 * @param {} input 
 */
function CheckBoxShadowInput(input){

}
/**
 * Check the input of the bracket highlight
 * If not equal to true then display notification
 * @param {} input 
 */
function ValidatePreference(input){
  if(input.value == "true" || input.value == "false"){
    //Add success class for correct input 
    input.classList.add("uk-form-success")
   //Check if they have the danger class 
   if(input.classList.contains("uk-form-danger")){
    input.classList.remove("uk-form-danger");
   }
   //If they have the class remove it after a period of time
   if(input.classList.contains("uk-form-success")){
     setTimeout(function(){
      input.classList.remove("uk-form-success");
     },3000)
   }
    return true;
  }else{
    //Toggle the danger class
    input.classList.toggle("uk-form-danger");
    return false;
  }
}
function SettingsManagement(){
  //Check if the settings are not undefined 
  if(PreferencesSettings.get(AutoPairingSetting)== undefined){
    //Reset the setting
    PreferencesSettings.set(AutoPairingSetting,AutoPairingDefault);
  }
  if(PreferencesSettings.get(BracketHighlightingSetting)== undefined){
    //Reset the setting
    PreferencesSettings.set(BracketHighlightingSetting,BracketHighlightingDefault);
  }
  if(PreferencesSettings.get(boxShadowSetting)== undefined){
    //Reset the setting
    PreferencesSettings.set(boxShadowSetting,boxShadowDefault);
  }
  if(PreferencesSettings.get(ColorThemeSetting)== undefined){
    //Reset the setting
    PreferencesSettings.set(ColorThemeSetting,ColorThemeSettingDefault);
  }
  //Add event listener for the reset button 
  resetSettingsButton.addEventListener("click",function(){
    //Display modal to reset or cancel resetting the settings
    NotificationManager.DisplayModal("Are you sure you want to reset the settings",ResetSettings());
    
  });
 
}

function ResetSettings(){
  //Restore each item to the original setting
    PreferencesSettings.set(ColorThemeSetting,ColorThemeSettingDefault);
    PreferencesSettings.set(boxShadowSetting,boxShadowDefault);
    PreferencesSettings.set(BracketHighlightingSetting,BracketHighlightingDefault);
    PreferencesSettings.set(AutoPairingSetting,AutoPairingDefault);
}
 
DetectChange();
SetTheme();
SetBoxShadow();
SetSideBarBackgroundColor();
SetAutoPairing();
SetBracketHighlighting();