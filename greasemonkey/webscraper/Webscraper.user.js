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

//\newcommand{\n}{new line} is it wise to write js in a tex editor??

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
function makeselectraw(id, values, def, style){ 
  if (!def) def = 0;
  if (GM_getValue(prf+id+"_saved")) def = GM_getValue(prf+id+"_saved") * 1;
  return '<select style="'+style+'" id="'+prf+id+'">'+ values.map ( function(e, i) { return '<option value="'+i+'"'+(def == i ? " selected" : "")+'>'+e+'</option>'} ) + '</select>'; 
}
function makeselect(caption, id, values, def){ 
  return '<tr><td>'+caption+':</td><td>'+makeselectraw(id,values,def,"width:100%")+'</td></tr>'; 
}



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
makeinput('Excluded classes', "classesexcl", ".*(even|odd|select|click|hover|highlight|active|[0-9]|"+prf+").*")+
makeinput('Excluded default tags', "tagsexcl", "tbody")+
makeselect('Include siblings', "siblings", ["always", "if necessary", "never"], 1)+
'</table>'+
'<hr>Final ' + makeselectraw("outputkind", ["template","xpath (case)", "xpath", "css"], 0, "width: auto")+ ":"+
'</div>'
      )
      .append(
        $("<button/>", {
          text: "remote test",
          click: function(){
            var fd = new FormData();
            var extract = $(prfid+"template").val();
            var extractKind = (["template", "xpath", "xpath", "css"])[$(prfid+"outputkind").val()];
            if (extractKind == "css") {
              extract = (extract + "\n").split("\n")[0];
              var varCutOff = /.*:=(.*)/.exec(extract);
              if (varCutOff) extract = varCutOff[1];
            } else if (extractKind == "xpath") {
              var s = extract.split("\n");
              extract = "(";
              for (var i=0;i<s.length;i++) {
                if (s[i].trim() == "") continue;
                if (extract.length != 1) extract += ",\n";
                extract += s[i];
              }
              extract += ")";
            }

            fd.append("extract", extract);
            fd.append("extract-kind", extractKind);
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
      
      $(gui).find("input, select").change(function(){
        GM_setValue(this.id+"_saved", this.value);
        regenerateTemplateQueued();
      });

      $(gui).find("td button").click(regenerateTemplateQueued);
      
       $("table", gui)
       .append($("<tr/>")
         .append($("<td/>"))
         .append($("<td/>")
           .append($("<input>", {type: "checkbox", id: prf+"useLineBreaks", checked: GM_getValue(prf+"useLineBreaks"+"_saved", true), click: function(){
             GM_setValue(this.id + "_saved", this.checked);         
             regenerateTemplateQueued();
           }}))
           .append(" use linebreaks")
         )
       );

      
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
    $(prfid+"outputkind").val(0);
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
      var oldData = "";
      
      if (GM_getValue("FORM_URL", "") != "" || GM_getValue("FORM_DATA", "") != "") {
        if (GM_getValue("FORM_URL") != "") curUrl = GM_getValue("FORM_URL");
        if (GM_getValue("FORM_DATA") != "") oldData = GM_getValue("FORM_DATA");
        GM_setValue("FORM_URL", "");
        GM_setValue("FORM_DATA", "");
      }

      oldMultipage.push({url: curUrl, repeat: false, test: "", template: $(prfid+"template").val(), post: oldData});
      while (oldMultipage.length >= 2 &&
             oldMultipage[oldMultipage.length-2].url == oldMultipage[oldMultipage.length-1].url &&
             (oldMultipage[oldMultipage.length-1].template == "" || oldMultipage[oldMultipage.length-1].template == "waiting for selection..."))
          oldMultipage.pop(); //remove useless duplicates caused by reloads
          
      for (var i = 0; i < oldMultipage.length; i++) 
        createNewPage(oldMultipage[i]);

      multipageInitialized = true;
      regenerateMultipageTemplate();
      
      
      
      $("form").submit(function(){
        if (!GM_getValue("multipageActive", false)) return;
        function getParams(form) { //taken from some forum post
          var esc = encodeURIComponent;
              var params = [];
              for (i=0; i<form.elements.length; i++){
              var e = form.elements[i];
              var n = e.getAttribute('name');
              if (!n) continue;
              if (e.tagName == "INPUT"){
              switch (e.getAttribute('type').toLowerCase()){
              case "text": case "hidden": case "password":
              params.push(n + "=" + esc(e.value));
              break;
              case "checkbox":
              if (e.checked) { params.push(n + "=" + esc(e.value)); }
              //else { params.push(n + "="); } failed with stbdue
              break;
              case "radio":
              if (e.checked) { params.push(n + "=" + esc(e.value)); }
              break;
              }
              }
              if (e.tagName == "TEXTAREA"){
              params.push(n + "=" + esc(e.value));
              }
              if (e.tagName == "SELECT"){
              params.push(n + "=" + esc(e.options[e.selectedIndex].value));
              }
              }
              return params.join('&');
        }      
        
        var url = this.action;
        if (url == "") url = location.href;
        var data = getParams(this);
        if (this.method == "GET") {
          if (url.indexOf("?") > 0) url += "&";
          else url += "?";
          url += data;
          data = "";
        }
        GM_setValue("FORM_URL", url);
        GM_setValue("FORM_DATA", data);
      });
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
      if (!h.attributes[a] || att[a] != h.attributes[a].value) return false;
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
    function nodeToTemplate(node) {
      if ( node.nodeType == Node.TEXT_NODE) {
        var temp = node.textContent.trim();
        if (temp == "") return null;
        return {
          kind: TemplateMatchText,
          value: temp,
          attributes: {},
          children: [],
          templateAttributes: {}
        };
      } else if (node.nodeType == Node.ELEMENT_NODE) {
        return {
         kind: TemplateMatchNode,
         value: node.nodeName,
         attributes: filterNodeAttributes(node),
         children: [],
         templateAttributes: {}
        };
      }
      return null;
    }
  
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
    var foundRead = false;
    var hasText = false;
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
        foundRead = true;
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
          var toPushReverse = [];
          for (var j = i - 1; j > lastFoundTemplate; j--)
            if (testTemplate.kind == TemplateShortRead 
             || testTemplate.kind == TemplateLoop 
             || (toPushReverse.length > 0 && findTemplateMatchingNodes(toPushReverse[toPushReverse.length-1], kids[j]).length > 0)
             || findTemplateMatchingNodes(testTemplate, kids[j]).length > 0) {
               var x = nodeToTemplate(kids[j]);               
               if (x && x.kind != TemplateMatchText) toPushReverse.push(x);
               else if (x && !hasText || !foundRead) { //multiple text nodes around a read mean that the text node has been splitted and the html contains only one text node here, so the template can only inlclude the first text node 
                 hasText = true;
                 toPushReverse.push(x);
               }
           }
           for (var j = toPushReverse.length - 1; j >= 0; j--)
             res.push([toPushReverse[j]]);
        }
        if (matchChildren) 
          for (var j=0;j<kids[i].childNodes.length-1;j++) {
            var x = nodeToTemplate(kids[i].childNodes[j]);
            if (x) res.push([x]);
          }
        fullSpecified = fullSpecified && templateSpecific;
        lastFoundTemplate = i;
        res.push(newTemplate);
      } else if (siblingsinclmode == 0) { //always
        var x = nodeToTemplate(kids[i]);
        if (x != null) {
          if (x.kind != TemplateMatchText) res.push([x]);
          else if (!hasText || !foundRead) { //multiple text nodes around a read mean that the text node has been splitted and the html contains only one text node here, so the template can only inlclude the first text node 
            hasText = true;
            res.push([x]);
          }
        }
      }
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
      } else alert("????: "+res[i]+": "+res[i].toSource());
    }
    
    
    var ignoreTag = fullSpecified || (!cur.hasAttributes() && tagsexcl.test(cur.nodeName));
     
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

  
  var finalRes;
  switch ($(prfid+"outputkind").val() * 1) {
    case 0: finalRes = serializeTemplate(res.template); break;
    case 1: finalRes = serializeTemplateAsXPath(res.template, true);  break;
    case 2: finalRes = serializeTemplateAsXPath(res.template); break;
    case 3: finalRes = serializeTemplateAsCSS(res.template); break;
  }
  
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
  var useLineBreaks = $(prfid + "useLineBreaks").is(":checked");
  var lineBreak = useLineBreaks ? "\n" : "";

  var res = "";
  function addSurrounded(s) {
    if (s == "") return;
    if (useLineBreaks && s[s.length-1] == '\n') res += "\n";
    res += s;  
  }
  for (var i=0;i<templates.length;i++) {
    if (templates[i].kind == TemplateMatchNode) {
      res += "<" + templates[i].value;
      if (objHasProperties(templates[i].attributes)) res += " " + encodeXMLAttributes(templates[i].attributes);
      if (templates[i].templateAttributes.optional) res += " t:optional=\"true\"";
      if (templates[i].children.length == 0) res += "/>" + lineBreak;
      else {
        res+=">";
        addSurrounded(serializeTemplate(templates[i].children));
        res+="</"+templates[i].value+">" + lineBreak; 
      }
    } else if (templates[i].kind == TemplateMatchText) {
      res += templates[i].value;
    } else if (templates[i].kind == TemplateLoop) {
      res += "<t:loop>";
      addSurrounded(serializeTemplate(templates[i].children));
      res += "</t:loop>" + lineBreak;
    } else if (templates[i].kind == TemplateShortRead) {
      var shortNotation =  (i == 0 || (templates[i-1].kind != TemplateMatchText && templates[i-1].kind != TemplateShortRead))
                        && (i == templates.length-1 || (templates[i+1].kind != TemplateMatchText && templates[i+1].kind != TemplateShortRead));
      if (shortNotation) res += "{";
      else res += "<t:s>";
      res += templates[i].value;
      if (shortNotation) res += "}";
      else res += "</t:s>";
    }
  }
  return res;
}

/*
Conversion rules
node[@att="xyz"]

node.class

<a><b></b></a>

a b

a x ~ y ~ b 

<a><x/><y/><b>..</b></a>
*/

function serializeTemplateAsCSS(templates) {
  function rec(t) {
    if (t.kind != TemplateMatchNode && t.kind != TemplateLoop) 
      return; //ignore read and text for css
    function serializeNode(t){
      if (t.kind == TemplateLoop) return;  //ignore loop (everything is looped)
      var sel = t.value;
      if (t.attributes["id"] != null)
        sel += "#" + t.attributes["id"];
      if (t.attributes["class"] != null)
        for (var i = 0; i < t.attributes["class"].length; i++) 
          sel = sel + "." + t.attributes["class"][i];

      for (var a in t.attributes)
        if (a != "class" && a != "id") 
          sel = sel + "[" + a + "=\"" + t.attributes[a].replace(/"/g, '\\"') + "\"]";
      return sel;
    } 
    
    var basesel = serializeNode(t);
    var childsel = "";
    var first = true;

    var resSel = [], resNames = [];
    for (var i=0;i<t.children.length;i++) {
      if (t.children[i].kind == TemplateMatchText) continue; //ignore
      else if (t.children[i].kind == TemplateMatchNode || t.children[i].kind == TemplateLoop) {
        var kid = t.children[i];
        if (kid.kind == TemplateLoop) { //todo: handle multiple children
          if (kid.children.length == 0) continue;
          kid = kid.children[0];
        }
        if (childsel != "") childsel += " ~ ";
        else childsel += " ";

        var cn = rec(kid) ;         
        var c = cn[0], n = cn[1];
        for (var j = 0; j<c.length;j++) {
          resSel.push(basesel + childsel +  c[j]);  
          resNames.push(n[j]);
        }

        childsel += serializeNode(kid);            //ignore children for matching (can't nest css selectors)
      } else if (t.children[i].kind == TemplateShortRead) {
        resSel.push(basesel);
        var names = /([^ ]*) *:=/.exec(t.children[i].value);
        resNames.push( ( names && names.length > 1) ? names[1] : "");
      }
    }
    return [resSel, resNames];
  }
  
  var res = "";
  for (var i = 0; i < templates.length; i++) {
    var x = rec(templates[i]);
    for (var j = 0; j < x[0].length; j++)
       res += (x[1][j] != "" ? x[1][j] + " := " : "") + x[0][j] + "\n";
  }
  return res;
}

/*
  Basic conversion rules:
<node att="xyz">

node[@att="xyz"][1]

node[translate(@att, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "xyz"][1]

<a><b></b></a>

 //a//b


<a><x/><y/><b>..</b></a>

//a//x/following-sibling::y/following-sibling::b/

  
*/
function serializeTemplateAsXPath(templates, full) {
  function rec(t) {
    if (t.kind != TemplateMatchNode && t.kind != TemplateLoop) 
      return; //ignore read and text for css
    function cmp(xpath, to, startswith){
      var toesc = '"' + to.replace( /"/g, '""' ) + '"';
      if (!full) {
        if (startswith) return 'starts-with('+xpath+', '+toesc+')';
        else return xpath + ' = ' + toesc;
      }
      //translate(xpath, "ABC...", "abc", ...)
      var lup   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var ldown = "abcdefghijklmnopqrstuvwxyz";
      var letters = "";
      for (var i=0;i<26; i++)
        if (to.indexOf(lup[i]) >= 0 || to.indexOf(ldown[i]) >= 0) letters += lup[i];
      var translated = 'translate('+xpath+', "' + letters + '", "'+letters.toLowerCase()+'")';
      if (startswith) return 'starts-with('+translated + ', '+toesc+')';
      else return translated + ' = ' + toesc;
    }      
    function serializeNode(t){
      if (t.kind == TemplateLoop) return;  //ignore loop (everything is looped)
      var sel;
      if (!full) sel = t.value;
      else sel = "*["+cmp("node-name(.)", t.value)+"]";
      for (var a in t.attributes)
        if (a != "class") 
          sel = sel + "[" + cmp("@" + a, t.attributes[a]) + "]";

      if (t.attributes["class"] != null)
        for (var i = 0; i < t.attributes["class"].length; i++) 
          sel = sel + "[" + cmp('tokenize(@class, " ")', t.attributes["class"][i]) + "]";

      return sel;
    } 
    
    var basesel = serializeNode(t);
    var childsel = "";
    var first = true;

    var resSel = [], resNames = []; var lastWasText = false;
    for (var i=0;i<t.children.length;i++) {
      if (t.children[i].kind == TemplateMatchText) {
        if (childsel != "") childsel += "/following-sibling::";
        else childsel += "//";
        childsel += "text()["+cmp(".", t.children[i].value, true)+"]";
        lastWasText = true;
      } else if (t.children[i].kind == TemplateMatchNode || t.children[i].kind == TemplateLoop) {
        var kid = t.children[i];
        if (kid.kind == TemplateLoop) { //todo: handle multiple children
          if (kid.children.length == 0) continue;
          kid = kid.children[0]; //ignore loops (xpath is looping over all anyways)
        }
        if (childsel != "") childsel += "/following-sibling::";
        else childsel += "//";

        var cn = rec(kid) ;         
        var c = cn[0], n = cn[1];
        for (var j = 0; j<c.length - 1;j++) {

          resSel.push(basesel + childsel + c[j]);  
          resNames.push(n[j]);
        }
        childsel += c[c.length-1];
        lastWasText = false;
      } else if (t.children[i].kind == TemplateShortRead) {
        var read = /([^ ]*) *:= *(.*)/.exec(t.children[i].value);
        if (read == null) read = ["", t.children[i].value];
        resNames.push( read[0] );
        if (read[1] == ".") resSel.push(basesel);
        else if (childsel == "") resSel.push(basesel + childsel + "/" + read[1]);
        else if (read[1] == "text()") resSel.push(basesel + childsel + ( lastWasText ? "" : "/following-sibling::text()") );
        else resSel.push(basesel + childsel + (lastWasText ? "/" : "/following-sibling::node()/") + read[1].replace( /text[(][)]/g, "."));
      }
    }
    if (childsel == "") resSel.push(basesel);
    else resSel.push(basesel + "[." + childsel + "]");
    resNames.push(":=");
    return [resSel, resNames];
  }
  
  var res = "";
  for (var i = 0; i < templates.length; i++) {
    var x = rec(templates[i]);
    for (var j = 0; j < x[0].length - 1; j++)
       res += (x[1][j] != "" ? x[1][j] + " := " : "") + "//" + x[0][j] + "\n";
  }
  return res;
}
function UNIT_TESTS(){  // 👈🌍👉
return;
  if (!Node.ELEMENT_NODE) { alert("initialization failed"); return; }

  var testBox = $("<div/>", {id: "XXX_YYY_ZZZ_TESTBOX"}); //can't use scraper prefix, or it would be ignored
  testBox.appendTo(document.body);
  var testi = 0;
  function t(input, output, special){
    testBox.html(input);
    
    var rangepos = [];
    var rangenodes = [];
    var reprangepos = [];
    var reprangenodes = [];
    
    function rec(node){
      if (node.nodeType == Node.ELEMENT_NODE) {
        for (var i=0;i<node.childNodes.length;i++)
          rec(node.childNodes[i]);
      } else if (node.nodeType == Node.TEXT_NODE) {
        function extract(c, dest, destNode){
          var pos = [];
        
          var f = node.nodeValue.indexOf(c);
          while ( f > -1) {
            dest.push(f);
            destNode.push(node);
            if (f > -1) 
              node.nodeValue = node.nodeValue.substr(0,f) + node.nodeValue.substr(f+1); 
            f =  node.nodeValue.indexOf(c);
          }
          return pos;
        }
        
        extract("|", rangepos, rangenodes);
        extract("#", reprangepos, reprangenodes);
      }
    }
    
    rec(document.getElementById("XXX_YYY_ZZZ_TESTBOX"));

    for (var i=0;i<rangepos.length;i+=1  ) {
      var range = document.createRange();
      range.setStart(rangenodes[i], rangepos[i]);
      i+=1;
      range.setEnd(rangenodes[i], rangepos[i]);

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      addSelectionToTemplate();
      
      var j = i + 1;
      if (j < rangenodes.length && rangenodes[j] == rangenodes[i]) {
        var reads = document.getElementsByClassName(prf+"templateRead");
        var newContainer = reads[reads.length-1].nextSibling;
        while (j < rangenodes.length && rangenodes[j] == rangenodes[i]) {
          rangenodes[j] = newContainer;
          rangepos[j] -= rangepos[i];
          j++;
        }
      }
    }
    
    for (var i=0;i<reprangenodes.length;i++) {
      var range = document.createRange();
      range.setStart(reprangenodes[i], reprangepos[i]);
      i+=1;
      range.setEnd(reprangenodes[i], reprangepos[i]);

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      window.searchingRepetition = $($("."+prf+"templateRead").get((i-1)/2)); 
     
      addSelectionToTemplate();
    }

    if (special) special();
    
    regenerateTemplate();
    
    if (output.indexOf('id="') < 0) 
      output = '<DIV id="XXX_YYY_ZZZ_TESTBOX">\n' + output + '\n</DIV>';
    output += "\n";
    
    var got = $(prfid + "template").val();
    
    testi += 1;
    if (got != output) alert("Test: "+testi +"\nGot: "+got+"\n------------------\nExpected: "+output);
  }
  
  var ta = t;
  //t = function(a,b){};
  
  
  t('<a><b>|Dies wird Variable test|</b></a>', '<A>\n<B>{.}</B>\n</A>');
  t('<a><b>|Dies wird erneut Variable test|</b><b>Nicht Test</b><b>Test</b></a>', '<A>\n<B>{.}</B>\n</A>');
  t('<a>|<b>Dies wird erneut Variable test|</b><b>Nicht Test</b><b>Test</b></a>', '<A>\n<B>{.}</B>\n</A>');
  t('<a><b>|Dies wird erneut Variable test</b>|<b>Nicht Test</b><b>Test</b></a>', '<A>\n<B>{.}</B>\n</A>');
  t('<a>|<b>Dies wird erneut Variable test</b>|<b>Nicht Test</b><b>Test</b></a>', '<A>\n<B>{.}</B>\n</A>');
  t('<a><b>Nicht Test</b><b>Test:</b><b>|Dies wird erneut Variable test2|</b></a>', '<A>\n<B/>\n<B/>\n<B>{.}</B>\n</A>');
  t('<a><b v="abc">1</b><b v="def"></b>      <b>2</b><b>3</b><b v="ok">Hier|xyz|</b><b v="!">5</b></a>', '<A>\n<B>Hier<t:s>filter(text(), "Hier(.*)", 1)</t:s></B>\n</A>');
  t('<a><b v="abc">1</b><b v="def"></b>      <b>2</b><b>3</b><b v="ok">Hier|xyz</b>|<b v="!">5</b></a>', '<A>\n<B>Hier<t:s>filter(text(), "Hier(.*)", 1)</t:s></B>\n</A>');

  t('<a><b>|abc|</b><c>|dies kommt raus|</c></a>', '<A>\n<B>{.}</B>\n<C>{.}</C>\n</A>');
  t('<a>|<b>abc</b><c>dies kommt raus</c>|</a>', '<A>{.}</A>');

  t('<a><b>|1|</b><b>#2#</b><b>3</b><b>4</b><b>5</b></a>', '<A>\n<t:loop>\n<B>{.}</B>\n</t:loop>\n</A>');
  t('<a><b>0</b><b>|1|</b><b>#2#</b><b>3</b><b>4</b><b>5</b></a>', '<A>\n<B/>\n<t:loop>\n<B>{.}</B>\n</t:loop>\n</A>');
  t('<a><ax>123124</ax><ax><b>525324</b></ax><ax><b>1</b></ax><ax><b>|3|</b></ax></a>', '<A>\n<AX/>\n<AX/>\n<AX/>\n<AX>\n<B>{.}</B>\n</AX>\n</A>');
  t('<table class="prettytable"><tbody><tr class="hintergrundfarbe6"><th>Trigraph</th><th>ersetztes Zeichen</th></tr><tr><td><code>??=</code></td><td><code>|Y|</code></td></tr><tr><td><code>??/</code></td><td><code>#\\#</code></td></tr><tr><td><code>??\'</code></td><td><code>^</code></td></tr><tr><td><code>??(</code></td><td><code>[</code></td></tr><tr><td><code>??)</code></td><td><code>]</code></td></tr><tr><td><code>??!</code></td><td><code>X</code></td></tr><tr><td><code>??&lt;</code></td><td><code>{</code></td></tr><tr><td><code>??&gt;</code></td><td><code>}</code></td></tr><tr><td><code>??-</code></td><td><code>~</code></td></tr></tbody></table>', '<TABLE class="prettytable">\n<t:loop>\n<TR>\n<TD/>\n<TD>\n<CODE>{.}</CODE>\n</TD>\n</TR>\n</t:loop>\n</TABLE>'); //table modified from wikipedia
  t('<table class="prettytable"><tbody><tr class="hintergrundfarbe6"><th>Trigraph</th><th>ersetztes Zeichen</th></tr><tr><td><code>??=</code></td><td><code>Y</code></td></tr><tr><td><code>??/</code></td><td><code>|\\|</code></td></tr><tr><td><code>??\'</code></td><td><code>#^#</code></td></tr><tr><td><code>??(</code></td><td><code>[</code></td></tr><tr><td><code>??)</code></td><td><code>]</code></td></tr><tr><td><code>??!</code></td><td><code>X</code></td></tr><tr><td><code>??&lt;</code></td><td><code>{</code></td></tr><tr><td><code>??&gt;</code></td><td><code>}</code></td></tr><tr><td><code>??-</code></td><td><code>~</code></td></tr></tbody></table>', '<TABLE class="prettytable">\n<TR/>\n<TR/>\n<t:loop>\n<TR>\n<TD/>\n<TD>\n<CODE>{.}</CODE>\n</TD>\n</TR>\n</t:loop>\n</TABLE>'); //table modified from wikipedia, skipping one requires two new rows, since the first row matches the header
  t('<x>foobar 123|456|7890 |abc|defghij xyz</x>', '<X>foobar 123<t:s>filter(text(), "foobar 123(.*)7890 abcdefghij xyz", 1)</t:s><t:s>filter(text(), "7890 (.*)defghij xyz", 1)</t:s></X>');
  t('<a><b>|1|</b><c>|2|</c></a>', '<A>\n<B t:optional="true">{.}</B>\n<C>{.}</C>\n</A>', function(){$("."+prf+"templateRead ."+prf+"read_optional").first().prop("checked", "checked");});
  t('<a><b id="test">|xyz|</b></a>', '<B id="test">{.}</B>');
  t('<a><b id="test">|xyz|</b><c>|abc|</c></a>', '<DIV id="XXX_YYY_ZZZ_TESTBOX">\n<A>\n<B id="test">{.}</B>\n<C>{.}</C>\n</A>\n</DIV>');
  t('<a><b>|hallo|</b></a>', '<A>\n<B>hallo<t:s>.</t:s></B>\n</A>', function(){$("."+prf+"templateRead ."+prf+"read_match_children").first().prop("checked", "checked");});
  t('<a><b>|123<x/>456|</b></a>', '<A>\n<B>{.}</B>\n</A>');   
  t('<a><b>|123<x/>456|</b></a>', '<A>\n<B>123<X/>\n456<t:s>.</t:s></B>\n</A>', function(){$("."+prf+"templateRead  ."+prf+"read_match_children").first().prop("checked", "checked");}); 
//  t('<a><b>123<x/>456|foo<span>ood</span>bar|789<x/>012</b></a>', '<A>\n<B>hallo<t:s>.</t:s></B>\n</A>', function(){$("."+prf+"templateRead  ."+prf+"read_match_children").first().prop("checked", "checked");}); not sure what this should become
    
  $(prfid+"gui").css("background-color","#00FF00");
  
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


  setTimeout(UNIT_TESTS, 50);
}

if (GM_getValue("optionTableDisplay", "none") != "none") {
  $(prfid+"optiontable").show(); 
  $(prfid+"optioncheckbox").prop("checked", "checked");
}