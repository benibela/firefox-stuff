// ==UserScript==
// @name           alertremover
// ==/UserScript==

var inject = document.createElement("script");
inject.innerHTML="window.alert = function(m) { if (!confirm(m)) var kill=asdsadapfksaoOPSFKPASKOPFS; }"
document.getElementsByTagName("body")[0].appendChild(inject);


document.title = document.title + " - " + document.URL;
//alert(document.title + " - " + document.URL);
setTimeout(function(){ if (document.title.indexOf(document.URL) < 0) document.title = document.title + " - " + document.URL; }, 1000);


//alert(ccache(1467634,2862376,"d89e3cb1d50dea8f3ca9aeb8d8c0f47b"));