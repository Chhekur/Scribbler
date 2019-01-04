//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog} = require("electron").remote;
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
                    exports.currentFileName = filename;
                    //Creating a new tab 
                    TabManagement(exports.currentFileName);
                    //Writing the data to the window
                    base.editableCodeMirror.setValue(data);
                    //Setting the bar at the bottom
                    base.currentFilename.innerHTML = path.basename(exports.currentFileName.toString());
                    return currentFilename;
                }
            })
        }
    }) 
    

    
}
//Save File
function save(){
    if(currentFileName == null || currentFileName == " "){
        exports.saveAs();
    }else{
        fs.writeFile(currentFileName,base.editableCodeMirror.getValue(),function(err){
            if(err){
                console.log(err);
            }else{
                console.log(currentFileName);
            }
        });
    }
}

function displayNotification(icon,message,pos,state){
    //Different notifcations
    //Errors
    //Success
    //Warnings 
    setTimeout(function(){
        switch(state){
            case "err":
            UIkit.notification({message: '<span uk-icon=\'icon: check\'></span>'+message+' ',pos: pos ,status: "danger"});     
            break;
            
            case "success":
            UIkit.notification({message: '<span uk-icon=\'icon: check\'></span>'+message+' ',pos: pos ,status: "success"});     
            break;
            case "warning":
            UIkit.notification({message: '<span uk-icon=\'icon: check\'></span>'+message+' ',pos: pos ,status: "warning"});     
            break;
        }
    },1000);
    
    
}
//Save File As
function saveAs(){
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
                    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Save successful',pos: 'bottom-center',status:'success'});     
                    //Set time out on closing notification 
                    setTimeout(function(){
                        UIkit.notification.closeAll();
                    },1000)               

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
    saveAs,
    save
}