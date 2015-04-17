// ==UserScript==
// @name           tyrantbot
// @namespace      ?
// @include        http://kg.tyrantonline.com/*
// ==/UserScript==

//-------------------
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var MD5 = (function() {
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * MD5.chrsz);

  var ipad = [], opad = [];
  for(var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * MD5.chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
  var bin = [], chrsz = MD5.chrsz;
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
  var str = "", chrsz = MD5.chrsz;
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
  var hex_tab = MD5.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++) {
      if(i * 8 + j * 6 > binarray.length * 32) str += MD5.b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

  return {
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
    hexcase: 0, // hex output format. 0 - lowercase; 1 - uppercase
    b64pad: "", // base-64 pad character. "=" for strict RFC compliance
    chrsz: 8,   // bits per input character. 8 - ASCII; 16 - Unicode

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
    hex:function( s ) { 
      return binl2hex( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    base64:function( s ) {
      return binl2b64( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    string:function( s ) {
      return binl2str( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    hmac:{
      hex:function( key, data ) {
        return binl2hex( core_hmac_md5( key, data ) );
      },

      base64:function( key, data ) {
        return binl2b64( core_hmac_md5( key, data ) );
      },

      string:function( key, data ) {
        return binl2str( core_hmac_md5( key, data ) );
      }
    },

    test:function() { // Perform a simple self-test to see if the VM is working
      return this.hex("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }
  };
})();

//-------------------

window.assert = function(cond) {
  if (!cond) {
      alert("assert failed: "+cond);
      //if (console) console.trace();
      GM_reportError();
  }
}

function bbg_id(id){
  return document.getElementById(id);
};

function bbgr_id(id){
  var r = bbg_id(id);
  if (!r) alert("Not found: "+id);
  return r;
};


String.prototype.contains = function(searchFor) {
  return this.indexOf(searchFor) >= 0;
}
String.prototype.count = function(searchFor) {
  var res = 0;
  var i = this.indexOf(searchFor);
  while (i >= 0) {
    res++;
    i = this.indexOf(searchFor, i + searchFor.length);
  }
  return res;
}
Array.prototype.contains = function(searchFor) {
  return this.indexOf(searchFor) >= 0;
}
Array.prototype.pushAll = function(a) {
  var t = this;
  a.forEach(function(x){t.push(x)});
}
Array.prototype.fill = function(f){
  for (var i=0;i<this.length;i++)
    this[i] = f;
}



  
function GM_md5(s){
  return MD5.hex(s);
}
  
function ccache(time, user_id, flashcode){
  res = GM_md5(time + "" + user_id);
  for (var i=0;i<flashcode.length;i++) 
    res.replace(flashcode[i], flashcode[i++]);
  return res;
}

var version= localStorage["SIM_VERSION"];
if (!version) version = "2.2.63";
var timehash="fgjk380vf34078oi37890ioj43";
var serverStartTime = 0;
var localStartTime = 0;
function synURLRequest (message, data, callback){
// return; //STOP CONNECTION %TODO
  var time = 0;
  if (serverStartTime != 0) time = Math.floor( (Math.floor(((new Date()).getTime() - localStartTime) / 1000) + serverStartTime) / (60 * 15)) ;
  req = new XMLHttpRequest();
  req.open("POST", "http://kg.tyrantonline.com/api.php?user_id="+user_id+"&message="+message);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  if (callback) req.onreadystatechange = (function(_req) { return function(){if (_req.readyState!=4) return; if (_req.status==200) callback(_req.responseText, _req); else alert("request failed: "+message+", "+data+"\n => "+_req.status+" "+_req.responseText); } }) (req);
  req.send(((data != null)?data:"?") 
  + "&flashcode=" + flashcode
  + "&time=" + time
  + "&version=" + (time!=0?version:"")
  + "&hash=" + GM_md5(message+time+timehash)
  + "&ccache="  //ccache(time, user_id, flashcode)
  + "&client_code="  + (window.client_code ? window.client_code : "null")
  + "&game_auth_token=" + game_auth_token
  + "&rc=2"
  ) 
  ;  
}

function jsonRequest (message, data, callback){
  synURLRequest(message, data, function(plain) { callback(JSON.parse(plain)); } );
}

function updatestats(data){
  if (data.user_data) data = data.user_data;
  window.stamina = data.stamina;
  if (data.max_stamina) window.max_stamina = data.max_stamina;
  window.energy = data.energy;
  if (data.max_energy) window.max_energy = data.max_energy;
  displaystats();
}

function displaystats(){
  bbgr_id("staminaspan").textContent = stamina;
  bbgr_id("maxstaminaspan").textContent = max_stamina;
  bbgr_id("energyspan").textContent = energy;
  bbgr_id("maxenergyspan").textContent = max_energy;
}

var flashbackup, flashparent;

function init(){


//------------------------------
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

  dragObj.elNode.style.zIndex = ++dragObj.zIndex;

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
}

//------------------------------

  
var applet = bbg_id("clientApp");

if (!applet) {setTimeout(init, 500); return;}

window.flashvars = document.getElementsByName("flashvars")[0].getAttribute("value");
window.user_id = /kongregate_user_id=([0-9]+)&/.exec(flashvars)[1];
window.game_auth_token = /kongregate_game_auth_token=([0-9a-fA-F]+)&/.exec(flashvars)[1];
window.flashcode = /flashcode=([0-9a-fA-F]+)&/.exec(flashvars)[1];

var gdiv = bbg_id("game");
if (gdiv) {
  gdiv.style.left=0;
  gdiv.style.top=0;
}
flashparent=applet.parentNode;
flashbackup=applet.parentNode.innerHTML;
applet.parentNode.removeChild(applet);

document.body.style.overflow="auto";

function sendInitRequest(){
  synURLRequest("init", null, function(data){
    var answer = JSON.parse(data);
    if (answer.version!=version) {
      alert("new version: "+answer.version+ " != "+version);
      localStorage["SIM_VERSION"] = answer.version;
      version = answer.version;
    }
    localStartTime = (new Date()).getTime();
    serverStartTime = answer.time;
    window.faction_id = answer.faction_info.faction_id;
    window.location_id = answer.user_data.location_id;
    window.client_code = answer.client_code;
    updatestats(answer);
   
    setTimeout(function(){
      setInterval(function(){
        stamina++; if (stamina > max_stamina) stamina = max_stamina;
        energy++; if (energy > max_energy) energy = max_energy;
        displaystats();
      }, 60*1000);
    }, 60*1000);
  
    window.user_decks = answer.user_decks; //{"1":{"deck_id":"1","name":null,"commander_id":"1045","cards":{"500":"7","2012":"3"}},"2":{"deck_id":"2","name":null,"commander_id":"1021","cards":{"103":"1","139":"1","166":"1","225":"1","247":"1","345":"1","524":"1","633":"1","3004":"2"}}
    window.user_cards = answer.user_cards; //{"1":{"num_owned":"2","num_used":"0"},"2":{"num_owned":"12","num_used":"0"}..
    window.user_mission_complete = answer.user_mission_complete; //{"1":"6","2":"1","3":"3","4":"2","5":"3","6":"2","
    window.active_deck = answer.user_data.active_deck;
    window.user_quest = answer.user_quest;
     //{"user_id":"2862376","end_time":"1361569280","step":"1","step_id":"2","step_start_time":"1361486480","used_effects":"[1]","status":"0"}
    
    var sel = bbgr_id("deckchooser");
    var sel1 = bbgr_id("deckchooser1");
    var sel2 = bbgr_id("deckchooser2");
    var i = 0;
    var addcrap = function(to, d, text) {
      if (answer == null || answer.user_decks == null )  alert("1");
      if (answer.user_decks[d] == null)  alert("2: "+d+": "+answer.user_decks);
      if (!getCard(answer.user_decks[d].commander_id)) alert("3:"+answer.user_decks[d].commander_id + ": "+getCard(answer.user_decks[d].commander_id));
        to.appendChild(bbCreateElementWithText("option", getCard(answer.user_decks[d].commander_id).name + " ("+d+text+")", {value: d}));
    }
    addcrap(sel, answer.user_data.active_deck, "");
    addcrap(sel1, 4, " war");
    addcrap(sel2, 3, " mission");
  //  sel2.appendChild(bbCreateElementWithText("option", getCard(answer.user_decks[answer.user_data.active_deck].commander_id).name + " ("+answer.user_data.active_deck+")", {value: answer.user_data.active_deck}));
    for (var d in answer.user_decks)  {
      addcrap(sel, d, "");    
      addcrap(sel1, d, ", war?");
      addcrap(sel2, d, ", mission");
    }
    sel = bbgr_id("missionchooser");
    var raidName = function(type) { if (type == 3) return "Kor";  if (type == 12) return "Jotun"; return "?"};
    for (var raid in answer.user_raids)
      if (answer.user_raids[raid].status == 1){
        var remmin = Math.floor(-serverTimeMinAgo(answer.user_raids[raid].end_time));
        sel.appendChild(bbCreateElementWithText("option", "Raid: "+raid+"("+raidName(answer.user_raids[raid].raid_id)+") "+answer.user_raids[raid].health+ 
        " by "+ Math.floor( remmin / 60)+"h"+(remmin - 60*Math.floor(remmin / 60))+"m", {value: "RAID:"+raid}));
      }
    if (window.user_quest.step_id > 0 && window.user_quest.status == "0") {
     sel.appendChild(bbCreateElementWithText("option", "Quest ("+window.user_quest.step_id+")", {value: "QUEST", id: "QuestStepIdOption"}));
    }
    statuscomplete("init");
    
    //alert(window.faction_id+ " : "+stamina+"/"+max_stamina+" "+energy+"/"+max_energy);
    setTimeout(function(){
      synURLRequest("getAvailableTournaments", "", function(data){  //flash does it
       getFactionNews();
       var f = function(){
              if (document.getElementById("status"+"cards").style.backgroundColor == "green") getFactionWars();
              else { setTimeout(f, 750); }
              if (answer.daily_bonus) {              
                var box = Math.floor(Math.random()*3);
                synURLRequest("claimDailyBonus", "index="+box, function(bonusdata){
                  var bd = JSON.parse(bonusdata);
                  if (!bd.bonus_list) alert("CLAIMING failed: "+box+" "+bonusdata);
                  else if (!bd.bonus_list[box]) alert("CLAIMING failed (2): "+box+" "+bonusdata);
                  else mylog("Claimed: "+bd.bonus_list[box].toSource());
                });
              }
            };
       setTimeout(f, 750);
      });
  
      window.autopilot = answer.user_data.flags.autopilot;
    }, 5000);
  });
}

window.bestCard = null;
window.cards = null;
cardreq = new XMLHttpRequest();
cardreq.open("GET", "http://kg.tyrantonline.com/assets/cards.xml");
cardreq.onreadystatechange = (function(_req) { return function(){
  if (_req.readyState!=4) return; 
  if (_req.status==200) { 
    window.cards=_req.responseXML.getElementsByTagName("unit"); 
    sendInitRequest();
    statuscomplete("cards");
  } else alert("request failed: "+message+", "+data+"\n => "+_req.status+" "+_req.responseText); 
} }) (cardreq);
cardreq.send();

window.cardCache = new Array();
function readProp(o, prop, def) {
  var a = o.getElementsByTagName(prop);
  if (a.length == 0)  return def?def:0;
  if (def == "")  return a[0].textContent;
  else return a[0].textContent * 1;
}

function getNamedCard(name){
  for (var id in window.cardCache) 
    if (window.cardCache[id].name == name) return window.cardCache[id];
  var found = null;
  for (var i=0;i<window.cards.length;i++)
    if (readProp(window.cards[i], "name", "") == name) 
      if ((found == null) || (readProp(window.cards[i], "health") < readProp(found, "health"))) 
        found = window.cards[i];
   if (!found) return null;
   return getCard(found.firstElementChild.textContent);
}
function getCard(id){
  if (window.cards == null) { alert("cards not loaded yet"); return null; }
  if (window.cardCache[id]) return window.cardCache[id];
  for (var i=0;i<window.cards.length;i++)
    if (window.cards[i].firstElementChild.textContent == id) {
      window.cardCache[id] = {
                              cardid: id,
                              name: readProp(window.cards[i], "name", ""),
                              picture: readProp(window.cards[i], "picture", ""),
                              attack: readProp(window.cards[i], "attack"),
                              health: readProp(window.cards[i], "health"),
                              maxhealth: readProp(window.cards[i], "health"),
                              cost: readProp(window.cards[i], "cost"),
                              type: readProp(window.cards[i], "type"), //imp, bt, xeno, ...
                              rarity: readProp(window.cards[i], "rarity"),
                              skills: new Object(),
                              pod: window.cards[i],
                              assault: id < 1000 || (id > 4000 && id < 5000),
                              building: id >= 2000 && id < 3000
                              };
      window.cardCache[id].base = window.cardCache[id];
      var skills =  window.cards[i].getElementsByTagName("skill");
      for (var i=0;i<skills.length;i++) {
        var c = skills[i];
        var so = new Object();
        if (c.getAttribute("y")) so.targetType = c.getAttribute("y") * 1;
        if (c.getAttribute("x")) so.amount = c.getAttribute("x") * 1;
        else so.amount = 1;
        //alert(c.getAttribute("x")+"=>"+so.amount);
        if (c.getAttribute("all")=="1") so.all = true;
        so.died =  (c.getAttribute("died")=="1")?true:false;
        so.played =  (c.getAttribute("played")=="1")?true:false;
        var s = ""+c.getAttribute("id");
        window.cardCache[id].skills[s] = so; 
      }
      
      return window.cardCache[id];
    }
  alert("card not fouznd: "+id);
  return null;
}
  



function serverToLocalTimeMS(t) {
  return (t - serverStartTime) * 1000 + localStartTime;
}

function serverTimeMinAgo(st) {
  return - ((serverToLocalTimeMS(st) - (new Date()).getTime()) / 1000 / 60);
}

function getFactionName(id, contWith) {
  if (id == null || id == 0) {
    contWith("(none)", 0);
    return;
  }
  synURLRequest("getFactionName", "faction_id="+id, function(data){
    contWith(JSON.parse(data).name, id);
  });
}

function getFactionMemberNameSync(id){
  if (window.faction_members == null) return "";
  if (id == null || id == 0) return "";
  if (window.faction_members.members[""+id]) return window.faction_members.members[""+id].name;
  return "";
}

var nameCache = new Array();

function getMemberName(id, callback){
  if (!id || id == 0) { callback("error", id); return; }
  if (nameCache[""+id]) {callback(nameCache[""+id], id); return; }
  var s = getFactionMemberNameSync(id);
  if (s != "") callback(s, id);
  else jsonRequest("getName", "target_id="+id, function(data){
    nameCache[""+id] = data.name;
    callback(data.name, id);
  });
}

function mylog(mes, serverTime){
  if (serverTime)
    bbgr_id("bbhigheventlog").value =  Math.floor(serverTimeMinAgo(serverTime)) + " min ago: "+  mes + "\n" + bbgr_id("bbhigheventlog").value;
  else
    bbgr_id("bbhigheventlog").value =  mes + "\n" + bbgr_id("bbhigheventlog").value;
}

function getFactionNews() {
  mylog("\n");
  synURLRequest("getFactionMembers", "faction_id="+faction_id, function(data){
    window.faction_members = JSON.parse(data);
    synURLRequest("getFactionNews", "", function(data){
      var answer = JSON.parse(data);
      var i=3;
      if (i>=answer.news.length) i = answer.news.length-1;
      for (i=i;i>=0; i--) {
	(function(n) { getFactionName(n.target_faction_id, function(name) { 
	   var mes;
	   if ( n.type == 12 ) mes = name + " has declared war on you"; 
	   else if ( n.type == 11 ) mes = name + " was declared war on by " + getFactionMemberNameSync(n.instigator); 
	   else if ( n.type == 13 ) mes = "War against "+ name + " was won, +  " + n.value + " rating"; 
	   else if ( n.type == 14 ) mes = "War against "+ name + " was lost, " + n.value + " rating"; 
	   else if ( n.type == 20 ) mes = getFactionMemberNameSync(n.user_id) + " has joined, performed by " + getFactionMemberNameSync(n.instigator) ;
	   else mes = "unknown event " + n.type + " regarding faction " + name + " and member " + getFactionMemberNameSync(n.user_id) + " and value "+ n.value;
	   mylog(mes, n.time);
	 }); }) ( answer.news[i] );
//	 alert(i+"/"+answer.news.length+":"+answer.news[i].toSource());
      }
      statuscomplete("faction");
    });
  });
}

function getFactionChat(){
  mylog("\n");
  synURLRequest("getFactionMessages", "", function(data){
    var answer = JSON.parse(data);
    for (var i=0; i<answer.messages.length;i++){
      mylog(getFactionMemberNameSync(answer.messages[i].user_id) + ": "+ answer.messages[i].message, answer.messages[i].time);
    }
  });
}

var choosenBattle = 0, choosenWar, choosenMission; var invertedRoles = false; var forceSurrender = false; var autoDoubleFight = false;
var firstWar = 0; var choosenMissionOld = 0;
var FACTION_FIGHT = 1; FACTION_SURGE = 2; MISSION = 3; ARENA = 4; RAID = 5; ARENASELF = 6; QUEST = 7;
var orderedCards = [];
var remainingOrderedCards = [];


function showScore(ri, add) {
  getMemberName(ri.user_id, function(name) { mylog(name + ": Points: "+ ri.points + " ( - "+ri.points_against + ")" + "  Plays: "+ri.wins+"/"+ri.losses + "  " + (add?add:"")); } );
}

function getBotScore(war){
  var subScore = function (t) { 
    var pre = "War"+war+t; 
    return t + ":" + localStorage[pre+":WinPoints"] + "/" + localStorage[pre+":LostPoints"] + " in "+ localStorage[pre+":Wins"] + "/" + localStorage[pre+":Loses"];
  };
  return "Bot score: " + subScore("Fight") + "     "  + subScore("Surge");
}
    
function getFactionWars(contWith){
  wars=bbgr_id("wars");
  var res = "<table style='background-color: white' border=1>";
  jsonRequest("getActiveFactionWars", null, function(data){
//  alert("called");
    if (data.wars.length == 0) {
      wars.innerHTML = "no wars";
      return;
    }
//    alert(data.wars.toSource());
//    if (data.wars.length > 0)
    firstWar = 0;
    for (var w in data.wars) {
      if (firstWar == 0) firstWar = w;
      var wi =   data.wars[w];
      var act = wi.attacker_faction_id == faction_id;
      var actv = (act ? "ACT" : "DEF");
      res +=  "<tr><td>"+ wi.name + "</td><td>" + actv + "</td><td>" + (act?wi.attacker_points:wi.defender_points) +"</td><td>" + (!act?wi.attacker_points:wi.defender_points) + "</td><td>" + Math.floor(wi.duration * 60 - serverTimeMinAgo(wi.start_time)) + " min left </td>";
      res += "<td><button id='war"+w+"'>choose fight</td>";
      res += "<td><button id='war"+w+"s'>choose surge</td></tr>";
      mylog(wi.name+":"+actv+"  " + getBotScore(w))
    }
    wars.innerHTML=res;
    //alert(res);
//    if (data.wars.length > 0)
    for (var w in data.wars) 
      for (var t = 0; t < 2; t++) 
        bbgr_id("war"+w+(t==1?"s":"")).addEventListener("click", (function(war,_t){return function(){
  	  synURLRequest("getFactionWarInfo", "faction_war_id="+war, function() {
  	    jsonRequest("getFactionWarRankings", "faction_war_id="+war, function(data) {
  	      for (fac in data.rankings) {
	        for (r in data.rankings[fac]) 
		  showScore(data.rankings[fac][r]);
	      }
	    });
 	  });
          if (_t == 1) {
            bbgr_id("combat").innerHTML = "Surge "+war;
            choosenBattle = FACTION_SURGE;
          } else {
            bbgr_id("combat").innerHTML = "Fight "+war;
  	    choosenBattle = FACTION_FIGHT;
          }
	  choosenWar = war;
        }}) ( w,t), false);
    statuscomplete("factionwars");
    if (contWith != null) contWith();
  });
}


function combat() {
  removeAutoTimer();
  remainingOrderedCards = orderedCards.slice(0);
  var shouldauto = bbgr_id("realauto").checked?"1":"0";
  if (shouldauto != window.autopilot) {
    mylog("changing auto: => "+shouldauto);
    jsonRequest("setUserFlag", "flag=autopilot&value="+shouldauto, function(data){
      mylog("auto pilot changed: "+data.result);
      if (data.result == true) window.autopilot = shouldauto;
      else { alert("ups?" + data.result); return; }
      combat();
    });
    return;
  }
  invertedRoles = false;
  forceSurrender = false;
  if (choosenBattle == FACTION_FIGHT) combatFactionFight();
  if (choosenBattle == FACTION_SURGE) combatFactionSurge();
  if (choosenBattle == MISSION) combatMissionFight();
  if (choosenBattle == ARENA) combatMissionArena();
  if (choosenBattle == ARENASELF) combatMissionArenaSelf();  
  if (choosenBattle == RAID) combatRaid();
  if (choosenBattle == QUEST) combatQuest();
}

var LAST_MISSION_ID = 416;

  var basicMissions = 
    {/*[energy, location, id, description]*/
    "28":  [10, 5, 28, "=> BW"],
    "38":  [8, 7, 38, "=> PR"], //changeDeck(6, "http://tyrant.40in.net/kg/deck.php?id=1123,30,63,104,143,173")
    "41":  [10,7,41, "=> Pathr."],
    "49":  [6,9,61, "=> TI"],
    "107": [18,17,143, "=> SC"],
    "117": [19,19,153, "=> LR"], //better than 119, 0.684 vs. 0.681
   // "119": [22,19,155, "=> LR"],
    "135": [17,22,187, "=> SO"],
    "163": [23  , 27, 235, "=> Torm"],
    "181": [23,29,265, "=> BlTa"],
/*    {"137": [20,22,189, "=> gold"]}
    {"144": [22,23,196, "=> gold"]}
    {"AF4": [25,23,208, "=> gold"]}
    {"WS7": [25,24,215, "=> gift"]}  
    {"169": [22,28,241 "=> gold"]}    */
   // "DT4": [27,28,249, "=> gold"],
    "252": [100,41,348, "=> gold"], //http://tyrant.40in.net/kg/deck.php?id=1203,143,423,423,143,423,624,14318,2149,983,2149,624
    "276": [100,43,376, "=> gold"],  //http://tyrant.40in.net/kg/deck.php?id=1246,4118,2139,4118,2149,983,2149,624    
    "300": [100,45,416, "=> gold"] //http://tyrant.40in.net/kg/deck.php?id=1246,4273,2158,4273,4273,4273,2110,3057,3061,4273,4273
//    "HN3": [200,8,380, "=> HN event"] //"http://tyrant.40in.net/kg/deck.php?id=1035,4051,4032,4051,4051,4051,4051,3003,4051,4051,3003";/ for hostile negations
    }   ;

var defaultMissionDeckId = "3";
var defaultMissionDeck =  "http://tyrant.40in.net/kg/deck.php?id=1246,4273,2158,4273,4273,4273,2110,3057,3061,4273,4273"
//?? http://tyrant.40in.net/kg/deck.php?id=1246,4118,2139,4118,2149,983,2149,624";

var defaultDefenseDeckId = "7";
var defaultDefenseDeck = "http://tyrant.40in.net/deck.php?id=1248;200;769;826;983;2083;2088;2110;2139;4032;4174";


var questDecks = { //questlog
   "1":  "http://tyrant.40in.net/kg/deck.php?id=1045,246,4043,4032,425,537,606,624,680,752", //Rush 1:  (better with longshot)
   "2":  "http://tyrant.40in.net/kg/deck.php?id=1045,435,452,452,452,452,680", //Rush 2:  (better with pathrazer) (or try TI?)
   "3":  "http://tyrant.40in.net/kg/deck.php?id=1045,752,761,964,330,330,624,435", //Rush 3: (better with updated vigil)
   "4":  "http://tyrant.40in.net/kg/deck.php?id=1221,4273,4273,159,4273,3061,4273", 
         //"http://tyrant.40in.net/deck.php?id=1121;154;154;154;430;430;430;430", //Copy cat (4): ()thinking)
   "5": // "http://tyrant.40in.net/kg/deck.php?id=1121,154,430,154,430,154,430,537,752,430,430",  //Copy cat (5) (thinking, bad, better with longshot)
         //"tyrant.40in.net/kg/deck.php?id=1203,2034,2034,106,2114,54,54,2044,54,40,965", //(still not so good)
         "http://tyrant.40in.net/kg/deck.php?id=1221,4273,4273,159,4273,3061,4273", 
   "6":  "http://tyrant.40in.net/kg/deck.php?id=1045,951,951,997,997,951,951",
   //"http://tyrant.40in.net/deck.php?id=1045;500;500;500;500;500;2012;2012;2012;3041;3049", //Quicksilver 6:   standard ogre: (THINKING) (better mit Lancerider, hoc),
   "7":  "http://tyrant.40in.net/kg/deck.php?id=1182,951,951,951,951,3030,3055", //))"http://tyrant.40in.net/kg/deck.php?id=1045,716,907,435,452", // Quicksilver 7:   (ordered, better with pathrazer, ti or LR)
   "8":  "http://tyrant.40in.net/kg/deck.php?id=1021,2139,2141,2088", //Disease/Decay 8 and 9:  (ordered)
   "9":  "http://tyrant.40in.net/kg/deck.php?id=1021,2139,2141,2088", //Disease/Decay 8 and 9:  (ordered)
   "10": "http://tyrant.40in.net/kg/deck.php?id=1045,40,40,40,99,99,99,99,104,106,246", //High Skies 10: (ordered, better a 949 updated sand crawler than 246?)
   "11": "http://tyrant.40in.net/kg/deck.php?id=1045,2141,964,2110,939,2139,2141,983,3061,624", //High skies 11: (ordered, breaks all)
   "12": "http://tyrant.40in.net/kg/deck.php?id=1123,143,4077,103,624", //   High skies (12): (ordered, good it says, better with hornet drones, very small?)
   "13": "http://tyrant.40in.net/kg/deck.php?id=1045,205,205,104,40,4043,205,4043,352,205,40", //Impenetrable 13: (ordered, not sim tested)
   "14": "http://tyrant.40in.net/kg/deck.php?id=1045,240,240,4043,240,240,352,104,624,4043,205", //   Impenetrable 14: (ordered)
   "15": "http://tyrant.40in.net/kg/deck.php?id=1182,907,951,951,951,3006,3041",   //Invigorate 15, 16, 17:  (ordered fear)
   "16": "http://tyrant.40in.net/kg/deck.php?id=1182,907,951,951,951,3006,3041",   //Invigorate 15, 16, 17:  (ordered fear)
   "17": "http://tyrant.40in.net/kg/deck.php?id=1182,907,951,951,951,3006,3041",   //Invigorate 15, 16, 17:  (ordered fear)
   "18": "http://tyrant.40in.net/kg/deck.php?id=1115,518,2149,606", //Split Clone 18:  (ordered)
   "19": "http://tyrant.40in.net/kg/deck.php?id=63,981,63,694,624,63", //Split Clone 19:    (ordered?? better with hoc?)
   "20": "http://tyrant.40in.net/kg/deck.php?id=1115,518,2139,716", //Split Clone 20:  (ordered)
   "21": "http://tyrant.40in.net/kg/deck.php?id=1141,423,423,2149,2149,423,423,2057", //Friend Fire (21) (ordered, better with 2 more LR)
   "22": "http://tyrant.40in.net/kg/deck.php?id=1182,4032,983,2139,2079,716,752,2095", //Friendly Fire (22): (? breaks def, ordered)
   "23": "http://tyrant.40in.net/kg/deck.php?id=1045,2139,2083,769,983,2088,3061,3061", //   Genesis (23):  (breaks def, ordered)
   "24": "http://tyrant.40in.net/kg/deck.php?id=1049,2139,2009,2141,2141,983,3061,3061,2110", //   Genesis (24): (ordered, modify?)
   "25": "http://tyrant.40in.net/kg/deck.php?id=1246,4051,981,260,2155,4051,4051,536,4051,4051,4051",
   "26": "http://tyrant.40in.net/kg/deck.php?id=1246,4051,981,4051,260,4051,4051,4051,624,4051,4051",
};

var incompleteMission = -1;
    incompleteMissionValue = 0;

function autoFight(){
  removeAutoTimer();
  autoDoubleFight = true;
  autoFightQuest();
}

function autoFightQuest(){
  if (window.user_quest.status == "0" && (energy > 25) ) {
    verboseDeckToCardList(6, questDecks[window.user_quest.step_id], function(deckId, commander_id, cards){
      document.getElementById("strategy").selectedIndex = 1;
      orderedCards = cards;
      assert(document.getElementById("strategy").value == "ORDERED");
      var temp = cards.slice();
      temp.push(commander_id);
      changeDeck(deckId, temp, function(){
        choosenBattle = QUEST;
        combat();
      })
    })
  } else autoFightMission();
}


function autoFightMission(){
  if (incompleteMission == -1) {
    var last = 0;
    for (mid in user_mission_complete) if (mid != 432) last = mid;
    if (user_mission_complete[last] * 1 > 10) last =  last*1 + 1;
    if (last < LAST_MISSION_ID || user_mission_complete[last] * 1 < 10) {
      incompleteMission = last;
      choosenMissionOld = "INCOMPLETE";
      getFansiteMissionInfo(last, function(deck,energy,location){
        document.getElementById("misDeckCards").value = deck.join(",");
        basicMissions["INCOMPLETE"] = [energy,location,last, "auto"];
        
        autoFightMission();
      });
      return;
    }
    incompleteMission = 0;
  }
  

 // bbgr_id("realauto").checked = true;
  verboseDeckToCardList(bbgr_id("misDeckId").value*1, document.getElementById("misDeckCards").value, function(deckId, commander_id, cards){
    document.getElementById("strategy").selectedIndex = 1;
    orderedCards = cards;
    assert(document.getElementById("strategy").value == "ORDERED");
    var temp = cards.slice();
    temp.push(commander_id);
    changeDeck(deckId, temp, function(){
      choosenBattle = MISSION;
      choosenMission = choosenMissionOld;
      combat();
    })
  })
  /*selectDeck(bbgr_id("deckchooser2").value*1, function(){
    choosenBattle = MISSION;
    choosenMission = choosenMissionOld;
    combat();
  });*/
}

function autoFightWar(){
  changeDeck(bbgr_id("defDeckId").value*1, document.getElementById("defDeckCards").value, function(){
    bbgr_id("realauto").checked = false;
    changeDeck(bbgr_id("attDeckId").value*1, document.getElementById("attDeckCards").value, function(){
      document.getElementById("strategy").selectedIndex = 0;
      assert(document.getElementById("strategy").value == "SIMULATOR");
  
      getFactionWars(function(){
        choosenBattle = FACTION_SURGE; //FACTION_FIGHT;
        choosenWar = firstWar;
        if (firstWar >= 0) combat();      
      });
    });
  });
/*  selectDeck(bbgr_id("deckchooser1").value*1, function(){
    getFactionWars(function(){
      choosenBattle = FACTION_SURGE; //FACTION_FIGHT;
      choosenWar = firstWar;
      if (firstWar >= 0) combat();      
    });
  });*/
}

function logDeck(deckId){
  var url = "http://tyrant.40in.net/deck.php?id="+window.user_decks[bbgr_id("deckchooser").value].commander_id;
  for (var c in window.user_decks[deckId].cards) {
    for (var i=0;i<window.user_decks[deckId].cards[c]*1;i++) {
      url = url +";"+ c ;
    }
  }
  mylog(url);
}

function selectDeck(deck, contWith){
  if (deck >= 1 && deck <= 100)  {
    jsonRequest("setActiveDeck", "deck_id="+deck, function(r) {
      logDeck(deck);
      if (r.result == true) {
        mylog("changed deck to: "+getCard(window.user_decks[bbgr_id("deckchooser").value].commander_id).name+ " ("+deck+")" );
        window.active_deck = deck;
        if (contWith) contWith();
      } else mylog("couldn't change");
    });
  } else alert("invalid deck id");
};


var myDeck, myDraws;
var myCommander, enemyCommander, myHistory, enemyHistory;

function combatFactionFight(){
  if (stamina < 10) { alert("need more stamina " + stamina + "/"+max_stamina); return; }
  if (window.autopilot == "1") if (!confirm("Auto pilot is on! Are sure?")) return;
  jsonRequest("fightFactionBattle", "faction_war_id="+choosenWar, function(data){
    stamina -= 10;
    displaystats();
    combatbegin(data);
  });
}
function combatFactionSurge(){
  if (stamina < 10) { alert("need more stamina " + stamina + "/"+max_stamina); return; }
  if (window.autopilot == "1") if (!confirm("Auto pilot is on! Are sure?")) return;
  jsonRequest("fightFactionBattle", "faction_war_id="+choosenWar+"&blitz=1", function(data){
    stamina -= 10;
    displaystats();
    invertedRoles = true;
    combatbegin(data);
  });
}


function combatMissionFight(){
  var missionEnergy, missionLocation, missionId;
  
  var mission = basicMissions[choosenMission];
  if (!mission) {alert("no mission choosen: "+choosenMission); return;}
  
  missionEnergy = mission[0];
  missionLocation = mission[1];
  missionId = mission[2];
  
  if (energy < missionEnergy) { if (autoDoubleFight) autoFightWar(); else alert("need more energy " + energy + "/"+max_energy); return; }
  var start = function(){
    jsonRequest("doMission", "mission_id="+missionId, function(data){
      energy -= missionEnergy;
      displaystats();
      combatbegin(data);
    });
  }
  
  if (missionLocation == location_id ) start();
  else {
    jsonRequest("moveLocation", "location_id="+missionLocation, function(data){
      assert(data.result == true);
      start();
    });
  }
}

var arenaFights = 330, arenaPlayers;

function combatMissionArena(){
  if (arenaFights > 30) {
    arenaPlayers = new Array();
    jsonRequest("getRivals", null, function(data){
      for (var id in data) 
        arenaPlayers.push(data[id].user_id);
      arenaFights = 0;
      combatMissionArena();
    });
    return;
  }
  var enemy = arenaPlayers[Math.floor(arenaFights / 5)];
  assert(enemy);
  jsonRequest("doArenaFight", "enemy_id="+enemy, function(data){
    combatbegin(data);
  });
  arenaFights++;
}


function combatMissionArenaSelf(){
  jsonRequest("doArenaFight", "enemy_id="+user_id, function(data){
    combatbegin(data);
  });
}

function combatRaid(){
  if (energy < 10) { alert("need more energy " + energy + "/"+max_energy); return; }
  jsonRequest("fightRaidBoss", "user_raid_id="+choosenRaid, function(data){
    energy -= 10;
    displaystats();
    combatbegin(data);
  });
}

function combatQuest(){
  if (energy < 25) { alert("need more energy " + energy + "/"+max_energy); return; }
  jsonRequest("fightQuestBattle", null, function(data){
    energy -= 25;
    displaystats();
    combatbegin(data);
  });
}

var finalCardScore = new Object();
function createVisualCard(id, combatid){
  var card = getCard(id);
  var visual;
  if (card) {
    visual = document.createElement("img");
    visual.src = "http://cdn.tyrantonline.com/warhawk/images/"+card.picture;
    visual.title = id + " " + card.name;
    visual.width="50";
    visual.height="50";
    var rarity = new Array("", "common", "uncommon", "rare", "legendary"); rarity[10] = "missiononly";
    visual.className = rarity[card.rarity];
  } else visual = document.createTextNode(id);

  var li = document.createElement("li");
  li.appendChild(bbCreateElementWithText("div", "", {style: "position:absolute; ", id: "status"+combatid}));
  li.appendChild(visual);
  if (card) {
    var temp = document.createElement("div");
    temp.appendChild(bbCreateElementWithText("span", card.attack, {style: "color: #FF8800", id: "attack"+combatid}));
    temp.appendChild(bbCreateElementWithText("span", "", {style: "color: #FF0000", id: "attackmod"+combatid}));
    temp.appendChild(bbCreateElementWithText("span", " / "));
    temp.appendChild(bbCreateElementWithText("span", card.health, {style: "color: #0088FF", id: "health"+combatid}));
    temp.appendChild(bbCreateElementWithText("span", " / "));
    temp.appendChild(bbCreateElementWithText("span", card.cost, {style: "color: #00FFFF", id: "cost"+combatid}));    
    li.appendChild(temp);
    var skillCount = 0;
    for (var s in card.skills){
      var str = s;
      var c = card.skills[s];
      if (c.targetType) {
	if (c.targetType == 1) str += " imp";
	else if (c.targetType == 3) str += " bt";
	else if (c.targetType == 4) str += " xeno";
	else if (c.targetType == 8) str += " right";
	else if (c.targetType == 9) str += " raid";
	else str += " ?";
      }
      if (c.amount > 1) str += " " + c.amount;
      if (c.all) str = str.toUpperCase()+"A";
      var d = bbCreateElementWithText("div", str);
      li.appendChild(d);
      if (c.played) d.className = "played";
      if (c.died) d.className = "died";
      skillCount ++;
    }
    for (var i=skillCount;i<3;i++) li.appendChild(bbCreateElement("br"));

    var enemy = combatid >= 100 || combatid == -2; 
    if (invertedRoles) enemy = !enemy;
    card.enemy = enemy; 
    if (finalCardScore[combatid] != null)
      li.appendChild(bbCreateElementWithText("div", "Total: "+Math.round(finalCardScore[combatid]*100)/100));
    /*li.appendChild(bbCreateElementWithText("div", "HB: "+Math.round(cardBasicHealth(card,enemy)*100)/100+ " HS:"+Math.round(cardSkillHealth(card,enemy)*100)/100));
    li.appendChild(bbCreateElementWithText("div", "CD: "+Math.round(cardCombatDamage(card,enemy)*100)/100+ " SD:"+Math.round(cardSkillDamage(card,enemy)*100)/100));
    li.appendChild(bbCreateElementWithText("div", "Total: "+Math.round(  ( (cardBasicHealth(card,enemy)+cardSkillHealth(card,enemy)+1) * (1+cardCombatDamage(card,enemy)+cardSkillDamage(card,enemy)) ) *100)/100));*/
  }
  return li;
}

var existingCards, myCommanderHealth, enemyCommanderHealth;

function changehealth(value) {
  this.health = this.health*1 + value;
  if (this.health > this.maxhealth) this.health = this.maxhealth;
  document.getElementById("health"+this.combatid).textContent = this.health;
}

function ticktock() {
  if (this.cost <= 0) return;
  this.cost -= 1;
  document.getElementById("cost"+this.combatid).textContent = this.cost;
  if (this.cost == 0) document.getElementById("cost"+this.combatid).style.display = "none";
}

function addcard(cardid, combatid) {
  var card = getCard(cardid);
  var enemy = combatid >= 100 || combatid == -2;
  if (invertedRoles) enemy = !enemy;
  var visual = createVisualCard(cardid, combatid);
  bbgr_id((enemy?"enemy":"my") +  (card.assault?"assault":"support")).appendChild(visual);
  
  var logicCard = { 
    cardid: cardid,
    combatid: combatid, 
    enemy: enemy, 
    assault: card.assault, 
    attack: card.attack, 
    berserked: 0,
    status: new Object(),
    health: card.health, 
    skills: card.skills, 
    maxhealth: card.health, 
    cost: card.cost, 
    visual: visual, 
    tick: ticktock, 
    base: card };
  //console.log(combatid + " => "+logicCard.enemy);
  existingCards[combatid] = logicCard;
  
  if (combatid < 0) playedCommanders[enemy] = logicCard;
  playedCards[enemy].push(logicCard);
  if (logicCard.assault) playedAssaultCards[enemy].push(logicCard);
  if (!logicCard.assault) playedBuildingCards[enemy].push(logicCard);
  
  return logicCard;
}

function skillAmount(skill, cards, self){
  if (!skill) return 0;
  var targets = 1;
  if (cards && skill.all) {
    if (!skill.targetType) targets = cards.length;
    else targets = cards.filter(function(c){return c.type == skill.targetType;}).length;
    if (self) targets++;
  }
  return targets*skill.amount;
}

function cardActivationFactor(card){
  if (card.cost == 0) return 1.5;
  if (card.cost == 1) return 1;
  if (card.cost == 2) return 0.5;
  if (card.cost == 3) return 0.34;
  if (card.cost == 4) return 0.25;
  return 0.25;
}

function directSkillAmount(skill, card, hitProbability) {
  if (!skill) return 0;
  if (card && skill.targetType && skill.targetType != card.type) return 0;
  if (skill.all) return skill.amount;
  return skill.amount * hitProbability;
}

function probablyOccuringSkillDirectHits(card, enemy){
  if (card.assault) {
    var hitProbability = 1 / (playedAssaultCards[enemy].length + 1);
    return playedCards[!enemy].reduce(function(value, c){ 
      return value + directSkillAmount(c.skills["strike"],card,hitProbability) + directSkillAmount(c.skills["enfeeble"],card,hitProbability);
    }, 0) / (playedCards[!enemy].length + 1);
  } else {
    var hitProbability = 1 / (playedBuildingCards[enemy].length + 1);
    return playedCards[!enemy].reduce(function(value, c){ 
      return value + directSkillAmount(c.skills["siege"],card,hitProbability);
    }, 0) / (playedCards[!enemy].length + 1);
  }
}
function probablyOccuringSkillHealing(card,enemy){
  var hitProbability = 1 / (playedAssaultCards[enemy].length + 1);
  return playedCards[enemy].reduce(function(value, c){ 
    return value + directSkillAmount(c.skills["heal"],card,hitProbability) + directSkillAmount(c.skills["supply"],card,hitProbability);
  }, 0) / (playedCards[!enemy].length + 1);
}


function cardBasicHealth(card, enemy){
  var h = card.health;
  var activationFactor = cardActivationFactor(card);
  //true passive
  h += skillAmount(card.skills["armored"]) * 2;
  h += skillAmount(card.skills["counter"]) * 0.5;
  h += skillAmount(card.skills["regenerate"]) * 2;
  if (card.skills["refresh"]) h+=card.health*1.5;
  
  
  //dependant passive
  if (card.skills["evade"]) h += probablyOccuringSkillDirectHits(card,enemy) * 0.5;
  if (card.assault && card.skills["tribute"]) h += probablyOccuringSkillHealing(card, enemy);
  
  //skill/combat
  h += skillAmount(card.skills["leech"]) * 2 * activationFactor;

  
  if ((card.skills["wall"] || card.skills["siphon"]) && playedAssaultCards[!enemy].some(function(t){return t.skills["fear"];})) {
    if (card.skills["wall"]) h += card.health; 
    h += skillAmount(card.skills["siphon"]) * 2 * activationFactor;;
  }

  if (card.skills["flying"] && playedAssaultCards[!enemy].length > 0) h += playedAssaultCards[!enemy].reduce(function(cur, c) {
    if (c.skills["antiair"]) return cur - skillAmount(c.skills["antiair"]);
    else return cur + card.health*0.5;
  }, 0) / playedAssaultCards[!enemy].length;

  
  //h += skillAmount(card.skills["immobilize"]) * 2 * activationFactor;
  return h;
}

function cardSkillHealth(card, enemy, mimiced){
  var h = 0;
  h += skillAmount(card.skills["protect"], playedAssaultCards[enemy], true) * 2.2;
  h += skillAmount(card.skills["cleanse"], playedAssaultCards[enemy], true) * 0.5;
  h += skillAmount(card.skills["weaken"], playedAssaultCards[!enemy]) * 2;
  if (playedAssaultCards[enemy].length == 0) h += skillAmount(card.skills["supply"]) * 1.5;
  else if (playedAssaultCards[enemy].length == 1) h += skillAmount(card.skills["supply"]) * 2;
  else h += skillAmount(card.skills["supply"]) * 2.5;
  h += skillAmount(card.skills["heal"], playedAssaultCards[enemy], true) * 2.5;
  if (card.skills["jam"])  h += playedAssaultCards[!enemy].reduce(function(value, c){ return value + cardSkillDamage(c, !enemy); }, 0) * 0.5;
  if (!mimiced && card.skills["mimic"] && playedAssaultCards[!enemy].length > 0) {
    h += playedAssaultCards[!enemy].reduce(function(value, c){
      return value + cardSkillHealth(c, !enemy, true);
    },0) / playedAssaultCards[!enemy].length;
  }

  return   h * cardActivationFactor(card);
}

function cardCombatDamage(card, enemy){
  var d = card.attack;
  if (card.skills["antiair"] && playedAssaultCards[!enemy].length > 0) d += skillAmount(card.skills["antiair"]) * playedAssaultCards[!enemy].filter(function(c){return c.skills["flying"];}).length / playedAssaultCards[!enemy].length;
  else if (card.skills["antiair"]) d += skillAmount(card.skills["antiair"]) * 0.5;
  d += skillAmount(card.skills["berserk"]) * 4;
  d += skillAmount(card.skills["crush"]) * 1.5;
  d += skillAmount(card.skills["disease"]) * (probablyOccuringSkillHealing(null,!enemy) + playedAssaultCards[!enemy].reduce(function(value, c){
    var v = value;
    if (c.skills["refresh"]) v+=c.health;
    if (c.skills["regenerate"]) v+=c.skills["regenerate"].amount * 2; 
    return v;
   }, 0) / (playedAssaultCards[!enemy].length+1)) / 2;
  
  d += skillAmount(card.skills["pierce"]);
  d += skillAmount(card.skills["poison"]);

  if (card.skills["flurry"]) d *= skillAmount(card.skills["flurry"]) * 0.5 + 1;
  
  if (card.skills["swipe"]) {
    if (playedAssaultCards[!enemy].length == 0) d *= 1.5;
    else if (playedAssaultCards[!enemy].length == 1) d *= 2;
    else d *= 2.5;
  }
  
  //valor
  d *= cardActivationFactor(card);
  d += skillAmount(card.skills["counter"]) * 1.5;
  if (card.skills["payback"]) d += probablyOccuringSkillDirectHits(card, enemy) * 0.5;
  return d;
}



function cardSkillDamage(card, enemy, mimiced){
  //if (card.hasSkill
  var d = 0;
  if (card.skills["rally"]) {
    if (!card.skills["rally"].all) d = card.skills["rally"].amount * 2;
    else d = card.skills["rally"].amount * 5;
  }
  d += skillAmount(card.skills["strike"], playedAssaultCards[!enemy]) * 1.5;
  d += skillAmount(card.skills["enfeeble"], playedAssaultCards[!enemy]) * 1.25;
  if (playedBuildingCards[!enemy].length > 0) d += skillAmount(card.skills["siege"], playedBuildingCards[!enemy]) * 1;
  if (!mimiced && card.skills["mimic"]&& playedAssaultCards[!enemy].length > 0) {
    d += playedAssaultCards[!enemy].reduce(function(value, c){
      return value + cardSkillDamage(c, !enemy, true);
    },0) / playedAssaultCards[!enemy].length;
  }
  if (!mimiced && card.skills["chaos"] && playedAssaultCards[!enemy].length > 0) {
    d += playedAssaultCards[!enemy].reduce(function(value, c){
      return value + cardSkillDamage(c, !enemy, true);
    },0) / playedAssaultCards[!enemy].length;
  }
  return d * cardActivationFactor(card);
}


/*
antiair
armored
berserk
chaos
cleanse
counter
crush
disease
enfeeble
evade
fear
flurry
flying
heal
immobilize
jam
leech
mimic
payback
pierce
poison
protect
rally
refresh
regenerate
siege
siphon
strike
supply
swipe
tribute
valor
wall
weaken  
*/

/*
All skills:

antiair
armored
augment
backfire
berserk
blizzard
chaos
cleanse
counter
crush
disease
enfeeble
evade
fear
flurry
flying
freeze
fusion
heal
immobilize
infuse
jam
leech
mimic
mist
payback
pierce
poison
protect
rally
recharge
refresh
regenerate
repair
shock
siege
siphon
split
strike
supply
swipe
tribute
valor
wall
weaken
*/


function combatbegin(data){
  if (window.autopilot == "1") {
    battleEnded(data);
    return;
  }
  
  currentBattleData = data;
  window.myDeck = data.attack_deck;
  playedCommanders = new Array();
  playedCards = new Array(); playedAssaultCards = new Array(); playedBuildingCards = new Array();
  playedCards[false] = new Array(); playedAssaultCards[false] = new Array(); playedBuildingCards[false] = new Array();
  playedCards[true] = new Array();  playedAssaultCards[true] = new Array();  playedBuildingCards[true] = new Array();
  
  updatestats(data);
  bbgr_id("battleview").innerHTML = "<ul id='enemysupport'></ul><ul id='enemyassault'></ul><ul id='myassault'></ul><ul id='mysupport'></ul> ";
  bbgr_id("battleview").style.overflow="scroll";
  window.currentBattleRound = 0;
  existingCards = new Object();
  statusreset("battle");
  if (!invertedRoles) {
    myDeck = data.attack_deck;
    for (var i=0;i<myDeck.length;i++) myDeck[i] = myDeck[i] % 10000;
    myDraws = data.turn["1"].draws;
    myCommander = data.attack_commander % 10000;
    enemyCommander = data.defend_commander % 10000;
    addcard(enemyCommander, -2);
    addcard(myCommander, -1);
    myCommanderHealth = existingCards["-1"].health;
    enemyCommanderHealth = existingCards["-2"].health;

    setTimeout(updateBattle, 1000);
  } else {
    myDeck = data.defend_deck;
    for (var i=0;i<myDeck.length;i++) myDeck[i] = myDeck[i] % 10000;
    myDraws = data.turn["2"].draws;
    myCommander = data.defend_commander % 10000;
    enemyCommander = data.attack_commander % 10000;
    addcard(enemyCommander, -1);
    addcard(myCommander, -2);
    addcard(data.card_map[data.turn["1"].plays[0][0]] % 10000, data.turn["1"].plays[0][0]);
    myCommanderHealth = existingCards["-2"].health;
    enemyCommanderHealth = existingCards["-1"].health;

    currentBattleData = data;
    currentBattleTurns = new Array();
    currentTurn = 1;
    visualizeBattle();    

  }
}

function cardScore(cardid, enemy) {
  var card = getCard(cardid);
  if (enemy != true && enemy != false) enemy = false;
  return ( (cardBasicHealth(card,enemy)+cardSkillHealth(card,enemy)+1) * (1+cardCombatDamage(card,enemy)+cardSkillDamage(card,enemy)) );
}


//#################################################################################################
//#################################################################################################
//                                          SIMULATOR
//#################################################################################################
//#################################################################################################
/*
 
Deck: {commander, walls, buildings 
 
 
 { assault: cardid < 1000, attack: card.attack, health: card.health, skills: card.skills, maxhealth: card.health, cost: cost}
*/

var simOwnDeck, simEnemyDeck;

var tempArray = new Array(128);
var tempArray2 = new Array(128);
var tempArray3 = new Array(128);

  
function ProbArray() {}
ProbArray.prototype = new Array;  //from http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
ProbArray.prototype.change = function(prob,delta){
  if (prob < 0.0000001 || delta == 0) return; //first case won't happen anyways
  if (delta > 0) {
    var newmax = this.max + delta;
    if (newmax >= this.length) newmax = this.length-1; //limit must not get to high. todo: lost probabilities on too large/small values
    for (var i=this.max+1;i<=newmax;i++) this[i] = 0;
    this.max = newmax;
  }
  var nonprob = 1 - prob;
  var vmax = this.max; var temp = tempArray;
  for (var i=0;i<=vmax;i++) { temp[i] = this[i]; this[i] *= nonprob; }
  if (delta >= 0) {
    var i = delta; 
    for (;i<=vmax;i++) this[i] = this[i] + temp[i-delta] * prob;
  } else {
    var i = 0;
    vmax = vmax + delta;
    for (;i<=vmax;i++) this[i] = this[i] + temp[i-delta] * prob;
  }
};
ProbArray.prototype.fix = function (v) {
  if (this.length <= v) this.length = v;
  this.fill(0); 
  this[v] = 1;
  this.max = v;
};
ProbArray.prototype.average = function(){
  var res = 0;
  for (var i=0;i<=this.max;i++) res += i*this[i];
  return res;
}
function probArray(capacity){
  var r = new Array(capacity);
  r.__proto__ = ProbArray.prototype;
  r.max = -1;
  return r;  
}

//==========================ACTIVATION SKILLS==============================================


var activationSkillSimulations = new Object();

function activationSkillAllEffects(prob, targetcard, skillamount, activecard, skillinfo, payback, tributable){
  skillinfo.effect(prob, targetcard, skillamount, activecard);
  if (payback && targetcard.skills["payback"]) skillinfo.effect(0.5 * prob, activecard, skillamount, targetcard);
  if (tributable && targetcard.skills["tribute"]) skillinfo.effect(prob, activecard, skillamount, targetcard);
}

function activationSkillTarget(baseprob, skill, card, deck, skillinfo) {
//alert(baseprob+" "+card.name + ": "+skill.toSource()+"  "+skillinfo.toSource());
  var tempTargetProbability = new Array(20);
  var tempTargetProbability2 = new Array(20);
  var evadable = true;
  if (skillinfo.evadable) evadable = skillinfo.evadable;
  else if (skillinfo.targetOwnDeck) evadable = false;
  var payback = true;
  if (skillinfo.payback) payback = skillinfo.payback;
  else if (skillinfo.targetOwnDeck) payback = false;
  var tributable = false;
  if (skillinfo.targetOwnDeck) tributable = true;
  
  if (skill.all) {
    for (var i=0;i<deck.length;i++) {
      if (skill.targetType && skill.targetType != deck[i].base.type) continue;
      var p = baseprob;
      if (evadable && deck[i].skills["evade"]) p *= 0.5;
      if (skillinfo.condition) p *= skillinfo.condition(deck[i], card);
      if (!skillinfo.augmentable || card.augmented.max == 0)
        activationSkillAllEffects(p, deck[i], skill.amount, card, skillinfo, payback, tributable);
      else for (var augmention=0;augmention<=card.augmented.max;augmention++) 
        if (card.augmented[augmention] > 0.001)
          activationSkillAllEffects(p * card.augmented[augmention], deck[i], skill.amount + augmention, card, skillinfo, payback, tributable);
    }
  } else {
    //alive probability
    for (var i=0;i<deck.length;i++) tempTargetProbability[i] = 0;
    for (var i=0;i<deck.length;i++) tempTargetProbability2[i] = (1-deck[i].health[0]);
    //additional probability
    if (skillinfo.condition)
      for (var i=0;i<deck.length;i++) tempTargetProbability2[i] *= skillinfo.condition(deck[i], card);
    if (skill.targetType)
      for (var i=0;i<deck.length;i++) 
        if (skill.targetType != deck[i].base.type) 
          tempTargetProbability2[i] = 0;
    for (var i=0;i<deck.length;i++) 
      if (tempTargetProbability2[i] > 0 && deck[i].skills["intercept"]) {
        var neightbourprob = 1;
        for (var j = i-1; j>=0 && neightbourprob > 0.01; j--) { 
          var p = tempTargetProbability[j] * neightbourprob; 
          tempTargetProbability[i] += p; 
          tempTargetProbability[j] -= p; 
          neightbourprob *= deck[j].health[0];
        }
        neightbourprob = 1;
        for (var j = i+1; j<deck.length && neightbourprob > 0.01; j++) { 
          var p = tempTargetProbability[j] * neightbourprob; 
          tempTargetProbability[i] += p; 
          tempTargetProbability[j] -= p; 
          neightbourprob *= deck[j].health[0];
        }
      }
    for (var i=0;i<deck.length;i++) tempTargetProbability[i] += tempTargetProbability2[i];
    var total = 0;
    for (var i=0;i<deck.length;i++) total += tempTargetProbability[i];
    if (total <= 0) total = 1;
    for (var i=0;i<deck.length;i++) 
      if (tempTargetProbability[i] > 0) {
        var p = baseprob * tempTargetProbability[i] / total;
        if (evadable && deck[i].skills["evade"]) p *= 0.5;
        
        if (!skillinfo.augmentable || card.augmented.max == 0)
          activationSkillAllEffects(p, deck[i], skill.amount, card, skillinfo, payback, tributable);
        else for (var augmention=0;augmention<=card.augmented.max;augmention++) 
          if (card.augmented[augmention] > 0.001)
            activationSkillAllEffects(p * card.augmented[augmention], deck[i], skill.amount + augmention, card, skillinfo, payback, tributable);
      }
  }
}

function simActivation(prob, card, mimicer, overrideSkills){
  if (prob < 0.00001) return;
  var truecard = mimicer?mimicer:card;
  //if (truecard.cost > 0) return; this would block on x skills
  var ownDeck = truecard.deck;
  var enemyDeck = (ownDeck == simOwnDeck)?simEnemyDeck:simOwnDeck;
  if (!mimicer) prob *= (1 - card.jammed); //  * (1 - card.health[0]); multiplied by caller
  for (var s in (overrideSkills?overrideSkills:card.skills)){
    if (mimicer && s == "mimic") continue;
    if (!overrideSkills && (card.skills[s].died || card.skills[s].played)) continue;
    if (s == "summon") {
      if (prob < 0.025) continue; //don't want too many cards
      var c = new SimCard(getCard(card.skills[s].amount));
      c.health[c.base.health] = prob;
      c.health[0] = 1 - prob;
      truecard.deck.playCard(c);
      continue;
    }
    if (!activationSkillSimulations[s]) continue;  
    var targetDeck = activationSkillSimulations[s].targetOwnDeck?ownDeck:enemyDeck;
    var targetCards = activationSkillSimulations[s].targetBuildings?targetDeck.buildings:targetDeck.assaults;
    var chaosed = activationSkillSimulations[s].targetOwnDeck?0:truecard.chaosed;
    activationSkillTarget(prob * (1-chaosed), card.skills[s], truecard, targetCards, activationSkillSimulations[s]);
    if (chaosed) {
      targetDeck = ownDeck;
      targetCards = activationSkillSimulations[s].targetBuildings?targetDeck.buildings:targetDeck.assaults;
      activationSkillTarget(prob * chaosed, card.skills[s], truecard, targetCards, activationSkillSimulations[s]);
    }
  }
}

/* Skill default:
   targetOwnDeck: false
   targetBuildings: false
   evadable: !targetOwnDeck
   payback: !targetOwnDeck,
   tributed: targetOwnDeck
*/

function probOR(a,b){ return a + b - a * b; } ; //fuzzy a || b
function probORm(){
  var res = arguments[0];
  for (var i=1;i<arguments.length;i++)
    res += arguments[i] - res * arguments[i];
//  alert(arguments+"=>" + res);
  return res;
}
function probAND(a,b){ return a * b; } ; //fuzzy a && b

//Skill activation: augment, Enfeeble, Heal, Jam, Mimic, Rally, Repair, Siege, Strike, Weaken
//supply, protect
//cleanse, chaos
activationSkillSimulations["augment"] = ({
  effect: function(p, t, sa){ t.augmented.change(p, sa);  },
  condition: function(t, c) {  
    if (t.cost > 0) return 0; 
    if (c.base.assault && t.index < c.index) return 0; 
    for (var s in t.skills) if (!t.skills[s].died && !t.skills[s].played)
      if (activationSkillSimulations[s] && activationSkillSimulations[s].augmentable) return 1;
    return 0;
  },
  targetOwnDeck: true
}); 
activationSkillSimulations["enfeeble"] = ({
  effect: function(p, t, sa){ t.enfeebled.change(p, sa); },
  augmentable: true
}); 
activationSkillSimulations["heal"] = ({
  effect: function(p, t, sa){ t.heal(p, sa); },
  condition: function(t,c) { return 1 - t.health[t.base.health]; },
  targetOwnDeck: true,
  augmentable: true
}); 
activationSkillSimulations["supply"] = ({
  effect: function(p, t, sa){ t.heal(p, sa); },
  condition: function(t,c) { /* probability that all to the target are dead (alive is checked by called ) */
      if (t.index >= c.index-1 && t.index <= c.index + 1) return 1;
      var res = 1; var dir = t.index < c.index?1:-1;
      for (var i = t.index + dir; i != c.index && res > 0; i+=dir) res *= t.deck.assaults[i].health[0];
      return res;
    },
  targetOwnDeck: true,
  augmentable: true
}); 
activationSkillSimulations["jam"] = ({
  effect: function(p, t, s) { t.jammed = probOR(t.jammed, 0.5*p); }
});
activationSkillSimulations["mimic"] = ({ //TODO
  effect: function(p, t, s, c) { if (c.cost <= 0) simActivation(p,t,c); },
  payback: false
});
activationSkillSimulations["rally"] = ({
  effect: function(p, t, sa){  t.attack.change(p, sa); },
  condition: function(t, c) {  if (t.cost > 0) return 0; if (!c.base.assault) return 1; else if (t.index < c.index) return 0; else return 1;},
  targetOwnDeck: true,
  augmentable: true
}); 
activationSkillSimulations["repair"] = ({
  effect: function(p, t, sa){ t.heal(p, sa); },
  condition: function(t,c) { return 1 - t.health[t.base.health]; },
  targetOwnDeck: true,
  targetBuildings: true,
  augmentable: true
}); 
activationSkillSimulations["strike"] = ({
  effect: function(p, t, sa){ t.damage(p, sa); /*mylog("Strike: "+p+": "+t.base.name+ " => "+t.health.average()); */ },
  augmentable: true
}); 
activationSkillSimulations["siege"] = ({
  effect: function(p, t, sa){ t.damage(p, sa); },
  targetBuildings: true,
  augmentable: true
//  payBack: false //???
}); 
activationSkillSimulations["weaken"] = ({
  effect: function(p, t, sa){ t.attack.change(p, - sa); },
  condition: function(t,c){ return 1 - t.attack[0]; },
  augmentable: true
}); 
activationSkillSimulations["protect"] = ({
  effect: function(p, t, sa){ t.protection.change(p, sa); },
  targetOwnDeck: true,
  augmentable: true
}); 
activationSkillSimulations["cleanse"] = ({
  effect: function(p, t){ 
    var unchangedP = 1 - p;
    t.diseased *= unchangedP;
    t.jammed *= unchangedP;
    t.immobilized *= unchangedP;    
    t.enfeebled[0] = t.enfeebled[0] + (1 - t.enfeebled[0]) * p;
    for (var i=1;i<=t.enfeebled.max;i++) t.enfeebled[i] *= unchangedP; //TODO: Does not work against normal Enfeeble, only Paybacked and/or Chaosed Enfeeble. 
    t.chaosed *= unchangedP;
  },
  condition: function(t,c){ return probORm(1 - t.poisoned[0], t.diseased, t.jammed, t.immobilized, 1 - t.enfeebled[0], t.chaosed /*TODO: frozen */ ); },
  targetOwnDeck: true
}); 
activationSkillSimulations["chaos"] = ({
  condition: function(t,c){ return probOR(1 - t.chaosed, 1 - t.jammed); },
  effect: function(p, t){ t.chaosed =  t.chaosed + (1 - t.chaosed) * p; }
}); 


//selection, swipe, fear, 

//Direct hit
var tempAttackVector = probArray(50);
function simDirectAttack(prob, target, card, probvalor){
  var dmgmod = 0;
  if (target.skills["flying"]){
    if (card.skills["antiair"]) dmgmod += card.skills["antiair"].amount;
    else prob *= 0.5;
  }
  
  tempAttackVector.max = card.attack.max + dmgmod;
  tempAttackVector[0] = 0; //probability to not attack doesn't matter, so set it to 0 to allow transformations
  for (var i=1; i <= dmgmod; i++) 
    tempAttackVector[i] = 0;
  for (var i=dmgmod + 1; i<=tempAttackVector.max; i++)
    tempAttackVector[i] = card.attack[i - dmgmod] * prob;
   
  if (card.skills["burst"] && target.assault) { //mylog("::"+target.base.health+"=>"+target.health[target.base.health]+":"+card.skills["burst"].amount);
  //mylog(tempAttackVector);
    tempAttackVector.change(target.health[target.base.health], card.skills["burst"].amount);
  //mylog(tempAttackVector);
      }
  if (card.skills["valor"]) 
    tempAttackVector.change(probvalor, card.skills["valor"].amount);
   
  var hitProb = 0;
  var oldProbTargetDead = target.health[0];
 
  var killProb = target.multidamage(tempAttackVector, target.skills["armored"]?target.skills["armored"].amount:0,
                                                         target.skills["pierce"] ?target.skills["pierce"].amount:0, card.skills["disease"])
  var attackProbabilityResult = tempArray;
 
  var hitProb = 0;
  var maxdamage = target.enfeebled.max + card.attack.max; if (dmgmod > 0) maxdamage += dmgmod;
  for (var a=1;a<=maxdamage;a++) {   
    var curHitProb = attackProbabilityResult[a];
    
    if (target.assault) {
      if (card.skills["leech"]) card.heal(curHitProb, Math.min(card.skills["leech"].amount,a)); 
      if (card.skills["siphon"]) card.deck.commander.heal(hitProb, Math.min(card.skills["siphon"].amount, a)); 
    }
    hitProb += curHitProb;
  }
  if (target.assault) {
    if (card.skills["immobilize"]) target.immobilized = probOR(target.immobilized, 0.5 * hitProb);
    if (card.skills["poison"]) {
      var newpoison = card.skills["poison"].amount;
      var weakerpp = 0;
      for (var i=0;i<newpoison;i++) weakerpp+=target.poisoned[i];
      var delta = weakerpp * (hitProb - target.poisoned[newpoison] * hitProb);
      target.poisoned[newpoison] += delta; 
      if (weakerpp > 0) for (var i=0;i<newpoison;i++) target.poisoned[i] -= delta * target.poisoned[i] / weakerpp;
    }
  }
  
  if (target.skills["counter"]) card.damage(hitProb, target.skills["counter"].amount);
  
  
  
  //-------done
  //valor
  //immobilize
  //armored
  //pierce
  //flying
  //antiair
  //leech
  //berserk
  //counter
  //disease
  //crush
  //siphon

  if (target.assault) {
  
    if (card.skills["crush"]) {
      var wallFall = killProb;
      for (var i=0;i<target.deck.walls.length && wallFall > 0;i++) {
        var dp = target.deck.walls[i].health[0];
        target.deck.walls[i].damage(wallFall, card.skills["crush"].amount);
        wallFall *= dp;
      }
      if (wallFall > 0)
        target.deck.commander.damage(wallFall, card.skills["crush"].amount);
    }
  
  
  }
  
  if (card.skills["berserk"]) { card.attack.change(hitProb, card.skills["berserk"].amount); card.berserked.change(hitProb, card.skills["berserk"].amount);}
  
}




function simAssaultAttack(attackAtAllProb, attDeck, defDeck){
  var MAX_UNITS = 20;
  
  var defPositions = new Array(MAX_UNITS);
  for (var i=0;i<defPositions.length;i++) defPositions[i] = new Object();
  var possiblePositions = probArray(MAX_UNITS); 
  possiblePositions.fix(0);
  for (var i=0;i<defDeck.assaults.length;i++) {
    for (var j=0;j<=possiblePositions.max;j++) if (possiblePositions[j] > 0) defPositions[j][i] = possiblePositions[j] * (1 - defDeck.assaults[i].health[0]);
    possiblePositions.change(1 - defDeck.assaults[i].health[0], 1); //increase when alive
  }
  
  //alert(defPositions.toSource());

  var attProbCumulAssault = new Array(defDeck.assaults.length);
  var attProbCumulWall = new Array(defDeck.walls.length);
  var attProbCumulCommander = 0;

  var valorprob = 0;
  var valormaxcards = attDeck.assaults.length > defDeck.assaults.length ? attDeck.assaults.length : defDeck.assaults.length;
  var valorAttCards = probArray(valormaxcards+1); valorAttCards.fix(0);
  var valorDefCards = probArray(valormaxcards+1); valorDefCards.fix(0);
  for (var i=0;i<attDeck.assaults.length;i++) valorAttCards.change(1-attDeck.assaults[i].health[0], 1);
  for (var i=0;i<defDeck.assaults.length;i++) valorDefCards.change(1-defDeck.assaults[i].health[0], 1);
  var valorCumul = 0; for (var l=0;l<valorDefCards.length;l++) valorCumul += valorDefCards[l];
  for (var l=0;l<valormaxcards;l++) {
    valorCumul -= valorDefCards[l];
    valorprob += valorAttCards[l] * valorCumul; // sum valorDefCards[l+1..infty]
  }

  possiblePositions.fix(0);
  for (var c=0;c<attDeck.assaults.length;c++) {
    var card = attDeck.assaults[c];
    var oldOldLifeProb = 1 - card.health[0];

    for (var p=1;p<=card.poisoned.max;p++)
      card.health.change(card.poisoned[i], -i);
    var oldLifeProb = 1 - card.health[0];
    
    
    if (card.cost <= 0) {
      simActivation(attackAtAllProb*oldLifeProb, card);
      
      var flurry = 0;
      if (card.skills["flurry"]) flurry = card.skills["flurry"].amount;
      var swipe = 0;
      if (card.skills["swipe"]) swipe = 1;
      
      for (var f = 0; f<=flurry;f++) {
        attProbCumulAssault.fill(0);
        attProbCumulWall.fill(0);
        attProbCumulCommander = 0;
      
        var attProb = oldLifeProb * ((f==0)?1:0.5) * (1 - card.immobilized);
        
        if (card.skills["fear"]) {
              //attack walls
          var wallFall = 1;
          for (var i=0;i<defDeck.walls.length && wallFall > 0;i++) {
            var dp = defDeck.walls[i].health[0];
            attProbCumulWall[i] += wallFall * attProb;
            wallFall *= dp;
          }
              
          //attack commander
          attProbCumulCommander += wallFall * attProb;
        } else {
        for (var s = - swipe; s <= swipe; s++ ) {
          var j = 0; if (s < 0) j = 1;
          for (;j<=possiblePositions.max;j++) 
            if ( possiblePositions[j] > 0) {
              var attackHere = attProb * possiblePositions[j];
              //attack j + s
              var totalProb = 0;
              for (var i in defPositions[j+s]) {
                var prob = defPositions[j+s][i];
                attProbCumulAssault[i] += prob*attackHere;
                totalProb += prob;
              }
              
              //attack walls
              var wallFall = 1 - totalProb;
              for (var i=0;i<defDeck.walls.length && wallFall > 0;i++) {
                var dp = defDeck.walls[i].health[0];
                attProbCumulWall[i] += wallFall * attackHere;
                wallFall *= dp;
              }
              
              //attack commander
              attProbCumulCommander += wallFall * attackHere;
            }
        }
        }
          
        for (var i=0;i<attProbCumulAssault.length;i++)
          if (attProbCumulAssault[i] > 0) 
            simDirectAttack(attackAtAllProb*attProbCumulAssault[i],defDeck.assaults[i],card, valorprob);
        for (var i=0;i<attProbCumulWall.length;i++)
          if (attProbCumulWall[i] > 0) 
            simDirectAttack(attackAtAllProb*attProbCumulWall[i],defDeck.walls[i],card, valorprob);
        if (attProbCumulCommander > 0)
          simDirectAttack(attackAtAllProb*attProbCumulCommander,defDeck.commander,card, valorprob);
      }
    }
    
    possiblePositions.change(oldLifeProb, 1);
    
  }
}

function filterSkills(skills, attrib) {
  var ps = new Object;
  for (var s in skills) if (skills[s][attrib]) ps[s] = skills[s];
  return ps;
}

function simTopRow(prob, attDeck, defDeck){
  for (var i=0;i<attDeck.actions.length;i++) {
    if (attDeck.actions[i].assault || attDeck.actions[i].building) {
      var tempIndex = attDeck.actions[i].index;
      attDeck.actions[i].index = 0; //temoorary change position to remove positional target conditions
      simActivation(prob, attDeck.actions[i], false, filterSkills(attDeck.actions[i].skills, "played"));
      attDeck.actions[i].index = tempIndex;
    } else simActivation(prob, attDeck.actions[i]);
  }
  attDeck.actions = new Array();
  simActivation(prob, attDeck.commander);
  for (var i=0;i<attDeck.buildings.length;i++)
    simActivation(prob * (1-attDeck.buildings[i].health[0]), attDeck.buildings[i]);
}


function simSimpleTurn(enemyAttacks){
  var defDeck = enemyAttacks?simOwnDeck:simEnemyDeck;
  var attDeck = enemyAttacks?simEnemyDeck:simOwnDeck;
  attDeck.playNextCard();
  attDeck.resetState();
  simTopRow(1 - attDeck.commander.health[0], attDeck, defDeck);
  simAssaultAttack(1 - attDeck.commander.health[0], attDeck, defDeck);  
  for (var i=0;i<attDeck.assaults.length;i++) if (attDeck.assaults[i].cost > 0) attDeck.assaults[i].cost -= 1;
  for (var i=0;i<attDeck.buildings.length;i++) if (attDeck.buildings[i].cost > 0) attDeck.buildings[i].cost -= 1;
}

var logSimulationResult = false;
function simDoubleTurn(){
  simSimpleTurn(false);
  simSimpleTurn(true);
  
  var logDeck = function(name, deck){
    var s = deck.commander.base.name + " ("+deck.commander.health.average() + "): ";
    for (var i=0;i<deck.assaults.length;i++) s+=deck.assaults[i].base.name + " ("+deck.assaults[i].attack.average()+";"+deck.assaults[i].health.average() +"/"+deck.assaults[i].cost+ "), ";
    for (var i=0;i<deck.buildings.length;i++) s+=deck.buildings[i].base.name + " ("+deck.buildings[i].health.average()+"/"+deck.buildings[i].cost + "), ";
    mylog(name+": "+s);
  }
  if (logSimulationResult){
    logDeck("own", simOwnDeck);
    logDeck("enemy", simEnemyDeck);
  }
  //mylog("");
}

function SimCard(logicCard){
  this.base = logicCard.base;
  this.skills = logicCard.skills;
  this.assault = logicCard.base.assault;
  this.building = logicCard.building;
  
  this.health = probArray(logicCard.maxhealth+1);
  this.health.fix(logicCard.health);
  this.lastTurnDeathProbability = 0;
  this.attack = probArray(100);

  for (var s in this.skills)
    if (this.skills[s].played) this.hasPlayedSkills = true; 
    else if (this.skills[s].died) this.hasDiedSkills = true; 

  this.enfeebled = probArray(32); 
  this.protection = probArray(32); 
  this.poisoned = probArray(8); 
  this.berserked = probArray(100);
  this.berserked.fix(logicCard.berserked?logicCard.berserked:0);
  this.augmented = probArray(32); 
  this.diseased = 0;
  this.chaosed = 0;
  this.immobilized = 0;  
  
  this.cost = logicCard.cost;
  
  this.resetState = function(){
    if (this.skills["refresh"]) {
      for (var i=1;i<=this.base.health;i++) this.health[i] *= this.diseased;
      this.health[this.base.health] += (1-this.diseased) * (1 - this.health[0]);
    }
    this.protection.fix(0);
    this.enfeebled.fix(0);
    this.poisoned.fix(0);
    this.augmented.fix(0); //actually resets after card's turn
    this.jammed = 0;
    this.chaosed = 0;
    this.attack.fill(0);
    this.attack.max = this.base.attack + this.berserked.max;
    for (var i=0;i<=this.berserked.max;i++)
      this.attack[i+this.base.attack] = this.berserked[i];
    
  }  
  this.resetState();
  
  if (logicCard.status) {
    if (logicCard.status["attack_boost"]) this.attack.change(1, logicCard.status["attack_boost"]);
    if (logicCard.status["jammed"]) this.jammed = 1;
    if (logicCard.status["enfeeble"]) this.enfeebled.fix(logicCard.status["enfeeble"]*1);
    if (logicCard.status["protect"]) this.protection.fix(logicCard.status["protect"]*1);
    if (logicCard.status["disease"]) this.diseased = 1; //?
    if (logicCard.status["chaos"]) this.chaosed = 1; 
    if (logicCard.status["immobilize"]) this.immobilized = 1;  //?
    if (logicCard.status["poison"]) this.poisoned.fix(logicCard.status["poison"]*1);  
    if (logicCard.status["augment"]) this.augmented.fix(logicCard.status["augment"]);
  }
  
  this.damage = function(prob, damage, pierce, applyDisease){
    if (isNaN(prob)) {  mylog("invalid damage:" +prob + ": " +  damage + " => "+this.base.name + " :: "+ this.health.average());  return; }
  //var curh = this.health.average();
    var temp = tempArray;
    var temp2 = tempArray2;
  
    //effective damage, damage + this.enfeeble - this.protection
    var maxdamage = damage+this.enfeebled.max;
    
    for (var i=0;i<=maxdamage;i++) temp[i] = 0;
    for (var e=0;e<=this.enfeebled.max;e++) 
      for (var p=0;p<=this.protection.max;p++) {
        var dmg = damage + e - p;
        if (pierce) {
          if (pierce > p) dmg += p;
          else dmg += pierce;
        }
        if (dmg < 0) dmg = 0;
        temp[dmg] += prob * this.enfeebled[e] * this.protection[p];
      }
      
    var resProbToHit = 0;
    for (var i=1;i<=maxdamage;i++) 
      resProbToHit += temp[i];
    
    //apply damage 
    var basehealth = this.base.health;
    var healtharray = this.health;
    for (var i=0;i<=basehealth ;i++) { temp2[i] = healtharray[i]; healtharray[i] = 0; }
    
    for (var h=0;h<=basehealth ;h++) { //TODO: check h == 0
      var loopmax = h;
      if (loopmax > maxdamage) loopmax = maxdamage;
      var temp2h = temp2[h];
      for (var d=1;d<=loopmax;d++) 
        healtharray[h-d] += temp2h * temp[d];
      for (var d=h+1;d<=maxdamage;d++) 
        healtharray[0]   += temp2h * temp[d];
//      for (var d=1;d<=damage+this.enfeebled.max;d++) 
//        healtharray[(h-d < 0) ? 0 : (h-d)] += temp2[h] * temp[d];
    }

    for (var h=0;h<=basehealth ;h++) 
      healtharray[h] += temp2[h] * (1 - resProbToHit);

    if (applyDisease) 
      this.diseased = this.diseased + resProbToHit - this.diseased * resProbToHit;
    
        
    var probToDie = healtharray[0] - temp2[0];

    if (this.hasDiedSkills) simActivation(probToDie, this, false, filterSkills(this.skills, "died"));

    if (this.skills["regenerate"]) {
      //old death probability temp2[0] doesn't change
      var probToRegen = 0.5 * (1-this.diseased);
      healtharray[this.skills["regenerate"].amount] += probToDie * probToRegen;
      healtharray[0] = temp2[0] + probToDie * (1-probToRegen);
    }
    
    
//    var curh; mylog(prob + ": " +  damage + " => "+this.base.name + " :: "+curh + " => "+this.health.average()); //DAMAGELOG
    return resProbToHit;
  }
  this.multidamage = function(damageArray, armor, pierce, applyDisease){ //TODO remove prob/damagemod and let caller modify damageArray (=> should be faster by O(n))    done??
  //var curh = this.health.average();
    var temp = tempArray;
    var temp2 = tempArray2;
    var damageModifier = tempArray3;
  
    var initDeadProb = this.health[0];
  
    //effective damage, damage + this.enfeeble - this.protection
    var maxdamage = damageArray.max+this.enfeebled.max;
    
    var maxdamagedecrease = this.protection.max+armor;
    var maxdamageincrease = this.enfeebled.max;
    for (var i=0;i<=maxdamagedecrease+maxdamageincrease;i++) damageModifier[i] = 0;

    for (var p=0;p<=this.protection.max;p++) {
      var tp = p + armor;
      for (var e=0;e<=this.enfeebled.max;e++) {
        var modi = e - tp;
        if (pierce) {
          if (pierce > tp) modi += tp;
          else modi += pierce;
        }
        damageModifier[modi+maxdamagedecrease] += this.enfeebled[e] * this.protection[p];
      }
    }
    
    for (var i=0;i<=maxdamage;i++) temp[i] = 0;
    for (var d=0;d<=damageArray.max;d++) {
      for (var m=-maxdamagedecrease;m<=maxdamageincrease;m++) {
        var td = d + m;
        if (td < 0) td = 0;
        temp[td] += damageArray[d] * damageModifier[m + maxdamagedecrease];
      }
    }
      
    //== That's all the same as in .damage ==
    var resProbToHit = 0;
    for (var i=1;i<=maxdamage;i++) 
      resProbToHit += temp[i];
    
    //apply damage 
    var basehealth = this.base.health;
    var healtharray = this.health;
    for (var i=0;i<=basehealth ;i++) { temp2[i] = healtharray[i]; healtharray[i] = 0; }
    
    for (var h=0;h<=basehealth ;h++) { //TODO: check h == 0
      var loopmax = h;
      if (loopmax > maxdamage) loopmax = maxdamage;
      var temp2h = temp2[h];
      for (var d=1;d<=loopmax;d++) 
        healtharray[h-d] += temp2h * temp[d];
      for (var d=h+1;d<=maxdamage;d++) 
        healtharray[0]   += temp2h * temp[d];
//      for (var d=1;d<=damage+this.enfeebled.max;d++) 
//        healtharray[(h-d < 0) ? 0 : (h-d)] += temp2[h] * temp[d];
    }

    for (var h=0;h<=basehealth ;h++) 
      healtharray[h] += temp2[h] * (1 - resProbToHit);

    if (applyDisease) 
      this.diseased = this.diseased + resProbToHit - this.diseased * resProbToHit;
    
    var probToKill = healtharray[0] - initDeadProb; //DIFFERENCE
        
    if (this.skills["regenerate"]) {
      //old death probability temp2[0] doesn't change
      var probToDie = healtharray[0] - temp2[0];
      var probToRegen = 0.5 * (1-this.diseased);
      healtharray[this.skills["regenerate"].amount] += probToDie * probToRegen;
      healtharray[0] = temp2[0] + probToDie * (1-probToRegen);
    }

    if (this.hasDiedSkills) simActivation(probToKill, this, false, filterSkills(this.skills, "died"));
//    var curh; mylog(prob + ": " +  damage + " => "+this.base.name + " :: "+curh + " => "+this.health.average()); //DAMAGELOG
    return probToKill;
  }  
  this.heal = function(prob, amount){
    prob *= 1 - this.diseased;
  
    //health to max, dead stay dead
    for (var i=0;i<this.health.length;i++) { tempArray[i] = this.health[i]; this.health[i] = 0; }
    for (var h=1;h<=this.base.health;h++) {
      var newH = h + amount;
      if (newH >= this.base.health) newH = this.base.health;
      this.health[newH] += prob * tempArray[h];
    }
    for (var h=1;h<=this.base.health;h++) 
      this.health[h] += (1-prob) * tempArray[h];
    this.health[0] = tempArray[0];
  }
  //this.index, deck
}

function simCreateDeck(commander, assaults, nonAssaults, cardsToPlay){
  var deck = ({
      commander: new SimCard(commander),
      walls: new Array(),
      buildings: new Array(),
      assaults: new Array(assaults.length),
      actions: new Array(),
              
      cardsToPlay: new Array(cardsToPlay.length)
    });
  deck.commander.index = -1;
  deck.commander.deck = deck;
  for (var i=0;i<assaults.length;i++){
    deck.assaults[i] = new SimCard(assaults[i]);
    deck.assaults[i].index = i;
    deck.assaults[i].deck = deck;
  }  
  for (var i=0;i<nonAssaults.length;i++){
    var addTo = nonAssaults[i].building ? deck.buildings : deck.actions;
    var card = new SimCard(nonAssaults[i]);
    addTo.push(card);
    card.index = addTo.length-1;
    card.deck = deck;
    if (addTo == deck.buildings && card.skills["wall"]) deck.walls.push(card);
  }
  for (var i=0;i<cardsToPlay.length;i++){
    deck.cardsToPlay[i] = new SimCard(cardsToPlay[i]);
    deck.cardsToPlay[i].deck = deck;
  }

  deck.resetState = function(){
    this.commander.resetState();
    for (var i=0;i<this.assaults.length;i++) this.assaults[i].resetState();
    for (var i=0;i<this.buildings.length;i++) this.buildings[i].resetState();
  }
  
  deck.playCard = function(simCard){
    var card = simCard;
    card.deck = this;
    var addTo = null;
    if (card.assault) addTo = this.assaults;
    else if (card.building) {
      addTo = this.buildings;
      if (card.skills["wall"]) this.walls.push(card);
    } else addTo = this.actions;
    card.index = addTo.length;
    addTo.push(card);
    if (card.hasPlayedSkills) this.actions.push(card);
  }
  
  deck.playNextCard = function(){
    if (this.cardsToPlay.length == 0) return;
    var card = this.cardsToPlay[0];
    this.cardsToPlay = this.cardsToPlay.slice(1);
    this.playCard(card);
  }
  
  return deck;
}

var simRounds;
function sortForType(list, assaults, nonAssaults) {
  for (var i=0;i<list.length;i++) 
    if (list[i].assault) assaults.push(list[i]);
    else nonAssaults.push(list[i]);
}

var simulationResultFirstTurnDieProbability = null;
function simulation(attCommander, attCards, attCardsToPlay, defCommander, defCards, defCardsToPlay, maxRounds){
  simulationResultFirstTurnDieProbability = null;
  
  var attAssaults = new Array;
  var attNonAssaults = new Array;
  sortForType(attCards, attAssaults, attNonAssaults);

  var defAssaults = new Array;
  var defNonAssaults = new Array;
  sortForType(defCards, defAssaults, defNonAssaults);
    
  simEnemyDeck = simCreateDeck(defCommander, defAssaults, defNonAssaults, defCardsToPlay);
  simOwnDeck = simCreateDeck(attCommander, attAssaults, attNonAssaults, attCardsToPlay);

  //mylog("Initial commander health: " + simOwnDeck.commander.health + ": "+simOwnDeck.commander.health.average())
  
  if (!maxRounds) maxRounds = 50;
  //mylog("first cost: "+(simEnemyDeck.assaults[0]?simEnemyDeck.assaults[0].cost:"?"))
  for (simRounds = 0; simRounds < maxRounds; simRounds++){
    simDoubleTurn();
    if (simRounds == 0) {
      simulationResultFirstTurnDieProbability = simOwnDeck.commander.health[0];
      mylog(simOwnDeck.commander.health);
    }
    if (simEnemyDeck.commander.health.average() < 0.0000001) break;
    if (simOwnDeck.commander.health.average() < 0.0000001) break;
  }
}

function getUserCard(id){
  var c = null;
  if ((typeof id) == "number") c = getCard(id);
  else if ((typeof id) == 'string') c = getNamedCard(id);
  assert(c != null);
  return c;
}
function getUserCards(ids){
  for (var i=0;i<ids.length;i++) ids[i] = getUserCard(ids[i]);
  return ids;
}

function userSimulation(attCommander, attCards, attCardsToPlay, defCommander, defCards, defCardsToPlay, maxRounds){
  logSimulationResult = true;
  simulation(getUserCard(attCommander), getUserCards(attCards), getUserCards(attCardsToPlay), getUserCard(defCommander), getUserCards(defCards), getUserCards(defCardsToPlay), maxRounds);
}

function simulationScoreReal(cardA, cardB, cardC){
  var attCards = playedCards[false].filter(function(card){return card.combatid >= 0;});
  var defCards = playedCards[true].filter(function(card){return card.combatid >= 0;});
  
  var attCardsToPlay = [getCard(cardA)];
  var defCardsToPlay = new Array();
  if (defCards.length == 0) defCardsToPlay = [getCard(247)];
  else defCardsToPlay.push(getCard(defCards[defCards.length-1].cardid));
  
  if (cardB) {
    attCardsToPlay.push(getCard(cardB));
    defCardsToPlay.push(getCard(defCardsToPlay[defCardsToPlay.length-1].cardid));
  }
  if (cardC) {
    attCardsToPlay.push(getCard(cardC));
    defCardsToPlay.push(getCard(defCardsToPlay[defCardsToPlay.length-1].cardid));
  }
  
  simulation(playedCommanders[false], attCards, attCardsToPlay, playedCommanders[true], defCards, defCardsToPlay);
  
  var score = simOwnDeck.commander.health.average() -  simEnemyDeck.commander.health.average();
  
  
  
  var score = simOwnDeck.commander.health.average() / simOwnDeck.commander.base.health -  simEnemyDeck.commander.health.average() / simEnemyDeck.commander.base.health;
  if (score < -0.1) { 
    score += simRounds / 200.0;     
    for (var i=0;i<simOwnDeck.assaults.length;i++) score += (1-simOwnDeck.assaults[i].health[0]) * 0.040;
    for (var i=0;i<simOwnDeck.buildings.length;i++) score += (1-simOwnDeck.buildings[i].health[0]) * 0.020;
    for (var i=0;i<simEnemyDeck.assaults.length;i++) score -= (1-simEnemyDeck.assaults[i].health[0]) * 0.020;
    for (var i=0;i<simEnemyDeck.buildings.length;i++) score -= (1-simEnemyDeck.buildings[i].health[0]) * 0.010;
  } else if (score > 0.1) {
    score -= simRounds / 200.0;
    for (var i=0;i<simOwnDeck.assaults.length;i++) score += (1-simOwnDeck.assaults[i].health[0]) * 0.020;
    for (var i=0;i<simOwnDeck.buildings.length;i++) score += (1-simOwnDeck.buildings[i].health[0]) * 0.010;
    for (var i=0;i<simEnemyDeck.assaults.length;i++) score -= (1-simEnemyDeck.assaults[i].health[0]) * 0.040;
    for (var i=0;i<simEnemyDeck.buildings.length;i++) score -= (1-simEnemyDeck.buildings[i].health[0]) * 0.020;
  }

  mylog("Simscore: "+attCardsToPlay[0].name+": "+simOwnDeck.commander.health.average() + ":"+  simEnemyDeck.commander.health.average() + " at "+simRounds+ "   =>   "+score);

  //probability not to win (!= probability to lose i.e. to die)  }
  if (!cardC && simulationResultFirstTurnDieProbability != null)
    simulationResultFirstTurnDieProbability = 1 - simEnemyDeck.commander.health[0]; 

  return score;
  
}

function simulationScore(cardA, cardB, cardC){
  if (!cardB && !cardC) return 1;
  if (!cardC) return simulationScoreReal(cardA, cardB);
  var score1 = simulationScoreReal(cardA, cardB, cardC);
  var dieScore1 = simulationResultFirstTurnDieProbability;
  var score2 = simulationScoreReal(cardA, cardC, cardB);
  var dieScore2 = simulationResultFirstTurnDieProbability;
  if (score1 > score2) {
    simulationResultFirstTurnDieProbability = dieScore1;
    return score1;
  }
  return score2;
}


    //alert(simOwnDeck.assaults[0].health.average());

//alert(simEnemyDeck.assaults[0].health.average());}


//#################################################################################################
//#################################################################################################
//                                     END SIMULATOR END 
//#################################################################################################
//#################################################################################################

//score of cardA, when cardB and cardC may also be on the hand
function  orderedScore(cardA, cardB, cardC){
  if (!cardB && !cardC) return 1;
  for (var i=0;i<remainingOrderedCards.length;i++)
    if (remainingOrderedCards[i] == cardA) return -i;
  return -100;
}






var chooseResultNextTurnDieProbability = null;
function choosebestcard(){
  chooseResultNextTurnDieProbability = null;
  
  if (myDraws.length == 0)  return null;
  if (myDraws.length == 1)  return myDraws[0];
  
  var strategy = bbgr_id("strategy").value;
  var scoreFunction = strategy == "SIMULATOR" ? simulationScore : 
                      strategy == "ORDERED" ? orderedScore : 
                      cardScore;
  
  var best = 0; var score = scoreFunction(myDeck[""+myDraws[0]], myDeck[""+myDraws[1]], myDeck[""+myDraws[2]]); finalCardScore[myDraws[0]] = score;
  chooseResultNextTurnDieProbability = simulationResultFirstTurnDieProbability;
  for (var i=1;i<myDraws.length;i++) {
    var ns = scoreFunction(myDeck[""+myDraws[i]], myDeck[""+myDraws[i-1]], myDeck[""+myDraws[(i+1) %3]]);
    finalCardScore[myDraws[i]] = ns;
    if ((ns > score) 
        || ( ns == score && myDeck[""+myDraws[best]] * 1 >= 3000 ) //don't waste action card
    ) { 
      score = ns; 
      best = i; 
      chooseResultNextTurnDieProbability = simulationResultFirstTurnDieProbability;
    }
  }
  mylog("");
  return myDraws[best];
  
  //random
  if (window.currentBattleRound*1 > 3) return  myDraws[Math.floor(Math.random()*myDraws.length)];
  var chooseFrom = new Array();
  for (var i=0;i<myDraws.length;i++) 
    if (myDeck[""+myDraws[i]] * 1 < 3000) chooseFrom.push(myDraws[i]);
  if (chooseFrom.length == 0) return  myDraws[Math.floor(Math.random()*myDraws.length)];
  return  chooseFrom[Math.floor(Math.random()*chooseFrom.length)];
}

function targetCards(targets, func, params){
  if (!params) params = [];
  if ( typeof targets == "object" && targets.length) {
    for (var j=0;j<targets.length;j++) 
      if (existingCards[targets[j]])
        func.apply(existingCards[targets[j]], params);
  } else if (existingCards[targets]) {
    func.apply(existingCards[targets], params);
  }
  //else alert("missing card " + targets);
}

var currentBattleData, currentBattleTurns, currentTurn;
var playedCommanders, playedCards, playedAssaultCards, playedBuildingCards;

function battleEnded(data){
  if (data) {
    mylog(((data.winner==1)?"battle won":"battle lost") + choosenBattle+ ":"+choosenMission);
    updatestats(data);
    if (choosenBattle == MISSION) { 
      mylog("Money: "+data.money + " XP: " + data.xp); 
      if (choosenMission == "INCOMPLETE" && data.mission_info && data.mission_info.complete != "0") {
        incompleteMission = -1;
        user_mission_complete[basicMissions[choosenMission][2]] = "10";
        if (basicMissions[choosenMission][2] < LAST_MISSION_ID)
          user_mission_complete[basicMissions[choosenMission][2]*1 + 1] = "0";
        alert("mission complete");
      } 
    }
    if (choosenBattle == RAID) { mylog("Raid score: "+data.raid_info.raid_members[user_id].damage); }
    if (choosenBattle == QUEST) { 
      if (data.winner!=1) alert("QUEST LOST!");
      if (data.quest_info) {
        window.user_quest = data.quest_info;
        document.getElementById("QuestStepIdOption").textContent = "QUEST ("+data.quest_info.step_id+")";
        mylog("New quest: "+data.quest_info.step_id);
      }
    }
  }
  if (choosenBattle == FACTION_FIGHT || choosenBattle == FACTION_SURGE) {
    var act = data.war_info.attacker_faction_id == faction_id;
    var myPoints = (act?data.attacker_points:data.defender_points)*1;
    var enemyPoints = ((!act)?data.attacker_points:data.defender_points)*1;
    var add = "   Delta. "+ myPoints + "-" + enemyPoints + "=" + (myPoints - enemyPoints);
    var type = (choosenBattle == FACTION_FIGHT)?"Fight":"Surge";
    localStorage["War"+choosenWar+type+":WinPoints"] = localStorage["War"+choosenWar+type+":WinPoints"] * 1 + myPoints;
    localStorage["War"+choosenWar+type+":LostPoints"] = localStorage["War"+choosenWar+type+":LostPoints"] * 1 + enemyPoints;
    localStorage["War"+choosenWar+type+":"+(data.winner==1?"Wins":"Loses")] = localStorage["War"+choosenWar+type+":"+(data.winner==1?"Wins":"Loses")] * 1 + 1;
    add += "\n"+getBotScore(choosenWar); 
    jsonRequest("getFactionWarRankings", "faction_war_id="+choosenWar, function(data){
      for (fac in data.rankings) 
	for (r in data.rankings[fac]) 
	  if (data.rankings[fac][r].user_id == user_id)
	    showScore(data.rankings[fac][r],add);
      if (!bbgr_id("autorepeat").checked) 
        statuscomplete("battle");
    });
  } else statuscomplete("battle");
  if (choosenBattle == ARENA) {
    mylog("arena: rating change: "+data.rating_change + " total battles against players: "+((data.achievements.length > 0)?data.achievements[0].number:""));
    if (data.rating_change == 0 && (arenaFights % 5 != 0)) arenaFights += Math.floor((5 - arenaFights % 5) / 2);
  }
  if (bbgr_id("autorepeat").checked) {
    document.getElementById("status"+"battle").style.backgroundColor = "#FFFF00"; //statusreset("battle");
    if (choosenBattle != QUEST) setTimeout(combat, ((window.autopilot=="1")?6000:1000) * (Math.random() + 0.9) );
    else if (autoDoubleFight) setTimeout(autoFightQuest, 1000 * (Math.random() + 0.8));
    else if (choosenBattle != MISSION || incompleteMission != -1) setTimeout(autoFightMission, 1000 * (Math.random() + 0.8) );
  }
  
  if (!bbgr_id("realauto").checked) bbgr_id("choosebox").parentNode.style.display = "none";
}

function visualizeAttackValue(){
  var span = bbgr_id("attackmod" + this.combatid);
  var delta = this.berserked * 1; 
  if (this.status["attack_boost"]) delta += this.status["attack_boost"]*1;

//  alert(this.status["attack_boost"] + "=>" + delta);
  if (delta > 0) span.textContent = " + " + delta;
  else if (delta < 0) span.textContent = " - " + (-delta);
  else span.textContent = "";
  
}
function visualizeStatus(){
  var text = "";
  for (var c in this.status) {
    if (c == "attack_boost") continue;
    if (this.status[c] && this.status[c] != 1)  text += c + ": " + this.status[c] + "<br>";
    else text += c + "<br>";
  }
  bbgr_id("status" + this.combatid).innerHTML = text; 
}

function visualStatusChange(targets, status, value){
  if (status == "mimic"  || status == "mimic_skills" || status == "poisoner") return;

  targetCards(targets, function(){this.status[status] = value; /*alert(targets + "=>" +this + ":" + this.toSource());*/});
  if (status == "attack_boost") targetCards(targets, visualizeAttackValue);
  else targetCards(targets, visualizeStatus);
}

function visualizeBattle(){
  var data = currentBattleData;
  if (currentBattleTurns == null || currentBattleTurns.length == 0 || (invertedRoles && currentBattleTurns.length == 1 && !currentBattleTurns[0]["plays"])){ 
    if (data.winner != null) {
      battleEnded(data);
    } else {
      if (invertedRoles && currentBattleTurns.length == 1 && !currentBattleTurns[0]["plays"] && currentBattleTurns[0]["draws"]) 
        for (var i=0;i<currentBattleTurns[0]["draws"].length;i++)
          myDraws.push(currentBattleTurns[0]["draws"][i]);
      
      var surrender = false;
      if ((choosenBattle == FACTION_FIGHT || choosenBattle == FACTION_SURGE) && (chooseResultNextTurnDieProbability == null)) {
        var commanderdamage = myCommanderHealth -  existingCards[invertedRoles?"-2":"-1"].health;
        if (commanderdamage > 0 && commanderdamage + 1 > myCommanderHealth) surrender = true;
	else {
	  var enemycards = 0, mycards = 0;
          for (var c in existingCards) 
	    if (existingCards[c].cost <= 0){
              if (existingCards[c].enemy) enemycards++;
	      else mycards++;
	    }
	  if ((enemycards > mycards + 3) && (choosenBattle == FACTION_FIGHT || choosenBattle == FACTION_SURGE)) surrender = true;
	  //alert(commanderdamage+":"+myCommanderHealth+" :: "+mycards+"-"+enemycards);
	}
      }
      myCommanderHealth = existingCards[invertedRoles?"-2":"-1"].health;
      if (surrender) 
	if (!confirm("I think I'm losing. Shall I surrender?")) 
	  surrender=false;
      
      if (!surrender) setTimeout(updateBattle, 100+1000*Math.random());
      else jsonRequest("forfeitBattle", null, function(data){ battleEnded(data); mylog("surrendered") });
    }
    return;
  }
  var cur = currentBattleTurns.shift();

  var enemy = ((currentTurn % 2) == 0);
  if (invertedRoles) enemy = !enemy;
  
  for (var c in existingCards) {
    if (existingCards[c].enemy == enemy)  {
      var cc = existingCards[c];
      cc.tick();
      
      var scount = 0;
      for (var p in cc.status) { scount++; break; }
      if (scount) {
        var temp = cc.status["disease"];
        cc.status = new Object();
        if (temp) cc.status["disease"] = temp;
        visualizeStatus.call(cc);
      }
    }
  }

  if (cur.begin) 
    for (var i=0;i<cur.begin.length;i++)
      visualStatusChange("" + cur.begin[i].card_uid, cur.begin[i].status_flag, cur.begin[i].value);

  var summonedCardIds = [], summonedCurIds = [];

  if (cur.actions) {
    var acts = cur.actions;
    for (var i=0;i<acts.length;i++){
      var healingSkills = new Array("heal", "supply", "repair", /* ???: */ "regenerate", "refresh", "leech", "siphon", "legion");
      var attackSkills = new Array(0, "0", "counter", "strike", /* ???: */ "payback", "siege", "crush", "flurry");
      var unimportantSkills = new Array("weaken", "rally", "swipe", "jam", "evade", "mimic", "protect", "enfeeble", "berserk", "invigorate", "summon", "pierce_p", "fear", "valor", "immobilize", "cleanse", "chaos", "tribute", "burst", "augment", "emulate", "blitz", "pierce", "stun", 
       "intercept", "rush", "split",//?
                                        "freeze",  //TODO: freeze prevents unit tick down
                                        "poison", "sunder", "phase", "disease"
                                        //todo: disease
      );
      var targetHealChange = 0;
      if (attackSkills.contains(acts[i].skill_id)) targetHealChange = - acts[i].value;
      else if (healingSkills.contains(acts[i].skill_id)) targetHealChange = acts[i].value;
      else if (unimportantSkills.contains(acts[i].skill_id)); 
      else alert("unknown skill: "+acts[i].skill_id);

      if (acts[i].skill_id == "berserk" || acts[i].skill_id == "invigorate") {
        targetCards(acts[i].targets, function(){this.berserked+=acts[i].value*1;});
        targetCards(acts[i].targets, visualizeAttackValue);
      } else if (acts[i].skill_id == "summon" || acts[i].skill_id == "split") {
        if (acts[i].value != 1 || acts[i].targets.length != 1) alert("strange summon/split: "+acts[i].toSource());
        if (!cur.tokens) alert("no summon tokens");
        var id = -1;
        for (var j = 0; j < cur.tokens.length; j++) if (cur.tokens[j].uid == acts[i].targets[0]) { id = cur.tokens[j].card_id; break; }
        if (id == -1) alert("no summon/splut token: "+acts[i].toSource() + " "+cur.tokens.toSource());
        summonedCardIds.push(id);
        summonedCurIds.push(acts[i].targets[0]);
      } else if (acts[i].skill_id == "rush") {
        targetCards(acts[i].targets, function(){this.tick();});
      }
      
      if (acts[i].status) 
        for (var j=0;j<acts[i].status.length;j++) 
          visualStatusChange(""+acts[i].status[j][0], acts[i].status[j][1], acts[i].status[j][2]);      
      
      if (targetHealChange == 0) continue;
      targetCards(acts[i].targets, changehealth, [targetHealChange]);
    }
  }

  if (cur.end) 
    for (var i=0;i<cur.end.length;i++)
      visualStatusChange("" + cur.end[i].card_uid, cur.end[i].status_flag, cur.end[i].value);

  //poison
  if (cur.upkeep) {
    var acts = cur.upkeep;
    for (var i=0;i<acts.length;i++){
      if (acts[i].skill_id != "poison") continue;
      var targetHealChange = -acts[i].value;
      targetCards(acts[i].targets, changehealth, [targetHealChange]);
    }
  }
  
  var tokill = new Array();
  for (var c in existingCards) 
    if (existingCards[c].health <= 0) 
      tokill.push(c);

  for (var i=0;i<tokill.length;i++) {
    existingCards[tokill[i]].visual.parentNode.removeChild(existingCards[tokill[i]].visual);
    delete existingCards[tokill[i]];
  }
  
  if (cur.plays && cur.plays.length == 1 && cur.plays[0].length >= 1) 
    addcard(data.card_map[""+cur.plays[0][0]] % 10000, cur.plays[0][0]);
  for (var i=0;i<summonedCardIds.length;i++)
    addcard(summonedCardIds[i], summonedCurIds[i]);
    
  
//alert(cur.draws)
  if (cur.draws && !invertedRoles) {
    for (var i=0;i<cur.draws.length;i++) {
      if (cur.draws[i] < 100 )
        myDraws.push(cur.draws[i]);
    }
  }  

//alert(cur.currentTurn)
  currentTurn++;
  
  setTimeout(visualizeBattle, 1000);
  
  playedCards[true] = playedCards[true].filter(function(c){return c.health > 0;});
  playedCards[false] = playedCards[false].filter(function(c){return c.health > 0;});
  playedBuildingCards[true] = playedBuildingCards[true].filter(function(c){return c.health > 0;});
  playedBuildingCards[false] = playedBuildingCards[false].filter(function(c){return c.health > 0;});
  playedAssaultCards[true] = playedAssaultCards[true].filter(function(c){return c.health > 0;});
  playedAssaultCards[false] = playedAssaultCards[false].filter(function(c){return c.health > 0;});
}

function visualizeDraws(){
  var data = currentBattleData;
  var oldbox = document.getElementById("choosebox");
  if (oldbox) {
    oldbox.style.display="block";
    oldbox.parentNode.style.display = "block";
  } else {
    var box = bbCreateElement("div", {style: "position: fixed; left:300px; top:400px; border:3px solid gray; width: 250px", id: "movebox"});
    var temp = bbCreateElementWithText("div", "Cards", {style:"background-color: blue; text-align:center; color: yellow"});
    temp.addEventListener("mousedown", function(e){dragStart(e,box)}, false);
    var surrenderbtn = bbCreateElementWithText("div", "Surrender", {style:"position: absolute; right: 0; top:0; font-size: 75%; background-color: red; color: yellow; border: 2px solid orange"});
    surrenderbtn.addEventListener("click", function(e){
      forceSurrender = true; 
      if (confirm("Surrender?")) { jsonRequest("forfeitBattle", null, function(data){ battleEnded(data); mylog("surrendered") }); bbgr_id("choosebox").style.display = "none"; } 
      else { forceSurrender = false; setTimeout(playCard, 3000); }
    }, false);
    temp.appendChild(surrenderbtn);
    box.appendChild(temp);
    oldbox = bbCreateElement("div", {id: "choosebox"});
    box.appendChild(oldbox);
    bbgr_id("botinterface").parentNode.appendChild(box);
  } 
  oldbox.innerHTML = "<ul style='background-color:#333333'></ul>";
  var ul = oldbox.firstChild;
  for (var i=0;i<myDraws.length;i++) {
    var visual = createVisualCard(myDeck[""+myDraws[i]], myDraws[i]);
    if (myDraws[i] == bestCard) visual.style.border = "1px solid green";
    else visual.style.border = "1px solid red";
    visual.addEventListener('click', (function(id){return function(){
      bestCard = id;
      var c = oldbox.firstChild.childNodes;
      for (var j = 0; j < c.length; j++) 
        c[j].style.border = "1px solid red";
      this.style.border = "1px solid green";
    }})(myDraws[i]), false);
    
    ul.appendChild(visual);
  }
}

function updateBattle(){
  bestCard = choosebestcard();
  if (bestCard == null) {
    alert("failed to get draws");
    return;
  }
  if ((!( bestCard > 0 && bestCard < 20) && !invertedRoles) ||
      (!( bestCard > 100 && bestCard < 120) && invertedRoles) 
  ) {
    alert("invalid card "+bestCard);
    return;
  }
  visualizeDraws();
  setTimeout(playCard, 3000);
} 
function playCard(){
  if (forceSurrender) return; 
    
  if (chooseResultNextTurnDieProbability > 0.66 &&
      (choosenBattle == FACTION_FIGHT || choosenBattle == FACTION_SURGE)
     // && confirm("May I surrender? The probability to lose is "+(chooseResultNextTurnDieProbability*100)+"%")
      ) {
    jsonRequest("forfeitBattle", null, function(data){ battleEnded(data); mylog("surrendered") });
    return;
  }
    
  bbgr_id("choosebox").style.display = "none";
  var newdraws = new Array();
  for (var i=0;i<myDraws.length;i++) if (myDraws[i] != bestCard) newdraws.push(myDraws[i]); 
  myDraws = newdraws;
//  alert(myDraws);

  var cardobj = getCard(myDeck[""+bestCard]);

  if (bbgr_id("strategy").value == "ORDERED") 
    for (var i=0;i<remainingOrderedCards.length;i++)
      if (remainingOrderedCards[i] == cardobj.cardid) {
        remainingOrderedCards.splice(i, 1);
        break;
      }
  

  //mylog("Play card: "+myDeck[""+card] + " "+(cardobj?cardobj.name:""));
 // addcard(myDeck[""+card], card).cost++;
  jsonRequest("updateBattle", "uid="+bestCard, function(data){
    if (data.result && data.result == "false") {
      alert(data.error_message);
      return;
    }
    if (!data.turn) {
      alert("no turns");
      alert(data.result);
    }
    window.currentBattleRound++;
    currentBattleData = data;
    currentBattleTurns = new Array();
    currentTurn = -1;
    for (var t in data.turn) {
      if (currentTurn == -1) currentTurn = t;
      currentBattleTurns.push(data.turn[t]);
    }
/*    var reset = function(c) { c.status = new Object(); visualizeStatus.call(c); visualizeAttackValue.call(c); }
    for (var i=0;i<playedCards[true].length;i++)  reset(playedCards[true][i]);
    for (var i=0;i<playedCards[false].length;i++) reset(playedCards[false][i]);*/
    visualizeBattle();    
  });
}







function changeDeckInternal(deckId, commander_id, cards, contWith){
  //{"1":{"deck_id":"1","name":null,"commander_id":"1045","cards":{"500":"7","2012":"3"}},"2":{"deck_id":"2","name":null,"commander_id":"1021","cards":{"103":"1","139":"1","166":"1","225":"1","247":"1","345":"1","524":"1","633":"1","3004":"2"}}
  var deck = user_decks[deckId];

  function mergeResult(answer){
    if (answer.deck_data) {
      deck = answer.deck_data;
      user_decks[deckId] = deck; 
    }
    if (answer.deck_cards) 
      for (var id in answer.deck_cards) 
        user_cards[id] = answer.deck_cards[id];
        
    return answer.result && answer.deck_id == deckId;
  }
  function addCard(cardId, contWith){
    jsonRequest("addCardDeck", "card_id="+cardId+"&deck_id="+deckId, function(data){
      if (mergeResult(data)) setTimeout(contWith, 700);
      else alert("failed to add card "+cardId+" "+getCard(cardId).name+" to deck "+deckId);
    });
  }
  function removeCard(cardId, contWith){
    jsonRequest("removeCardDeck", "card_id="+cardId+"&deck_id="+deckId, function(data){
      if (mergeResult(data)) setTimeout(contWith, 100);
      else alert("failed to remove card "+cardId+" "+getCard(cardId).name+" to deck "+deckId);
    });
  }
  
  function process(){
    if (active_deck != deckId) {
      selectDeck(deckId, process);
      return;
    }
  
    if (deck.commander_id != commander_id) {
      if (!user_cards[commander_id] || user_cards[commander_id].num_owned == 0) alert("no commander: "+commander_id); 
      else if (user_cards[commander_id].num_owned == user_cards[commander_id].num_used) {
        for (var d in user_decks)
          if (d != deckId && user_decks[d].commander_id == commander_id) {
            changeDeckInternal(d, 1000, user_decks[d].cards, process);
            return;
          }
      } else addCard(commander_id, process);
      return;
    }

    if (!Array.isArray(deck.cards)) //empty is [] instead of {}
      for (var card in deck.cards) 
        if (!cards[card] || deck.cards[card] * 1 > cards[card] ){
          removeCard(card, process)
          return;
        }
        
   // alert(cards);
    if (!Array.isArray(cards))
      for (var card in cards) 
        if ((cards[card]*1 > 0) && (!deck.cards[card] || deck.cards[card] * 1 < cards[card] )){
          if (!user_cards[card] || user_cards[card].num_owned == 0) alert("no card: "+card); 
          else if (user_cards[card].num_owned == user_cards[card].num_used) {
            for (var d in user_decks)
              if (d != deckId && user_decks[d].cards[card]) {
                var newCards = JSON.parse(JSON.stringify(user_decks[d].cards));
                var alreadyThere = deck.cards[card] ? deck.cards[card] * 1 : 0;
                var missingCards = (cards[card] - alreadyThere) - (user_cards[card].num_owned - user_cards[card].num_used);
                if (newCards[card] * 1 <= missingCards) delete newCards[card];
                else newCards[card] = newCards[card] - missingCards;
                changeDeckInternal(d, user_decks[d].commander_id, newCards, process);
                return;
              }
          }
          addCard(card, process)
          return;
        }
        
    if (contWith) contWith();
    else alert("complete");
  }
  process();
}

function verboseDeckToCardList(deckId, verboseDeck, contWith){
  if (!deckId) deckId = window.active_deck;
  if (!deckId) deckId = 1;
  var commander_id = user_decks[deckId].commander_id; 
  var cards = [];
  if (Array.isArray(verboseDeck)){
    cards = verboseDeck;
  } else if(typeof verboseDeck == "object"){
    if (verboseDeck.commander_id) commander_id = verboseDeck.commander_id;
    if (!verboseDeck.cards) alert("what is this: "+verboseDeck.toSource());
    for (var c in verboseDeck.cards)
      for (var i=0;i<verboseDeck[c].length;i++)
        cards.push(c);
  } else if (typeof verboseDeck == "string") {
    if (verboseDeck.contains("tyrant.40in.net") &&  verboseDeck.contains("deck.php?nid=")) { 
      verboseFansiteDeckToCardList(deckId, verboseDeck, contWith); return; 
    }
    verboseDeck = verboseDeck.replace("http://", "");
    verboseDeck = verboseDeck.replace("tyrant.40in.net/kg/deck.php?id=", "");
    verboseDeck = verboseDeck.replace("tyrant.40in.net/Kg/deck.php?id=", "");
    verboseDeck = verboseDeck.replace("tyrant.40in.net/deck.php?id=", "");
    var verboseDeckSplit = [];
    if (verboseDeck.contains(";")) verboseDeckSplit = verboseDeck.split(";");
    else if (verboseDeck.contains(",")) verboseDeckSplit = verboseDeck.split(",");
    else if (verboseDeck.contains(" ")) verboseDeckSplit = verboseDeck.split(" ");
    else alert("???: "+verboseDeck);
    for (var i=0;i<verboseDeckSplit.length;i++) {
      var card = verboseDeckSplit[i].trim();
      if (card*1 == card) cards.push(card*1);
      else if (getNamedCard(card)) cards.push(getNamedCard(card).cardid);
      else if (!isNaN(parseInt(card))){
        var count = parseInt(card);
        var id = card.substring((count+"").length).trim();
        if (id*1 == id) id = id*1;
        else if (getNamedCard(id)) id = getNamedCard(id).cardid;
        for (var j=0;j<count;j++) cards.push(id);
      }
    }
  } else alert("wth is "+verboseDeck);
  var tempcards = cards;
  cards = [];
  for (var i=0;i<tempcards.length;i++) 
    if (tempcards[i] % 10000 >= 1000 && tempcards[i] % 10000 <= 1999 ) commander_id = tempcards[i];
    else cards.push(tempcards[i]);
  contWith(deckId, commander_id, cards);
  return;
}

function changeDeck(deckId, verboseDeck, contWith){
  verboseDeckToCardList(deckId, verboseDeck, function(deckId, commander_id, cards){
    var cardobj = {};
    for (var i=0;i<cards.length;i++) 
      if (cardobj[cards[i]]) cardobj[cards[i]] = cardobj[cards[i]] + 1;
      else cardobj[cards[i]] = 1;
    changeDeckInternal(deckId, commander_id, cardobj, contWith);
  })
}

function changeToFansiteDeck(deckId, verboseDeck, contWith){
  GM_xmlhttpRequest({
    "method": "GET",
    onload: function(response){
      var result = [];
      /*var responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
      for (var i=0;i<10;i++) {
        var a = responseXML.getElementById("cc"+i);
        if (a) result.push(a.getAttribute("d:id"))
      }
      var scripts = responseXML.getElementsByTagName("script");*/
      if (result.length == 0) result = JSON.parse(/addcards *[(](([^)]+))/.exec( /*(scripts[scripts.length-1].textContent*/ response.responseText)[1])
      if (result.length == 0) {alert("failed:" +verboseDeck); }
      else {
        verboseDeckToCardList(deckId, result, contWith);
      }
    },
    url: verboseDeck
  });
}


function getCardsFromDeckHash(nid, ordered) {
    if (typeof(nid) != 'string' || nid == '') return [];
    var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var f1 = function(id) {
        var i = base64.indexOf(id);
        if (id === -1) return 0;
        return i;
    }
    if (typeof(ordered) == 'undefined') ordered = true;
    var f2 = function(id) {
        return f1(id.charAt(0)) * 64 + f1(id.charAt(1));
    }
    if (m = nid.match(/=(.*?)$/)) {
        nid = m[1];
    }
    var _4000 = '-';
    var cards = [];
    var card = '';
    var p4000 = false;
    while (nid.length > 0) {
        var ch = nid.substr(0, 1);
        var nid = nid.substr(1);
        if (ch != _4000 && base64.indexOf(ch) == -1) {
            // unknown symbol
            p4000 = false;
            card = '';
            continue;
        }
        if (ch == _4000) {
            p4000 = true;
            card = '';
            continue;
        }
        card = card + '' + ch;
        if (card.length == 2) {
            var cid = f2(card);
            if (cid > 4000) { // multiplier
                var cnt = cid - 4000;
             //   if (!cardsFullData.hasOwnProperty(cid)) continue; // unknown card
                if (cnt > 10) cnt = 10; // no more than 10 copies for each card
                var size = cards.length;
                if (size != 0) {
                    cid = cards[size - 1];
                    for (var i = 1; i < cnt; i++) {
                        cards.push(cid);
                    }
                }
            } else {
                if (p4000) cid += 4000;
              //  if (!cardsFullData.hasOwnProperty(cid)) continue; // unknown card
                cards.push(cid);
            }
            p4000 = false;
            card = '';
        }
    }
    if (!ordered) cards.sort(function(a, b){return(a-b);});
    var res = [], legendary = false, uniq = [], com = false;
    l = cards.length;

    for (i = 0; i < l; i++) {
        if (cards[i] >= 1000 && cards[i] < 2000) {
            if (com) continue;
            com = true;
            res.unshift(cards[i]);
            continue;
        }
        var cid = cards[i];
      /*  if (!cardsFullData.hasOwnProperty(cid)) {
            console.log('unknown cardId [' + cid + ']');
            continue;
        }
        var card = cardsFullData[cid];
        if (card.rarity == 4) {
            if (legendary) continue;
            legendary = true;
        } else if (card.unique) {
            if (uniq.hasOwnProperty(cid)) continue;
            uniq[cid] = true;
        }*/
        res.push(cid);
    }
    return res;
}

function filterToOwnedCards(list){
  var needed = {};
  for (var i=0;i<list.length;i++)
    if (needed[list[i]]) needed[list[i]] = needed[list[i]] + 1;
    else needed[list[i]] = 1;
    
  var missingCards = 0;
  for (var i in needed) 
    needed[i] = Math.min(needed[i], user_cards[i]?user_cards[i].num_owned:0);
  
  var res = [];
  for (var i=0;i<list.length;i++) {
    if (needed[list[i]] > 0) {
      res.push(list[i]);
      needed[list[i]] -= 1;
    }
  }
  return res;
}

function getFansiteMissionInfo(missionId, contWith){
  GM_xmlhttpRequest({
      "method": "GET",
      url: "http://tyrant.40in.net/kg/mission.php?id=" + missionId,
      onload: function(response){
        var energy = /<td +class="energy"> *([0-9]+)/.exec(response.responseText)[1];
        var location = /<td>([^<>]+)<.td><td +class="gold">/.exec(response.responseText)[1];
        var locmap = {"Cyprion": 3, "Lockeheart": 44, "Xeno Drilling Fields": 45, "Arctis": 2};
        if (!locmap[location]) {alert("unknown location!: "+location+ " for mission "+missionId); return;}
        location = locmap[location];
        //;}},"comments
        //var data = JSON.parse("[" + /tfSuggestDeck *[(](([^")]+|"([^"]|[\\]")*")+)[)];/.exec( response.responseText)[1] + "]");
         
        //alert(  /tfSuggestDeck *[(](.*)[)];}} *, *"comments/.exec( response.responseText));
        var data = JSON.parse("[" + /tfSuggestDeck *[(](.*)[)];}} *, *"comments/.exec( response.responseText)[1] + "]");
        var cards = data[0];
        var bestDeck = [];
        var bestScore = 0.5;
        var bestCover = 0;
        for (var id in cards) {
          var simScore = 0; var simTests = 0;
          for (s in cards[id].sim) {
            simScore += cards[id].sim[s].battlesWon / cards[id].sim[s].battlesTotal;
            simTests += 1;
          }
          simScore = simScore / simTests;
          if (simScore < bestScore) continue;
          var deck = getCardsFromDeckHash(cards[id].sid, true);
          var ownedDeck = filterToOwnedCards(deck);
          if (ownedDeck.length == 0 || ownedDeck[0] != deck[0]) continue; //need commander
          simScore = simScore - 0.5 * (deck.length - ownedDeck.length) / deck.length;
          if (deck.length == ownedDeck.length ||
              simScore > bestScore ) {
              bestScore = simScore;
              bestDeck = ownedDeck;
          } 
        };
        if (bestScore == 0.5) { alert("No good deck for mission "+missionId); return; }
        contWith(bestDeck, energy, location);
     }
 });
}




//var injectJS = document.createElement("script");injectJS.innerHTML = createBotObject.toSource();
var inject = document.createElement("div");
inject.style.backgroundColor = "#222222";
inject.innerHTML =
'<div style="position:relative" id="botinterface">'+
'</div>'+
'<div style="" >'+
'<textarea id="bbhigheventlog" style="height:7.5em"  cols=80 rows=7></textarea><div id="wars"></div>'+
'<div id="battleview" class="battleview"></div>'+
'eval: <textarea id="evalbox" cols=80 rows=25>alert("test");</textarea>'+
'<br><button id="evalbutton">eval</button> <br><br><button id="fansitebutton">fansite</button><br>'+
//'<textarea id="bbloweventlog" cols=150 rows=30></textarea>'+
'</div>';



window.bbCreateElement = function(el, attribs){
  var tmp = document.createElement(el);
  for (var a in attribs) 
    tmp.setAttribute(a, attribs[a]);
  return tmp;
} 
window.bbCreateElementWithText = function(el, text, attribs){
  var tmp = document.createElement(el);
  tmp.appendChild(document.createTextNode(text));
  for (var a in attribs) 
    tmp.setAttribute(a, attribs[a]);
  return tmp;
} 
window.bbCreateElementWithChild = function(el, child){
  var tmp = document.createElement(el);
  tmp.appendChild(child);
  return tmp;
} 
window.bbCreateElementWithAttribute = function(el, name, value){
  var tmp = document.createElement(el);
  tmp.setAttribute(name, value);
  return tmp;
} 
window.bbAddClick = function(click, el) {
  el.onclick = click;
  return el;
}
window.bbSetAttrib = function(el, name, value){
  el.setAttribute(name, value);
  return el;
}

window.bbButton  = function(text, onclick, id) {
  var res = bbCreateElementWithText("button", text);
  res.addEventListener('click', onclick, false);
  if (id) res.id = id;
  return res;
}

function statusElement(id){
  var res = bbCreateElementWithAttribute("span", "id", "status"+id);
  res.style.backgroundColor = "red";
  res.style.paddingLeft="8px";
  res.style.margin="5px";
  return res;
}

function statuscomplete(id) {
  document.getElementById("status"+id).style.backgroundColor = "green";
}
function statusreset(id) {
  document.getElementById("status"+id).style.backgroundColor = "#FF8800";
}

function removeAutoTimer(){ 
  var btn = bbg_id("autoTimer"); 
  if (btn)
    btn.parentNode.removeChild(btn); 
}

document.getElementsByTagName("body")[0].appendChild(inject);

document.getElementById("evalbutton").addEventListener('click',function(){eval(document.getElementById("evalbox").value);}, false);

document.getElementById("fansitebutton").addEventListener('click',function(){
  if (!localStorage["myfansite"]) localStorage["myfansite"] = prompt("fansite login");
  else  window.open(localStorage["myfansite"],'_newtab');
}, false);



var interface = document.getElementById("botinterface");
interface.appendChild(statusElement("cards"));
interface.appendChild(statusElement("init"));
interface.appendChild(statusElement("faction"));
interface.appendChild(statusElement("factionwars"));
interface.appendChild(statusElement("battle"));
statuscomplete("battle");

interface.appendChild(bbButton("normal", function() { 
  var applet = bbg_id("clientApp");
  if (applet) {
    applet.parentNode.removeChild(applet);
    bbgr_id("flashswitch").textContent = "normal";
  } else {
    flashparent.innerHTML = flashbackup;
    bbgr_id("flashswitch").textContent = "off";
  }
}, "flashswitch"));
interface.appendChild(bbButton("news", function() { getFactionNews(); } ));
interface.appendChild(bbButton("chat", function() { getFactionChat(); } ));
interface.appendChild(bbButton("wars", function() { getFactionWars(); } ));
interface.appendChild(bbButton("auto", function() { autoFight();  } ));
interface.appendChild(bbButton("fight", function() { combat(); } , "combat"));
//interface.appendChild(bbButton("choose mission 107", function() { choosenBattle = MISSION; choosenMission = 107; bbgr_id("combat").innerHTML = "Fight "+choosenMission; }));
var sel = document.createElement("select");
sel.appendChild(bbCreateElementWithText("option", "choose mission", {value: "0"}));
sel.appendChild(bbCreateElementWithText("option", "arena", {value: "arena"}));
sel.appendChild(bbCreateElementWithText("option", "arena self", {value: "arenaself"}));

var lastMission = "";
for (var i in basicMissions) {
  sel.appendChild(bbCreateElementWithText("option", i + (basicMissions[i][3] ? " ("+basicMissions[i][3]+")" : ""), {value: i}));
  lastMission = i;
}
sel.id = "missionchooser";
sel.addEventListener('change', function(){ 
  if (bbgr_id("missionchooser").value == "arena") {choosenBattle = ARENA; bbgr_id("combat").innerHTML = "Fight arena";}
  else if (bbgr_id("missionchooser").value == "arenaself") {choosenBattle = ARENASELF; bbgr_id("combat").innerHTML = "Fight self";}
  else if (bbgr_id("missionchooser").value.contains("RAID:")) {choosenBattle = RAID; choosenRaid = /[0-9]+/.exec(bbgr_id("missionchooser").value); bbgr_id("combat").innerHTML = "Raid "+choosenRaid;}
  else if (bbgr_id("missionchooser").value.contains("QUEST:")) { choosenBattle = QUEST; }
  else {
    var mission = bbgr_id("missionchooser").value;
    if (mission.length > 0) {  choosenBattle = MISSION; choosenMission = mission; choosenMissionOld=mission; bbgr_id("combat").innerHTML = "Fight "+choosenMission; } 
  }
}, false);
sel.selectedIndex = sel.options.length - 1; choosenBattle = MISSION; choosenMission = lastMission; choosenMissionOld=choosenMission;
interface.appendChild(sel);

interface.appendChild(bbCreateElement("input", {id: "autorepeat", type: "checkbox", checked: true}));
interface.appendChild(document.createTextNode("autorepeat"));
interface.appendChild(bbCreateElement("input", {id: "realauto", type: "checkbox"}));
interface.appendChild(document.createTextNode("real auto"));
var sel = bbCreateElement("select", {id: "strategy"});
sel.appendChild(bbCreateElementWithText("option", "SIMULATOR", {value: "SIMULATOR"}));
sel.appendChild(bbCreateElementWithText("option", "ORDERED", {value: "ORDERED"}));
sel.appendChild(bbCreateElementWithText("option", "CARDSCORE", {value: "CARDSCORE"}));
interface.appendChild(sel);
interface.appendChild(bbButton("auto timer: 30", removeAutoTimer , "autoTimer"));
interface.appendChild(document.createElement("br"));
interface.appendChild(bbCreateElementWithText("span", "?", {id: "staminaspan"}));
interface.appendChild(document.createTextNode("/"));
interface.appendChild(bbCreateElementWithText("span", "?", {id: "maxstaminaspan"}));
interface.appendChild(document.createTextNode("  "));
interface.appendChild(bbCreateElementWithText("span", "?", {id: "energyspan"}));
interface.appendChild(document.createTextNode("/"));
interface.appendChild(bbCreateElementWithText("span", "?", {id: "maxenergyspan"}));


sel = document.createElement("select");
sel.id = "deckchooser"
interface.appendChild(sel);
sel.addEventListener('change', function(){ selectDeck(bbgr_id("deckchooser").value * 1); } );
sel = document.createElement("select");
sel.id = "deckchooser1"
interface.appendChild(sel);
sel = document.createElement("select");
sel.id = "deckchooser2"
interface.appendChild(sel);

interface.appendChild(document.createElement("br"));
interface.appendChild(document.createTextNode("att deck: "));
interface.appendChild(bbCreateElement("input",  {id: "attDeckId", size: 5, value: "4"}));
interface.appendChild(bbCreateElement("input",  {id: "attDeckCards", size: 50, value: "http://tyrant.40in.net/kg/deck.php?id=1049,73,106,136,173,606,624,716,933,964,4043"}));

//that is also not bad: http://tyrant.40in.net/deck.php?id=1152;105;143;260;495;981;2023;2081;2149;4012;4126
//(raider rally)

interface.appendChild(document.createElement("br"));
interface.appendChild(document.createTextNode("def deck: "));
interface.appendChild(bbCreateElement("input",  {id: "defDeckId", size: 5, value: defaultDefenseDeckId}));
interface.appendChild(bbCreateElement("input",  {id: "defDeckCards", size: 50, value: defaultDefenseDeck}));
//previously: http://tyrant.40in.net/deck.php?id=1248;200;769;776;826;965;983;2083;2088;2110;4032 same except blitz,rally2op, card instead summon fortress

interface.appendChild(document.createElement("br"));
interface.appendChild(document.createTextNode("mis deck: "));
interface.appendChild(bbCreateElement("input",  {id: "misDeckId", size: 5, value: defaultMissionDeckId}));
interface.appendChild(bbCreateElement("input",  {id: "misDeckCards", size: 50, value: defaultMissionDeck}));

var head = document.getElementsByTagName("head")[0];
var ele = head.appendChild(window.document.createElement("style"));
ele.innerHTML = "#botinterface {color: white}"+
                ".battleview ul{ list-style-type: none; padding-left: 0px; white-space:nowrap; font-size: 10px; color: white; min-height: 100px} " + 
                ".battleview ul li {display: inline-block; width: 80px; text-align: center}"+
                "#choosebox ul{list-style-type: none; padding-left: 0px; white-space:nowrap; font-size: 10px; color: white;}" +
                "#choosebox ul li {display: inline-block; width: 80px; text-align: center}" +
                "img.legendary {border: 1px solid #BB00BB}"+
                "img.rare {border: 1px solid #888800}"+
                "img.uncommon {border: 1px solid #888888}"+
                "img.common {border: 1px solid black}" +
                "#choosebox div.played { text-decoration: underline; font-style: italic }" +
                ".battleview div.played { color: black; }"+
                "div.died { text-decoration: line-through; }"
                ;
//document.getElementsByTagName("head")[0].appendChild(injectJS);

bbgr_id("realauto").checked = false;

setInterval(function(){
  autoFight();
}, 50*60*1000);

var t = function(){
  var btn = bbg_id("autoTimer");
  if (!btn) return;
  var time = /-?[0-9]+/.exec(btn.textContent)[0] - 1;
  btn.textContent = "auto timer: "+time;
  if (time <= -1) autoFight();
  else setTimeout(t, 1000);
};
setTimeout(t, 1000);

}




init();
