(function(){

var settings = null;

window.addEventListener("DOMSubtreeModified", function(event){
    if (settings !== null)
        tweak(settings);
   });

chrome.storage.local.get(options, function(results){
	settings = results;
    tweak(settings);
});

function getColor(tag) {
   m = tag.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
   if ( m )
     return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),255];
   m = tag.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
   return m ? [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),parseInt(m[4])] : null;
}

function tweak(settings) {
    var nodes=document.body.getElementsByTagName('*');
    var pageBack=getColor(getComputedStyle(document.body).backgroundColor);
       
    for (var i=0; i<nodes.length; i++) {
      if (nodes[i].style) {
        var style = getComputedStyle(nodes[i]);
        var fore = getColor(style.color);
        if (fore && Math.max(fore[0]/255.,fore[1]/255.,fore[2]/255.) < settings.luminosity/100.) {
            nodes[i].style.color = "black";
        }
      }
    }
}

})();