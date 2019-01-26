//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog,app} = require("electron").remote;
const InterfaceManager = require("./InterfaceManager");
const NotificationManager = require("./NotificationManager");
global.CurrentFile;
var EditorManager = require("../EditorManager");
var isTempFile = false;
var defaultDocumentsPath = app.getPath("documents");
var ScribblerProjectToCreate = defaultDocumentsPath+"/Scribbler_Projects";
var DefaultSavePath = ScribblerProjectToCreate+"/";

//Watching directory -- Create updates


const OpenDialogOptions = {
    title: "Open File",
    filters: [
      { name: "Java", extensions: ["java"] },
      { name: "Scribble", extensions: ["src"] }
    
    ],

  };
const SaveDialogOptions = {
    title: "Save File",
    filters: [
      { name: "Java", extensions: ["java"] },
      { name: "Scribble", extensions: ["src"] }
    ],
  }

function CreateDefaultDir(){
    //Create the directory scribbler projects 
    fs.exists(ScribblerProjectToCreate,function(exists){
        if(exists){

        }else{
            fs.mkdir(ScribblerProjectToCreate,function(err){
                if(err){
                    console.log(err);
                }else{
                    //Watch for changes 
                  
                }
            })
        }
    });
}
//Open File
function OpenFile(){
    dialog.showOpenDialog(OpenDialogOptions,function(InstanceFile){
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
                                          
                }
            })
        }
    }) 
}

function SetCurrentFile(file){
   CurrentFile = file; 
}
function GetCurrentFile(){
    return CurrentFile;
}


//Normal save 
function Save(){
    //Check for a current file name
    if(CurrentFile == undefined || CurrentFile == null){
        CreateNewFile();
        NotificationManager.displayNotification("warning","No file detected, new file created","bottomCenter",2000,"fa fa-exclamation-triangle",false,"light",12);
    }if(isNewFile == true){
        InterfaceManager.RenameFile(CurrentFile);
        isNewFile = false;
    }else{;
        fs.writeFile(CurrentFile.toString(),EditorManager.editableCodeMirror.getValue(),function(err){
            if(err){
               NotificationManager.displayNotification("err","Failed to save, please try again later","bottomCenter",2000,"fa fa-ban",true,"light",12);
            }else{
                NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
            }
        });
    }
}

function SaveAs(){
        dialog.showSaveDialog(function(filename){
            if(filename != undefined){
                //Move the file to whereever the path is 
                fs.writeFile(filename[0],"New File","utf-8",function(err){
                    if(err){
                        console.log(err);
                    }else{
                    console.log("Successful save as ");
                    CurrentFile = filename;
                    }
                })
            }else{
                console.log("File is undefined, please try again");
            }
        })
     
    

    
    /*
   dialog.showSaveDialog(function(FileToBeSaved){
    if(FileToBeSaved == undefined){
        console.log("File is undefined please try again later");
    }else{
        fs.writeFile(FileToBeSaved[0],EditorManager.editableCodeMirror.getValue().toString(),function(err){
            if(err){
                console.log(err);
            }else{
                console.log("File successfully saved");
                NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
            }
        })
    }
   });
   */
}
/*
//Save File As
function SaveAs(){
    dialog.showSaveDialog(SaveDialogOptions,function(InstanceFile){
        if(InstanceFile == undefined){
            console.log("Error the file is undefined, please try again");
        }else{            
            fs.writeFile(InstanceFile[0],"EditorManager.editableCodeMirror.getValue().toString()",function(err){
                if(err){
                    console.log(err);
                }else{
                isAlreadySaved = true;
                //CurrentFile = InstanceFile;
                console.log(CurrentFile);
                NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
                //Update the current tab for new file name
                InterfaceManager.UpdateTab();  
                }
            });
            
        }
    })
}
*/

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

var isNewFile = false;
/**
 *  Create a new file and re-read that new file 
 */
function CreateNewFile(){
    isNewFile = true;
    var newFile = DefaultSavePath+CreateRandomFileName();
    //Clear current window 
    if(EditorManager.editableCodeMirror.getValue() != null || EditorManager.editableCodeMirror.getValue() != " "){
        EditorManager.editableCodeMirror.setValue("");
    }
    //Create the tmp file 
    fs.writeFile(newFile,"",function(err){
        if(err){
            console.log(err);
        }else{
            fs.readFile(newFile,'utf-8',function(err,data){
                if(err){
                    console.log(err);
                }else{
                    CurrentFile = newFile;
                    //Writing the data to the window
                    EditorManager.editableCodeMirror.setValue(data);
                    //Add to sidebar
                    InterfaceManager.ExplorerManagement(CurrentFile); 
                    //Display notification
                    NotificationManager.displayNotification("info","New file created, press Ctrl+S to save/rename","bottomCenter",3000,"fa fa-info-circle",false,"light",12);             
                }
            })
        }
    })
    /*
  
    */
}

var isRandFile = false;
//Create Random File Name
function CreateRandomFileName() {
    isRandFile = true;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text+".java";
  }

//Exports
module.exports = {
    CreateNewWindow,
    OpenFolder,
    OpenFile,
    SaveAs,
    Save,
    // CurrentFile,
    CreateNewFile,
    GetCurrentFile,
    SetCurrentFile,
    CreateDefaultDir,
    isRandFile
}