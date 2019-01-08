const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;

const {remote,shell,clipboard} = require("electron");
const exec = require('child_process').exec;
const FileManager = require("./FileManager");

//Side-bar
const SideBar = document.getElementById("explorer-side-bar");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const runCodeBtn = document.getElementById("run-code");

//Tab Icon
var newSideBarIcon = document.createElement("i"); 
newSideBarIcon.setAttribute("class","fa fa-caret-right");
newSideBarIcon.style.marginRight = "5px";
newSideBarIcon.style.visibility = "hidden";

//Menu
const {Menu,MenuItem} = require("electron").remote;
var TabMenu = new Menu();
var CloseTabMenuItem = new MenuItem({label: "Close Tab",click:CloseTab})
var RevealInExplorerMenuItem = new MenuItem({label: "Reveal In Explorer",click:RevealFileInExplorer});
var CopyRelativePath = new MenuItem({label: "Copy Relative Path",click:GetRelativeTabPath});
var CopyAbsolutePath = new MenuItem({label: "Copy Absolute Path",click:GetAbsoluteTabPath});
var CloseTabsToTheRight = new MenuItem({label: "Close To The Right",click:RevealFileInExplorer});
var CloseTabsToTheLeft = new MenuItem({label: "Close To The Left",click:RevealFileInExplorer});
var CloseOtherTabs = new MenuItem({label: "Close All Others",click:RevealFileInExplorer});
var TabMenuSeparator = new MenuItem({type:"separator"});
TabMenu.append(CloseTabMenuItem);
TabMenu.append(CloseTabsToTheLeft);
TabMenu.append(CloseTabsToTheRight);
TabMenu.append(TabMenuSeparator);
TabMenu.append(CopyRelativePath);
TabMenu.append(CopyAbsolutePath);
TabMenu.append(RevealInExplorerMenuItem);


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
/**
 * 
 * @param {*} CurrentFile 
 */
function ExplorerManagement(CurrentFile){
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile == " "){
       CreateTab(CurrentFile);
        for(var i=0; i<SideBar.childNodes.length;i++){
            if(SideBar.childNodes[i].nodeName == "A"){
               SideBar.childNodes[i].addEventListener("click",function(e){
                //Open the tab in the editor
                OpenTabInEditor(CurrentFile,e); 
               });
               SideBar.childNodes[i].addEventListener("contextmenu",function(e){
                   e.preventDefault();
                   TabMenu.popup(remote.getCurrentWindow());
               });
            }
        }
        
        
    }
}

/**
 * 
 * @param {*} CurrentFile 
 * @param {*} e 
 */
function OpenTabInEditor(CurrentFile,e){
    //Read the name of the tab and filename and adding it into the code mirror editor 
    CurrentFile = e.target.name;
    fs.readFile(CurrentFile,"utf-8",function(err,data){
        if(err){
            console.log(err);
        }else{
        EditorManager.editableCodeMirror.setValue(data);
        }
    });
}


/**
 * 
 * @param {*} e 
 */
function CreateTabMenu(e){
  
    
}


function CloseTab(){
    console.log("Closing tabs...");
}
function GetAbsoluteTabPath(){
    for(var i =0 ; i<SideBar.childNodes.length; i++){
        var tab = SideBar.childNodes[i];
        if(tab.nodeName == "A"){
            clipboard.writeText(tab.name);
        }
    }

}
function GetRelativeTabPath(){
    for(var i =0 ; i<SideBar.childNodes.length; i++){
        var tab = SideBar.childNodes[i];
        if(tab.nodeName == "A"){
       
        }
    }

}
function CloseOtherTabs(){

}



function RevealFileInExplorer(){
    //Loop again 
    for(var i =0 ; i<SideBar.childNodes.length; i++){
        var tab = SideBar.childNodes[i];
        if(tab.nodeName == "A"){
        shell.showItemInFolder(tab.name);
        }
    }

}
function UpdateTab(CurrentFile){
    //Get the current tab name 
   console.log(CurrentFile); 
}

function CreateTab(CurrentFile){
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".tmp"){
        CurrentFile = "Untitled";
    }  
  
  
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
}


module.exports = {
    SideBarToggle,
    ExplorerManagement,
    CreateTab,
    PreferencesToggle,
    UpdateTab,
    RunJava,
    CreateTabMenu
}