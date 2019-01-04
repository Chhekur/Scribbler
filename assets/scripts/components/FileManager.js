//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog} = require("electron").remote;
const NotificationManager = require("./NotificationManager");
var isAlreadySaved = false;
var newTabName;
//Tabs 
var tabList = document.getElementById("tab-group");
//Current file 
var CurrentFile;
//Import base
var EditorManager = require("../EditorManager");

//Open File
function OpenFile(){
    dialog.showOpenDialog(function(InstanceFile){
        if(InstanceFile == undefined){
            return;
        }else{
            fs.readFile(InstanceFile[0],'utf-8',function(err,data){
                if(err){
                    console.log(err);
                }else{
                    CurrentFile = InstanceFile;
                    //Tab management method
                    TabManagement(CurrentFile);
                    //Writing the data to the window
                    EditorManager.editableCodeMirror.setValue(data);                
                }
            })
        }
    }) 
    

    
}
//Save File
function AutoSave(){
    //Set interval for saving every 7 seconds 
        setInterval(function(){
            fs.writeFile(CurrentFile[0],EditorManager.editableCodeMirror.getValue(),function(err){
                if(err){
                   NotificationManager.displayNotification("err","Failed to save, please try again later","bottomCenter",1000,"fa fa-ban",true,"light",12);
                }else{
                    NotificationManager.displayNotification("success","Save successful","bottomCenter",800,"fa fa-check-circle",false,"light",12);
                }
            });
        },1000);
    
    //Check if auto-save feature is enabled (future feature)
}

//Normal save 
function Save(){
    //Check for a current file name
    if(CurrentFile == null || CurrentFile == " "){
        SaveAs();
    }else{
        fs.writeFile(CurrentFile[0],EditorManager.editableCodeMirror.getValue(),function(err){
            if(err){
               NotificationManager.displayNotification("err","Failed to save, please try again later","bottomCenter",2000,"fa fa-ban",true,"light",12);
            }else{
                NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
            }
        });
    }
}

//Save File As
function SaveAs(){
    dialog.showSaveDialog(function(InstanceFile){
        if(InstanceFile == undefined){
            console.log("Error the file is undefined, please try again");
        }else{
            fs.writeFile(InstanceFile,EditorManager.editableCodeMirror.getValue().toString(),function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("New Save complete");

                    //Set InstanceFile
                    isAlreadySaved = true;
                    InstanceFile = CurrentFile;
                    //Display notification
                    NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
                    //Set time out on closing notification 
                                

                }
            });
        }
    })
}


//Open Folder
function OpenFolder() {
    dialog.showOpenDialog({properties:["openDirectory"],title:"Select Folder"},function(folderPath){
        if(folderPath == undefined){
            return;
        }else{
        //Create the file hirearchy
        fs.readdir("/",function(err,files){
            if(err){
                console.log(err);
            }else{
                //Display the files
                files.forEach(file,function(){
                    console.log(file);
                });
            }
        });
    }
});
}


//Run java
function runJava(){

}

//Running Scribble
function runScribble() {

}

//Create new window
function createNewWindow(){
    //Create new instance of the window 
    console.log("Creating new window");
}

//Create new file and tab
function TabManagement (InstanceFile) {
    
    console.log("Creating a new file");
    if(InstanceFile == undefined || InstanceFile == null){
        newTabName = "Untitled";
    }else{
        newTabName = path.basename(InstanceFile.toString());
    }

    var newTab = document.createElement("li");
    newTab.setAttribute("title",InstanceFile);

    //Create tab 
    var tabContent = document.createElement("a");
    tabContent.setAttribute("href","#");
   
    tabContent.appendChild(document.createTextNode(newTabName));
    var completeTab = newTab.appendChild(tabContent);

    //Append tab
    tabList.appendChild(newTab);
    //Read the file path of each tab and re-read the content into the windiow
    
    for(var i = 0; i < tabList.childNodes.length; i++){
        
       tabList.childNodes[i].addEventListener("click", function(){
             //InstanceFile = tabList.childNodes[i].getAttribute("title").toString();
            
            fs.readFile(InstanceFile[0],"utf-8",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    EditorManager.editableCodeMirror.setValue(data);
                    console.log("Switching to "+path.basename(InstanceFile.toString()));
                }
            })
          
       });
     
    
}
}





//Exports
module.exports = {
    TabManagement,
    createNewWindow,
    OpenFolder,
    OpenFile,
    runScribble,
    runJava,
    SaveAs,
    Save,
    AutoSave,
    CurrentFile
    
}