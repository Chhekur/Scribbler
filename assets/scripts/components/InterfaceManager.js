const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;
const {Menu,MenuItem} = require("electron").remote;
const { exec } = require('child_process');
//Side-bar
const SideBar = document.getElementById("ExplorerSideBar");
var sideBarToggle = document.getElementById("sidebar-toggle");
var preferencesToggle  = document.getElementById("preferences-toggle");
//Toggling the sidebar view 

//New Menu
function CreatePopUpMenu(label,method){
    var popUpMnenu = new Menu();
    popUpMnenu.append(newMenuItem({label:label,click:method }));
}
function SideBarToggle(){
    sideBarToggle.addEventListener("click",function(){
        if(SideBar.classList.contains("visible") == true){
            SideBar.classList.remove("visible");
        }else{
            SideBar.classList.add("visible");
        }
    });
    
}
function PreferencesToggle(){
    preferencesToggle.addEventListener("click",function(){
        ipcRenderer.send("show-prefs");
    });
}
function ExplorerManagement(CurrentFile){

    if(CurrentFile != null || CurrentFile != undefined || CurrentFile == " "){
       CreateTab(CurrentFile);
        //Selecting between the files
        for(var i=0; i<SideBar.childNodes.length;i++){
            if(SideBar.childNodes[i].nodeName == "A"){
               SideBar.childNodes[i].addEventListener("click",function(){
                fs.readFile(CurrentFile[0],"utf-8",function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(CurrentFile);
                        EditorManager.editableCodeMirror.setValue(data);
                    }
                })
               });
            }
        }
        
        
    }
}

function CreateTab(CurrentFile){
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".tmp"){
        CurrentFile = "Untitled";
    }

    //Create the remove button 
    
    var newSideBarIcon = document.createElement("i"); 
       newSideBarIcon.setAttribute("class","far fa-file-code");
       newSideBarIcon.style.marginRight = "5px";
  

       var newSideBarItem = document.createElement("a");
       newSideBarItem.setAttribute("class","item");
       newSideBarItem.setAttribute("title",CurrentFile.toString()); 
       var newSideBarText = document.createTextNode(path.basename(CurrentFile.toString()));
       
       //Placing them in order
       newSideBarItem.appendChild(newSideBarIcon);
       newSideBarItem.appendChild(newSideBarText);
       SideBar.appendChild(newSideBarItem);
}

function RunJava(){
    //Grab the current file 
    //Compile it 
    //Return the output 
    //Create a second screen for it 
    //Display the second screen 

}
module.exports = {
    SideBarToggle,
    ExplorerManagement,
    CreateTab,
    PreferencesToggle
}