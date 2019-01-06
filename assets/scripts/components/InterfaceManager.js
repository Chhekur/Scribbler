const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");

//Side-bar
const SideBar = document.getElementById("ExplorerSideBar");
var sideBarToggle = document.getElementById("SideBarTool-sidebar-toggle");
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
function ExplorerManagement(CurrentFile){
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile == " "){
        
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


module.exports = {
    SideBarToggle,
    ExplorerManagement
}