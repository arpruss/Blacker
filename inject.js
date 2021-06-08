(function(){

var settings = null;

/*
window.addEventListener("DOMSubtreeModified", function(event){
    if (settings !== null) {
        //recursiveTweak(settings, event.target);
        //event.target.style.color = "blue";
    }
   }); */
   
window.addEventListener("DOMNodeInserted", function(event){
    if (settings !== null) {
        recursiveTweak(settings, event.target);
    }
   });
   
window.addEventListener("DOMAttrModified", function(event){
    if (settings !== null) {
        tweak(settings, event.target);
    }
   });
   
chrome.storage.local.get(options, function(results){
	settings = results;
    tweak(settings);
});

function getColor(tag) {
   m = tag.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
   if ( m )
     return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),1.0];
   m = tag.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([.0-9]+)\s*\)$/i);
   return m ? [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),parseFloat(m[4])] : null;
}

function realBackgroundColor(elem,style=undefined) {
   if (!elem || !elem.style) {
       return [255,255,255,1.0];
   }
   if (style === undefined) {
      style = getComputedStyle(elem);
   }
   if (style.backgroundImage !== 'none') {
      return undefined;
   }
   var color = getColor(style.backgroundColor);
   if (!color) {
      return undefined;
   }
   if (color[3]==1) {
/*        if (color[0] == 249 && color[1] == 237 && color[2] == 190) {
            console.log(style);
            console.log(elem.style);
            return [0,0,0,1.0];
        } */
        return color;
   }
   else {
      var under = realBackgroundColor(elem.parentElement);
      if (under === undefined)
          return undefined;
      return [color[0]*color[3]+under[0]*(1-color[3]),color[1]*color[3]+under[1]*(1-color[3]),color[2]*color[3]+under[2]*(1-color[3]),Math.max(color[3],under[3])]
   }
}   

function recursiveTweak(settings,node) {
    try {
        tweakNode(settings, node);
    }
    catch(err) {
    }
    
    if (node.childNodes) {
        var children = Array.from(node.childNodes);
        for (var i=0;i<children.length;i++)
            recursiveTweak(settings, children[i]);
    }
}

function tweakNode(settings,node) {
    if(!node.href || !settings.ignorelinks) { 
        var style = getComputedStyle(node);
        var fore = getColor(style.color);
        var back = realBackgroundColor(node, style);
        var backIntensity;
        if (back === undefined || back[3] == 0) 
            backIntensity = undefined;
        else 
            backIntensity = (back[0] + back[1] + back[2])/3;
        
        if (fore) {
            foreIntensity = (fore[0] + fore[1] + fore[2])/3;
            
            var z = Math.max(fore[0],fore[1],fore[2]);

            if (z > 0 && 100 * z < 255 * settings.black && (backIntensity === undefined || foreIntensity < backIntensity) ) {
                node.style.color = "black";
            }
            z = 255-Math.min(fore[0],fore[1],fore[2]);
            if (z > 0 && 100 * z < 255 * settings.white && (backIntensity === undefined || foreIntensity > backIntensity) ) {
                node.style.color = "white";
            }
        }
    }
}

function tweak(settings) {
    var nodes=document.body.getElementsByTagName('*');
    var pageBack=getColor(getComputedStyle(document.body).backgroundColor);
    
    var z = Math.max(pageBack[0],pageBack[1],pageBack[2]);
    if (z > 0 && 100 * z < 255 * settings.backblack && pageBack[3]==1) {
        document.body.style.backgroundColor = "black";
    }
    
    z = 255-Math.min(pageBack[0],pageBack[1],pageBack[2]);
    if (z > 0 && 100 * z < 255 * settings.backwhite && pageBack[3]==1) {
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