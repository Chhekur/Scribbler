var isProgressShowing = false;
var prefsContainer = document.getElementsByClassName("uk-container")[0];
//Declaration
var progressWrapper = document.createElement("div");
var progressContent = document.createElement("div");
var progressIcon = document.createElement("i");
var progressHeader = document.createElement("div");
var progressContentText; 
var progressContentHeaderText;

function InitModal(Message){
    bootbox.prompt(Message, function(result){ 
        return result;
     });

}
/**
 * 
 * @param {*} state 
 * @param {*} message 
 * @param {*} pos 
 * @param {*} timeout 
 * @param {*} icon 
 * @param {*} progressBar 
 * @param {*} theme 
 * @param {*} fontSize 
 */
function displayNotification(state,message,pos,timeout,icon,progressBar,theme,fontSize){
    //Displaying different notifications 
    switch(state){
        case "err":
        iziToast.error({
            
            message: message,
            progressBar: progressBar,
            theme: theme,
            icon: icon,
            messageSize: fontSize,
            timeout: timeout,
            position: pos
        });
    
        break;
        
        case "success":
        iziToast.success({
            
            message: message,
            progressBar: progressBar,
            theme: theme,
            icon: icon,
            messageSize: fontSize,
            timeout: timeout,
            position: pos
        });        
        break;

        case "warning":
        iziToast.warning({
            
            message: message,
            progressBar: progressBar,
            theme: theme,
            icon: icon,
            messageSize: fontSize,
            timeout: timeout,
            position: pos
        });        
        break;
        case "info":
        iziToast.info({
            
            message: message,
            progressBar: progressBar,
            theme: theme,
            icon: icon,
            messageSize: fontSize,
            timeout: timeout,
            position: pos


        });
    }
    
    
    
}
/**
 * 
 * @param {*} title 
 * @param {*} message 
 * @param {*} icon 
 */
function displayProgressNotification(title,message,icon){ 

    progressContentText = document.createTextNode(message);
    progressContentHeaderText = document.createTextNode(title);
    progressWrapper.setAttribute("class","ui icon message");
    progressWrapper.setAttribute("id","preferences-progress");
    progressContent.setAttribute("class","content");
    progressHeader.setAttribute("class","header");
    progressIcon.setAttribute("class",icon);

    //Append to wrapper
    progressWrapper.appendChild(progressIcon);
    progressWrapper.appendChild(progressContent);
    progressContent.appendChild(progressHeader);
    progressContent.appendChild(progressContentText);
    progressHeader.appendChild(progressContentHeaderText);
    progressWrapper.style.visibility ="hidden";
    
    //Append
    prefsContainer.append(progressWrapper);
    
    if(progressWrapper.style.visibility == "hidden"){
       progressWrapper.style.visibility ="visible";
    }else{
       progressWrapper.style.visibility = "hidden";
    }
    
    
}
/**
 * Create error to display underneath a preference when something is entered wrong
 * @param {} message 
 */
function CreateErrorNotification(message){
    //Create elements
    var ErrorNotificationWrapper = document.createElement("div");
    var ErrorNotificationLink = document.createElement("a");
    var ErrorNotificationPara = document.createElement("p");
    //Add classes and ID's
    ErrorNotificationWrapper.id = "preference-error";
    ErrorNotificationWrapper.classList.add("uk-alert uk-alert-danger");
    ErrorNotificationLink.classList.add("uk-alert-close");
    //Add attributes
    ErrorNotificationPara.textContent = message;
    //Append elements 
    //ErrorNotificationWrapper.appendChild(ErrorNotificationIcon);
    ErrorNotificationWrapper.appendChild(ErrorNotificationLink);
    ErrorNotificationWrapper.appendChild(ErrorNotificationPara);
    
    //Return element
    return ErrorNotificationWrapper;
}
function createErrorNode(icon,visible_message,lineNumber,message){

    var htmlNode =document.createElement("div");
    var iconNode = document.createElement("i");
    iconNode.setAttribute("class",icon);
    iconNode.style.marginRight = "5px";
    iconNode.style.marginLeft = "5px";

    
    var text =  document.createTextNode(visible_message+ " "+lineNumber + ",hover for more information");
    htmlNode.setAttribute("id","err")
    htmlNode.classList.add("error-node");
    htmlNode.title = message;
    htmlNode.appendChild(iconNode);
    htmlNode.appendChild(text);    

    //Check if the node is present 
    return htmlNode;
   
}

module.exports = {
    createErrorNode,
    displayNotification,
    displayProgressNotification,
    prefsContainer,
    progressWrapper,
    InitModal,
    CreateErrorNotification
}