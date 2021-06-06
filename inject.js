(function(){

var settings = null;

window.addEventListener("DOMSubtreeModified", function(event){
    if (settings !== null)
        tweakNode(settings, event.target);
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

function tweakNode(settings,node) {
  if (node.style) {
    if(!node.href || !settings.ignorelinks) { 
        var style = getComputedStyle(node);
        var fore = getColor(style.color);
        if (fore) {
            var z = Math.max(fore[0],fore[1],fore[2]);
            if (z > 0 && 100 * z < 255 * settings.black) {
                node.style.color = "black";
            }
            z = 255-Math.min(fore[0],fore[1],fore[2]);
            if (z > 0 && 100 * z < 255 * settings.white) {
                node.style.color = "white";
            }
        }
    }
  }
}

function tweak(settings) {
    var nodes=document.body.getElementsByTagName('*');
    var pageBack=getColor(getComputedStyle(document.body).backgroundColor);
    
    var z = Math.max(pageBack[0],pageBack[1],pageBack[2]);
    if (z > 0 && 100 * z < 255 * settings.backblack && pageBack[3]==255) {
        document.body.style.backgroundColor = "black";
    }
    
    z = 255-Math.min(pageBack[0],pageBack[1],pageBack[2]);
    if (z > 0 && 100 * z < 255 * settings.backwhite && pageBack[3]==255) {
        document.body.style.backgroundColor = "white";
    }
       
    for (var i=0; i<nodes.length; i++) {
      try {
        tweakNode(settings,nodes[i]);
      }
      catch(err) {
      }
    }
}

})();