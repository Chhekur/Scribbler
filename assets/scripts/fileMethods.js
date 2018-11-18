//Vars
var fs = require("fs");
var path = require("path");
var {remote,dialog} = require("electron").remote;
var isAlreadySaved = false;

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
                    //set the data to the code window 
                    base.editableCodeMirror.setValue(data);
                    //get the filename 
                    exports.currentFileName = filename;
                    base.infoBar.innerHTML = path.basename(filename.toString());
                }
            })
        }
    }) 
    

    
}

//Save File
exports.saveFile = function(){
    dialog.showSaveDialog(function(filename){
        if(filename == undefined){
            console.log("Error the file is undefined, please try again");
        }else{
            fs.writeFile(filename,base.editableCodeMirror.getValue().toString(),function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("New Save complete");
                    isAlreadySaved = true;
                    //set the filename
                    base.infoBar.innerHTML = path.basename(filename.toString());
                }
            });
        }
    })
}

//Create New File
exports.newFile = function(){
    console.log("New File");
}

