//Imports
const MainMenu = require("./components/MainMenu");
const FileManager = require("./components/FileManager");
const EditorStyling = require("./components/EditorStyling");
const TerminalManager = require("./components/InterfaceManager");
var ipcRenderer = require('electron').ipcRenderer;

//Main UI
exports.codeWindow = document.getElementById("codeWindow");
exports.feedbackWindow = document.getElementById("feedback-window");
exports.currentFilename = document.getElementById("currentFilename");
var codeMirroElem = document.getElementsByTagName("html")[0];

/*
//Language Mode UI
var infoBarLanguageMode = document.getElementById("languageModeSpan");
var languageModeDialog = document.getElementById("languageModeDialog");
var languageListElements = document.querySelectorAll("li");
*/



//HTML Stylesheet
var currentStyleSheet = document.getElementById("codeMirrorThemeCss");

//Init Editor 
function InitEditor(){
    exports.editableCodeMirror = CodeMirror.fromTextArea(codeWindow, {
        lineNumbers: true,
        matchBrackets:true,
        mode: "scribble"
        
    });
    //Setting preferences
    ipcRenderer.on("selected-theme",function(event,payload){
        setStylesheet(payload);
        exports.editableCodeMirror.setOption("theme",payload);
        EditorStyling.SetBottomBarColor();

      });

      ipcRenderer.on("selected-font-size",function(event,payload){
          var newFontSize = payload;
          codeMirroElem.style.fontSize = payload;
      })
}
    
//On-load
window.onload = function(){
    InitEditor();
    //setMode();
    MainMenu.CreateMainMenu();
    //EditorStyling.SetBottomBarColor();
    //Auto Save check 
    if(FileManager.CurrentFile != null || FileManager.CurrentFile == " " || FileManager.CurrentFile != undefined){
        FileManager.AutoSave();
    }
    TerminalManager.InitTerminal();

    
    

    
    
    
}

//Setting fontSize
//Setting Stylesheet
function setStylesheet(theme){
    currentStyleSheet.href="node_modules/codemirror/theme/"+theme+".css";
}

/*
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
*/


        
   



