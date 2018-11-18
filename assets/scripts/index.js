//imports
const mainMenu = require("./components/menu");
var ipcRenderer = require('electron').ipcRenderer;
const CodeMirror = require("codemirror");

//Main UI
var editableCodeMirror,feedbackWindow,infoBar,codeWindow,currentStyleSheet,setTerminal;
codeWindow = document.getElementById("codeWindow");
infoBar = document.getElementById("bottom-info-bar");
feedbackWindow = document.getElementById("feedback-window");

//Stylesheet
currentStyleSheet = document.getElementById("codeMirrorThemeCss");

//Init Terminal
setTerminal = function (){
    var term = new Terminal();
    term.open(document.getElementById('terminal'));
    term.on("data",function(data){
        term.write(data);
    });
}

//Init editor 
function setEditor(){
    var config = {
        lineNumbers: true
    };
    editableCodeMirror = CodeMirror.fromTextArea(codeWindow, config);
    
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        setStylesheet(payload);
        editableCodeMirror.setOption("theme",payload);
      });
    
}   

//On-load
window.onload = function(){
    setEditor();
    mainMenu.createMenu();
}

//Setting Stylesheet
function setStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}
//Exports
module.exports = {
    setTerminal,editableCodeMirror,feedbackWindow,infoBar,codeWindow,currentStyleSheet
}

