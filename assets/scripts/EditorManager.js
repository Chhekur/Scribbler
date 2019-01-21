var getCodeMirrorSetting;
var editableCodeMirror;
//Preferences 
const PreferencesStorage = require("electron-store");
const PreferencesSettings = new PreferencesStorage();
//Imports
const MainMenu = require("./components/MainMenu");
const InterfaceManager = require("./components/InterfaceManager");
const FileManager = require("./Components/FileManager");
const ipcRenderer = require('electron').ipcRenderer;
const remote = require("electron").remote;
const NotificationManager = require("./Components/NotificationManager");
//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];
var ToolBelt = document.getElementsByClassName("sidebar")[0];
var ExplorerSideBar = document.getElementsByClassName("sidebar")[1];

//HTML Stylesheet
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");
currentStyleSheet.href="node_modules/codemirror/theme/"+PreferencesSettings.get("settings.color-theme-settings")+".css";
//Init Editor 

function InitEditor(){
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, {
        
        lineNumbers: true,
        matchBrackets:MatchBracketSetting(),
        mode: "text/x-java",
        styleActiveLine: true,
		lineWrapping: true,
		foldGutter: true,
		autoCloseBrackets: AutoCloseBrackets(),
        autoCloseTags: true,
    
       // panel:true
        showTrailingSpace: true,
            //extraKeys: {"Ctrl-Space": "autocomplete","Ctrl-Q": function(cm){ editableCodeMirror.foldCode(editableCodeMirror.getCursor()); }},

        
        
    });
    Router();
    exports.editableCodeMirror.setOption("theme",PreferencesSettings.get("settings.color-theme-settings"));
}  
/**
 * On-load window 
 */
window.onload = function(){
    InitEditor();
    //Init menus 
    MainMenu.CreateMainMenu();
    InterfaceManager.CreateTabMenu();
    //Interface manager
    InterfaceManager.SideBarToggle();
    InterfaceManager.PreferencesToggle();
    //File Manager create dir 
    FileManager.CreateDefaultDir();
}

/**
 * 
 * @param {*} theme 
 */
function SetStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}

function MatchBracketSetting(){
    if(PreferencesSettings.get("settings.bracket-highlighting") == "true"){
        return true;
    }else{
        return false;
    }
   
}
function AutoCloseBrackets(){
    if(PreferencesSettings.get( "settings.auto-pairing") == "true"){
        return true;
    }else{
        return false;
    }
}
/**
 * Load preferences on load
 */
function Router(){
    PreferencesReciever(PreferencesSettings);
}
/**
 * Recieve preferences, and make editor changes accordingly 
 */
function PreferencesReciever(settings){
    ipcRenderer.on("settings-changed",function(event,payload){
        //Display modal detecting changed settings
       // DisplayResetModal('Preferences change detected, press ok to reset the editor');
    });
    //Settings to load
    SetBoxShadow(settings);
    SetSideBarBackground(settings);

    ipcRenderer.on("selected-theme",function(event,payload){
        SetStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
        ColourIntelligence();
    });
    ipcRenderer.on("selected-font-size",function(event,payload){
        var newFontSize = payload;
        codeMirroElem.style.fontSize = payload;
    })
 

}


/** 
 *  Tab colour, Sidebar colour, Explorer background, Icon colour
 */
function ColourIntelligence(){
    //UI Vars
}

/**
 * Change the shadow on the box value
 * @param {*} setting 
 */
function SetBoxShadow(setting){
    var boxShadowSettings = setting.get("settings.box-shadow-settings");
    ToolBelt.style.boxShadow = boxShadowSettings;
}
/**
 * Change the sidebar background color
 * @param {*} setting 
 */
function SetSideBarBackground(setting){
    var sideBarBackground = setting.get("settings.sideBarBackground");
    ToolBelt.style.background = sideBarBackground;

}
/**
 * Display reset modal that will require a message
 * @param {*} message 
 */
function DisplayResetModal(message){
    UIkit.modal.confirm(message).then(function() {
        remote.getCurrentWindow().reload();
        console.log('Confirmed.')
    }, function () {
        NotificationManager.displayNotification("info","Changes will appear when the editor is re-opened","bottomCenter",4000,"fa fa-info-circle",false,"light",12);
    });
}
module.exports = {
    editableCodeMirror,
    getCodeMirrorSetting
}