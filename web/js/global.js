(function($) {
    $(function() {

    }); // end of document ready
})(jQuery); // end of jQuery name space


/**
 * Get the specific parameter from url
 */
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


var sideNavClose = true;

function triggerSideNav() {

    if (sideNavClose) {
        $('.side-nav').css('margin', '0px 315px');
        document.getElementsByTagName("main")[0].style.marginLeft = "300px";
        sideNavClose = false;
    }
    else{
        $('.side-nav').css('margin', '0px 0px');
        document.getElementsByTagName("main")[0].style.marginLeft = "";
        sideNavClose = true;
    }
}