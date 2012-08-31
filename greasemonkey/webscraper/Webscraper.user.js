// ==UserScript==
// @name        Webscraper
// @namespace   http://www.benibela.de
// @include     *
// @version     1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==

/***************************************************************************
 *   copyright       : (C) 2012 Benito van der Zander                      *
 *                              (except the library directly below)        *
 *   http://www.benibela.de                                                *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation  either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 ***************************************************************************/

//******************************************************************************
//Dragging library
//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

// Determine browser and version.

function Browser() {

  var ua, s, i;

  this.isIE    = false;
  this.isNS    = false;
  this.version = null;

  ua = navigator.userAgent;

  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.

  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}

var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, el) {

  var el;
  var x, y;

  // If an element id was given, find it. Otherwise use the element being
  // clicked on.

  if (el)
    dragObj.elNode = el;
  else {
    if (browser.isIE)
      dragObj.elNode = window.event.srcElement;
    if (browser.isNS)
      dragObj.elNode = event.target;

    // If this is a text node, use its parent element.

    if (dragObj.elNode.nodeType == 3)
      dragObj.elNode = dragObj.elNode.parentNode;
  }

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Save starting positions of cursor and element.

  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
  dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  // Update element's z-index.

  //dragObj.elNode.style.zIndex = ++dragObj.zIndex;

  // Capture mousemove and mouseup events on the page.

  if (browser.isIE) {
    document.attachEvent("onmousemove", dragGo);
    document.attachEvent("onmouseup",   dragStop);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS) {
    document.addEventListener("mousemove", dragGo,   true);
    document.addEventListener("mouseup",   dragStop, true);
    event.preventDefault();
  }
}

function dragGo(event) {

  var x, y;

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Move drag element by the same amount the cursor has moved.

  dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
  dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

  if (browser.isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS)
    event.preventDefault();
}

function dragStop(event) {

  // Stop capturing mousemove and mouseup events.

  if (browser.isIE) {
    document.detachEvent("onmousemove", dragGo);
    document.detachEvent("onmouseup",   dragStop);
  }
  if (browser.isNS) {
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
  }
  
  var dragged = $(dragObj.elNode);
  GM_setValue(prf+"guicoordinates", JSON.stringify([dragged.css("left"), dragged.css("top"), dragged.width(), dragged.height()]));
}

//******************************************************************************



var prf = "__scraper_";
var prfid = "#__scraper_";
var multipageInitialized = false;
var mainInterface = null;
var changedBody = false;


   
function moveLeft(e){
  $(prfid + "moveleft").hide();
  $(prfid + "moveright").show();
  mainInterface.css("left", "0px");
  mainInterface.css("right", "");
  mainInterface.css("top", "0px");
  mainInterface.css("width", "25%");
  mainInterface.css("height", "100%");
  GM_setValue(prf+"guiposition", "left");
  
  $(document.body.parentNode).css("position", "absolute").css("left", "26%").css("width", "75%");
  //TODO: move fixed
  changedBody = true;
}

function moveRight(e){
  $(prfid + "moveleft").show();
  $(prfid + "moveright").hide();
  mainInterface.css("top", "0");
  mainInterface.css("left", "");
  mainInterface.css("right", "0px");
  mainInterface.css("width", "25%");
  mainInterface.css("height", "100%");
  GM_setValue(prf+"guiposition", "right");

  $(document.body.parentNode).css("position", "absolute").css("left", "0").css("width", "74%");
  changedBody = true;
}

function makeinput(caption, id, value){ 
  var overridenValue = value;
  if (GM_getValue(prf+id+"_saved")) overridenValue = GM_getValue(prf+id+"_saved");
  return '<tr><td>'+caption+':</td><td><input id="'+prf+id+'"'+(overridenValue?'value="'+overridenValue+'"':"")+'/></td><td><button onclick="document.getElementById(\''+prf+id+'\').value = \''+value+'\';">⟲</button></tr>'; 
}
function makeselect(caption, id, values, def){ 
  if (!def) def = 0;
  if (GM_getValue(prf+id+"_saved")) def = GM_getValue(prf+id+"_saved") * 1;
  return '<tr><td>'+caption+':</td><td><select style="width:100%" id="'+prf+id+'">'+ values.map ( function(e, i) { return '<option value="'+i+'"'+(def == i ? " selected" : "")+'>'+e+'</option>'} ) + '</select></td></tr>'; }

function activateScraper(){ 
  localStorage[prf+"_deactivated"] = "";
  if (!mainInterface || mainInterface.css("display") == "none") {
    if (!mainInterface) {
      var gui = $(
'<div style="border: none; clear: both" id="'+prf+'gui">'+
'<b>Select the values you want to extract on the site</b><br><hr>' +
'<input id="'+prf+'optioncheckbox" type="checkbox"/> Show options<br>'+
'<table id="'+prf+'optiontable" style="display:none">' + 
makeinput('Included Attributes', "attribs", "id|class|name")+
makeinput('Excluded ids', "idsexcl", ".*[0-9].*|"+prf+".*")+
makeinput('Excluded classes', "classesexcl", ".*(even|odd|select|click|highlight|active|[0-9]|"+prf+").*")+
makeinput('Excluded default tags', "tagsexcl", "tbody")+
makeselect('Include siblings', "siblings", ["always", "if necessary", "never"], 1)+
'</table>'+
'<hr>Resulting template:' +
'</div>'
      )
      .append(
        $("<button/>", {
          text: "remote test",
          click: function(){
            var fd = new FormData();
            fd.append("extract",$(prfid+"template").val());
            fd.append("extract-kind", "template");
            var clone = document.body.cloneNode(true);
            removeScraperNodes(clone);
            fd.append("data", "<html><head><title></title></head>"+ //prefix
                              encodeNodeTags(document.body)+ //body tag (with existing attributes)
                              clone.innerHTML+"</body></html>");
            fd.append("output-format", "json");
            GM_xmlhttpRequest({
              url: "http://videlibri.sourceforge.net/cgi-bin/xidelcgi",
              data: fd, //automatically sets content-type
              method: "POST",
              onload: function(response){alert(response.responseText)}
              });
          }
        }))
       .append($("<br/>"))
       .append($("<textarea/>", {
         id: prf+'template',
         text: "waiting for selection...",
         style: "height: 15em"
       }))
       .append($("<br/>"))
       .append($("<input/>", {
         type: "checkbox",
         id: prf+"multipagecheckbox",  
         click: toggleMultipageScraping}))
       .append("Multipage template")
       .append($("<button/>", {id: prf + "multipageclearall", text: "clear all", style:"display: none",  click: function(){
         if (!confirm("Are you sure you want to remove all templates below? This action is not reversible.")) return;
         GM_setValue("multipageTemplate", "[]");
         GM_setValue("multipageVariables", "");
         $(prfid+"multipage").css("display", "none");
         multipageInitialized = false;
         toggleMultipageScraping();
       }}))
       .append($("<div/>", {
         id: prf + "multipage",
         style: "display: none"
         })
           .append($("<table/>", {id: prf + "multipagetable"}))
           .append("Resulting multipage template:")
           .append($("<br/>"))
           .append($("<textarea/>", {id: prf + "multipagetemplate"}))
       )
       ;
    
      mainInterface = $("<div/>",{
        style: "position: fixed;" +
               "top: 10px; " +
               "border: 1px solid gray; " +
               "background-color: white; "+ 
               "color: black;" +
               "padding: 2px;"+
               "z-index: 2147483647;"+ //maximal z-index (yes, there are pages close to this value)
               "overflow: auto;"+
               "overflow-x: hidden;"+
               "max-height: 95%",
        id: prf + "main"
      });
      mainInterface.appendTo("body");
      
         
      
      var harness = $('<div/>', {style:"border:none; max-height: 100%; overflow: auto; background-color: #EEEEEE"}).mousedown(function(e){
        if (e.target != this) return;
        $(prfid + "moveleft").show();
        $(prfid + "moveright").show();
        mainInterface.css("height", "");
        mainInterface.css("width", "");
        if (mainInterface.css("right") != "") {
          mainInterface.css("left", $(document).width() - $(this.parentNode).width() - (/[0-9]+/.exec(mainInterface.css("right"))) + "px"); 
          mainInterface.css("right", "");
        }
        GM_setValue(prf+"guiposition", "free");
        if (changedBody) {
          $(document.body.parentNode).css("left", "0").css("width", "100%");
          changedBody = false;
        }
        //,alert("=>"+localStorage[prf+"guiposition"]);
        dragStart(e,this.parentNode);})
        .append($("<button/>", {
           text: "<<", 
           id: prf + "moveleft",
           style: "border: 1px dashed black; padding: 2px;   cursor: pointer", 
           click: moveLeft }))
        .append($("<button/>", {
           text: ">>", 
           id: prf + "moveright",
           style: "border: 1px dashed black; padding: 2px; cursor: pointer; float: right; display: none", 
           click: moveRight }))
        .append($("<button/>", {
           text: "X", 
           style: "border: 3px double black; cursor: pointer; float: right", 
           click: deactivateScraper }))
           ;
      
      
      mainInterface.append(harness).append(gui);
            
      $("head").append($(
'<style>'+ 
 '.'+prf+ 'templateRead { border: 2px solid #FF00FF; display: inline-block}' +      //text-decoration: line-through;  
 '.'+prf+ 'templateRead div { border: none}' +      
 '.'+prf+ 'templateRead input { border: 1px solid gray}' +      
 '.'+prf+ 'templateRead button { border: 1px solid gray; margin-left: 4px}' +      
 '.'+prf+'read_options_hide {font-size:75%; border: 1px dashed; display: none; width: 100%; padding-right: 7px}'+
 '.'+prf+'templateRead:hover .'+prf+'read_options_hide{display: table}'+
 '.'+prf+'templateRead .'+prf+'read_options_pre{display: inline; background-color: #FF00FF}'+ 
 '.'+prf+'templateRead:hover .'+prf+'read_options_pre{display: none}'+ 
 '.'+prf+'read_options {display: inline}'+ 
// '.'+prf+'read_options:hover {display: block}'+ 
 '.'+prf+'read_var {width: 40px}'+
 '.'+prf+'read_source {width: 100%}'+

 '#'+prf+'main table {width: 100%}'+
 '#'+prf+'main input {width: 100%; border: 1px solid gray; margin: 0; padding: 2px;}'+
 '#'+prf+'main table button {border: 1px dashed black; padding: 2px;   cursor: pointer}'+
 '#'+prf+'main select {width: 100%; border: 1px solid gray; margin: 0; padding: 2px;}'+
 '#'+prf+'main table td {padding:2px; margin: 0}'+
 '#'+prf+'main textarea {width: 20em; height:10em; resize: both; width: 100%}'+ 


 '.'+prf+ 'templateLoop { border: 2px solid #0000FF !important  ; }' +      
 '.'+prf+ 'templateLoopMatched { border: 2px solid #00FF00 !important; }' +      
 '.'+prf+ 'templateLoopTR { background-color: #6666FF !important; }' +      
 '.'+prf+ 'templateLoopTR td { background-color: #6666FF !important; }' +      
 '.'+prf+ 'templateLoopMatchedTR { background-color: #55FF55 !important; }' +      
 '.'+prf+ 'templateLoopMatchedTR td { background-color: #55FF55 !important; }' +      
 '.'+prf+ 'templateReadRepetition { border: 2px solid yellow }' +


// prfid + "multipagetable textarea {width: 100%}" + 
 'body, html {height: 100%}' + 
/* prfid+'multipagesurrounding { height: 100%; overflow: hidden}' +
 prfid+'multipageinterface { position: absolute; width: 25em; left: 0; top: 0; bottom: 0}' +
 prfid+'multipageframe { position: absolute; left: 25em; top: 0; right: 0; height: 100% }' +
 prfid+'multipageframe iframe {position: absolute; top: 0; left: 0;  width: 99%; height: 99%}' +*/
'</style>'));
      
      $(gui).find("input").change(function(){
        GM_setValue(this.id+"_saved", this.value);
        regenerateTemplateQueued();
      });
      $(gui).find("select").change(regenerateTemplateQueued);
      $(gui).find("td button").click(regenerateTemplateQueued);
      
      var mouseUpActivated = false;
      $(document).mouseup(function(e){
        if (mouseUpActivated) return;
        mouseUpActivated = true;
        setTimeout(function(){
          mouseUpActivated = false;
          addSelectionToTemplate();
        }, 350);
      });
      
      $(prfid+"optioncheckbox").click(function(){
        $(prfid+"optiontable").toggle(); 
        GM_setValue("optionTableDisplay", $(prfid+"optiontable").css("display"));
      });
      
      if (!Node.ELEMENT_NODE) Node.ELEMENT_NODE = 1;
      if (!Node.TEXT_NODE) Node.TEXT_NODE = 3;
      
      RegExp.escape = function(text) {
          return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
      } //by Colin Snover

//alert(localStorage[prf+"guiposition"]);
      
      //  $( prfid + "moveleft").click(); works, but then causes an exception :(
    } else mainInterface.show();
    $(prfid+"activation").hide();

    if (GM_getValue(prf+"guiposition") == "left") moveLeft(); 
    else if (GM_getValue(prf+"guiposition") == "right") moveRight();
    else if (GM_getValue(prf+"guiposition") == "free") {
      $(prfid + "moveright").show();
      var pos = GM_getValue(prf+"guicoordinates");
      if (pos) {
        pos = JSON.parse(pos);
        mainInterface.css("left", pos[0]).css("top", pos[1]);//.width(pos[2]);//.height(pos[3]);
      } else mainInterface.css("right", "10px");
    }
  }
}

function deactivateScraper(){
  localStorage[prf+"_deactivated"] = true;
  $(prfid+"activation").show();
  mainInterface.hide();
  if (changedBody) {
    $(document.body.parentNode).css("left", "0").css("width", "100%");
    changedBody = false;
  }
}



function toggleMultipageScraping(){
  if ($(prfid+"multipage").css("display") == "none") {
    $(prfid+"multipageclearall").show();
    $(prfid+"multipage").css("display", "block");
    GM_setValue("multipageActive", true);
    if (!multipageInitialized) {
      var oldMultipage = GM_getValue("multipageTemplate");
      if (oldMultipage) oldMultipage = JSON.parse(oldMultipage);
      else oldMultipage = [];

      var table = $(prfid+"multipagetable");
      
      table.html("");
      
      table.append($("<tr/>")
          .append($("<td/>", {text: "Variables:"}))
          .append($("<td/>", {colspan: 3}).append($("<input/>", {value: GM_getValue("multipageVariables", ""), id: prf + "multipageVariables", title: "Variables defined in the template, in the format a:=1, b:=2, c:=3.", change: regenerateMultipageTemplate}))));
      
      function toggleNextTR(cb, count){
        if (!count) count = 1;
        var row = cb.parentNode.parentNode;
        var el = row.nextSibling;
        if (el.style.display == "none") {
          for (var i=0;i<count;i++) {
            el.style.display = "table-row";
            el = el.nextSibling;
          }
        } else {
          for (var i=0;i<count;i++) {
            el.style.display = "none";
            el = el.nextSibling;
          }
        }
      }
      
      function createNewPage(page){
        var more = (page.repeat || page.post || page.test);
        table
        .append($("<tr/>",  {})
          .append($("<td/>", {style: "border-top: 1px solid black"})
            .append($("<button/>", {text: "X", click: function(){
              var row = this.parentNode.parentNode;
              var table = row.parentNode;
              if (table.rows.length < 8) { alert("The last sub template cannot be removed."); return;}
              if (!confirm("Are you sure you want to remove the template for url \""+row.getElementsByTagName("input")[0].value+"\"?\nThis action is not reversible.")) return;
              table.removeChild(row.nextSibling);
              table.removeChild(row.nextSibling);
              table.removeChild(row.nextSibling);
              table.removeChild(row);
              regenerateMultipageTemplate();
            }}))
            .append($("<span/>", {text: " URL:"}))
           )
          .append($("<td/>", {style: "border-top: 1px solid black", colspan: 3})
            .append($("<input/>", {value: page.url, change: regenerateMultipageTemplate})))
          .append($("<td/>", {style: "border-top: 1px solid black"})
            .append($("<input/>", {type: "checkbox", checked: more?true:false, change: function(){toggleNextTR(this, 2 + (page.repeat?1:0));}}))
            .append("more")
           )
        ).append($("<tr/>", {style: more?"":"display: none"})
          .append($("<td/>", {text: "Postdata:"}))
          .append($("<td/>", {colspan: 3}).append($("<input/>", {value: page.post, change: regenerateMultipageTemplate})))
        ).append($("<tr/>", {style: more?"":"display: none"})
          .append($("<td/>", {text: "Condition:"}))
          .append($("<td/>", {colspan: 3}).append($("<input/>", {value: page.test, change: regenerateMultipageTemplate})))
          .append($("<td/>", {})
            .append($("<input/>", {type: "checkbox", checked: (page.repeat?true:false), change: function(){page.repeat = !page.repeat; toggleNextTR(this); regenerateMultipageTemplate();}}))
            .append("loop"))
        ).append($("<tr/>", {style: page.repeat?"":"display: none"})
          .append($("<td/>", {text: "For all:"}))
          .append($("<td/>", {}).append($("<input/>", {value: page.loopvar, change: regenerateMultipageTemplate})))
          .append($("<td/>", {text: "in"}))
          .append($("<td/>", {}).append($("<input/>", {value: page.looplist, change: regenerateMultipageTemplate})))
        ).append($("<tr/>")
          .append($("<td/>", {text: "Template:"}))
          .append($("<td/>", {colspan: 4}).append($("<textarea/>", {text: page.template})))
        )
      }
      var curUrl = location.href;
      if (curUrl.indexOf("#") > 0) curUrl = curUrl.substring(0, curUrl.indexOf("#"));
      oldMultipage.push({url: curUrl, repeat: false, test: "", template: $(prfid+"template").val(), post: ""});
      while (oldMultipage.length >= 2 &&
             oldMultipage[oldMultipage.length-2].url == oldMultipage[oldMultipage.length-1].url &&
             (oldMultipage[oldMultipage.length-1].template == "" || oldMultipage[oldMultipage.length-1].template == "waiting for selection..."))
          oldMultipage.pop(); //remove useless duplicates caused by reloads
          
      for (var i = 0; i < oldMultipage.length; i++) 
        createNewPage(oldMultipage[i]);

      multipageInitialized = true;
      regenerateMultipageTemplate();
    }
    
  } else {
    $(prfid+"multipage").css("display", "none");
    $(prfid+"multipageclearall").hide();
    GM_setValue("multipageActive", false);
  }
}


function regenerateMultipageTemplate(){
  var pages = [];
  var tds = $(prfid+"multipagetable tr td");
  for (var i=2; i < tds.length; i+=14) {
    pages.push({
      url:      tds[i+ 1].getElementsByTagName("input")[0].value,
      post:     tds[i+ 4].getElementsByTagName("input")[0].value,
      test:     tds[i+ 6].getElementsByTagName("input")[0].value,
      repeat:   tds[i+ 7].getElementsByTagName("input")[0].checked,
      loopvar:  tds[i+ 9].getElementsByTagName("input")[0].value,
      looplist: tds[i+11].getElementsByTagName("input")[0].value,
      template: tds[i+13].getElementsByTagName("textarea")[0].value
    });
  }

  var vars = $(prfid+"multipageVariables").val();
  
  
  GM_setValue("multipageTemplate", JSON.stringify(pages));
  GM_setValue("multipageVariables", vars);
  
  var res = "<action>\n";
  if (vars != "") {
    res += '  <page><template>{' + vars + '}</template></page>\n\n';
  }
  for (var i=0;i < pages.length; i++){
    if (pages[i].repeat)
      res += ' <loop '+encodeXMLAttributes({
        "var": pages[i].loopvar != "" ? pages[i].loopvar : null,
        list: pages[i].looplist != "" ? pages[i].looplist : null,
        test: pages[i].test != "" ? pages[i].test : null
      }) + '>\n';
    res += '  <page '+encodeXMLAttributes({
      url: pages[i].url, 
      test: !pages[i].repeat && pages[i].test != "" ? pages[i].test : null
    })+'>\n';
    if (pages[i].post != "") 
      res += "    <post>"+encodeXMLAttribute(pages[i].post)+"</post>\n";
    if (pages[i].template != "") {
      res += "    <template>\n" + pages[i].template + "\n    </template>\n";
    }
    res += "  </page>\n";
    if (pages[i].repeat)
      res += " </loop>\n";
    res += "\n";
  }
  res += "</action>";
  $(prfid+"multipagetemplate").val(res);
}

function myCreate(name, properties){ //basically the same as $(name, properties).get(), but latter can't be passed to surroundContents
  var result = document.createElement(name);
  if (properties) for (var p in properties) result.setAttribute(p, properties[p]);
  return result;
}

function enumerate(context, callback){  //like $("*", context).each(callback), but latter didn't work for the DocumentFragments of Range.extractContents
  var kids = context.childNodes;
  for (var i=0;i<kids.length;i++) enumerate(kids[i], callback);
  callback(context);
}

/*function childNodeLength(el){
  var r = el.childNodes.length;
  console.log(el.childNodes[1]);
  alert(">"+el.childNodes[el.childNodes.length-1].nodeValue+"<");
  for (var i=0;i<el.childNodes.length && el.childNodes[i].nodeType == Node.TEXT_NODE && el.childNodes[i].nodeValue == "";i++)  r -= 1;
  for (var i=el.childNodes.length-1;i>=0 && el.childNodes[i].nodeType == Node.TEXT_NODE && el.childNodes[i].nodeValue == "";i--)  r -= 1;  
  if (r <= 0) return 0;
  return r;
}*/

function indexOfNode(nl, e) {  //overriding NodeList.indexOf didn't work, perhaps due to GreaseMonkey security
  for (var i=0;i<nl.length;i++) if (nl[i] == e) return i; 
  return -1; 
} 

function removeWhileEmptyTextNode(e){ 
  var p = e.parentNode;
  var i = indexOfNode(p.childNodes, e);
  var c = 0;
  while (i>=0 && p.childNodes[i].nodeType == Node.TEXT_NODE && p.childNodes[i].nodeValue == "") {
    p.removeChild(p.childNodes[i]);
    if (i >= p.childNodes.length) i-=1;
    c+=1;
  }
  return c;    
}

function removeEmptyTextNodesChildNodes(e){
  if (e.childNodes.length == 0) return;
  removeWhileEmptyTextNode(e.childNodes[0]);
  if (e.childNodes.length == 0) return;
  removeWhileEmptyTextNode(e.childNodes[e.childNodes.length-1]);
}

function removeNodeButKeepChildren(n, local){
  if (!n) return;
  if (!n.parentNode) return;
  var cn = n.childNodes;
  var p = n.parentNode;
  while (cn.length > 0){
    if (cn[0].classList && cn[0].classList.contains(prf+"read_options"))  {
      n.removeChild(cn[0]);
     } else
      p.insertBefore(cn[0], n);
  }
  var nid = $(n).attr("id");
  p.removeChild(n);
  if (local) return;

  if (n == window.searchingRepetition) window.searchingRepetition = null;
  if ($(n).data(prf+"repetition")) {
    removeNodeButKeepChildren(document.getElementById($(n).data(prf+"repetition")));
    if (!n.classList.contains(prf+"templateReadRepetition")){
      //n = from element (see addRepetition)
      $("."+prf+"templateLoopMarkedFrom"+nid)
        .removeClass(prf+"templateLoopMarkedFrom"+nid)
        .each(function(){
          if (this.className.indexOf(prf+"templateLoopMarkedFrom") < 0) {
            $(this).removeClass(prf+"templateLoop");  //remove loop marker, if no children are there to loop over
            $(this).removeClass(prf+"templateLoopMatched");
            $(this).removeClass(prf+"templateLoopTR");  
            $(this).removeClass(prf+"templateLoopMatchedTR"); 
          }
        })
    }
  }
  
}

function removeScraperNodes(n, local) {
  if (n.classList && n.classList.contains("__scraper_templateRead")) {
    removeNodeButKeepChildren(n, local);
    return;    
  }
  if (n.id == "__scraper_main" || n.id == "__scraper_activation" ) {
    n.parentNode.removeChild(n);
    return;
  }
  if (!n.childNodes) return;
  var kids = n.childNodes;
  for (var i=kids.length-1;i>=0;i--)
    removeScraperNodes(kids[i], local);
}

function nextNode(e){
  if (!e) return null;
  if (e.nextSibling) return e.nextSibling;
  return nextNode(e.parentNode);
}
function previousNode(e){
  if (!e) return null;
  if (e.previousSibling) return e.previousSibling;
  return previousNode(e.parentNode);
}


function addSelectionToTemplate(){
  if (!mainInterface || mainInterface.css("display") == "none") return;
  if (!Node.TEXT_NODE) alert("initialization failed");
  
  var s = window.getSelection();
  
  /*if (( s.anchorNode.classList && s.anchorNode.classList.contains(prf+"templateRead") &&
         s.focusNode.classList && s.focusNode.classList.contains(prf+"templateRead")) || $(s.anchorNode).add(s.focusNode).parents("."+prf+"templateRead, "+prfid+"main").length != 0) return;*/

  if ($(s.anchorNode).add(s.focusNode).parents(prfid+"main").length != 0) return; 
  if ($(s.anchorNode).add(s.focusNode).parents("."+prf+"read_options").length != 0) return; 

  var r = s.getRangeAt(0);
  if (!r) return;
  
  var start = r.startContainer, end = r.endContainer, startOffset = r.startOffset, endOffset = r.endOffset;

  var changed = false;
  if (start.classList && start.classList.contains(prf+"templateRead")) {
    var temp = start.parentNode;
    removeNodeButKeepChildren(start);
    start = temp;
    changed = true;
  }
  if (end.classList  && end.classList.contains(prf+"templateRead")) {
    var temp = end.parentNode;
    removeNodeButKeepChildren(end);
    end = temp;
    changed = true;
  }
  $(s.anchorNode).add(s.focusNode).parents("."+prf+"templateRead").each(
    function(i,n){removeNodeButKeepChildren(n); changed=true; }
  );
    
  
  if (start == end && endOffset <= startOffset) { if (changed) regenerateTemplateQueued(); return; }
  
//  alert(start+" "+end+" "+startOffset + " "+endOffset)
  //reimplementation of surroundContents, except the inserted element is moved down as far as possible in the hierarchie
  
  //remove useless (text) nodes
  while ((start.nodeType == Node.TEXT_NODE && start.nodeValue.substring(startOffset).trim() == "")
         || (start.nodeType == Node.ELEMENT_NODE && start.childNodes.length <= startOffset)) {
    startOffset = indexOfNode(start.parentNode.childNodes,start) + 1;
    start = start.parentNode;
    if (start == end && endOffset <= startOffset) return;
  }
  while (endOffset == 0 || (end.nodeType == Node.TEXT_NODE && end.nodeValue.substring(0,endOffset).trim() == "")) {
    endOffset = indexOfNode(end.parentNode.childNodes,end);
    end = end.parentNode;
    if (start == end && endOffset <= startOffset) { if (changed) regenerateTemplateQueued(); return;}
  }
  
  //find common ancestor
  var common;
  var a = start, b = end, ai = startOffset, bi = endOffset;

  if (a == b) common = a;
  else {
    var aparents = new Array(); var bparents = new Array();
    var aindices = new Array(); var bindices = new Array();

    aparents.push(a); aindices.push(ai);
    bparents.push(b); bindices.push(bi);
    while (a != b) {
      if (a != null) {
        ai = indexOfNode(a.parentNode.childNodes, a);
        if (bparents.indexOf(a.parentNode) >= 0) { common = a.parentNode; bi = bindices[bparents.indexOf(common)]; break; }
        a = a.parentNode;
      }
      if (b != null){
        bi = indexOfNode(b.parentNode.childNodes, b) + 1;
        if (aparents.indexOf(b.parentNode) >= 0) { common = b.parentNode; ai = aindices[aparents.indexOf(common)]; break; }
        b = b.parentNode;
      }
      aparents.push(a); aindices.push(ai);
      bparents.push(b); bindices.push(bi);
    }
    if (a == b)  
      common = a;
  }
  
  if (!common) alert("failed to find common parent");
  if (ai >= bi) { if (changed) regenerateTemplateQueued(); return; }
  
  var templateRead;
  if (common.nodeType != Node.TEXT_NODE) {
    bi -= removeWhileEmptyTextNode(common.childNodes[ai]);
    bi -= removeWhileEmptyTextNode(common.childNodes[bi-1]);
    if (ai >= bi) { if (changed) regenerateTemplateQueued(); return;}
    
    while (ai + 1 == bi) {
      if (common.childNodes[ai].classList && common.childNodes[ai].classList.contains(prf+"templateRead")) {
        bi = ai + common.childNodes[ai].childNodes.length;
        removeNodeButKeepChildren(common.childNodes[ai]);
        changed = true;
      } else {
        if (common.childNodes[ai].nodeType == Node.TEXT_NODE) break;
        common = common.childNodes[ai];
        ai = 0;
        bi = common.childNodes.length;
      }
      bi -= removeWhileEmptyTextNode(common.childNodes[ai]);
      bi -= removeWhileEmptyTextNode(common.childNodes[bi-1]);
      if (ai >= bi) { if (changed) regenerateTemplateQueued(); return;}
    }

    //if (bi + 1 <= common.childNodes.length)// && common.childNodes[bi].nodeType == Node.TEXT_NODE) 
    //  bi++; //prevent inclusion of the next element in the read tag, but still allow partial text inclusion (todo: check if this is correct)

    for (var i=bi-1; i >= ai; i--) 
      enumerate(common.childNodes[i], function(n){ 
        if (n.classList && n.classList.contains(prf+"templateRead")) 
          removeNodeButKeepChildren(n);           
      })
    templateRead = myCreate("div", {"class": prf + "templateRead"});
    common.insertBefore(templateRead, common.childNodes[ai]);
    for (var i=ai;i<bi;i++)
      templateRead.appendChild(common.childNodes[ai+1]);

  //alert(a+" "+b+" "+ai + " "+bi)
    //split text nodes
    if (start.nodeType == Node.TEXT_NODE && startOffset != 0)  {
      var prefix = start.nodeValue.substring(0,startOffset);
      start.textContent = start.nodeValue.substring(startOffset);
      templateRead.parentNode.insertBefore(document.createTextNode(prefix), templateRead);
    }

    if (end.nodeType == Node.TEXT_NODE && endOffset < end.nodeValue.length)  {
      var suffix = end.nodeValue.substring(endOffset);
      end.textContent = end.nodeValue.substring(0,endOffset);
      if (templateRead.parentNode.lastChild == templateRead)
        templateRead.parentNode.appendChild(document.createTextNode(suffix));
      else {
        templateRead.parentNode.insertBefore(document.createTextNode(suffix), templateRead.nextSibling);
      }
    }
    
    //get rid of duplicated text nodes
    enumerate(templateRead.parentNode, function(n){
      for (var i=n.childNodes.length-1;i>0;i--)
        if (n.childNodes[i].nodeType == Node.TEXT_NODE && n.childNodes[i - 1].nodeType == Node.TEXT_NODE) {
          n.childNodes[i-1].nodeValue = n.childNodes[i-1].nodeValue + n.childNodes[i].nodeValue;
          n.childNodes[i].parentNode.removeChild(n.childNodes[i]);
        }
    });
  } else {
    var prefix = common.nodeValue.substring(0,ai);
    var s = common.nodeValue.substring(ai, bi);
    templateRead = myCreate("div", {"class": prf + "templateRead"});
    templateRead.textContent = s;
    var suffix = common.nodeValue.substring(bi);

    common.parentNode.insertBefore(document.createTextNode(prefix), common);
    common.parentNode.insertBefore(templateRead, common);
    common.textContent = suffix;
  }
  
  if (templateRead) {
    enumerate(templateRead.parentNode, function(n){
      removeEmptyTextNodesChildNodes(n);
    });
    
    if (!window.runningId) window.runningId = 0;
    window.runningId += 1;
    templateRead.id = prf + "templateRead"+ window.runningId;
   

    var value = "";
 
    //same vars as in regenerateTemplate
    var cur = templateRead.parentNode;
    var kids = cur.childNodes;
    var tagsexcl = new RegExp("^("+$(prfid + "tagsexcl").val()+")$", "i");
    var ignoreTag = !cur.hasAttributes() && tagsexcl.test(cur.nodeName);       //auto created elements don't have attributes
    var i = indexOfNode(kids, templateRead);
    
    if (!ignoreTag && kids.length == 1) value = ".";
    else if (ignoreTag && cur.parentNode.childNodes.length == 1) value = ".";
    else if (kids[i].childNodes.length == 1 && kids[i].childNodes[0].nodeType == Node.TEXT_NODE) {
      //only read text
      var prefix = (i == 0 || kids[i-1].nodeType != Node.TEXT_NODE) ? "" : RegExp.escape(kids[i-1].nodeValue.trimLeft());
      var suffix = (i == kids.length - 1 || kids[i+1].nodeType != Node.TEXT_NODE) ? "" : RegExp.escape(kids[i+1].nodeValue).trimRight();
      if (prefix == "" && suffix == "") value = "text()";
      else value = "filter(text(), \""+prefix+"(.*)"+suffix+"\", 1)";
    } else {
      value = ".";
    }   
     
    function spanner(n){ return $("<span/>", {style: "display: table-cell"}).append(n); }
    function maketinyedit(c, info, clicky){if (!clicky) clicky = regenerateTemplateQueued; return $("<input/>", {class: c, title: info, /*change: clicky,*/ keyup: clicky, click: function(e){e.preventDefault(); this.focus();}   });};
    function maketinybutton(c, info, clicky){ return $("<button/>", {class: c, text: info, click: clicky  });}; 
       
       
    function varnameChanged(){
      var p = $(this).parents("."+prf+"templateRead");
      var value = p.find("."+prf+"read_var").val();
      if (p.find("."+prf+"read_optional").is(':checked')) value += "?";
      p.find("."+prf+"read_options_pre").text(value);
      regenerateTemplateQueued();
    }
    
    function followLink(e){
      var p = $(this).parents("."+prf+"templateRead");
      p.find("."+prf+"read_optional").prop("checked", true);
      p.find("."+prf+"read_var").val("_follow");
      p.find("."+prf+"read_source").val("@href");
      regenerateTemplateQueued();
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    
    function readRepetitions(e,p){
      if (p.data(prf+"repetition")) 
        removeNodeButKeepChildren(document.getElementById(p.data(prf+"repetition")));
      
      p.find("."+prf+"btnloop").text("select next occurence");
      window.searchingRepetition = p;
      if (e) e.preventDefault();
    }
    
    function addRepetition(from, to){
      //assert  window.searchingRepetition == from
      window.searchingRepetition = null;

      to.addClass(prf+"templateReadRepetition")
      from.data(prf+"repetition", to.attr("id"));
            
      //alert(from.get()  + " "+to.get());                                                                                   works (=> [object XrayWrapper [object HTMLDivElement]] [object XrayWrapper [object HTMLDivElement]])
      //alert(from.get().parentNode  + " "+to.get().parentNode);                                                             does not work (=> undefined undefined)
      //alert(document.getElementById(from.attr("id")).parentNode  + " "+document.getElementById(to.attr("id")).parentNode); works (=> [object XrayWrapper [object HTMLTableCellElement]] [object XrayWrapper [object HTMLTableCellElement]])
      
      
      var highestMatchFrom = document.getElementById(from.attr("id")).parentNode;
      var highestMatchTo =   document.getElementById(to.attr("id")).parentNode;
      
      if (highestMatchFrom == highestMatchTo) {
        alert("Repetitions need to be in different html tags");
        readRepetitions(null,from);
        return;
      }
      
      if (!fitElements(highestMatchFrom, highestMatchTo)) {
        alert("Failed to match parents: "+encodeNodeTags(highestMatchFrom) +" vs. "+encodeNodeTags(highestMatchTo)+"\nMake sure to select both occurences in the same way, and add mismatching attributes to the ignore lists.");
        readRepetitions(null,from);
        return;
      }
      
      var matchFromPseudoTemplate = [{nodeName: highestMatchFrom.nodeName, attributes: filterNodeAttributes(highestMatchFrom)}];
      
      while (highestMatchFrom.parentNode != highestMatchTo.parentNode && fitElements(highestMatchFrom.parentNode, highestMatchTo.parentNode)){
        highestMatchFrom = highestMatchFrom.parentNode;
        highestMatchTo = highestMatchTo.parentNode;
        matchFromPseudoTemplate.push({nodeName: highestMatchFrom.nodeName, attributes: filterNodeAttributes(highestMatchFrom)});
      }
      
      if ($(highestMatchFrom.parentNode).find("#"+to.attr("id")).length == 0){
        alert("Highest common parent: "+encodeNodeTags(highestMatchFrom)+ " doesn't contain the marked repetition.\nFailed matching: "+encodeNodeTags(highestMatchFrom.parentNode)+ " vs. "+encodeNodeTags(highestMatchTo.parentNode) );
        readRepetitions(null, from);
        return;
      }
        
      
      
      from.find("."+prf+"btnloop").text("read repetitions");
      to.data(prf+"repetition", from.attr("id"));
      
      $(highestMatchFrom).addClass(prf+"templateLoop").addClass(prf+"templateLoopMarkedFrom"+from.attr("id"));
      if (highestMatchFrom.nodeName == "TR") $(highestMatchFrom).addClass(prf+"templateLoopTR");
      
      var siblings = highestMatchFrom.parentNode.childNodes;
      var selfFound = false;
      for (var i=0;i<siblings.length;i++)
        if (selfFound) {
          if (canMatchPseudoTemplate(matchFromPseudoTemplate, matchFromPseudoTemplate.length, siblings[i])) {
            $(siblings[i]).addClass(prf+"templateLoopMatched").addClass(prf+"templateLoopMarkedFrom"+from.attr("id"));
            if (siblings[i].nodeName == "TR")
              $(siblings[i]).addClass(prf+"templateLoopMatchedTR");            
              
          }
        } else if (siblings[i] == highestMatchFrom) selfFound = true;
      
      regenerateTemplateQueued();
      //from.css("border", "2px solid blue");
    }
   
    if ($(templateRead).width() < 90) width = "40px";
    else width = "100%";

    $('<span/>', {
      text: "",
      class: prf+"read_options_pre"
    }).add(
      window.searchingRepetition ?  ( $("<span/>", {text: "repetition", style: "background-color: yellow"}) )
      :
      (($('<div/>', {
          text: "",
          class: prf+"read_options_hide"
         })).append(
           $("<div/>", {style: "display: table"})
           .append(
             $("<div/>", {style: "display: table-row"})
               .append(spanner(maketinyedit(prf+"read_var", "Variable name", varnameChanged)))
               .append(spanner().text(":="))
               .append(spanner(maketinyedit(prf+"read_source", "Value to read (e.g. text() or   @href))").val(value).css("width", width)).css("width", width).css("padding-right", "10px"))
           ).add($("<div/>", {})
             .append(maketinybutton(prf+"btnkill", "X", function(e){var readTag = this.parentNode.parentNode.parentNode.parentNode; removeNodeButKeepChildren(readTag); regenerateTemplateQueued(); e.preventDefault(); }))
            // .append("<br/>")
             .append(cur.nodeName == "A" ? maketinybutton(prf+"btnfollow", "follow link", followLink) : "")
             .append(maketinybutton(prf+"btnloop", "read repetitions", function(e){readRepetitions(e,$(this).parents("."+prf+"templateRead"));}))
             .append($("<input/>", {type: "checkbox", class: prf+"read_optional", change: varnameChanged, click: function(e){ e.preventDefault(); var t = this; var tc = this.checked; setTimeout(function(){ t.checked = tc; varnameChanged.call(t); /* returning resets the checked value to the old value. */ }, 200); return false;}}))
             .append("optional")
             .append($("<input/>", {type: "checkbox", class: prf+"read_match_children", change: varnameChanged, click: function(e){ e.preventDefault(); var t = this; var tc = this.checked; setTimeout(function(){ t.checked = tc; varnameChanged.call(t); /* returning resets the checked value to the old value. */ }, 200); return false;}}))
             .append("match children")
           )
       )) 
    ).appendTo($("<div class='"+prf+"read_options'/>").appendTo($(templateRead)));
  }
  
  if (window.searchingRepetition) 
    addRepetition(window.searchingRepetition, $(templateRead));
  /*
  var cur = ex;
  removeEmptyTextNodesChildNodes(cur);
  while (cur.childNodes.length == 1) {
    cur = cur.firstChild;
    removeEmptyTextNodesChildNodes(cur);
  }
  var templateRead = null;
  if (cur == ex) {
    cur = myCreate("div", {"class": prf + "templateRead"});
    cur.appendChild(ex);
    templateRead = cur;
    alert("1");    
  } else {
    templateRead = myCreate("div", {"class": prf + "templateRead"});
    cur.parentNode.replaceChild(templateRead, cur);
    alert(cur.parentNode);
    templateRead.appendChild(cur);
    alert(cur.parentNode == templateRead);
    alert(cur);
    alert(cur.innerHTML);
    cur = ex;
    for (var i=0;i<cur.childNodes.length;i++)
      alert(cur.childNodes[i]+": "+	cur.childNodes[i].innerHTML)
    return;
  }
  
//  alert( $("."+prf+"templateRead", $(ex.childNodes)).length);
//alert( $("."+prf+"templateRead", $(ex)).length);
  r.insertNode(cur); //surroundContents(myCreate("span", {"class": prf + "templateRead"}));
//  if (templateRead.parentNode) removeEmptyTextNodesChildNodes(templateRead.parentNode);
//  if (templateRead.parentNode.parentNode) removeEmptyTextNodesChildNodes(templateRead.parentNode.parentNode);
  */
  regenerateTemplateQueued();
  window.getSelection().collapseToStart();
}

function updateRegexps(){
  window.attribs = new RegExp("^("+$(prfid + "attribs").val()+")$", "i");
  window.tagsexcl = new RegExp("^("+$(prfid + "tagsexcl").val()+")$", "i");
  window.idsexcl = new RegExp("^("+$(prfid + "idsexcl").val()+")$", "i");
  window.classesexcl = new RegExp("^("+$(prfid + "classesexcl").val()+")$", "i");
  window.siblingsinclmode = $(prfid+"siblings").val();
}

function filterNodeAttributes(node){
  var res = {};
  var a = node.attributes;
  if (a)
    for (var i=0;i<node.attributes.length;i++)
      if (attribs.test(a[i].name)) 
        if (a[i].name == "id") {
          if (!idsexcl.test(a[i].value)) 
            res[a[i].name] = a[i].value;
        } else if (a[i].name == "class") {
          var cl = new Array();
          for (var j=0;j<node.classList.length;j++)
            if (!classesexcl.test(node.classList[j])) cl.push(node.classList[j]);
          if (cl.length > 0) res["class"] = cl;
        } else res[a[i].name] = a[i].value;
    //if (node.attributes[i].name)
  return res;
}

function objHasProperties(obj){
  for (var i in obj) return true;
  return false;
}

function fitElements(t, h){ //template vs. html element
  if (t.nodeName != h.nodeName) return false;
  return fitElementTemplate(t.nodeName, filterNodeAttributes(t), h);
}

function fitElementTemplate(tn, att, h){ //template node name, template attributes vs. html element
//alert("fit: "+encodeNodeTags(t)+" => "+encodeNodeTags(h));
  if (tn != h.nodeName) return false;
  
  for (var a in att) 
    if (a != "class") {
      if (att[a] != h.attributes[a].value) return false;
    } else {
      var expectedClasses = att[a];
      if (expectedClasses.length == 0) continue;
      if (!h.classList) return false;
      for (var i=0;i<expectedClasses.length;i++)
        if (!h.classList.contains(expectedClasses[i])) 
          return false;
    }

  return true;
}

var TemplateShortRead = 1;
var TemplateLoop = 2;
var TemplateMatchNode = 3;
var TemplateMatchText = 4; 

//(simplified) template matching
function canMatchPseudoTemplate(templateNodes, templateNodeLength, tocheck){
  //TODO: optimize (e.g. gather all that match last, gather all that match last-1 and have parents in the 1st set,...). Matching again to all children is crazy
  var last = templateNodes[templateNodeLength-1];
  var kids = tocheck.childNodes;
  if (fitElementTemplate(last.nodeName, last.attributes, tocheck)) {
    if (templateNodeLength == 1) return true;
    for (var i=0;i<kids.length;i++)
      if (canMatchPseudoTemplate(templateNodes, templateNodeLength-1, kids[i]))
        return true; 
  }
  //alert(templateNodes+" "+templateNodeLength+" "+tocheck+ " "+tocheck.textContent);
  for (var i=0;i<kids.length;i++)
    if (canMatchPseudoTemplate(templateNodes, templateNodeLength, kids[i]))
      return true; 
  return false;
}

function findTemplateMatchingNodes(template, start) {
  //find all self-or-descendants::* matching template (ignoring children)
  var firstLevelMatches = new Array;
  function recElement(node){
    if (fitElementTemplate(template.value, template.attributes, node)) firstLevelMatches.push(node);
    var kids = node.childNodes;
    for (var i=0;i<kids.length;i++)
      recElement(kids[i]);
  }
  function recText(node){
    if (node.nodeType == Node.TEXT_NODE) {
      if (node.nodeValue.trim() == template.value)
        firstLevelMatches.push(node);
    } else {
      var kids = node.childNodes;
      for (var i=0;i<kids.length;i++)
        recText(kids[i]);
    }
  }
  
  if (template.kind == TemplateMatchNode) recElement(start);
  else if (template.kind == TemplateMatchText) recText(start);
  else return [];
  
  if (!template.children || template.children.length == 0) return firstLevelMatches;
  
  
  //find all matches for all children
  var kidsMatches = new Array();
  
  for (var i = 0; i < template.children.length; i++) {
    var doMatch = ((!template.children[i].templateAttributes || !template.children[i].templateAttributes.optional) 
               && (template.children[i].kind == TemplateMatchText || template.children[i].kind == TemplateMatchNode));
    if (!doMatch) 
      kidsMatches.push(null);
    else {
      kidsMatches.push(findTemplateMatchingNodes(template.children[i], start)); //This is only called once for every template element 
      if (kidsMatches[kidsMatches.length-1].length == 0) return [];
    }
  }
  
  firstLevelMatches.filter(function(node){
    var okay = true;
    var laterKids = new Array();
    for (var i = 0; i < node.children.length; i++)
      if (kidsMatches[i] != null) {
        var newMatches = kidsMatches[i].filter(function(n){ return n != node && node.compareDocumentPosition(n) & 16 == 16; });
        if (newMatches.length == 0) return false;
        laterKids.push(newMatches);
      }
    for (var i = laterKids.length-1; i>=0; i--) 
      for (var j = laterKids.length-1; j>i; j--) {
        while ((laterKids[i][laterKids[i].length-1].compareDocumentPosition(laterKids[j][laterKids[j].length-1]) & 4) != 4) { //UNLESS laterKids[i].last < laterKids[j].last  
          laterKids[i].pop();
          if (laterKids[i].length == 0) return false;
        }
      }
   return true;
  });
  
  return firstLevelMatches;
}

function encodeXMLAttribute(s) {
  if (s instanceof Array) s = s.join(" ");
  return s.replace( /&/g, '&amp;').replace( /"/g, '&quot;').replace( /</g, '&lt;');
}
function encodeXMLAttributes(o) {
  var res = "";
  for (var i in o) {
    if (o[i] == null) continue;
    if (res != "") res += " ";
    res += i + "=\"" + encodeXMLAttribute(o[i]) + "\"";
  }
  return res;
}

function encodeNodeTags(node, close){
  if (!node) return "??";
  var res = "<" + node.nodeName;
  var attr = filterNodeAttributes(node);
  if (attr)
    for (var i in attr)
      if (i != "class") res += " " + i + "=\""+encodeXMLAttribute(attr[i])+"\"";
      else res += " " + i + "=\""+encodeXMLAttribute(attr[i].join(" "))+"\"";
  if (close) res += "/>\n";
  else res += ">";
  return res;
}

/*function fitElements(n1, n2){
  if (n1.nodeName != n2.nodeName) return false;
  var a1 = filterNodeAttributes(n1);
  var a2 = filterNodeAttributes(n2);
  function cmp(b1, b2) {
    for (var a in b1) 
      if (a != "class") {
        if (b1[a] != b2[a]) return false;
      } else {
        if (b1[a].split(" ").sort().join(" ") != 
            b2[a].split(" ").sort().join(" "))
          return false;
      }
    return true;
  }
  
  return cmp(a1, a2) && cmp(a2, a1);
}*/


function regenerateTemplateQueued(){   setTimeout(function(){regenerateTemplateQueuedDo(new Date().getTime())}, 250); }

var updatedTime = 0;
function regenerateTemplateQueuedDo(callTime){   
  if (callTime < updatedTime) return;
  regenerateTemplate();
}


function regenerateTemplate(){


  updateRegexps();
  
  function regenerateTemplateRec(cur){
    var kids = cur.childNodes;
    var res = new Array();
    var lastFoundTemplate = -1;
    var i = 0;
    var useSiblings = false;
    var fullSpecified = true;
    var hasReadTag = false;
    var allOptional = true;
    var hasOptional = false;
    var optionals = new Array();
    for (i=0;i<kids.length;i++) {
      if (kids[i].nodeType != Node.TEXT_NODE && kids[i].nodeType != Node.ELEMENT_NODE) continue;

      var newTemplate = null;
      var templateSpecific = false;
      var matchChildren = false;
      if (kids[i].classList && kids[i].classList.contains(prf+"templateRead")) {
        if (kids[i].classList.contains(prf+"templateReadRepetition")) 
          continue;
       
        hasReadTag = true;
        
        var read = $("." + prf + "read_var", kids[i]).val();
        if (read != "") read += " := ";

        read += $("." + prf + "read_source", kids[i]).val();
        
        newTemplate = [{
         kind: TemplateShortRead,
         value: read,
         attributes: {},
         children: [],
         templateAttributes: {}
        }];
        
       
       
        var optional = $("."+prf+"read_optional", kids[i]).is(':checked');
        allOptional = allOptional && optional;
        hasOptional = hasOptional || optional;
        optionals.push(optional);
        matchChildren = $("."+prf+"read_match_children", kids[i]).is(':checked');
      } else { 
        var x = regenerateTemplateRec(kids[i]); 
        if (x.template && x.template.length > 0) {
          newTemplate = x.template;
          allOptional = allOptional && x.optional;
          hasOptional = hasOptional || x.optional;
          optionals.push(x.optional);
          templateSpecific = x.fullSpecified && !x.optional;
        } 
      }
      if (newTemplate != null) {
        if (siblingsinclmode == 1 && newTemplate.length > 0 && !templateSpecific) {
          var testTemplate = newTemplate[0];
          if (testTemplate.kind == TemplateLoop && testTemplate.children.length > 0) 
            testTemplate = testTemplate.children[0];
          for (var j = lastFoundTemplate + 1; j < i; j++)
            if (testTemplate.kind == TemplateShortRead 
             || testTemplate.kind == TemplateLoop 
             || findTemplateMatchingNodes(testTemplate, kids[j]).length > 0)
              res.push(kids[j]);
        }
        if (matchChildren) 
          for (var j=0;j<kids[i].childNodes.length;j++)
             res.push(kids[i].childNodes[j]);
        fullSpecified = fullSpecified && templateSpecific;
        lastFoundTemplate = i;
        res.push(newTemplate);
      } else if (siblingsinclmode == 0) //always
        res.push(kids[i]);
    }
    
    if (lastFoundTemplate == -1) return {template: []};

    var p = 0;
    var restemplate = [];
    //alert(res.toSource());
    for (var i=0;i<res.length;i++) {
      if (res[i] == null) continue;
      if (res[i] instanceof Array) {
        for (var j = 0; j < res[i].length; j++) {
          if (!allOptional && optionals[p])
            res[i][j].templateAttributes.optional = true;
          restemplate.push(res[i][j]);
        }
        p+=1;
      } else if ( res[i].nodeType == Node.TEXT_NODE) {
          //if (i ) if (i == 0 || typeof res[i-1] != "string"){  //don't add following text nodes, they wouldn't be matched ??????
          var temp = res[i].textContent.trim();
          if (temp != "") {
            restemplate.push({
             kind: TemplateMatchText,
             value: temp,
             attributes: {},
             children: [],
             templateAttributes: {}
            });
          }
      } else if (res[i].nodeType == Node.ELEMENT_NODE) {
          var obj = {
           kind: TemplateMatchNode,
           value: res[i].nodeName,
           attributes: filterNodeAttributes(res[i]),
           children: [],
           templateAttributes: {}
          };
          restemplate.push(obj);
      }     
    }
    
    
    var ignoreTag = !cur.hasAttributes() && tagsexcl.test(cur.nodeName);    
     
    if (!ignoreTag) {
      restemplate = [{
       kind: TemplateMatchNode,
       value: cur.nodeName,
       attributes: filterNodeAttributes(cur),
       children: restemplate,
       templateAttributes: {}
      }];

      if (objHasProperties(restemplate[0].attributes)) {
        if (restemplate[0].attributes.id != null) fullSpecified = true;
      }

    }
    
    if (cur.classList && cur.classList.contains(prf+"templateLoop")) {
      restemplate = [{
        kind: TemplateLoop,
        value: "",
        attributes: {},
        children: restemplate,
        templateAttributes: {}
       }];
    }     
// 
    return {template: restemplate, 
            fullSpecified: fullSpecified, 
            optional: allOptional};
  }
  
  var res = regenerateTemplateRec(document.body);
  
  if (res.optional)
    for (var i=0;i<res.template.length;i++)
      res.template[i].templateAttributes.optional = true;

  for (var i=0;i<res.template.length;i++) if (res.template[i].value == "BODY") res.template[i].attributes = {}; //don't need to check attributes on body

  
  var finalRes = serializeTemplate(res.template);
  
  $(prfid + "template").val( finalRes );
  
  if ($(prfid+"multipage").css("display") != "none") {
    $(prfid+"multipagetable textarea").last().val( finalRes );
    regenerateMultipageTemplate();
  }
  
  updatedTime = new Date().getTime();
}


 /* function serializeAll(cur){
    if (cur.nodeType == Node.TEXT_NODE) return cur.nodeValue;
    if (cur.classList && (cur.classList.contains(prf+"templateRead") || cur.classList.contains(prf+"read_options"))) return "";
    var kids = cur.childNodes;
    var res = encodeNodeTags(cur)+"\n";
    for (var i=0;i < kids.length;i++) { 
      res += serializeAll(kids[i]);
    }
    res += "</"+cur.nodeName+">\n";
    return res;
  }
  */
function serializeTemplate(templates) {
  var res = "";
  function addSurrounded(s) {
    if (s == "") return;
    if (s[s.length-1] == '\n') res += "\n";
    res += s;  
  }
  for (var i=0;i<templates.length;i++) {
    if (templates[i].kind == TemplateMatchNode) {
      res += "<" + templates[i].value;
      if (objHasProperties(templates[i].attributes)) res += " " + encodeXMLAttributes(templates[i].attributes);
      if (templates[i].templateAttributes.optional) res += " t:option=\"true\"";
      if (templates[i].children.length == 0) res += "/>\n";
      else {
        res+=">";
        addSurrounded(serializeTemplate(templates[i].children));
        res+="</"+templates[i].value+">\n"; 
      }
    } else if (templates[i].kind == TemplateMatchText) {
      res += templates[i].value;
    } else if (templates[i].kind == TemplateLoop) {
      res += "<t:loop>";
      addSurrounded(serializeTemplate(templates[i].children));
      res += "</t:loop>\n";
    } else if (templates[i].kind == TemplateShortRead) {
      var shortNotation = ((i == 0 || templates[i-1].kind != TemplateMatchText) 
                        && (i == templates.length-1 || templates[i+1].kind != TemplateMatchText));
      if (shortNotation) res += "{";
      else res += "<t:s>";
      res += templates[i].value;
      if (shortNotation) res += "}";
      else res += "</t:s>";
    }
  }
  return res;
}



/*Templategeneration guide lines:

Selection:

  No empty read tags!

  No nested read tags (would be possible, but too confusing)  

  Attribute white list id|class
  
  Element blacklist: tbody
  
  Id blacklist: .*[0-9].*
  
  Class blacklist: even|odd|selected|.*[0-9].*


  Read tags surrounding text only/p:

     Need br siblings
 
     In table, need tr/td siblings if no unique attribute  exist (e.g. id) (class not sufficient, since it's probably even/odd)
     
     If splitted text nodes, use regex filtering
 
 
        content:        text only       elements
        surrounding:
        none:             .                .
        text           use text()        use .
                       (+filter)
        elements:      use text()        use (_lastmatched, _lastmatched/following-siblings::*)
                    (+siblings+filter?)  
 
  (If parent has no relevant attributes and no other children, move read tag up? no)

  If only single child, move down

  TABLE: No tbody, thead


LOOPING:

  Find common parent
  
  Find similar ending, discard middle path of the tree 
  
  (correct details?)

GUI:
  
  Clear all button
  
  Make optional
  
  Remove button
  
  Extend (to all siblings) button 
  
  Read to variable
  
  Read attribute
  */
  
  
  
  
  
$("<div/>",{
  text: "Activate Scraping",
  style: "position: fixed;" +
         "right: 10px; top: 10px; " +
         "border: 2px solid red; " +
         "background-color: white; "+ 
         "cursor: pointer; padding: 2px; z-index: 2147483647",
  id: prf + "activation",
  click:  activateScraper
}).appendTo("body");

if (!localStorage[prf+"_deactivated"]) {
  activateScraper();
  if (GM_getValue("multipageActive", false)) {
    document.getElementById(prf+"multipagecheckbox").checked = true;
    toggleMultipageScraping();
  }
}

if (GM_getValue("optionTableDisplay", "none") != "none") {
  $(prfid+"optiontable").show(); 
  $(prfid+"optioncheckbox").prop("checked", "checked");
}