//Imports
const MainMenu = require("./components/MainMenu");
const FileManager = require("./components/FileManager");
const InterfaceManager = require("./components/InterfaceManager");
var ipcRenderer = require('electron').ipcRenderer;
const NotificationManager = require("./Components/NotificationManager");
//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];
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
}

function ColourIntelligence(){

}