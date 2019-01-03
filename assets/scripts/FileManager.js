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
exports.openFile = function(){
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
                    exports.createNewFileWithTab(filename);
                    //Writing the data to the window
                    base.editableCodeMirror.setValue(data);
                    //Setting the bar at the bottom
                    base.currentFilename.innerHTML = path.basename(filename.toString());
                }
            })
        }
    }) 
    

    
}
//Save File
exports.save = function(){
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

//Save File As
exports.saveAs = function(){
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
                    base.infoBar.innerHTML = path.basename(currentFileName.textContent);
                

                }
            });
        }
    })
}


//Open Folder
exports.openFolder = function () {
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
exports.runJava = function(){

}

//Running Scribble
exports.runScribble = function() {

}

//Create new window
exports.createNewWindow = function(){
    //Create new instance of the window 
    console.log("Creating new window");
}

//Create new file and tab
exports.createNewFileWithTab = function (filename) {
    
    console.log("Creating a new file");
    if(filename == undefined || filename == null){
        newTabName = "Untitled";
    }else{
        newTabName = path.basename(filename.toString());
    }

    var newTab = document.createElement("li");
  
    newTab.setAttribute("title",filename);

    //Remove the class from others 
    var tabContent = document.createElement("a");
    tabContent.setAttribute("href","#");
    tabContent.appendChild(document.createTextNode(newTabName));

    var completeTab = newTab.appendChild(tabContent);
    tabList.appendChild(newTab);

    //Tab Management
    exports.TabManagement(filename);
}



 exports.TabManagement = function (filename){
    var count = 0;
    //When clicking on the tab re-read the content into the window 
    
    for(var i = 0; i < tabList.childNodes.length; i++){
        if(tabList.childNodes[i].nodeName == "LI"){
       tabList.childNodes[i].addEventListener("click", function(){
            //var filenameToRead = tabList.childNodes[i].getAttribute("title");
            fs.readFile(filename[0],"utf-8",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    base.editableCodeMirror.setValue(data);
                    console.log("Switching to "+path.basename(filename.toString()));
                    //Setting the bar at the bottom
                    base.currentFilename.innerHTML = path.basename(filename.toString());
                }
            })
          
       });
    }
}
   
}