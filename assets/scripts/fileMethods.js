//Vars
const fs = require("fs");
const path = require("path");
const {remote,dialog} = require("electron").remote;
var isAlreadySaved = false;

//Current file 
var currentFileName;
//Import base
var base = require("./index");

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
                    base.editableCodeMirror.setValue(data);
                    exports.currentFileName = filename;
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
                    alert(currentFileName);

                }
            });
        }
    })
}


//Open Folder
exports.openFolder = function() {
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
//Create New File
exports.newFile = function(){
    console.log("New File");
}

//Run java
exports.runJava = function(){

}

//Create new window
exports.createNewWindow = function(){
    //Create new instance of the window 
    console.log("Creating new window");
}