const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const FileManager = require("./FileManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;
const {Menu,MenuItem,shell} = require("electron").remote;
const {remote,clipboard} = require("electron");
const $ = require("jquery");
const UIKit = require("uikit");
//Terminal Manager
const command = require('child_process').exec;
//Side-bar
const tabContainer = document.getElementById("tab-container");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const BuildCommandsBtn = document.getElementById("run-code");
const pathExtra = require("path-extra");
//Target Tab item being clicked 
var varTargetTab;
//Tab vars
var newTabItemListItem;
//Explorer Sidebar
var ExplorerSideBar = document.getElementById("explorer-side-bar");
//Menu
var TabMenu;
//Error nodes array
var errorNodes = [];
var errorLines = [];
var multilineError = false;
//Create the menu
//Titlebar filename 
var TitleBarFileName =  document.getElementById("title-bar-filename");
/**
 * Create the tab menu
 */
CreateTabMenu();
function CreateTabMenu(){
    TabMenu = new Menu();
    var RevealInExplorerMenuItem = new MenuItem({label: "Reveal In Explorer",click:RevealFileInExplorer});
    var CopyAbsolutePath = new MenuItem({label: "Copy Path",click:GetAbsoluteTabPath});
    var CloseTabsToTheRight = new MenuItem({label: "Close To The Right",click:RemoveTabsToTheRight});
    var CloseOtherTabs = new MenuItem({label: "Close All Others",click:RevealFileInExplorer});
    var CloseCurrentTab = new MenuItem({label:"Close Current Tab",click:RemoveCurrentTab});
    var DeleteCurrentFile = new MenuItem({label:"Delete File",click:DeleteFileFromEditor});
    var TabMenuSeparator = new MenuItem({type:"separator"});
    TabMenu.append(CloseCurrentTab);
    TabMenu.append(CloseTabsToTheRight);
    TabMenu.append(TabMenuSeparator);
    TabMenu.append(CopyAbsolutePath);
    TabMenu.append(RevealInExplorerMenuItem);
    TabMenu.append(TabMenuSeparator);
    TabMenu.append(DeleteCurrentFile);

}
/**
 * Finds the target tab 
 * Get the name and remove the file 
 */
function DeleteFileFromEditor(){
    fs.unlink(varTargetTab.name,function(err){
        if(err){
            console.log(err);
        }else{
            //Remove the tab 
            RemoveCurrentTab();
            //Notify the user 
            NotificationManager.displayNotification("success",path.basename(varTargetTab.name.toString())+" deleted","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
        }
    });
}

/**
 * Toggle the view of the sidebar 
 */
function SideBarToggle(){
    sideBarToggle.addEventListener("click",function(){
        if(SideBar.classList.contains("visible") == true){
            SideBar.classList.remove("visible");
        }else{
            SideBar.classList.add("visible");
        }
    });
    
}
/**
 * Display the preferences 
 */
function PreferencesToggle(){
    preferencesToggle.addEventListener("click",function(){
        ipcRenderer.send("show-prefs");
    });
}
/**
 * @param {*} CurrentFile 
 */
function ExplorerManagement(CurrentFile){
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile != " "){
        CreateTab(CurrentFile);
        
    
        for(var i=0; i<tabContainer.childNodes.length;i++){
                tabContainer.childNodes[i].addEventListener("click",function(e){
                //Open the tab in the editor
                OpenTabInEditor(CurrentFile,e); 
               });
               tabContainer.childNodes[i].addEventListener("contextmenu",function(e){
                   TabMenu.popup(remote.getCurrentWindow());
                   varTargetTab = e.target;
               });
        }
    }
}

/**
 * @param {*} CurrentFile 
 * @param {*} e 
 */
function OpenTabInEditor(CurrentFile,e){
    //Read the name of the tab and filename and adding it into the code mirror editor 
    CurrentFile = e.target.name;
    BuildCommands(CurrentFile);
    //Read file into the editor area
    fs.readFile(CurrentFile.toString(),"utf-8",function(err,data){
        if(err){
            console.log(err);
        }else{
        EditorManager.editableCodeMirror.setValue(data);
        }
    });
}
function GetAbsoluteTabPath(){
    //Copies the absolute path of the highlighted file
   clipboard.writeText(varTargetTab.name);
   NotificationManager.displayNotification("info","Absolute path copied!","bottomCenter",2000,"fa fa-info-circle",false,"light",12);
}
function RevealFileInExplorer(){
    shell.showItemInFolder(varTargetTab.name);
}
/**
 * 
 * @param {*} CurrentFile 
 */
function UpdateTab(OldFilePath,NewFilePath){
    //Get the name of each tab 
    $('.newTab').each(function(){
        if($(this).attr("name") == OldFilePath || $(this).siblings().attr("name") == OldFilePath){
            $(this).attr("title", NewFilePath);
            $(this).children().attr("title", NewFilePath);
            $(this).attr("name", NewFilePath);
            $(this).children().attr("name", NewFilePath);
           // $(this).text(path.basename(NewFilePath.toString()));
            $(this).children().text(path.basename(NewFilePath.toString()));
            CurrentFile = NewFilePath;
            //ExplorerManagement(CurrentFile);
        }else{
            console.log(false);
        }
    })
    
}
/**
 * 
 * @param {*} CurrentFile 
 */
function CreateWorkSpaceTab(CurrentFile){
    //Create element
    var WorkSpaceManagerLink = document.createElement("a");
    WorkSpaceManagerLink.addEventListener("click",function(e){
        OpenTabInEditor(CurrentFile,e);
    });
    //Create text node
    var WorkSpaceManagerTextContent = document.createTextNode(path.basename(CurrentFile.toString()));
    //Append text node 
    WorkSpaceManagerLink.appendChild(WorkSpaceManagerTextContent);
    //Add class to link 
    WorkSpaceManagerLink.classList.add("item");
    //Add attributes to it 
    WorkSpaceManagerLink.setAttribute("title",CurrentFile.toString());
    WorkSpaceManagerLink.setAttribute("name",CurrentFile.toString());
    //Append to sidebar
    ExplorerSideBar.appendChild(WorkSpaceManagerLink);


}
/**
 * @param {*} CurrentFile 
 */
function CreateTab(CurrentFile){
    if(FileManager.isRandFile == true){
        CurrentFile = "Untitled";
    }
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".txt"){
       return;
    } 
    //Check if there is a tab with the same name 
     newTabItemListItem = document.createElement("li");
    //Create link
    var newTabItemLink = document.createElement("a");
    //Set attribute for link 
    newTabItemListItem.setAttribute("name",CurrentFile.toString()); 
    newTabItemListItem.setAttribute("title",CurrentFile.toString()); 
    newTabItemListItem.classList.add("newTab");
    //Loop and remove from other children JQUERY
    newTabItemLink.setAttribute("name",CurrentFile.toString()); 
    newTabItemLink.setAttribute("title",CurrentFile.toString()); 
    //Create text 
    var newTabItemTextNode =document.createTextNode(path.basename(CurrentFile.toString()));
    //Append text to the a
    newTabItemLink.appendChild(newTabItemTextNode);
    //Append a to li 
    newTabItemListItem.appendChild(newTabItemLink);
    //Append to tab container
    tabContainer.appendChild(newTabItemListItem);
    //Check if they have the same name 
    tabContainer.appendChild(newTabItemListItem);
    //Check changing classes and names
    TabChecking();
    CreateWorkSpaceTab(CurrentFile);
}
/**
 * Checks for duplicates
 */
function TabChecking(){
    $(".newTab").siblings().each(function(){
        if($(this).siblings().text() == $(this).text()){
            $(this).remove();
        }
        if($(this).siblings().hasClass("uk-active")){
            $(this).siblings().removeClass("uk-active");
            newTabItemListItem.classList.add("uk-active");
            //Reload the editor 
        }
    });
}

/**
 * For every match made an error node is created 
 * @param {*} errormessage 
 */
function GetDisplayLine(errormessage){
    var errorMsg = errormessage.toString();
    var searchExp = /\d+/g;
    var  match = errorMsg.match(searchExp);
    errorLines.push(match);
    if(match != null){
    if(match.length >  -1 ){
        //return the final number which will be the number of errors 
        multilineError = true;
        return match[match.length - 1];
    }else{
        console.log(match[0]);
        return match[0];
    }
}
}

/**
 * @param {*} CurrentFile 
 * @param {*} errormessage 
 */
function DisplayErrorInCode(CurrentFile,errormessage){
    if(multilineError == true){
        errorNodes.push(EditorManager.editableCodeMirror.addLineWidget(EditorManager.editableCodeMirror.lastLine() ,NotificationManager.createErrorNode("fa fa-exclamation-circle","Number of errors found:",GetDisplayLine(errormessage),errormessage.toString()) ));
        NotificationManager.displayNotification("err","Compilation unsuccessful view editor for more info","bottomCenter",3000,"fa fa-info-circle","light",12);

    }else{
        errorNodes.push(EditorManager.editableCodeMirror.addLineWidget(GetDisplayLine(errormessage) -1 ,NotificationManager.createErrorNode("fa fa-exclamation-circle","Error on line",GetDisplayLine(errormessage),errormessage.toString()) ));
        NotificationManager.displayNotification("err","Compilation unsuccessful view editor for more info","bottomCenter",3000,"fa fa-info-circle","light",12);
    }
}

/**
 * @param {*} CurrentFile 
 */
function Save(CurrentFile){
        fs.writeFile(CurrentFile[0],EditorManager.editableCodeMirror.getValue(),function(err){
            if(err){
               NotificationManager.displayNotification("err","Failed to save, please try again later","bottomCenter",2000,"fa fa-ban",true,"light",12);
            }else{
            }
        });
    }


/**
 * Check for any error nodes and remove them
 * Build Commads 
 * @param {*} CurrentFile 
 */
function BuildCommands(CurrentFile){
    //Declare the commands 
    var compileJavaCommand = "javac "+path.basename(CurrentFile.toString());
    var runJavaCommand ="java "+pathExtra.base(CurrentFile.toString(), false);
    console.log("File path to run: "+compileJavaCommand);
    //Checks for error nodes and removes them 
    CheckErrorNodes();
    BuildCommandsBtn.addEventListener("click",function(){
    if(CurrentFile == undefined || CurrentFile == null || CurrentFile == " "|| CurrentFile == ""){
        NotificationManager.displayNotification("info","No file detected, please select a tab that you need to build","bottomCenter",2000,"fa fa-info-circle",true,"light",12);
    }
    //Save(CurrentFile);
    var extname = path.extname(CurrentFile.toString());
    var requiredName = ".java";
    if(requiredName.trim() != extname.trim()){
        NotificationManager.displayNotification("info","Cannot run compiler on non java files","bottomCenter",2000,"fa fa-info-circle",false,"light",12);
        return;
   }else{
    BuildJava(runJavaCommand,compileJavaCommand,CurrentFile);
    }
});
}


/**
 * @param {*} runJavaCommand 
 * @param {*} compileJavaCommand 
 * @param {*} CurrentFile 
 */
function BuildJava(runJavaCommand,compileJavaCommand,CurrentFile){
    command(compileJavaCommand,{cwd: path.dirname(CurrentFile.toString())},function(err,stdout,stderr){
        if(err){
            DisplayErrorInCode(CurrentFile,err);
            console.log(errorNodes);
        }else if(stderr){
            console.log(stderr);
        }else{
        command(runJavaCommand, {cwd: path.dirname(CurrentFile.toString())},function(err,stdout,stderr){
             if(err){
                 console.log(err);
             }
              if(stderr){
                 console.log(stderr);
                 DisplayErrorInCode(CurrentFile,err);
             }
             //Display notification 
             NotificationManager.displayNotification("success","Compilation success! View the terminal window to display results","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
             //Send output to the terminal output window
             SendTerminalOutput(stdout);
        });
     }
    });
}
/**
 * @param {*} CurrentFile 
 */
function ReadInFile(CurrentFile){
    fs.readFile(CurrentFile[0],'utf-8',function(err,data){
        if(err){
            console.log(err);
        }else{
            EditorManager.editableCodeMirror.setValue(data);
        }
    });
}
function RemoveTabsToTheRight(){
    //Delete the sibling next
    console.log("Remove from the left");
}

function RemoveCurrentTab(){
    //Remove the current selected tab
    var parentTab  = $(varTargetTab).parent();
    var tab = $(varTargetTab);
    if(varTargetTab.nodeName == "A"){
        //Check if there is any other tabs 
        if(parentTab.prev().length > 0){
            CurrentFile = parentTab.prev().attr("name");
            //Re-reads in the previous file 
            ReadInFile(CurrentFile);
            parentTab.remove();
        }else{
            parentTab.remove();
            EditorManager.editableCodeMirror.setValue("");

        }
        
    }
    if(varTargetTab.nodeName == "LI"){
        if(tab.prev().length > 0){
            CurrentFile = tab.prev().attr("name");
            //Re-reads in the previous file 
            ReadInFile(CurrentFile);
            //Remove the node 
            tab.remove();
        }else{
            tab.remove();
            EditorManager.editableCodeMirror.setValue("");
            console.log(CurrentFile);
        }
        CurrentFile = $(varTargetTab).prev().attr("name");
    }   
}
function CheckErrorNodes(){
    //Removes the error nodes after a certain amount of time
    EditorManager.editableCodeMirror.on("change",function(){
        setTimeout(function(){
        if(errorNodes.length > 0 ){
            for(var i = 0 ; i< errorNodes.length; i ++){
                EditorManager.editableCodeMirror.removeLineWidget(errorNodes[i]);
            }
        }
    },3000)
    });  
}
/**
 * Send the output
 * @param {*} output 
 */
function SendTerminalOutput(output){
    //Sends the terminal output to the second window
    ipcRenderer.send("console-output",output);
}
/**
 * 
 * @param {*} CurrentFile 
 */
var updatePath;
function RenameFile(CurrentFile){
     UIkit.modal.prompt('Enter a new name for the file:', '').then(function (name) {
        //Re-name with the new file
        var currentDir = path.dirname(CurrentFile.toString()); 
        var newRenamedFile = currentDir+"/"+name+".java";
        if(name!= undefined || name!=" " || name !=null || name !=""){
        fs.rename(CurrentFile,newRenamedFile,function(err){
            if(err){
                console.log(err);
            }else{
                UpdateTab(CurrentFile,newRenamedFile);
                CurrentFile = newRenamedFile;
                console.log("Re-named file: "+CurrentFile.toString());
                FileManager.isRandFile = false;
            }
        });
    }else{
        console.log("Undefined");
    }
    });
  
}
module.exports = {
    SideBarToggle,
    ExplorerManagement,
    PreferencesToggle,
    TitleBarFileName,
    BuildCommands,
    RenameFile,
    CreateTabMenu
}