const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;

const {remote,shell} = require("electron");
const exec = require('child_process').exec;
const FileManager = require("./FileManager");

//Side-bar
const SideBar = document.getElementById("ExplorerSideBar");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const runCodeBtn = document.getElementById("run-code");

//Menu
const {Menu,MenuItem} = require("electron").remote;
var TabMenu = new Menu();
//Toggling the sidebar view 
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
        for(var i=0; i<SideBar.childNodes.length;i++){
            if(SideBar.childNodes[i].nodeName == "A"){
               SideBar.childNodes[i].addEventListener("click",function(e){
                CurrentFile = e.target.name;
                fs.readFile(CurrentFile,"utf-8",function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                    EditorManager.editableCodeMirror.setValue(data);
                    }
                })
               });
               SideBar.childNodes[i].addEventListener("contextmenu",function(e){
                   e.preventDefault();
                   CreateTabMenu(e);
               });
            }
        }
        
        
    }
}
function CreateTabMenu(e){
    var CloseTabMenuItem = new MenuItem({label: "Close Tab",click:CloseTab})
    var RevealInExplorerMenuItem = new MenuItem({label: "Reveal In Explorer",click:RevealFileInExplorer(e)});
    TabMenu.append(CloseTabMenuItem);
    TabMenu.append(RevealInExplorerMenuItem);
    TabMenu.popup(remote.getCurrentWindow());
}

function CloseTab(){

}

function RevealFileInExplorer(e){
    var file = e.target.name;
    shell.showItemInFolder(file);

}
function UpdateTab(CurrentFile){
    //Get the current tab name 
   console.log(CurrentFile); 
}

function CreateTab(CurrentFile){
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".tmp"){
        CurrentFile = "Untitled";
    }  
    //Create the remove button 
    var newSideBarIcon = document.createElement("i"); 
       newSideBarIcon.setAttribute("class","fa fa-file-code");
       newSideBarIcon.style.marginRight = "5px";
  
       var newSideBarText = document.createTextNode(path.basename(CurrentFile.toString()));

       var newSideBarItem = document.createElement("a");
       newSideBarItem.setAttribute("class","item");
       newSideBarItem.setAttribute("name",CurrentFile.toString()); 
       newSideBarItem.setAttribute("title",CurrentFile.toString());
       //Placing them in order
       newSideBarItem.appendChild(newSideBarIcon);
       newSideBarItem.appendChild(newSideBarText);
       SideBar.appendChild(newSideBarItem);
}


function RunJava(CurrentFile){
    //Grab the current file
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile != " "){
     runCodeBtn.addEventListener("click",function(){
         //Save the file beforehand
        exec("javac "+path.basename(CurrentFile.toString()),{cwd: path.dirname(CurrentFile.toString())});
        exec("java "+path.basename(CurrentFile.toString(),path.extname(CurrentFile.toString())),{cwd: path.dirname(CurrentFile.toString())},function(err,out,stderr){
            if(err){
                console.log(err);
            }
            if(stderr){
                console.log(stderr);
            }
            console.log(out)
        });
     });
    }else{
        NotificationManager.displayNotification("danger","Error when running java on "+path.basename(CurrentFile.toString()),"bottomCenter",1000,"fa fa-check-circle","false","light",12);
    }
    //Compile it 
    //Return the output 
    //Create a second screen for it 
    //Display the second screen 

}


module.exports = {
    SideBarToggle,
    ExplorerManagement,
    CreateTab,
    PreferencesToggle,
    UpdateTab,
    RunJava
}