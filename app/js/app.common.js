// string utilities

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// create slug-like strings (wordpress concept) for URI generation and other purposes
function slugify(s) {
  const a = '/_,:;';
  const b = '-----';
  const p = new RegExp(a.split('').join('|'), 'g');

  return s.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// php brainfarts

function isset(obj,elem) { return defined(obj) && obj.hasOwnProperty(elem); }
function var_dump(a,b=null) { if ( b ) { console.log(a); console.log(b); } else console.log(a); }
function defined(objele) { try { result= (typeof objele !== 'undefined'); } catch(e) { result=false; } return result; }
function isnull(obj) { return (obj !== null); }
function int(a) { return parseInt(a); }
function implode( sep, arr ) { var res=""; for ( var i=0; i<arr.length; i++ ) { res+=arr[i]; if ( i != arr.length -1 ) res+=sep; } return res; }
function is_array(arr) { return Array.isArray(arr); }

// javascript augmentation functions

function beyond_range(v,a,b) { if ( v < a || v > b ) return true; return false; }
function within_range(v,a,b) { if ( v >= a && v <= b ) return true; return false; }

function merge( a, b ) { return { ...a, ...b }; }

function istrue(v) {
	var b=isString(b)?v.toLowerCase():v;
	if ( b === true ) return true;
	if ( b == '1' ) return true;
	if ( b === 1 ) return true;
	if ( b == 'true' ) return true;
	if ( b == 'y' ) return true;
	if ( b == 'yes' ) return true;
	return false;
}

function isfalse(v) {
	var b=isString(b)?v.toLowerCase():v;
	if ( b === false ) return true;
	if ( b == '0' ) return true;
	if ( b === 0 ) return true;
	if ( b == 'false' ) return true;
	if ( b == 'n' ) return true;
	if ( b == 'no' ) return true;
	return false;
}

function forEachNested(O, f, cur){
    O = [ O ]; // ensure that f is called with the top-level object
    while (O.length) // keep on processing the top item on the stack
        if( f( cur = O.pop() ) && cur && // do not spider down if `f` returns true
           cur instanceof Object && // ensure cur is an object, but not null 
           [Object, Array].includes(cur.constructor) //limit search to [] and {}
        ) O.push.apply(O, Object.values(cur)); //search all values deeper inside
}

function traverse(o,func) {
    for (var i in o) {
        func.apply(this,[i,o[i]]);  
        if (o[i] !== null && typeof(o[i])=="object") {
            //going one step down in the object tree!!
            traverse(o[i],func);
        }
    }
}

// time and date

function getLocalTime() { var d=new Date(); return d.getMilliseconds(); }
function Timestamped(data) { return { data: data, time: getLocalTime() }; }

// useful web page stuff

// Read a page's GET URL variables and return them as an associative array.
function getparams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) { hash = hashes[i].split('='); vars[hash[0]] = hash[1]; }
    return vars;
}
function get_protocol() { return location.protocol; }
function is_ssl() { return (get_protocol() === 'https:'); }

// DOM helpers

function Get( id ) { return document.getElementById(id); }

function GetInputValue(id) {
	var a = Get(id);
	return $(a).val();
}

function PageVisibilityProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function isPageVisible() {
    var prop = PageVisibilityProp();
    if (!prop) return true;    
    return !document[prop];
}

// css helpers

function GetAColor( seed ) {
 var colors = ["Aqua","Aquamarine","Black","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse",
 "Chocolate","Coral","CornflowerBlue","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey",
 "DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon",
 "DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink",
 "DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod",
 "Gray","Grey","Green","GreenYellow","HotPink","IndianRed","Indigo","Khaki","Lavender",
 "LawnGreen","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow",
 "LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray",
 "LightSlateGrey","LightSteelBlue","Lime","LimeGreen","Magenta","Maroon","MediumAquaMarine",
 "MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise",
 "MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","Olive",
 "OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip",
 "PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown",
 "Salmon","SandyBrown","SeaGreen","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey",
 "SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","Yellow",
 "YellowGreen"];
 return colors[seed%colors.length];
}


// geometry: rectangles

function WITHIN(tx,ty,x,y,w,h) { return ( tx > x && tx < x+w && ty > y && ty < y+h ); }
function WITHINInclusive(tx,ty,x,y,w,h) { return ( tx >= x && tx <= x+w && ty >= y && ty <= y+h ); }


// html form handler that supports jquery automation with ajax api

var html="";
function PackForm( model, prefix="mcapp-model" ) {
 html="";
 html='<table width="100%">';
 model.forEach(function(item,index){
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = (item.value?item.value:"");
	 var p = (item.hint?item.hint:"");
	 html+="<tr><td>";
	 if ( item.label ) html+='<label for="'+n+'">'+item.label+'</label>';
	 html+="</td><td>";
	 if ( item.type === "p" ) {
		html+='</td><td></td></tr><tr><td colspan=2><p id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</p></td></tr>';
	 } else if ( item.type === "div" ) {
		html+='<div id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</div>';
	 } else if ( item.type === "span" ) {
		html+='<span id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</span>';
	 } else if ( item.type === "h1" ) {
		html+='<h1 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h1>';
	 } else if ( item.type === "h2" ) {
		html+='<h2 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h2>';
	 } else if ( item.type === "h3" ) {
		html+='<h3 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h3>';
	 } else if ( item.type === "h4" ) {
		html+='<h4 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h4>';
	 } else if ( item.type === "h5" ) {
		html+='<h5 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h5>';
	 } else if ( item.type === "h6" ) {
		html+='<h6 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h6>';
	 } else if ( item.type === "hidden" ) {
		html+='<input name="'+n+'" id="'+i+'" type="hidden" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "string" ) {
		html+='<input name="'+n+'" id="'+i+'" type="text" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "text" ) {
		html+="</td></tr>";
		html+="</table>";
		html+='<textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea>';
		html+='<table width="100%">';
		html+="<tr><td>";
		html+="</td><td>";
	 } else if ( item.type === "markdown" ) {
		html+="</td></tr>";
		html+="</table>";
		html+='<div class="roundbox markdown-editor"><textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea></div>';
		html+='<table width="100%">';
		html+="<tr><td>";
		html+="</td><td>";
	} else if ( item.type === "date" ) {
		html+='<input name="'+n+'" id="'+i+'" type="date" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "slider" ) {
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" ) {
		 if ( item.type == "money" ) html+="<span><b>$</b>";
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
		 html+= item.range ? ( (defined(item.range.min)?(' min="'+item.range.min+'"'):'') + (defined(item.range.max)?(' max="'+item.range.max+'"'):'') + (defined(item.range.step)?(' step="'+item.range.step+'"'):'') + (defined(item.list)?(' list="'+i+'-datalist"'):'') ) : '';
		 html+='>';
		 if ( item.list ) {
			html+='<datalist id="'+i+'-datalist">';
			for( var i=0; i<item.list.length; i++ ) {
				html+=isString(item.list[i])?'<option value="'+item.list[i]+'">':'<option value="'+item.list[i].value+'">'+item.list[i].text;
			}
			html+='</datalist>';
		 }
		 if ( item.type == "money" ) html+="USD </span>";
	 } else if ( item.type === "radio" ) {
		 if ( item.title ) html+=item.title;
		 item.options.forEach(function(opt,num){
			 html+=(item.wrapper?'<'+item.wrapper+'>':'<div>')+'<input type="radio" name="'+i+'" id="'+i+'-'+num+'" value="'+opt.value+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"> '+opt.label+((item.wrapper?'</'+item.wrapper+'>':'</div>')+(item.after?item.after:''));
		 });
	 } else if ( item.type === "select" ) {
		 html+='<select id="'+i+'"';
		 html+=(item.autofocus?" autofocus":'');
		 html+=(item.multiple?" multiple":'');
		 html+=(item.disabled?" disabled":'');
		 html+=(item.size?(' size="'+item.size+'"'):'');
		 html+='>';
		 item.options.forEach(function(opt,num){
			 html+='<option value="'+opt.value+'" id="'+i+'-'+num+'"';
			 html+=(""+opt.value) == (""+item.value)?' selected':'';
			 html+=opt.label?(' label="'+opt.label+'"'):'';
			 html+=opt.disabled?' disabled':'';
			 html+='>'+opt.name+'</option>';
		 });
		 html+='</select>';
	 } else if ( item.type === "toggle" ) {
		 html+=html_Switch(i,istrue(v));
	 }
	 html+="</td></tr>";
 });
 return html;
}

function enableByValue( ele ) {
	var item=ele.formitem;
	var n = (item.name?item.name:index);
	var i = ele.id;
	var p = (item.hint?item.hint:"");
	if ( !( item.type == 'radio' || item.type == 'select' ) ) return;
	if ( item.type == 'radio' ) {
     var value=null;
	 var value_domid=null;
	 var opt_list=[];
 	 for ( var i=0; i<item.options.length; i++ ) {
		 var domid=i+'-'+num;
		 opt_list[opt_list.length]=domid;
	   	 var domlist;
	   	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	   	 for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( $(Get(domid)).is(':checked') ) {
			value=i;
			value_domid=domid;
			for(var j=0;j<domlist.length;j++){
			 Get('#'+domlist[j]).prop("disabled",true);
			 Get('#'+domlist[j]).removeAttr("disabled");
			}
		 } else {
			for ( var j=0; j<domlist.length; j++ ) {
			 Get('#'+domlist[j]).setAttribute("disabled",true);
			}
		 }
	 }
	} else if ( item.type == 'select' ) {
	 var value=ele.selectedIndex;
	 var value_domid=value?(i+'-'+value):null;
	 var opt_list=[];
 	 for ( var i=0; i<item.options.length; i++ ) {
		 var domid=i+'-'+num;
		 opt_list[opt_list.length]=domid;
	   	 var domlist;
	   	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	   	 for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( value == i ) {
			for(var j=0;j<domlist.length;j++){
			 Get('#'+domlist[j]).prop("disabled",true);
			 Get('#'+domlist[j]).removeAttr("disabled");
			}
		 } else {
			for ( var j=0; j<domlist.length; j++ ) {
			 Get('#'+domlist[j]).setAttribute("disabled",true);
			}
		 }
	  }
	}
}

function revealByValue( ele ) {
	var item=ele.formitem;
	var n = (item.name?item.name:index);
	var i = ele.id;
	var p = (item.hint?item.hint:"");
	if ( !( item.type == 'radio' || item.type == 'select' ) ) return;
	if ( item.type == 'radio' ) {
     var value=null;
	 var value_domid=null;
	 var opt_list=[];
 	 for ( var i=0; i<item.options.length; i++ ) {
		 var domid=i+'-'+num;
		 opt_list[opt_list.length]=domid;
	   	 var domlist;
	   	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	   	 for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( $(Get(domid)).is(':checked') ) {
			value=i;
			value_domid=domid;
			for(var j=0;j<domlist.length;j++){
			 $('#'+domlist[j]).show();
			}
		 } else {
			for ( var j=0; j<domlist.length; j++ ) {
			 $('#'+domlist[j]).hide();
			}
		 }
	 }
	} else if ( item.type == 'select' ) {
	 var value=ele.selectedIndex;
	 var value_domid=value?(i+'-'+value):null;
	 var opt_list=[];
 	 for ( var i=0; i<item.options.length; i++ ) {
		 var domid=i+'-'+num;
		 opt_list[opt_list.length]=domid;
	   	 var domlist;
	   	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	   	 for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( value == i ) {
			for(var j=0;j<domlist.length;j++){
			 $('#'+domlist[j]).show();
			}
		 } else {
			for ( var j=0; j<domlist.length; j++ ) {
			 $('#'+domlist[j]).hide();
			}
		 }
	  }
	}
}

// call to bind functions in jquery after packing the form and spewing it
function jQueryForm( model, prefix="mcapp-model" ) {
 model.forEach(function(item,index){
	 item.prefix=prefix;
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = (item.value?item.value:"");
	 var p = (item.hint?item.hint:"");
	 var ele=Get(i);
	 ele.formitem=item;
	 if ( item.hide ) $("#"+i).hide();
	 if ( item.hover ) $("#"+i).hover(item.hover.enter,item.hover.leave);
	 if ( item.click ) $("#"+i).click(item.click);
	 if ( item.scroll ) $("#"+i).scroll(item.scroll);
	 if ( item.toggle ) $("#"+i).toggle(item.toggle.even,item.toggle.odd);
	 if ( item.select ) $("#"+i).select(item.select);
	 if ( item.resize ) $("#"+i).resize(item.resize);
	 if ( item.blur ) $("#"+i).blur(item.blur);
	 if ( item.load ) $("#"+i).load(item.load);
	 if ( item.unload ) $("#"+i).contextmenu(item.unload);
	 if ( item.input ) $("#"+i).input(item.input);
	 if ( item.menu ) $("#"+i).contextmenu(item.menu);
	 if ( item.focus ) $("#"+i).focus(item.focus);
	 if ( item.focusin ) $("#"+i).focusin(item.focusin);
	 if ( item.focusout ) $("#"+i).focusout(item.focusout);
	 if ( item.submit ) $("#"+i).submit(item.submit);
	 if ( item.mousemove ) $("#"+i).mousemove(item.mousemove);
	 if ( item.mouseenter ) $("#"+i).mouseenter(item.mouseenter);
	 if ( item.mouseleave ) $("#"+i).mouseleave(item.mouseleave);
	 if ( item.mouseover ) $("#"+i).mouseover(item.mouseover);
	 if ( item.mouseout ) $("#"+i).mouseout(item.mouseout);
	 if ( item.mousedown ) $("#"+i).mousedown(item.mousedown);
	 if ( item.mouseup ) $("#"+i).mouseup(item.mouseup);
	 if ( item.keyup ) $("#"+i).keyup(item.keyup);
	 if ( item.keydown ) $("#"+i).keydown(item.keydown);
	 if ( item.keypress ) $("#"+i).keypress(item.keypress);
	 if ( item.change ) $("#"+i).change(item.change);
	 // "on"	 
	 if ( item.onmousemove ) $("#"+i).mousemove(item.onmousemove);
	 if ( item.onmouseenter ) $("#"+i).mouseenter(item.onmouseenter);
	 if ( item.onmouseleave ) $("#"+i).mouseleave(item.onmouseleave);
	 if ( item.onmouseover ) $("#"+i).mouseover(item.onmouseover);
	 if ( item.onmouseout ) $("#"+i).mouseout(item.onmouseout);
	 if ( item.onmousedown ) $("#"+i).mousedown(item.onmousedown);
	 if ( item.onmouseup ) $("#"+i).mouseup(item.onmouseup);
	 if ( item.onkeydown ) $("#"+i).keydown(item.onkeydown);
	 if ( item.onkeypress ) $("#"+i).keypress(item.onkeypress);
	 if ( item.onkeyup ) $("#"+i).keyup(item.onkeyup);
	 if ( item.onchange ) $("#"+i).change(item.onchange);
	 if ( item.oninput ) $("#"+i).input(item.oninput);
	 if ( item.contextmenu ) $("#"+i).contextmenu(item.contextmenu);
	 if ( item.type === "markdown" ) {
		 item.live=woofmark(Get(i),{
  parseMarkdown: function (input) {
    return megamark(input, {
      tokenizers: [{
        token: /(^|\s)@([A-z]+)\b/g,
        transform: function (all, separator, id) {
          return separator + '<a href="/users/' + id + '">@' + id + '</a>';
        }
      }]
    });
  },
  parseHTML: function (input) {
    return domador(input, {
      transform: function (el) {
        if (el.tagName === 'A' && el.innerHTML[0] === '@') {
          return el.innerHTML;
        }
      }
	});
  },
  fencing: true,
  html: false,
  wysiwyg: true,
  defaultMode: 'wysiwyg'
		 });
	 }
	 // enable,reveal expects "domid" or ["domid","domid2"...]
	 if ( item.type == 'toggle' ) {
	   if ( item.enable ) {
	   	 var domlist;
	   	 if ( is_array(item.enable) ) domlist=item.enable;
	     else { domlist=[]; domlist[0]=item.enable; }
	   	 var ele=Get(i);
	   	 for(var i=0;i<this.domlist.length;i++) this.domlist[i]=prefix+'-'+slugify(this.domlist[i]);
	   	 ele.domlist=domlist;
	   	 $(ele).toggle(
	   	  function(e){for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).setAttribute("disabled",true);}},
	   	  function(e){for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).prop("disabled",true);$(this.domlist[i]).removeAttr("disabled");}}
	   	 );
	   	 if ( istrue(item.value) ) {
			 for(var i=0;i<domlist.length;i++){Get('#'+domlist[i]).setAttribute("disabled",true);}
	   	 } else {
			 for(var i=0;i<domlist.length;i++){Get('#'+domlist[i]).prop("disabled",true);Get('#'+domlist[i]).removeAttr("disabled");}
		 }
	   }
	   if ( item.reveal ) {
	   	 var domlist;
	   	 if ( is_array(item.reveal) ) domlist=item.reveal;
	     else { domlist=[]; domlist[0]=item.reveal; }
	   	 var ele=Get(i);
	   	 for(var i=0;i<this.domlist.length;i++) this.domlist[i]=prefix+'-'+slugify(this.domlist[i]);
	   	 ele.domlist=domlist;
	   	 $(ele).toggle(
	   	  function(e){for(var i=0;i<this.domlist.length;i++){$(this.domlist[i]).show();} if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); },
	   	  function(e){for(var i=0;i<this.domlist.length;i++){$(this.domlist[i]).hide();} if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); }
	   	 );
	   	 if ( istrue(item.value) ) {
			 for(var i=0;i<domlist.length;i++){$(domlist[i]).show();}
	   	 } else {
			 for(var i=0;i<domlist.length;i++){$(domlist[i]).hide();}
		 }
	   }
	 }
	 // enable or reveal appear inside the options list
	 // enable,reveal expects [] of { value:"triggervalue", elements: "domid" or ["domid","domid"] }
	 if ( item.type == 'radio' ) {
	   if ( item.enable ) {
         for ( var i=0; i<item.options.length; i++ ) {
		  var opt_i = i+'-'+num;
		  var opt_ele=Get(opt_i);
		  opt_ele.formitem=item;
	   	  $(opt_ele).change( function(e){ enableByValue(this); } );
		  if ( $(opt_ele).is(':checked') ) enableByValue(opt_ele);
		 }
	   }
	   if ( item.reveal ) {
         for ( var i=0; i<item.options.length; i++ ) {
		  var opt_i = i+'-'+num;
		  var opt_ele=Get(opt_i);
		  opt_ele.formitem=item;
	   	  $(opt_ele).change( function(e){ revealByValue(this); } );
		  if ( $(opt_ele).is(':checked') ) revealByValue(opt_ele);
		 }
	   }
	 }
	 // enable or reveal appear inside the options list
	 // enable,reveal expects [] of { value:"triggervalue", elements: "domid" or ["domid","domid"] }
	 if ( item.type == 'select' ) {
	   if ( item.enable ) {
         for ( var i=0; i<item.options.length; i++ ) {
	   	  $(ele).change( function(e){ enableByValue(this); } );
		 }
	   }
	   if ( item.reveal ) {
         for ( var i=0; i<item.options.length; i++ ) {
	   	  $(ele).change( function(e){ revealByValue(this); } );
		 }
	   }
	   $(ele).trigger('change');
	 }
 });
 return html;
}

function FormErr(item,model,prefix) {
 if ( item.onrequired ) item.onrequired(item,model,prefix);
 return { error: 'form requirement not met', message: (isString(item.required) ? item.required : (n+' cannot be blank.')) };
}

// Get the data out of a packed form
function UnpackForm( model, prefix="mcapp-model" ) {
 var data={};
 console.log("Unpacking: ");
 console.log(model);
 model.forEach(function(item,index){
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = ( item.type == "toggle" ) ? ($('#'+i).is(':checked')?1:0) :
             ( item.type == "markdown" ) ? (item.live.value()) :
			 $("#"+i).val();
	 if ( item.required ) {
		 if ( item.type == "string" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "date" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "toggle" && isfalse(v) ) return FormErr(item,model,prefix);
		 else if ( (item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" )
                && (item.range && beyond_range(v,item.range.min,item.range.max)) ) return FormErr(item,model,prefix);
	 }
	 if ( !(item.type == 'h1'      || item.type == 'h2'
 	    || item.type == 'h3'	   || item.type == 'h4'
	    || item.type == 'h5'       || item.type == 'h6'
	    || item.type == 'span'     || item.type == 'div'
	    || item.type == 'p') ) {
			data[n] = v;
	 }
 });
 console.log("UnpackForm:data:");
 console.log(data);
 return data;
}

function SaveButton( where, model, saveFunction, text="Save Changes", prefix="mcapp" ) {
	var domid=prefix+'-saveButton';
	var html='<button id="'+domid+'">'+text+'</button>';
	$(Get(where)).append(html);
	var ele=Get(domid);
	ele.model=model;
	ele.saveFunction = saveFunction;
	$(ele).click(function(e){
     this.setAttribute("disabled",true);
	 this.saveFunction(e);
	 $(this).prop("disabled",true);
	 $(this).removeAttr("disabled");
	});
}

// Executes your fun "form model" that usually is built off an API data block
// expects: unpackFunc( data, model, domid_prefix, context )
function Modelize( injectpoint, prefix="mcapp-model", model, jqueryIt=true ) {
	$(injectpoint).html(PackForm(model,prefix));
	if ( jqueryIt ) jQueryForm(model, prefix);
}

function defaultUnmapForm(data) { return data; }

function Demodelize( model, unmapFunc=defaultUnmapForm, completionFunc, prefix="mcapp-model" ) {
 	  console.log(model);
	  var data=UnpackForm(model,prefix);
	  console.log(data);
	  if ( data.error ) {
		  Warn(data.error.message);
	  } else {
		app.api.Modify("Program", data.id, 
		  unmapFunc(data),
		  completionFunc,
		  function(e){
			  Warn("Unable to save changes!");
		  }
		 );
	  }
}


// http://bootstrap-notify.remabledesigns.com/

function Warn(msg) {
	console.log("Warning: "+msg);
	$.notify({	message: msg },{  type: 'danger', z_index:100000 });
}

function Warning(msg) {
	console.log("Warning: "+msg);
	$.notify({	message: msg },{  type: 'danger', z_index:100000 });
}

function Succeed(msg) {
	console.log("Success: "+msg);
	$.notify({	message: msg },{  type: 'success', z_index:100000 });
}


// html rendering based on app layer css styles

function html_Switch( domid, checked=false, disabled=false) {
	return '<div class="onoffswitch" id="'+domid+'-wrapper"><input type="checkbox" name="'+domid+'" class="onoffswitch-checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'>'
	 +'<label class="onoffswitch-label" for="'+domid+'"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>';
	return '<span class="switch"><input type="checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'><span class="slider round"></span></span>';
}


