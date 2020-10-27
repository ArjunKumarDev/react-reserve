
function catchErrors(error,displayError){
let errorMsg;

if(error.response) {
    errorMsg = error.response.data;
    console.error("error response",errorMsg)

    // cloudinary image uploads
    if(error.response.data.error) {
        errorMsg = error.response.data.error.message
    }

}else if(error.request) {
    errorMsg = error.request;
    console.error("err req",errorMsg)
}else {

     errorMsg = error.message;
}
      
 displayError(errorMsg)
}


export default catchErrors;