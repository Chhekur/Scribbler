
function displayNotification(state,message,pos,timeout,icon,progressBar,theme,fontSize){
    //Displaying different notifications 
    switch(state){
        case "err":
        iziToast.error({
            
            message: message,
            progressBar: progressBar,
            theme: theme,
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
            messageSize: fontSize,
            timeout: timeout,
            position: pos


        });
    }
    
    
    
}

module.exports = {
    displayNotification
}