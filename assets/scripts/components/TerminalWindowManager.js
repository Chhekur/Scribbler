const ipcRenderer = require("electron").ipcRenderer;
const {BrowserWindow} = require("electron").remote;
const NotificationManager = require("./NotificationManager");
var outputTextNode = document.getElementById("output-text");

function RecieveAndDisplayConsoleOutput(){
    //Recieve terminal 
    ipcRenderer.on("console-output",function(event,payload){
        outputTextNode.innerHTML = payload;
        NotificationManager.displayNotification("success","Compilation successful view editor for more info","bottomCenter",2000,"fa fa-check-circle",false,"light",12);    })
}

RecieveAndDisplayConsoleOutput();

