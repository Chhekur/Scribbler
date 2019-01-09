const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;
const {Menu,MenuItem} = require("electron").remote;
const {remote,shell,clipboard} = require("electron");
const cp = require('child_process');
const FileManager = require("./FileManager");
const $ = require("jquery");
//Side-bar
const tabContainer = document.getElementById("tab-container");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const runCodeBtn = document.getElementById("run-code");

var instance;
//Feddback window 
var feebackInterface = document.getElementById("feedback-text");
//Menu
var TabMenu;
CreateTabMenu();

//Titlebar filename 
var TitleBarFileName =  document.getElementById("title-bar-filename");

function CreateTabMenu(){
    TabMenu = new Menu();
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

}

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
var count = 0;
function ExplorerManagement(CurrentFile){
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile == " "){
       CreateTab(CurrentFile);
        for(var i=0; i<tabContainer.childNodes.length;i++){
            if(tabContainer.childNodes[i].nodeName == "LI"){
                tabContainer.childNodes[i].addEventListener("click",function(e){
                //Open the tab in the editor
                OpenTabInEditor(CurrentFile,e); 
               });
               tabContainer.childNodes[i].addEventListener("contextmenu",function(e){
                   TabMenu.popup(remote.getCurrentWindow());
                   instance = e.target.name;
                   return instance;
                  
                   
               });
            }
        }
        
        
    }
}


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

function CloseTab(){
    console.log("Closing tabs...");
}

function GetAbsoluteTabPath(){
   clipboard.writeText(instance);
   NotificationManager.displayNotification("info","Absolute path copied!","bottomCenter",2000,"fa fa-info-circle",false,"light",12);

}

function GetRelativeTabPath(){

}
function CloseOtherTabs(){

}

function RevealFileInExplorer(){
    shell.showItemInFolder(instance);
}

function UpdateTab(CurrentFile){
    //Get the current tab name 
   console.log(CurrentFile); 
}

function CreateTab(CurrentFile){
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".tmp"){
        CurrentFile = "Untitled";
    } 

    //Check if there is a tab with the same name 
    //Create li 
    var newTabItemListItem = document.createElement("li");
    //Create a 
    var newTabItemLink = document.createElement("a");
    //Set attribute for link 
    newTabItemListItem.setAttribute("name",CurrentFile.toString()); 
    newTabItemListItem.setAttribute("title",CurrentFile.toString()); 
    newTabItemLink.setAttribute("name",CurrentFile.toString()); 
    newTabItemLink.setAttribute("title",CurrentFile.toString()); 
    //Create text 
    var newTabItemTextNode =document.createTextNode(path.basename(CurrentFile.toString()));
    //Append text to the a
    newTabItemLink.appendChild(newTabItemTextNode);
    //Append a to li 
    newTabItemListItem.appendChild(newTabItemLink);
    //Append to tab container
    tabContainer.appendChild(newTabItemListItem);

    //Check if they have the same name 
    tabContainer.appendChild(newTabItemListItem);
}


function RunJava(CurrentFile){
    //Grab the current file
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile != " "){
     runCodeBtn.addEventListener("click",function(){
         //Save the file beforehand
        var command = "node "+path.basename(CurrentFile.toString());
        cp.exec(command, {cwd:path.dirname(CurrentFile.toString())},function(err,stdout,stderr){
            if(err){
                feebackInterface.innerHTML = err;
                console.log(err);
            }
            if(stderr){
                feebackInterface.innerHTML = stderr;
                console.log(stderr);
            }
           feebackInterface.innerHTML = stdout;

           EditorManager.editableCodeMirror.addLineWidget(EditorManager.editableCodeMirror.getCursor().line,NotificationManager.createErrorNode("fa fa-exclamation-circle","Error") );
           console.log(stdout);
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
    TitleBarFileName,
    RunJava,
    
    
}