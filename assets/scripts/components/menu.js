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
            {label:"New",click:fileMethods.newFile, accelerator: "Ctrl+N"},
            {label: "Open",click: fileMethods.openFile, accelerator: "Ctrl+O"},
            {label: "Save",click: fileMethods.saveFile,accelerator:"Ctrl+Shift+S"},
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