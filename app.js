//import modules
const {app,BrowserWindow,ipcMain} = require("electron");
const electron  = require("electron")
const path = require("path");

//Electron Reload
require("electron-reload")(__dirname);

//Init Window
let win,prefsWindow,consoleWindow,introWindow;

function initApp(){
  
    //Intro window loading 
    introWindow = new BrowserWindow({width: 500,height:500,x:CalcMiddleX(),y:CalcMiddleY(),frame:false});
    introWindow.loadFile("Templates/LoadingWindow.html");
    introWindow.setTitle("Scribbler Intro");

    //Displaying the loading window before hand 
    win = new BrowserWindow({width: 700,height:600,x:0,y:0,show:false,frame:true});
    win.setTitle("Scribbler");
    win.loadFile("Templates/Welcome.html");
    //win.loadURL(`${__dirname}/index.html`);
    win.webContents.openDevTools();

    //Terminal output window 
    consoleWindow = new BrowserWindow({width:win.width,height:win.height,x:CaclWindowPosX(),y:CalcWindowPosY(),show:false,resizable:true});
    consoleWindow.loadFile("Templates/TerminalOutput.html");
    consoleWindow.setMenuBarVisibility(false);
    consoleWindow.openDevTools();
    consoleWindow.setTitle("Console Window Output");

    //Preferences Window
    prefsWindow = new BrowserWindow({width:700,height:600,x:0,y:0,show:false,resizable:true});
    prefsWindow.setTitle("Preferences");
    prefsWindow.setMenuBarVisibility(false);
    prefsWindow.loadFile("Templates/Preferences.html");
    prefsWindow.openDevTools();

    introWindow.on("ready-to-show",function(){
        introWindow.show()
    })
    win.on("ready-to-show",function(){
        //Swap the windows 
        win.show();
        introWindow.hide();
    });

    if(!introWindow.isVisible()){
        introWindow.close();
        introWindow = null;
    }
    
    //Check if preference window is showing
    ipcMain.on("show-prefs",function(){
        
       
        
        if(!prefsWindow.isVisible()){ 
            prefsWindow.show();
        }else{
            prefsWindow.hide();
        }

    });
   

    //Check if console window is showing
    ipcMain.on("console-output",function(event,payload){
        consoleWindow.webContents.send("console-output",payload);
        if(!consoleWindow.isVisible()){
            consoleWindow.show();
        }
    });

    ipcMain.on("show-editor",function(){
        win.loadURL("Templates/index.html");
    })
    //IPC Main Data
    ipcMain.on("selected-theme",function(event,payload){
        win.webContents.send("selected-theme",payload);

    });

    ipcMain.on("selected-font-size",function(event,payload){
        win.webContents.send("selected-font-size",payload);
    });
    ipcMain.on("settings-changed",function(event,payload){
        win.webContents.send("settings-changed",payload);
    });
    ipcMain.on("selected-auto-pairing",function(event,payload){
        win.webContents.send("selected-auto-pairing",payload);
    });
    ipcMain.on("changed-sideBar-background",function(event,payload){
        win.webContents.send("changed-sideBar-background",payload);
    });
    //Event Listeners
    prefsWindow.on("close",function(event){
        prefsWindow.hide();
        event.preventDefault();
    });
    prefsWindow.on("closed",function(){
        prefsWindow = null;
    });

    consoleWindow.on("close",function(event){
        consoleWindow.hide();
        event.preventDefault();
    });
    consoleWindow.on("closed",function(){
        consoleWindow = null;
    });

    win.on("closed",function(){
        prefsWindow = null;
        win = null;
        consoleWindow = null;
        app.quit();
    })
}

//Init Application
app.on("ready",initApp);
app.on("window-all-closed",function(){
    if(process.platform !== "darwin"){
        app.quit();
    }
})
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
     initApp();
    }
  })

function CaclWindowPosX(){
    var newPosX = win.x + win.width;
    return newPosX;
}   
function CalcWindowPosY(){
    var newPosY = win.y + win.height;
    return newPosY;
}

function CalcMiddleX(){
    var bounds_x = electron.screen.getPrimaryDisplay.width / 2;
    return bounds_x;
}
function CalcMiddleY(){
    var bounds_y = electron.screen.getPrimaryDisplay.height / 2;
    return bounds_y;
}
