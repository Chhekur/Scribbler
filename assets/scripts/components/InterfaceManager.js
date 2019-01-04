/*
Interface between the terminal and the code window 
Handles the user interface for the window 
*/
const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");

var ErrorState = false;
var Editor = EditorManager.codeWindow;

function SetTitleBar(){
   
}

function SetBottomBarColor(){
    //Grab the colour of the gutter 
    var gutter = document.getElementsByClassName("CodeMirror-gutters")[0];
    //Removing the border
    var pickedStyle = window.getComputedStyle(gutter);
    var pickedBgColor = pickedStyle.getPropertyValue("background-color");
    console.log(pickedBgColor);
    //Set the background colour of the bottom bar to the gutter
    var bottomBar = document.getElementById("info-bar");
    bottomBar.style.backgroundColor = pickedBgColor;
    //Change the color of the icons to that same as the gutter fonts 
    
}



//Exporting
module.exports= {
    SetBottomBarColor,
    SetTitleBar,
    MainTitleBar
}