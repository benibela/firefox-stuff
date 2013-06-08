// ==UserScript==
// @name           daily wtf comment revealer
// @namespace      ?
// @include        http://thedailywtf.com/Articles/*
// ==/UserScript==
var art = document.getElementsByClassName("ArticleBody")[0]
if (art) {
  art.innerHTML = art.innerHTML.replace("<!--", "<span style='color:green'>", "g").replace("-->", "</span>", "g");
}