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
   function waitForChain(args){
     function waitForChainRec(p) {
       if (p >= args.length) return;
       waitFor(args[p], function(x){
         args[p+1](x);
         waitForChainRec(p+2);
       });
     }
     waitForChainRec(0);
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
     $("div.ui_quickbar").append('<div id="bbscript" style="padding-left: 2em">Bauern: '+mkislandbtn(5)+mkislandbtn(20)+mkislandbtn(90)+mkislandbtn(480)+'<input id="bbpeasantlocal" type="checkbox"/> lokal</div>');
     $("div.ui_quickbar").css({"text-align": "left", "color": "white"});
     
     window.claimisland = function(time) { 
       //if ($("#activetown").length == 0) 
         $("div.btn_jump_to_town.jump_to_town").click();
       setTimeout(function(){waitFor("#activetown", function(){claimislandPrivate(time, $(".town_name")[0].textContent);})}, 750);
     }
     window.claimislandPrivate = function(time, endisland) { 
       var peasants = $(".farmtown_owned_on_same_island span.res_available").parent().children("a");
       if (peasants.length == 0) {
         if ($("#bbpeasantlocal")[0].checked) return;
         $(".btn_next_town").click();
         setTimeout(function(){
           if ($(".town_name")[0].textContent == endisland) return;
           //alert($(".town_name")[0].textContent +"=="+ endisland);
           $("div.btn_jump_to_town.jump_to_town").click();
           setTimeout(function(){
             claimislandPrivate(time, endisland);
           }, 1500);
         }, 1000);         
         return;
       }
       if ($(".limit_reached").length > 0) { alert("full!"); return; }
       var t = peasants[Math.floor(Math.random()*peasants.length)];
       var off = getOffset(t);
       var x = off.left;
       var y = off.top;
      
       WMap.handlerDown({"target": t, clientX: x, clientY: y});
       WMap.handlerUp({"target": t, clientX: x, clientY: y});
       
       var pillage = $(".forced_loyalty").length > 0;
       
       waitForChain([ pillage ? "#pillage_info" : "#claim_info", function(claim){
         claim.mousedown();
         claim.mouseup();
       }, 
       ".farm_claim", function(claims){
           function finalClaim(xtime) {
             for (var i=0;i<claims.length;i++){
               if (claims[i].textContent.contains(xtime)) {
                 $(claims[i]).children("a.farm_claim_button").click();
                 return true;
               }
             }
             return false;
           }
           if (!finalClaim(time+":00"))
             finalClaim("240:00");
       },
       "html", function(){ claimislandPrivate(time, endisland); }
       ]);
     }   
   });
   
}


setTimeout(function(){
  var injectJS = document.createElement("script");
  injectJS.innerHTML = initbbutils.toSource()+"initbbutils()";
  document.getElementsByTagName("head")[0].appendChild(injectJS);
}, 1000);

 