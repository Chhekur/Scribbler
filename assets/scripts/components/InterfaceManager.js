const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;
const {Menu,MenuItem} = require("electron").remote;
const exec = require('child_process').exec;
const FileManager = require("./FileManager");
//Side-bar
const SideBar = document.getElementById("ExplorerSideBar");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const runCodeBtn = document.getElementById("run-code");
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
               SideBar.childNodes[i].addEventListener("click",function(e){
                fs.readFile(e.target.name,"utf-8",function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(e.target.name);
                        EditorManager.editableCodeMirror.setValue(data);
                    }
                })
               });
               SideBar.childNodes[i].addEventListener("contextmenu",function(e){
                alert(e.target.name);
               });
            }
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
    //Create the remove button 
    
    var newSideBarIcon = document.createElement("i"); 
       newSideBarIcon.setAttribute("class","far fa-file-code");
       newSideBarIcon.style.marginRight = "5px";
  
       var newSideBarText = document.createTextNode(path.basename(CurrentFile.toString()));

       var newSideBarItem = document.createElement("a");
       newSideBarItem.setAttribute("class","item");
       newSideBarItem.setAttribute("name",CurrentFile.toString()); 
       
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