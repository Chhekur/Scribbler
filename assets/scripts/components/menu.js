const {remote,Menu,MenuItem,BrowserWindow} = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const fileMethods = require("../fileMethods");
const base = require("../index");
const path = require("path");

//Preferences
let prefOptions;

//Create main menu
exports.createMenu = function () {
    //Declare main menu
    const mainMenu = new Menu();

    //File menu
    var fileMenuItem = new MenuItem({
        label: "File",
        submenu:[
            {label:"New File",click:fileMethods.newFile, accelerator: "Ctrl+N"},
            {label:"New Window",click:fileMethods.createNewWindow, accelerator: "Ctrl+Shift+N"},
            {type:"separator"},
            {label: "Open File",click: fileMethods.openFile, accelerator: "Ctrl+O"},
            {label: "Open Folder",click: fileMethods.openFolder, accelerator: "Ctrl+Shift+O"},
            {type:"separator"},
            {label: "Save",click: fileMethods.save,accelerator:"Ctrl+S"},
            {label: "Save As",click: fileMethods.saveAs,accelerator:"Ctrl+Shift+S"},
            {label: "Save All...",click: fileMethods.saveFile,accelerator:"Ctrl+K+S"},
        ]
    });
    //Preferences menu 
    var preferencesMenuItem = new MenuItem({
        label: "Preferences",
        accelerator: "Ctrl+,",
        click: function(){
            ipcRenderer.send("show-prefs");
        }
        
    });

    //Terminal menu  
    var terminalMenuItem = new MenuItem({
        label: "Terminal",
        submenu:[{
            label:"Display terminal", 
            click: function(){
                base.setTerminal()
        },accelerator: "Ctrl+Shift+T"
    }
    ]
    
    })
    //Set menu
    mainMenu.append(fileMenuItem);
    mainMenu.append(preferencesMenuItem);
    mainMenu.append(terminalMenuItem);
    Menu.setApplicationMenu(mainMenu);
}