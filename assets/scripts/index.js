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
var languageListElements = document.querySelectorAll("li");

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

    //Doesn't work need a work around for the li's
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

        for(var i = 0; i < languageListElements.length; i++){
            languageListElements[i].addEventListener("click",function(){
                //Set CodeMirror Mode
                var newMode = this.textContent.toLowerCase();
                exports.editableCodeMirror.setOption("mode","'"+newMode+"'");
                languageModeDialog.style.display ="none";
                infoBarLanguageMode.innerHTML = newMode.toLocaleUpperCase();
                
        });
    }
    });

       
}
        
   



