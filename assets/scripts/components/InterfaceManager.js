const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
const path = require("path");
const fs = require("fs");
const ipcRenderer = require("electron").ipcRenderer;
const {Menu,MenuItem,shell} = require("electron").remote;
const {remote,clipboard} = require("electron");
const $ = require("jquery");
//Terminal Manager
const command = require('child_process').exec;
//Side-bar
const tabContainer = document.getElementById("tab-container");
const sideBarToggle = document.getElementById("sidebar-toggle");
const  preferencesToggle  = document.getElementById("preferences-toggle");
const BuildCommandsBtn = document.getElementById("run-code");
const pathExtra = require("path-extra");
var instance;

//Menu
var TabMenu;
//Error nodes array
var errorNodes = [];
var errorLines = [];
//Create the menu
CreateTabMenu();
//Titlebar filename 
var TitleBarFileName =  document.getElementById("title-bar-filename");
/**
 * Create the tab menu
 */
function CreateTabMenu(){
    TabMenu = new Menu();
    var CloseTabMenuItem = new MenuItem({label: "Close Tab",click:CloseTab})
    var RevealInExplorerMenuItem = new MenuItem({label: "Reveal In Explorer",click:RevealFileInExplorer});
    var CopyRelativePath = new MenuItem({label: "Copy Relative Path",click:GetRelativeTabPath});
    var CopyAbsolutePath = new MenuItem({label: "Copy Absolute Path",click:GetAbsoluteTabPath});
    var CloseTabsToTheRight = new MenuItem({label: "Close To The Right",click:RevealFileInExplorer});
    var CloseTabsToTheLeft = new MenuItem({label: "Close To The Left",click:RevealFileInExplorer});
    var CloseOtherTabs = new MenuItem({label: "Close All Others",click:RevealFileInExplorer});

    var TabMenuSeparator = new MenuItem({type:"separator"});

    TabMenu.append(CloseTabMenuItem);
    TabMenu.append(CloseTabsToTheLeft);
    TabMenu.append(CloseTabsToTheRight);
    TabMenu.append(TabMenuSeparator);
    TabMenu.append(CopyRelativePath);
    TabMenu.append(CopyAbsolutePath);
    TabMenu.append(RevealInExplorerMenuItem);

}

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
function PreferencesToggle(){
    preferencesToggle.addEventListener("click",function(){
        ipcRenderer.send("show-prefs");
    });
}
/**
 * 
 * @param {*} CurrentFile 
 */
var count = 0;
function ExplorerManagement(CurrentFile){
    if(CurrentFile != null || CurrentFile != undefined || CurrentFile == " "){
    //Check if the node exists
        CreateTab(CurrentFile);
    
        for(var i=0; i<tabContainer.childNodes.length;i++){
            if(tabContainer.childNodes[i].nodeName == "LI"){
                tabContainer.childNodes[i].addEventListener("click",function(e){
                //Open the tab in the editor
                OpenTabInEditor(CurrentFile,e); 
               });
               tabContainer.childNodes[i].addEventListener("contextmenu",function(e){
                   TabMenu.popup(remote.getCurrentWindow());
                   instance = e.target.name;
                   return instance;
               });
            }
        }
        
        
    }
}



/**
 * 
 * @param {*} CurrentFile 
 * @param {*} e 
 */
function OpenTabInEditor(CurrentFile,e){
    //Read the name of the tab and filename and adding it into the code mirror editor 
    CurrentFile[0] = e.target.name;
    fs.readFile(CurrentFile[0],"utf-8",function(err,data){
        if(err){
            console.log(err);
        }else{
        EditorManager.editableCodeMirror.setValue(data);
       console.log(CurrentFile[0].toString());
        }
    });
}

function CloseTab(){
    console.log("Closing tabs...");
}

function GetAbsoluteTabPath(){
   clipboard.writeText(instance);
   NotificationManager.displayNotification("info","Absolute path copied!","bottomCenter",2000,"fa fa-info-circle",false,"light",12);

}

function GetRelativeTabPath(){

}
function CloseOtherTabs(){

}
/**
 * Reveal item in a folder 
 */
function RevealFileInExplorer(){
    shell.showItemInFolder(instance);
}
/**
 * 
 * @param {*} CurrentFile 
 */
function UpdateTab(CurrentFile){
    //Get the current tab name 
   console.log(CurrentFile); 
}

/**
 * 
 * @param {*} CurrentFile 
 */
function CreateTab(CurrentFile){
    if(CurrentFile == null || CurrentFile == undefined || path.extname(CurrentFile.toString()) ==".tmp"){
        CurrentFile = "Untitled";
    } 
    //Check if there is a tab with the same name 
    var newTabItemListItem = document.createElement("li");
    //Create a 
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
    

}

function TabChecking(){
    $(".newTab").siblings().each(function(){
        if($(this).siblings().text() == $(this).text()){
            $(this).remove();
        }
        
        if($(this).siblings().hasClass("uk-active")){
            $(this).siblings().removeClass("uk-active");
            newTabItemListItem.classList.add("uk-active");
        }
    });
}

function RemoveErrorNodes(){
    if(document.getElementById("err")){
    for(var i = 0; i<document.getElementById("err").length; i++){
    if(document.getElementById("err")[i]){
        document.removeChild(doucment.getElementById("err")[i]);
        }
    }
    }
}
/**
 * For every match made an error node is created 
 * @param {*} errormessage 
 */
var multilineError = false;
function GetDisplayLine(errormessage){
    
    var errorMsg = errormessage.toString();
    var searchExp = /\d+/g;
    var  match = errorMsg.match(searchExp);
    errorLines.push(match);
    if(match.length >  -1 ){
        //return the final number which will be the number of errors 
        multilineError = true;
        return match[match.length - 1];
        
    }else{
        console.log(match[0]);
        return match[0];
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
 * 
 * @param {*} CurrentFile 
 */
function Save(CurrentFile){
    //Check for a current file name
        fs.writeFile(CurrentFile[0],EditorManager.editableCodeMirror.getValue(),function(err){
            if(err){
               NotificationManager.displayNotification("err","Failed to save, please try again later","bottomCenter",2000,"fa fa-ban",true,"light",12);
            }else{
                //NotificationManager.displayNotification("success","Save successful","bottomCenter",2000,"fa fa-check-circle",false,"light",12);
            }
        });
    }

/**
 * Check for any error nodes and remove them
 * Build Commads 
 * @param {*} CurrentFile 
 */
function BuildCommands(CurrentFile){
    CheckErrorNodes();
    BuildCommandsBtn.addEventListener("click",function(){
    Save(CurrentFile);
    command("javac "+path.basename(CurrentFile.toString()),{cwd: path.dirname(CurrentFile.toString())},function(err,stdout,stderr){
       if(err){
           DisplayErrorInCode(CurrentFile,err);
           console.log(errorNodes);
       }else if(stderr){
           console.log(stderr);
       }else{
       command("java "+pathExtra.base(CurrentFile.toString(), false), {cwd: path.dirname(CurrentFile.toString())},function(err,stdout,stderr){
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
});

}

function CheckErrorNodes(){
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
    ipcRenderer.send("console-output",output);
}



module.exports = {
    SideBarToggle,
    ExplorerManagement,
    CreateTab,
    PreferencesToggle,
    UpdateTab,
    TitleBarFileName,
    BuildCommands
}