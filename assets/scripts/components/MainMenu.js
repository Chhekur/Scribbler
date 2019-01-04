const {remote,Menu,MenuItem,BrowserWindow} = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const FileManager = require("./FileManager");
const CustomElectronTitlebar = require("custom-electron-titlebar");
const base = require("../EditorManager");
const path = require("path");

//Preferences
let prefOptions;

//Create main menu
function CreateMainMenu() {
    const mainMenu = new Menu();

    //Creating the custom title bar 
    const MainTitleBar = new CustomElectronTitlebar.Titlebar("#444",{
        drag: true,
        minimizable: true,
        maximizable: true,
        closeable: true,
        menuItemHoverColor: "#ccc"
    })
    //File menu
    var fileMenuItem = new MenuItem({
        label: "File",
        submenu:[
            {label:"New File", accelerator: "Ctrl+N"},
            {label:"New Window",click:FileManager.createNewWindow, accelerator: "Ctrl+Shift+N"},
            {type:"separator"},
            {label: "Open File",click: FileManager.OpenFile, accelerator: "Ctrl+O"},
            {label: "Open Folder",click: FileManager.OpenFolder, accelerator: "Ctrl+Shift+O"},
            {type:"separator"},
            {label: "Save",click: FileManager.Save,accelerator:"Ctrl+S"},
            {label: "Save As",click: FileManager.SaveAs,accelerator:"Ctrl+Shift+S"},

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
    
    MainTitleBar.setMenu(mainMenu);
}

module.exports = {
    CreateMainMenu
}