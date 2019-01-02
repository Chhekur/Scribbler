//Imports
const mainMenu = require("./components/menu");
var ipcRenderer = require('electron').ipcRenderer;

//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.infoBar = document.getElementById("bottom-info-bar");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];
//Language Mode UI
var infoBarLanguageMode = document.getElementById("languageModeSpan");
var languageModeDialog = document.getElementById("languageModeDialog");
var languageListElements = document.querySelectorAll("li");



//Setting Scribble Mode 
var keywords = ["timer", "counter", "version"];
CodeMirror.defineMode("scribble", function() {
  return {
    token: function(stream, state) {
      stream.eatWhile(/\w/);

      if (arrayContains(stream.current(), keywords)) {
        return "style1";
      }
      stream.next();
    }
  };

});
function arrayContains(needle, arrhaystack) {
  var lower = needle.toLowerCase();
  return (arrhaystack.indexOf(lower) > -1);
}

//HTML Stylesheet
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");

//Init Editor 
function setEditor(){
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, {
        lineNumbers: true,
        matchBrackets:true,
        mode: "scribble"
        
    });
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        setStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
      });

      ipcRenderer.on("selected-font-size",function(event,payload){
          var newFontSize = payload;
          codeMirroElem.style.fontSize = payload;
      })
}
    
//On-load
window.onload = function(){
    setEditor();
    setMode();
    mainMenu.createMenu();
    
}

//Setting fontSize
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


        
   



