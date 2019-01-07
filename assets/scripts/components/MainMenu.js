const {Menu,MenuItem,BrowserWindow} = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const FileManager = require("./FileManager");
const CustomElectronTitlebar = require("custom-electron-titlebar");
const base = require("../EditorManager");
const path = require("path");
const InterfaceManager = require("./InterfaceManager");

//Preferences
let prefOptions;

//Create main menu
function CreateMainMenu() {
    const MainMenu = new Menu();
    //View menu
    var viewMenuItem = new MenuItem({
        label: "View",
        submenu:[
            {label:"Toggle Sidebar",click:InterfaceManager.SideBarToggle, accelerator: "Ctrl+Shift+}"}
        ]
    })
    //File menu
    var fileMenuItem = new MenuItem({
        label: "File",
        submenu:[
            {label:"New File", click:FileManager.CreateNewFile,accelerator: "Ctrl+N"},
            {label:"New Window",click:FileManager.CreateNewWindow, accelerator: "Ctrl+Shift+N"},
            {type:"separator"},
            {label: "Open File",click: FileManager.OpenFile, accelerator: "Ctrl+O"},
            {label: "Open Folder",click: FileManager.OpenFolder, accelerator: "Ctrl+Shift+O"},
            {type:"separator"},
            {label: "Save",click: FileManager.Save,accelerator:"Ctrl+S"},
            {label: "Save As",click: FileManager.SaveAs,accelerator:"Ctrl+Shift+S"},

        ]
    });

    //Preferences menu 
   

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
    MainMenu.append(fileMenuItem);
    MainMenu.append(viewMenuItem);
    MainMenu.append(terminalMenuItem);
    
    Menu.setApplicationMenu(MainMenu);
}

module.exports = {
    CreateMainMenu
}