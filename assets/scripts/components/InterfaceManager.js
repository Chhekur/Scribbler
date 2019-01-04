const NotificationManager =require("./NotificationManager");
const EditorManager = require("./../EditorManager");
var ErrorState = false;
var Editor = EditorManager.codeWindow;

function InitTerminal(){
console.log("Terminal Feature, coming soon....")
}

function ErrorDiscovery(){
//When the script is run
//Scan file 
Editor.eachLine()
//If error change the error state 
//Highlight that line
//Display information about the error(future feature)
}
module.exports = {
    InitTerminal,
    ErrorDiscovery
}