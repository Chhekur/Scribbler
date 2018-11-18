//import modules
const {app,BrowserWindow,ipcMain} = require("electron");
const path = require("path");
//init window
let win,prefsWindow;
function initApp(){
    win = new BrowserWindow({width: 800,height:600,x:0,y:0});
    win.setTitle("Scribbler");
    win.loadURL(`${__dirname}/index.html`);
    win.webContents.openDevTools();

    //Preferences Window
    prefsWindow = new BrowserWindow({width:800,height:600,x:0,y:0,show:false});
    prefsWindow.setTitle("Preferences");
    prefsWindow.setMenuBarVisibility(false);
    prefsWindow.loadFile("views/prefs.html");
    prefsWindow.openDevTools();
    
    //display preferences window
    ipcMain.on("show-prefs",function(){
        if(!prefsWindow.isVisible()){
            prefsWindow.show();
        }else{
            prefsWindow.hide();
        }
        
    });

    //IPC Main Data
    ipcMain.on("selected-theme",function(event,payload){
        win.webContents.send("selected-theme",payload);
    })
   
    //Event Listeners
    prefsWindow.on("close",function(event){
        prefsWindow.hide();
        event.preventDefault();
    });
    prefsWindow.on("closed",function(){
        prefsWindow = null;
    });
    win.on("closed",function(){
        prefsWindow = null;
        win = null;
    })
}

//init app
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
