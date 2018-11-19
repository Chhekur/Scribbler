//Imports
const mainMenu = require("./components/menu");
var ipcRenderer = require('electron').ipcRenderer;


//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.infoBar = document.getElementById("bottom-info-bar");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");

//Language Mode UI
var infoBarLanguageMode = document.getElementById("languageModeSpan");
var languageModeDialog = document.getElementById("languageModeDialog");
var languageListElements = document.querySelectorAll("li");

//HTML Stylesheet
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");
//Init Editor 
function setEditor(){
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, {
        lineNumbers: true,
        matchBrackets:true,
    });
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        setStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
      });
}
    
//On-load
window.onload = function(){
    setEditor();
    setMode();
    mainMenu.createMenu();
    
}

//Setting Stylesheet
function setStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}

//Set Language-Mode
function setMode(){
    exports.editableCodeMirror.getOption("mode");
    //Check CodeMirror Mode
    if(infoBarLanguageMode.innerHTML == "" ){
        infoBarLanguageMode.innerHTML = "None"
    }else{
        infoBarLanguageMode.innerHTML = exports.editableCodeMirror.getOption("mode");
    }
    infoBarLanguageMode.addEventListener("click",function(){
        
        //Check for visibility of dialog
        if(languageModeDialog.style.display == "none"){
            languageModeDialog.style.display = "flex";
        }else{
            languageModeDialog.style.display = "none";
        }

        for(var i = 0; i < languageListElements.length; i++){
            languageListElements[i].addEventListener("click",function(){
                //Set CodeMirror Mode
                var newMode = this.textContent.toLowerCase();
                exports.editableCodeMirror.setOption("mode",newMode);
                languageModeDialog.style.display ="none";
                infoBarLanguageMode.innerHTML = newMode.toLocaleUpperCase();
        });
    }
    });      
}


        
   



