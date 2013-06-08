var bbfirefoxthings = function () {
//	var regexAlphaNumber = /^[0-9]+$/;
	var allowedIframeAccessOverride = ["http://www.kongregate.com/games/kingk/dream-world","http://www.kongregate.com/games/synapticon/tyrant"];
//	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		/*init : function () {
		},
			
		run : function () {
			var head = content.document.getElementsByTagName("head")[0],
				style = content.document.getElementById("link-target-finder-style"),
				allLinks = content.document.getElementsByTagName("a"),
				foundLinks = 0;
			
			if (!style) {
				style = content.document.createElement("link");
				style.id = "link-target-finder-style";
				style.type = "text/css";
				style.rel = "stylesheet";
				style.href = "chrome://linktargetfinder/skin/skin.css";
				head.appendChild(style);
			}	
						
			for (var i=0, il=allLinks.length; i<il; i++) {
				elm = allLinks[i];
				if (elm.getAttribute("target")) {
					elm.className += ((elm.className.length > 0)? " " : "") + "link-target-finder-selected";
					foundLinks++;
				}
			}
			if (foundLinks === 0) {
				alert("No links found with a target attribute");
			}
			else {
				alert("Found " + foundLinks + " links with a target attribute");
			}	
		}*/
		init: function(){
		//alert(opener);
			var gDocument = document;
			if (!gDocument) return;

			var appcontent = document.getElementById("appcontent");   // browser
			if (appcontent)
	      			appcontent.addEventListener("DOMContentLoaded", bbfirefoxthings.onPageLoad, true);

			document.addEventListener("BBIFrameAccessOverrideEvent", function(e) { bbfirefoxthings.BBIFrameAccessOverrideEvent(e); }, false, true);							//gBrowser.addEventListener("load", function () {
			//alert(e.sender);
				//window.alert = function(m) { if (!window.confirm(m)) var kill = NONEXISTINGVARIABLExxxxKILLxxxKILL; }
			//	alert("wtf?");
			//}, false);

			//Remove ctrl+q shortcut
			gDocument.getElementById("key_quitApplication").setAttribute("command", "");

	
			//Save alert on XUL level (doesn't affect pages => greasemonkey)
			window.alert = function(m) { if (!window.confirm(m)) var kill = NONEXISTINGVARIABLExxxxKILLxxxKILL; }
			//alert(gDocument.getElementById("key_quitApplication").getAttribute("command"));
			//alert(cmd_quitApplication);
		},
		
		onPageLoad: function(e){
//var doc = e.originalTarget; // doc is document that triggered "onload" event
			//if (doc.nodeName != "#document") return;
			//var temp=document.createElement("script");
			//temp.appendChild(document.createTextNode("window.alert=function(m){if (!confirm(m)) var kill=ZZAGDUIADJALDJALD; }"));
			//doc.getElementsByTagName("body")[0].appendChild(temp);
			//alert(window.top.getBrowser().selectedBrowser.contentWindow.alert); window.content.document.defaultView.wrappedJSObject.testFunction();
			//alert(
			//document.defaultView.alert = function(m){if (!confirm(m)) var kill=ZZAGDUIADJALDJALD; };
		},
		
		run: function(){
			var javascript = prompt("Eval: ");
			eval(javascript);
		},
		
		BBIFrameAccessOverrideEvent: function(evt) {
			if (allowedIframeAccessOverride.indexOf(content.document.documentURI) == -1) {
				alert("Attention: Invalid iframe access override from "+content.document.documentURI+" for \n"+
				      "            "+evt.target.getAttribute("iframeid")+"\n"+
				      "            "+evt.target.getAttribute("targetid")+"|"+evt.target.getAttribute("targettagname")+"["+evt.target.getAttribute("targetnr")+"]\n"+
				      "            "+evt.target.getAttribute("attrib")+"="+ evt.target.getAttribute("value"));
				return;
			}
			var doc = content.document;
			if (doc == null) {alert("no doc"); return;}
			var iframe = doc.getElementById(evt.target.getAttribute("iframeid"));
			var target;
			if (evt.target.getAttribute("targetid") != "" && evt.target.getAttribute("targetid") != null) {
				//alert("1");
				target = iframe.contentDocument.getElementById(evt.target.getAttribute("targetid"));
			} else if (evt.target.getAttribute("targetnr") != "" && evt.target.getAttribute("targetnr") != null){
				//alert("2:"+iframe.contentDocument+":"+iframe.contentDocument.getElementsByTagName(evt.target.getAttribute("targettagname")));
				target = iframe.contentDocument.getElementsByTagName(evt.target.getAttribute("targettagname"))[1*evt.target.getAttribute("targetnr")];
			} else alert("no target given");
			target.setAttribute(evt.target.getAttribute("attrib"), evt.target.getAttribute("value") );
		}
	};
}();
window.addEventListener("load", bbfirefoxthings.init, false);


//https://developer.mozilla.org/en/Working_with_windows_in_chrome_code
//window.getElementById("mainKeyset").getElementById("key_quitApplication").command = "";
/*
function onLoad(){alert("onLoad");}

function init(target) {
alert(target);
 if(!target) return;
 gDocument = target.document;
 alert("x");
alert(gDocument); 
alert(gDocument.getElementById("key_quitApplication"));
 gDocument.getElementById("key_quitApplication").command = "";
}

init(window.opener); 
alert("test");*/
