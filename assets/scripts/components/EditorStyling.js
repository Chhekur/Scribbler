//Setting the programmatic styles 

function SetBottomBarColor(){
    //Grab the colour of the gutter 
    var gutter = document.getElementsByClassName("CodeMirror-gutters")[0];
    //Removing the border
    var pickedStyle = window.getComputedStyle(gutter);
    var pickedBgColor = pickedStyle.getPropertyValue("background-color");
    //Set the background colour of the bottom bar to the gutter
    var bottomBar = document.getElementById("info-bar");
    bottomBar.style.backgroundColor = pickedBgColor;
    //Change the color of the icons to that same as the gutter fonts 
}


//Exporting
module.exports= {
    SetBottomBarColor
}