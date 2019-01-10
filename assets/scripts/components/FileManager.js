//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog} = require("electron").remote;
const InterfaceManager = require("./InterfaceManager");
const NotificationManager = require("./NotificationManager");
var tabList = document.getElementById("tab-group");
var CurrentFile;
var EditorManager = require("../EditorManager");
const tmp = require("tmp");
var isTempFile = false;
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
                    //Writing the data to the window
                    EditorManager.editableCodeMirror.setValue(data);
                    //Add to sidebar
                    InterfaceManager.ExplorerManagement(CurrentFile); 
                    InterfaceManager.BuildMethods(CurrentFile);        
                    //Make the last child active
                                    
                }
            })
        }
    }) 
    

    
}
//Auto-Save File
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
    if(CurrentFile == undefined || CurrentFile == null){
        CreateNewFile();
        NotificationManager.displayNotification("warning","No file detected, new file created","bottomCenter",2000,"fa fa-exclamation-triangle",false,"light",12);
    }
    if(isTempFile == true){
        SaveAs();
        isTempFile = false;
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
                    InterfaceManager.UpdateTab(CurrentFile);
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

//Create new window
function CreateNewWindow(){
    //Create new instance of the window 
    console.log("Creating new window");
}

function CreateNewFile(){
    //Clear current window 
    if(EditorManager.editableCodeMirror.getValue() != null || EditorManager.editableCodeMirror.getValue() != " "){
        EditorManager.editableCodeMirror.setValue("");
    }
    //Create a temp file 
    tmp.file(function CreateTempFile(err,temppath,fd,callback){
        if(err){
            console.log(err);
        }
        
        CurrentFile = temppath;
      

        //Removes the file after
        callback();
        //Create new tab 
        InterfaceManager.CreateTab(CurrentFile);
        isTempFile = true;
        console.log(CurrentFile.toString());
        
    })
  

}



//Exports
module.exports = {
    
    CreateNewWindow,
    OpenFolder,
    OpenFile,
    SaveAs,
    Save,
    AutoSave,
    CurrentFile,
    CreateNewFile
    
}