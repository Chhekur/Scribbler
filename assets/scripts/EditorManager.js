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
const cp = require("child_process");
//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];
var ToolBelt = document.getElementsByClassName("sidebar")[0];
var ExplorerSideBar = document.getElementsByClassName("sidebar")[1];
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");
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
    //Presets the themes
    exports.editableCodeMirror.setOption("theme",ThemeSetting());
    currentStyleSheet.href =" node_modules/codemirror/theme/"+ThemeSetting()+".css";

}  
/**
 * On-load window 
 */
window.onload = function(){
    InterfaceManager.CheckForJava();
    InitEditor();
    //Init menus 
    MainMenu.CreateMainMenu();
    //Interface manager
    InterfaceManager.SideBarToggle();
    InterfaceManager.PreferencesToggle();
    //File Manager create dir 
    FileManager.CreateDefaultDir();
    NotificationManager.displayNotification("info","Before you start typing create a new file Ctrl+N","bottomCenter",5000,"fa fa-info-circle",false,"light",12);
    //Create new file 
    //FileManager.CreateNewFile();
}


/**
 * Get the setting and return a value depending on the output
 */
function MatchBracketSetting(){
    if(PreferencesSettings.get("settings.bracket-highlighting") == "true"){
        return true;
    }else{
        return false;
    }
   
}
/**
 * Auto close pairs such as brackets and quotes
 */
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
       DisplayResetModal('Preferences change detected, press ok to reset the editor');
    });
    //Settings to load
    SetBoxShadow(settings);
    SetSideBarBackground(settings);
    SetTheme();
    
    ipcRenderer.on("selected-font-size",function(event,payload){
        var newFontSize = payload;
        codeMirroElem.style.fontSize = payload;
    })
 

}
/**
 * 
 */
function SetTheme(){
    ipcRenderer.on("selected-theme",function(event,payload){
        currentStyleSheet.href =" node_modules/codemirror/theme/"+payload+".css";
        exports.editableCodeMirror.setOption("theme",payload);
        PreferencesSettings.set("appearance.color-theme-settings",payload);
        return payload;
    });
}
function ThemeSetting(){
    var getTheme = PreferencesSettings.get("appearance.color-theme-settings");
    return getTheme;
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
    ipcRenderer.on("box-shadow-settings",function(event,payload){
        ToolBelt.style.boxShadow = payload;
    });
    var boxShadowSettings = setting.get("appearance.box-shadow-settings");
    ToolBelt.style.boxShadow = boxShadowSettings;
}
/**
 * Change the sidebar background color
 * @param {*} setting 
 */
function SetSideBarBackground(setting){
    ipcRenderer.on("changed-sideBar-background",function(event,payload){
        ToolBelt.style.background = payload;

    });
    var sideBarBackground = setting.get("appearance.sideBarBackground");
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