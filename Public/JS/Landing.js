var postion = $(window).scrollTop(); 

$(document).ready(function(){
    $(".Heading").fadeIn(2000);
    $('body').on("load",function(){
        $(".Heading").css('font-size',(8)+"rem")
    })
   $(window).scroll(function(e){
    var height = $(window).scrollTop();
    var headingSize = parseInt($(".Heading").css('font-size'));
    if(height > postion && headingSize >70 ){
        $(".Heading").css('font-size',(headingSize-1)+"px");
    }
    let size = parseInt($(".Heading").css("font-size"))
   });
})


let div2 = document.querySelector(".first_div2");
let div3 = document.querySelector(".first_div3");
window.addEventListener("scroll",()=>{
    let bounding = div2.getBoundingClientRect();
    let bounding2 = div3.getBoundingClientRect();
    if(bounding.top <=400){
        $(".content_holder1").fadeIn(900);
    }
    if(bounding2.top <=400){
        $(".content_holder2").fadeIn(900);
    }
})

