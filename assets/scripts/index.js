//Imports
const mainMenu = require("./components/menu");
var ipcRenderer = require('electron').ipcRenderer;
const CodeMirror = require("codemirror");

//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.infoBar = document.getElementById("bottom-info-bar");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");

//Language Mode UI
var infoBarLanguageMode = document.getElementById("languageModeSpan");
var languageModeDialog = document.getElementById("languageModeDialog");
var languagesList = document.getElementById("langaugesList");
var languageListElements = languagesList.getElementsByTagName("li");

//HTML Stylesheet
currentStyleSheet = document.getElementById("codeMirrorThemeCss");

//Init Terminal
setTerminal = function (){
    var term = new Terminal();
    term.open(document.getElementById('terminal'));
    term.on("data",function(data){
        term.write(data);
    });
}

//Init Editor 
function setEditor(){
    var config = {
        lineNumbers: true,
        mode: "javascript"
        
    };
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, config);
    
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        setStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
      });
    
}   

//On-load
window.onload = function(){
    setEditor();
    mainMenu.createMenu();
    setMode();
}

//Setting Stylesheet
function setStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}

//Set Language-Mode
function setMode(){
    infoBarLanguageMode.addEventListener("click",function(){
        
        //Check for visibility of dialog
        if(languageModeDialog.style.display == "none"){
            languageModeDialog.style.display = "flex";
        }else{
            languageModeDialog.style.display = "none";
        }
    });
        //Loop through language list 
        for(var i = 0; i < languageListElements.length; i++){
            var selectedNode = languageListElements[i];
            selectedNode.addEventListener("click",function(){
                //Set CodeMirror Mode
                exports.editableCodeMirror.setOption("mode","'"+selectedNode.textContent.toLowerCase()+"'");
                languageModeDialog.style.display = "none";
                infoBarLanguageMode.innerHTML = selectedNode.textContent;
                
            })
        }
        
   
}


