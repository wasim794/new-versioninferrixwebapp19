var isMobile = false;
//updateURL(0);
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}


jQuery(document).ready(function($) {
    'use strict';

    // ==============================================================
    // Notification list
    // ==============================================================
      if ($(".notification-list").length) {

        $('.notification-list').slimScroll({
            height: '250px'
        });
    }

    // ==============================================================
    // Menu Slim Scroll List
    // ==============================================================

      if ($(".menu-list").length) {
        $('.menu-list').slimScroll({

        });
    }

  $(".commonSaveButton").addClass("sidebarCommonClass");
    // ==============================================================
    // Sidebar scrollnavigation
    // ==============================================================
      if ($(".sidebar-nav-fixed a").length) {
        $('.sidebar-nav-fixed a')
            // Remove links that don't actually link to anything

            .click(function(event) {
                // On-page links
                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                    location.hostname == this.hostname
                ) {
                    // Figure out element to scroll to
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        event.preventDefault();
                        $('html, body').animate({
                            scrollTop: target.offset().top - 90
                        }, 1000, function() {
                            // Callback after animation
                            // Must change focus!
                            var $target = $(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            };
                        });
                    }
                };
                $('.sidebar-nav-fixed a').each(function() {
                    $(this).removeClass('active');
                })
                $(this).addClass('active');
            });

    }

    // ==============================================================
    // tooltip
    // ==============================================================
      if ($('[data-toggle="tooltip"]').length) {

            $('[data-toggle="tooltip"]').tooltip()

        }

     // ==============================================================
    // popover
    // ==============================================================
      if ($('[data-toggle="popover"]').length) {
            $('[data-toggle="popover"]').popover()

    }

     // ==============================================================
    // Chat List Slim Scroll
    // ==============================================================
      if ($('.chat-list').length) {
            $('.chat-list').slimScroll({
            color: 'false',
            width: '100%'


        });
    }

    // my js start here toggle class menu
//    $(".navi").on('click', function(){$(".headinglayout, .cardlayout").toggleClass("menu");   });

    $(".onlysmalldevices").on("click", function(){
        $(".adduserside").css({"visibility":"hidden"});

    });



    // ==============================================================
    // dropzone script
    // ==============================================================

 //     if ($('.dz-clickable').length) {
 //            $(".dz-clickable").dropzone({ url: "/file/post" });
 // }

}); // AND OF JQUERY


// $(function() {
//     "use strict";




   // var monkeyList = new List('test-list', {
    //    valueNames: ['name']

     // });
  // var monkeyList = new List('test-list-2', {
    //    valueNames: ['name']

   // });






// });

/******************* CUSTOM JS RAJ********************/



$(document).ready(function(){
    $('.fa-times').click(function(){
       $('.sidebar-dark').removeClass("collapse-open-dashboard");
       $('.sidebar-dark').addClass("collapse-close-dashboard");
       $('#show-sidebar').addClass('hide-fa-bars');
       $('#show-sidebar').removeClass('show-fa-bars');
       $('.dashboard-wrapper').addClass('m-l-50');
       $('.footer-wrapper').addClass('m-l-50');
       $('.dashboard-wrapper').removeClass('dashboard-wrap');
       $('.footer-wrapper').removeClass('dashboard-wrap');
    });

    $('#show-sidebar').click(function(){
       $('.sidebar-dark').addClass("collapse-open-dashboard");
       $('.sidebar-dark').removeClass("collapse-close-dashboard");
       $('#show-sidebar').removeClass('hide-fa-bars');
       $('#show-sidebar').addClass('show-fa-bars');
       $('.dashboard-wrapper').removeClass('m-l-50');
       $('.footer-wrapper').removeClass('m-l-50');
       $('.dashboard-wrapper').addClass('dashboard-wrap');
       $('.footer-wrapper').addClass('dashboard-wrap');
    });


//$(window).scroll(function(){
//
//  // Show button after 100px
//  var showAfter = 50;
//  if ( $(this).scrollTop() > showAfter ) {
//   $('.headinglayout').addClass('header_sticky').fadeIn();
////   $('.addbottomuser').fadeIn();
//  } else {
//   $('.headinglayout').removeClass('header_sticky');
////   $('.addbottomuser').fadeOut();
//  }
// });


if(!isMobile){
$("#sidebarclose").remove();
$("#sidebarclosetwo").remove();
$("#datasource_side").remove();
$("#alertlist_side").remove();
}






// $(".event_detail").mouseover(function(){
//    $(this).text("volume_off");
//  });
//  $(".event_detail").mouseout(function(){
//    $(this).text("volume_up");
//  });


// $(".event_detail").hover(function() {
//                $(this).text("volume_off");
//            }, function() {
//                 $(this).text("volume_up");
//            });





$(".add_icons").click(function(){
$(".drawer_sidebar").addClass("add_drawer_sidebar");
});

//$(".all_icons").on('click', function(e){
//e.preventDefault();
//var myId = $(".mat-tab-label").attr("id");
//if(myId=="mat-tab-label-0-0"){
//$(".addnew_drawer_sidebar").css('width','40%');
//
//}
//
//$("#mat-tab-label-0-1").on('click', function(){
//console.log("hello");
//
//$(".addnew_drawer_sidebar").css('width','60%');
//});
//
//$("#mat-tab-label-0-0").on('click', function(){
//
//console.log("hello");
//$(".addnew_drawer_sidebar").css('width','40%');
//});
//
//});

$(window).load(function() {
var numCard = $('.mat-card').length;
 if (numCard == 2) {
   /* $('.cards').css('color', 'red'); */
   $("mat-card").parent(".ng-star-inserted").addClass("two-cards");
 } else if (numCard == 3) {
   $(".ng-star-inserted").parent(".ng-star-inserted").addClass("three-cards");
 } else {

 }
 });

});

if(isMobile){
// var element  = document.querySelector("mat-slide-toggle#mat-slide-toggle-1");
//  element.classList.remove("toogleShaddowTopFilter");
}

function goBack() {
  window.history.back();
}









