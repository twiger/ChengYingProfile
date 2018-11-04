
(function($){
  $(function(){

    

  }); // end of document ready
})(jQuery); // end of jQuery name space


/**
 * Get the specific parameter from url
 */
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


/**
 * return target IP
 */
function getIP() {
    console.log("Get IP!");
    // return 'http://140.116.72.187:5000';
    return 'http://127.0.0.1:5000';
}
