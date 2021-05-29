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
     return [parseInt(m[1])/255.,parseInt(m[2])/255.,parseInt(m[3])/255.,1.];
   m = tag.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
   return m ? [parseInt(m[1])/255.,parseInt(m[2])/255.,parseInt(m[3])/255.,parseInt(m[4])/255.] : null;
}

function tweak(settings) {
    var nodes=document.body.getElementsByTagName('*');
    var pageBack=getColor(getComputedStyle(document.body).backgroundColor);
    
    if (Math.max(pageBack[0],pageBack[1],pageBack[2]) < settings.backblack/100.) {
        document.body.style.backgroundColor = "black";
    }
    else if (Math.min(pageBack[0],pageBack[1],pageBack[2]) > 1-settings.backwhite/100.) {
        document.body.style.backgroundColor = "white";
    }
       
    for (var i=0; i<nodes.length; i++) {
      if (nodes[i].style) {
        if(!nodes[i].href || !settings.ignorelinks) { 
            var style = getComputedStyle(nodes[i]);
            var fore = getColor(style.color);
            if (fore) {
                if (Math.max(fore[0],fore[1],fore[2]) < settings.black/100.) {
                    nodes[i].style.color = "black";
                }
                else if (Math.min(fore[0],fore[1],fore[2]) > 1-settings.white/100.) {
                    nodes[i].style.color = "white";
                }
            }
        }
      }
    }
}

})();