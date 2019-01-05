/*
Interface between the terminal and the code window 
Handles the user interface for the window 
*/
const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");

var ErrorState = false;
var Editor = EditorManager.codeWindow;


function SideBarToggle(){
    var SideBar = document.getElementById("ExplorerSideBar");
    if(SideBar.classList.contains("visible") == true){
        SideBar.classList.remove("visible");
    }else{
        SideBar.classList.add("visible");
    }
}
module.exports = {
    SideBarToggle
}