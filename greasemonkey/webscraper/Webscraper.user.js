// ==UserScript==
// @name        Webscraper
// @namespace   http://www.benibela.de
// @include     *
// @version     1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==

var prf = "__scraper_";
var prfid = "#__scraper_";

$("<div/>",{
  text: "Activate Scraping",
  style: "position: fixed;" +
         "right: 10px; top: 10px; " +
         "border: 2px solid red; " +
         "background-color: white; "+ 
         "cursor: pointer; padding: 2px; z-index: 100000",
  id: prf + "activation",
  click:  activateScraper
}).appendTo("body");

var mainInterface = null;

function makeinput(caption, id, value){ return '<tr><td>'+caption+':</td><td><input id="'+prf+id+'"'+(value?'value="'+value+'"':"")+'/></td></tr>'; }

function activateScraper(){ 
  if (!mainInterface || mainInterface.css("display") == "none") {
    if (!mainInterface) {
      var gui = $(
'<div style="border: none; clear: both" id="'+prf+'gui">'+
'<b>Select the values you want to extract on the site</b><br><hr>' + 
'<table>' + 
makeinput('Included Attributes', "attribs", "id|class|name")+
makeinput('Excluded tags', "tagsexcl", "tbody|p")+
makeinput('Excluded ids', "idsexcl", ".*[0-9].*")+
makeinput('Excluded classes', "classesexcl", "even|odd|selected|.*[0-9].*")+
'</table>'+
'<hr>Resulting template: <br>' +
'  <textarea style="width: 20em; height:10em; resize: both; width: 100%" id="'+prf+'template">waiting for selection</textarea>'+
'</div>'
      );
    
      mainInterface = $("<div/>",{
        style: "position: fixed;" +
               "right: 10px; top: 10px; " +
               "border: 1px solid gray; " +
               "background-color: white; "+ 
               "color: black;" +
               "padding: 2px;"+
               "z-index: 100000",
        id: prf + "main"
      });
      mainInterface.appendTo("body");
      
      function moveLeft(){
        $(prfid + "moveleft").hide();
        $(prfid + "moveright").show();
        mainInterface.css("right", "");
        mainInterface.css("left", "10px");
        localStorage[prf+"guiposition"] = "left";
      }
      
      var harness = $('<div/>', {style:"border:none"})
        .append($("<a/>", {
           text: "<<", 
           id: prf + "moveleft",
           style: "border: 1px solid black; cursor: pointer", 
           click: moveLeft }))
        .append($("<a/>", {
           text: ">>", 
           id: prf + "moveright",
           style: "border: 1px solid black; cursor: pointer; float: right; display: none", 
           click: function(){
             $(prfid + "moveleft").show();
             $(prfid + "moveright").hide();
             mainInterface.css("right", "10px");
             mainInterface.css("left", "");
             localStorage[prf+"guiposition"] = "right";
           } }))
        .append($("<a/>", {
           text: "X", 
           style: "border: 1px solid black; cursor: pointer; float: right", 
           click: deactivateScraper }))
           ;
      
      
      mainInterface.append(harness).append(gui);
            
      $("head").append($(
'<style>'+ 
 '.'+prf+ 'templateRead { border: 2px solid #FF00FF; display: inline-block }' +      //text-decoration: line-through; 
'</style>'));
      
      var mouseUpActivated = false;
      $(document).mouseup(function(e){
        if (mouseUpActivated) return;
        mouseUpActivated = true;
        setTimeout(function(){
          mouseUpActivated = false;
          addSelectionToTemplate();
        }, 350);
      });
      
      
      if (!Node.ELEMENT_NODE) Node.ELEMENT_NODE = 1;
      if (!Node.TEXT_NODE) Node.TEXT_NODE = 3;
      
      RegExp.escape = function(text) {
          return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
      } //by Colin Snover

      if (localStorage[prf+"guiposition"] == "left") moveLeft(); //  $( prfid + "moveleft").click(); works, but then causes an exception :(
    } else mainInterface.show();
    $(prfid+"activation").hide();
    
  }
}

function deactivateScraper(){
  $(prfid+"activation").show();
  mainInterface.hide();
}


activateScraper();


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

function removeNodeButKeepChildren(n){
  var cn = n.childNodes;
  var p = n.parentNode;
  while (cn.length > 0)
    p.insertBefore(cn[0], n);
  p.removeChild(n);
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
  if (!Node.TEXT_NODE) alert("initialization failed");  
  
  var s = window.getSelection();
  
  /*if (( s.anchorNode.classList && s.anchorNode.classList.contains(prf+"templateRead") &&
         s.focusNode.classList && s.focusNode.classList.contains(prf+"templateRead")) || $(s.anchorNode).add(s.focusNode).parents("."+prf+"templateRead, "+prfid+"main").length != 0) return;*/

  if ($(s.anchorNode).add(s.focusNode).parents(prfid+"main").length != 0) return; 

  var r = s.getRangeAt(0);
  if (!r) return;
  
  var start = r.startContainer, end = r.endContainer, startOffset = r.startOffset, endOffset = r.endOffset;

  if (start.classList && start.classList.contains(prf+"templateRead")) {
    var temp = start.parentNode;
    removeNodeButKeepChildren(start);
    start = temp;
  }
  if (end.classList  && end.classList.contains(prf+"templateRead")) {
    var temp = end.parentNode;
    removeNodeButKeepChildren(end);
    end = temp;
  }
  $(s.anchorNode).add(s.focusNode).parents("."+prf+"templateRead").each(
    function(i,n){removeNodeButKeepChildren(n);}
  );
    
  
  if (start == end && endOffset <= startOffset) return;
  
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
    if (start == end && endOffset <= startOffset) return;
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
  if (ai >= bi) return;
  
  if (common.nodeType != Node.TEXT_NODE) {
    bi -= removeWhileEmptyTextNode(common.childNodes[ai]);
    bi -= removeWhileEmptyTextNode(common.childNodes[bi-1]);
    if (ai >= bi) return;
    
    while (ai + 1 == bi) {
      if (common.childNodes[ai].classList && common.childNodes[ai].classList.contains(prf+"templateRead")) {
        bi = ai + common.childNodes[ai].childNodes.length;
        removeNodeButKeepChildren(common.childNodes[ai]);
      } else {
        if (common.childNodes[ai].nodeType == Node.TEXT_NODE) break;
        common = common.childNodes[ai];
        ai = 0;
        bi = common.childNodes.length;
      }
      bi -= removeWhileEmptyTextNode(common.childNodes[ai]);
      bi -= removeWhileEmptyTextNode(common.childNodes[bi-1]);
      if (ai >= bi) return;
    }

    //if (bi + 1 <= common.childNodes.length)// && common.childNodes[bi].nodeType == Node.TEXT_NODE) 
    //  bi++; //prevent inclusion of the next element in the read tag, but still allow partial text inclusion (todo: check if this is correct)

    for (var i=bi-1; i >= ai; i--) 
      enumerate(common.childNodes[i], function(n){ 
        if (n.classList && n.classList.contains(prf+"templateRead")) 
          removeNodeButKeepChildren(n);           
      })
    var templateRead = myCreate("div", {"class": prf + "templateRead"});
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
    var templateRead = myCreate("div", {"class": prf + "templateRead"});
    templateRead.textContent = s;
    var suffix = common.nodeValue.substring(bi);

    common.parentNode.insertBefore(document.createTextNode(prefix), common);
    common.parentNode.insertBefore(templateRead, common);
    common.textContent = suffix;
  }
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
  regenerateTemplate();
}

function regenerateTemplate(){
  var attribs = new RegExp("^("+$(prfid + "attribs").val()+")$", "i");
  var tagsexcl = new RegExp("^("+$(prfid + "tagsexcl").val()+")$", "i");
  var idsexcl = new RegExp("^("+$(prfid + "idsexcl").val()+")$", "i");
  var classesexcl = new RegExp("^("+$(prfid + "classesexcl").val()+")$", "i");

  function encodeNodeTags(node, close){
  if (!node) return "??";
    var res = "<" + node.nodeName;
    var a = node.attributes;
    if (a)
      for (var i=0;i<node.attributes.length;i++)
        if (attribs.test(a[i].name)) 
          if (a[i].name == "id") {
            if (!idsexcl.test(a[i].value)) 
              res = res + " id=\"" +a[i].value + "\"";
          } else if (a[i].name == "class") {
            var cl = new Array();
            for (var j=0;j<node.classList.length;j++)
              if (!classesexcl.test(node.classList[j])) cl.push(node.classList[j]);
            if (cl.length > 0) 
              res = res + " class=\"" + cl.join(" ") + "\""
          } else res = res + " " + a[i].name + "=\"" +a[i].value + "\""
      //if (node.attributes[i].name)
    if (close) res += "/>\n";
    else res += ">";
    return res;
  }
  
  function regenerateTemplateRec(cur){
    var kids = cur.childNodes;
    var res = new Array();
    var foundSomething = false;
    var i = 0;
    var useSiblings = false;
    var hasReadTag = false;
    for (i=0;i<kids.length;i++) {
      if (kids[i].nodeType != Node.TEXT_NODE && kids[i].nodeType != Node.ELEMENT_NODE) continue;
      var t;
      if (kids[i].className == prf+"templateRead") {
        hasReadTag = true;
        var noTextNodes = (i == 0 || kids[i-1].nodeType != Node.TEXT_NODE || kids[i-1].nodeValue.trim() == "" ) && 
                          (i == kids.length - 1 || kids[i+1].nodeType != Node.TEXT_NODE || kids[i+1].nodeValue.trim() == "" );
        if (noTextNodes) t = "{";
        else { t = "<t:s>"; useSiblings = true; }
        
        if (kids.length == 1) t += ".";
        else if (kids[i].childNodes.length == 1 && kids[i].childNodes[0].nodeType == Node.TEXT_NODE) {
          //only read text
          var prefix = (i == 0 || kids[i-1].nodeType != Node.TEXT_NODE) ? "" : RegExp.escape(kids[i-1].nodeValue.trimLeft());
          var suffix = (i == kids.length - 1 || kids[i+1].nodeType != Node.TEXT_NODE) ? "" : RegExp.escape(kids[i+1].nodeValue).trimRight();
          if (prefix == "" && suffix == "") t += "text()";
          else t += "filter(text(), \""+prefix+"(.*)"+suffix+"\", 1)";
        } else {
          t += ".";
        }
        
        if (noTextNodes) t += "}";
        else t += "</t:s>";
      } else { t = regenerateTemplateRec(kids[i]); }
      if (t == "") res.push(kids[i]);
      else { res.push(t); foundSomething = true; }
    }
    
    if (!foundSomething) return "";
//    console.log(res);
    var ignoreTag = tagsexcl.test(cur.nodeName);
    var res2 = "";
    if (!ignoreTag) {
      res2 += encodeNodeTags(cur);
      if (useSiblings || !hasReadTag) res2 += "\n";
    }
    for (var i=0;i<res.length;i++) {
      if ((typeof res[i]) == "string") res2 += res[i];
      else if (useSiblings) {
        if ( res[i].nodeType != Node.TEXT_NODE) 
          res2 += encodeNodeTags(res[i], true);
        else if (i == 0 || typeof res[i-1] != "string")  //don't add following text nodes, they wouldn't be matched
          res2 += res[i].textContent.trim();
      }
    }
    if (!ignoreTag) res2 += "</"+cur.nodeName+">\n";
    
    return res2;
  }
  
  
  $(prfid + "template").text( regenerateTemplateRec(document.body));
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