/*
Interface between the terminal and the code window 
Handles the user interface for the window 
*/
const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");

var ErrorState = false;
var Editor = EditorManager.codeWindow;

