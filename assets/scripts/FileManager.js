//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog} = require("electron").remote;
const NotificationManager = require("./components/NotificationManager");
var isAlreadySaved = false;
var newTabName;
//Tabs 
var tabList = document.getElementById("tab-group");
//Current file 
var currentFileName;
//Import base
var base = require("./EditorManager");

//Open File
function openFile(){
    dialog.showOpenDialog(function(filename){
        if(filename == undefined){
            return;
        }else{
            fs.readFile(filename[0],'utf-8',function(err,data){
                if(err){
                    console.log(err);
                }else{
                    currentFileName = filename;
                    //Tab management method
                    TabManagement(currentFileName);
                    //Writing the data to the window
                    base.editableCodeMirror.setValue(data);
                    //Setting the bar at the bottom
                  
                    
                }
            })
        }
    }) 
    

    
}
//Save File
function Save(){
    if(currentFileName == null || currentFileName == " "){
        SaveAs();
    }else{
        fs.writeFile(currentFileName,base.editableCodeMirror.getValue(),function(err){
            if(err){
                console.log(err);
                displayNotification("err","Save unsuccessful","bottom-center",1000);
            }else{
                displayNotification("success","Save successful!","bottom-center",1000);
            }
        });
    }
}

//Save File As
function SaveAs(){
    dialog.showSaveDialog(function(filename){
        if(filename == undefined){
            console.log("Error the file is undefined, please try again");
        }else{
            fs.writeFile(filename,base.editableCodeMirror.getValue().toString(),function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("New Save complete");

                    //Set Filename
                    isAlreadySaved = true;
                    filename = currentFileName;
                    //Display notification
                    NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"material-icons",false,"light",12);
                    //Set time out on closing notification 
                                

                }
            });
        }
    })
}


//Open Folder
function openFolder() {
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
function TabManagement (filename) {
    
    console.log("Creating a new file");
    if(filename == undefined || filename == null){
        newTabName = "Untitled";
    }else{
        newTabName = path.basename(filename.toString());
    }

    var newTab = document.createElement("li");
    newTab.setAttribute("title",filename);

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
             //filename = tabList.childNodes[i].getAttribute("title").toString();
            
            fs.readFile(filename[0],"utf-8",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    base.editableCodeMirror.setValue(data);
                    console.log("Switching to "+path.basename(filename.toString()));
                    base.currentFilename.innerHTML = path.basename(filename.toString());
                }
            })
          
       });
     
    
}
}





//Exports
module.exports = {
    TabManagement,
    createNewWindow,
    openFolder,
    openFile,
    runScribble,
    runJava,
    SaveAs,
    Save
    
}