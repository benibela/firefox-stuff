// ==UserScript==
// @name        forbidden things
// @namespace   http://www.benibela.de
// @description Grepolis
// @include     http://*.grepolis.com/game/index*
// @version     1
// ==/UserScript==

function initbbutils(){
   function waitForDirect(selector, cont, timeout) {
       if ($(selector).length==0) { setTimeout(function(){waitFor(selector, cont);}, timeout?500:timeout); return; }
       cont($(selector));
   }
   function waitFor(selector, cont) {
      setTimeout(function(){waitForDirect(selector, cont)}, Math.random()*500+250);
   }
   function getOffset( el ) {
       var _x = 0;
       var _y = 0;
       while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
           _x += el.offsetLeft - el.scrollLeft;
           _y += el.offsetTop - el.scrollTop;
           el = el.offsetParent;
       }
       return { top: _y, left: _x };
   }
   
   
   waitFor("div.ui_quickbar", function(){
     String.prototype.contains = function(v){return this.indexOf(v) >= 0;};
   
     function mkislandbtn(time){return '<a href="javascript:claimisland('+time+')">'+time+"m </a>";}
     $("div.ui_quickbar").append('<div id="bbscript" style="padding-left: 2em">Bauern: '+mkislandbtn(5)+mkislandbtn(90)+mkislandbtn(480)+'</div>');
     $("div.ui_quickbar").css({"text-align": "left", "color": "white"});
     
     window.claimisland = function(time) { 
       var peasants = $(".farmtown_owned_on_same_island span.res_available").parent().children("a");
       var t = peasants[0];
       var off = getOffset(t);
       var x = off.left;
       var y = off.top;
      
       WMap.handlerDown({"target": t, clientX: x, clientY: y});
       WMap.handlerUp({"target": t, clientX: x, clientY: y});
       
       waitFor("#claim_info", function(claim){
         claim.mousedown();
         claim.mouseup();
         waitFor(".farm_claim", function(claims){
           time = time+":00";
           for (var i=0;i<claims.length;i++){
             if (claims[i].textContent.contains(time)) {
               $(claims[i]).children("a.farm_claim_button").click();
               return;
             }
           }
         });
       });
     }   
   });
   
}


setTimeout(function(){
  var injectJS = document.createElement("script");
  injectJS.innerHTML = initbbutils.toSource()+"initbbutils()";
  document.getElementsByTagName("head")[0].appendChild(injectJS);
}, 1000);

 