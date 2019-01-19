//Imports
const MainMenu = require("./components/MainMenu");
const InterfaceManager = require("./components/InterfaceManager");
const FileManager = require("./Components/FileManager");
var ipcRenderer = require('electron').ipcRenderer;
//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];
var ToolBelt = document.getElementsByClassName("sidebar")[0];
var ExplorerSideBar = document.getElementsByClassName("sidebar")[1];
//HTML Stylesheet
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");
//Init Editor 
function InitEditor(){
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, {
        lineNumbers: true,
        matchBrackets:true,
        mode: "text/x-java"
        
    });
    Router();
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
    //Load Prefs

}

/**
 * 
 * @param {*} theme 
 */
function SetStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}
function Router(){
    PreferencesReciever();
}
/**
 * Recieve preferences, and make editor changes accordingly 
 */
function PreferencesReciever(){
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        SetStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
        ColourIntelligence();
    });
    ipcRenderer.on("selected-font-size",function(event,payload){
        var newFontSize = payload;
        codeMirroElem.style.fontSize = payload;
    })
    ipcRenderer.on("selected-box-shadow",function(event,payload){
        if(payload == "No"){
           //Get the current box-shadaow 
           var CurrentToolBeltShadow,CurrentExplorerSideBarBoxShadow;
           //Set the shadow 
           ToolBelt.style.boxShadow = "0px 1px 2px 0 rgba(34, 36, 38, 0.15)";
           ExplorerSideBar.style.boxShadow = "0px 1px 2px 0 rgba(34, 36, 38, 0.15)";
        } 
    });

}


/**
 * When a theme changes, 
 *  Tab colour, Sidebar colour, Explorer background, Icon colour
 */
function ColourIntelligence(){
    //UI Vars
}