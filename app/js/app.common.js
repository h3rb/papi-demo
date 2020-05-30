var PI=Math.PI.toFixed(20);

function interpolate( min, max, percent_norm_1 ) {
 min=parseFloat(min);
 max=parseFloat(max); 
 return ( (min) + ((max) - (min) / (percent_norm_1) == 0.0 ? 1.0 : (percent_norm_1) ) );
}

var Date_options = {};
var idleSince = Date.now();

function formatDateForHTML(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

var todays_html_date=formatDateForHTML(idleSince);
var week_ago_html_date=formatDateForHTML(Date.now() - 7*(24*60*60*1000));

function HUMANDATE( dstring ) { // Locale version for human eyes
 var d= new Date(dstring);
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleDateString(undefined,options);
}

function HUMANTIME( dstring ) { // Locale version for human eyes
 var d= new Date(dstring);
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleTimeString(undefined,options);
}
function DDMMYYYY( dstring ){ // this format required for API calls
 if ( !defined(dstring) ) return null;
 var d= new Date(dstring);
 var d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[2]+'/'+parts[1]+'/'+parts[0];
}

function YYYYMMDD( dstring ){ // this format required for html date input tag value
 if ( !defined(dstring) ) return null;
 var d= new Date(dstring);
 var d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[0]+'-'+parts[1]+'-'+parts[2];
}
// flips YYYYMMDD to DDMMYYYY
function DDMMYYYYtoHUMAN( dstring, sep='/' ){
 var parts=dstring.split(sep);
 var d=new Date;
 d.setDate(parseInt(parts[0]));
 d.setMonth(parseInt(parts[1])-1);
 d.setYear(parseInt(parts[2]))
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleDateString(undefined,options);
}

function YYYYMMDDtoDDMMYYYY(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[2]+sep+parts[0];
}
function DDMMYYYYtoYYYYMMDD(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[2]+sep+parts[0];
}

function DDMMtoMMDD(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[0]+sep+parts[2];
}
function MMDDtoDDMM(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[0]+sep+parts[2];
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function importObject(to, from,name=null) {
 var oname=name;
 if ( !defined(name) || !name ) oname=from.constructor.name;
 for (var prop in from) {
  if ( defined(to[prop]) ) console.log("importObject("+oname+"): Warning `"+prop+"` is already defined, redefining" );
  to[prop] = from[prop];
 }
}

function isChecked(item) {	
    if ( item.checked ) return true;
    switch(item.getAttribute('aria-checked')) {
        case "true": return true;
    }
	return false;
}

function stripHtml(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


	 // Function to download data to a file
function downloadAsFile(data, filename, type="text") {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function numToLetter( n ) {
 return String.fromCharCode(n % 26 + 'a'.charCodeAt(0));
}

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

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

function isBoolean(obj) {
   return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// php brainfarts

function isset(obj,elem) { return defined(obj) && obj.hasOwnProperty(elem); }
function var_dump(a,b=null) { if ( b ) { console.log(a); console.log(b); } else console.log(a); }
function defined(objele) { try { result= (typeof objele !== 'undefined'); } catch(e) { result=false; } return result; }
function isnull(obj) { return (obj !== null); }
function int(a) { return parseInt(a); }
function implode( sep, arr ) { var res=""; for ( var i=0; i<arr.length; i++ ) { res+=arr[i]; if ( i != arr.length -1 ) res+=sep; } return res; }
function is_array(arr) { return Array.isArray(arr); }

function getUrlParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return (results && results[1]) || undefined;
}

// number format
function nf( a, digi=2 ) { return parseFloat(a).toFixed(digi); }
// round format integer
function rfi( a, round=0.5 ) { return parseInt(Math.floor(parseFloat(a)+0.5)); }
// timestamp conversion
function ts(a) { var d= new Date(parseInt(a)*1000);
 return d.toString().replace("Eastern Standard Time","EST").replace("Eastern Daylight Time","EDT").replace("Pacific Standard Time","PST").replace("Pacific Daylight Time","PDT").replace("Mountain Standard Time","MST").replace("Mountain Daylight Time","MDT").replace("Central Standard Time","CST").replace("Central Daylight Time","CDT");
}
// timestamp conversion
function tsDDMMYYYY(a,sep='-') { var d= new Date(parseInt(a)*1000);
 var d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[2]+sep+parts[1]+sep+parts[0];
}
// timestamp conversion
function tsYYYYMMDD(a,sep='-') { var d= new Date(parseInt(a)*1000);
 console.log(d.toISOString());
 var d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[0]+sep+parts[1]+sep+parts[2];
}

// human file size
function humanFileSize(bytes, si=true) {
    var thresh = (si ? 1000 : 1024), u=-1;
    if (Math.abs(bytes) < thresh) return bytes + ' b';
    var units = si ? ['kb','mb','G','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    do { bytes /= thresh; ++u; } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

// time and date
function getLocalTime() { var d=new Date(); return d.getMilliseconds(); }
function Timestamped(data) { return { data: data, time: getLocalTime() }; }


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  var mybutton=Get("scroll_to_top");
  if ( !mybutton ) return;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function html_Switch( domid, checked=false, disabled=false) {
	return '<div class="onoffswitch" id="'+domid+'-wrapper"><input type="checkbox" name="'+domid+'" class="onoffswitch-checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'>'
	 +'<label class="onoffswitch-label" for="'+domid+'"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>';
	return '<span class="switch"><input type="checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'><span class="slider round"></span></span>';
}

// Scroll to an element

function scrollElement( ele, delayed=2000 ) { 
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#"+ele.id).offset().top
    }, delayed);
}

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

// scrolling

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
 * return the distance between two points.
 *
 * @param {number} x1		x position of first point
 * @param {number} y1		y position of first point
 * @param {number} x2		x position of second point
 * @param {number} y2		y position of second point
 * @return {number} 		distance between given points
 */
Math.getDistance = function( x1, y1, x2, y2 ) {
	var	xs = x2 - x1, ys = y2 - y1;	
	xs *= xs;
	ys *= ys;
	return Math.sqrt( xs + ys );
}

function sq( a ) { return a*a; }
function mum( pixels ) { return pixels*3.45; }
function pir2( radius ) { return PI * sq(radius); }

function implode( sep, arr ) {
	var res="";
	for ( var i=0; i<arr.length; i++ ) {
		res+=arr[i];
		if ( i != arr.length -1 ) res+=sep; 
	}
	return res;
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

function WITHIN(tx,ty,x,y,w,h)          { return ( tx > x && tx < x+w && ty > y && ty < y+h ); }
function WITHINInclusive(tx,ty,x,y,w,h) { return ( tx >= x && tx <= x+w && ty >= y && ty <= y+h ); }
function rad2deg(radians) {  return radians * (180/Math.PI.toFixed(20));  }
function LineAngleDeg(x,y,x2,y2) { return rad2deg(Math.atan2( (y2-y), (x2-x) )); }


function Get( id ) { return document.getElementById(id); }

function GetInputValue(id) {
	var a = Get(id);
	return $(a).val();
}

// returns the browser's page visibility property
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
 return (""+colors[seed%colors.length]).trim();
}

function slugify(s) {
  return s.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}



// html form handler that supports jquery automation with ajax api

/*
 * Form Model Description:
 *
 *
 * Example model :
 [
	 { name: "id", type:"hidden", value:id },
	 { name: "name", label: "Name:", type:"string", value: program.name, hint: "Program Name" },
	 { name: "desc", label: "Description:", type:"text", value: program.desc, hint: "Description" },
	 { name: "mode", label: "Testing Mode", type: "select", value: parseInt(program.mode),
		 options: [
		 { name: "Each test", value: 1 },
		 { name: "All tests", value: 2 }
		 ]
	 }, ...
	 
	 ... html inserts
	 { type: "p", css: "alert alert-dark", text: "When set to <i>ON</i>, prior certified students are given a chance to weigh in to help grade exams that require a human grader.  Final exam results are still approved by you, but their suggested grade shows up if they participate.  This can help cut down grading time.  You can also mark participants as trusted so their grading opinions appear higher in the list.  Participants receive extra bling on their badges indicating they have helped you certify others for something in which they are certified.  Please note that students can opt out of this feature." },
 ...]
 * Values for "type":
 *  -html types:
 *   p, div, span, h1, h2, h3, h4, h5, h6, hr
 *  -input types:
 *   hidden, string, text, markdown, date, slider, range,
 *   integer, money, decimal, number, select, color, toggle,
 *   button
 *  -special form structures:
 *   extendable ("extend" short form typename)
 *
 *   { type:"extendable", model:<data-model>, close:<html|optional>, add:<html|optional> }
 *
 * Other parameters:
 * name    (unqiue) property.name, used to create id
 * css     css class list
 * style   style to add to tag
 * list    used to do autocomplete for limited value scenarios (integer, money, decimal, number, string)
 * text    used to populate the interior of an html element type
 * label   labels an area, button, or input
 * range  (optional) for numeric data entry (types integer, decimal, money, date),
 *         object that must contain the format { min: # (optional), max: # (optional) }
 * autofocus To enable autofocus feature (true/false)
 * multiple To enable multiple selections (true/false)
 * disabled To disable (true/false)
 * currency For "money" element types, if not present defaults to USD
 * 
 * Parameters only for 'extendable':
 * model    recursion (use with extendable)
 * close    html for close button, use with extendable, has default
 * closecss css class for close button, has default
 * closefirst  (default: false) allow removal of the "first"
 * closebefore (default: false) moves the close button before the form copy
 * add      html for add button, use with extendable, has default
 * addcss   css class for add button, has default
 * initial  a number that describes the number of initial copies
 * limit    (default: 0 = unlimited), limits the number of times an extendable can be extended
 * minimum  a number that must be less than limit, describing a minimum number of entries
 * title    A title for each section, where ### is replaced with the number of the extension
 * inner    describes the CSS class list to applied to each extendable form copy
 */

var html="";
var pfPrototypes={};
function PackForm( model, prefix="jsapp-model", keepPrototypes=false ) {
 var property=prefix.replaceAll("-","");
 if ( !keepPrototypes || !defined(pfPrototypes[property]) ) pfPrototypes[property]=[];
 html="";
 html='<table width="100%">';
 model.forEach(function(item,index) {
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = (item.value?item.value:"");
	 var p = (item.hint?item.hint:"");
	 if ( item.type == "markdown" || item.type == "text" ) html+='<tr><td>';
	 else html+='<tr id="'+i+'-wrapper"><td>';
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
  } else if ( item.type == "hr" ) {
   html+='<hr size=1 width="'+(item.width?item.width:"60%")+'"/>';
	 } else if ( item.type === "hidden" ) {
 		html+='<input name="'+n+'" id="'+i+'" type="hidden" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "string" ) {
 		html+='<input name="'+n+'" id="'+i+'" type="text" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
   html+= item.list ? ('list="'+i+'-datalist" ')  : '';
   html+= '/>';
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
			 for( var j=0; j<item.list.length; j++ ) {
			 	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
			 }
			 html+='</datalist>';
		 }
	 } else if ( item.type === "text" ) {
	  html+="</td></tr>";
   html+='<tr><td colspan=2>'
	  html+='<div id="'+i+'-wrapper"><textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea></div>';
	 } else if ( item.type === "markdown" ) {
		 html+="</td></tr>";
   html+='<tr><td colspan=2>'
		 html+='<div id="'+i+'-wrapper" class="roundbox markdown-editor"><textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea></div>';
	 } else if ( item.type === "date" ) {
 		html+='<input name="'+n+'" id="'+i+'" type="date" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
		 html+= item.range ? ( (defined(item.range.min)?(' min="'+item.range.min+'"'):'') + (defined(item.range.max)?(' max="'+item.range.max+'"'):'') + (defined(item.range.step)?(' step="'+item.range.step+'"'):'') + (defined(item.list)?(' list="'+i+'-datalist"'):'') ) : '';
   html+= item.list ? ('list="'+i+'-datalist" ')  : '';   
		 html+='/>';
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
			 for( var j=0; j<item.list.length; j++ ) {
			 	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
			 }
			 html+='</datalist>';
		 }   
	 } else if ( item.type === "slider" ) {
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" ) {
		 if ( item.type == "money" ) html+="<span><b>$</b>";
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
		 html+= item.range ? ( (defined(item.range.min)?(' min="'+item.range.min+'"'):'') + (defined(item.range.max)?(' max="'+item.range.max+'"'):'') + (defined(item.range.step)?(' step="'+item.range.step+'"'):'') + (defined(item.list)?(' list="'+i+'-datalist"'):'') ) : '';
   html+= item.list ? ('list="'+i+'-datalist" ') : '';
		 html+='/>';
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
		  for( var j=0; j<item.list.length; j++ ) {
		  	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
		  }
			 html+='</datalist>';
		 }
		 if ( item.type == "money" ) html+=(item.currency?item.currency:"USD")+" </span>";
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
  } else if ( item.type === "color" ) {
   html+= '<input type="color" id="'+i+'" name="'+i+'" value="'+(v.length>0?v:"#FF0000")+'">';
	 } else if ( item.type === "toggle" ) {
		 html+='<input type="checkbox" id="'+i+'" name="'+i+'" value="'+i+'"'+(istrue(v)?" checked":'')+'>';
	 } else if ( item.type === "extendable" || item.type === "extend" ) {
   var p=pfPrototypes[property].length;
   pfPrototypes[property][p]=item;
   var outer=i;
   var add=(item.add?item.add:faicon("fa-plus"));
   var addcss=(item.addcss?item.addcss:"form-extendable-add");
   html+='</td><td></td></tr><tr><td colspan=2>'+div(
    hrefbtn(add,"packFormExtendAdd('"+prefix+"','"+outer+"')",addcss,outer+"-addbtn"),
    item.css?item.css:"", outer, null, null, [
       {name:"pf-extendable",value:item.name},
       {name:"pf-prototype",value:p},
       {name:"pf-extendable-id",value:i},
       {name:"pf-counter",value:0},
       {name:"pf-outer",value:outer},
       {name:"pf-prefix",value:prefix}
    ]
   );
  }
	 html+="</td></tr>";
 });
 return html;
}

function packFormExtendClose( outer, itemNumber, closeFirst=false ) {
 var wrapper=Get(outer);
 var counter=parseInt($(wrapper).attr("pf-counter"));
 var prototype=parseInt($(wrapper).attr("pf-prototype"));
 var inner=outer+"-inner-"+itemNumber;
 var ele=Get( inner );
 ele.parentNode.removeChild(ele);
 counter--;
 $(wrapper).attr("pf-counter",counter);
 var elements=document.querySelectorAll('[pf-outer="'+outer+'"]');
 var i=1;
 elements.forEach(function(e) {
  $(e).attr("pf-number",i);
  i++;
 });
}

function packFormExtendAdd( prefix, outer ) {
 var property=prefix.replaceAll("-","");
// console.log(pfPrototypes[property]);
// console.log(outer);
 var wrapper=Get(outer);
 var counter=parseInt($(wrapper).attr("pf-counter"));
 var prototype=parseInt($(wrapper).attr("pf-prototype"));
// console.log("Prototype: "+prototype);
 var item=pfPrototypes[property][prototype];
 var closebtn="";
 var makeCloseButton=false;
 var disableAddButton=false;
 if ( defined(item.limit) ) {
  if ( item.limit != 0 ) {
   if ( item.limit <= counter ) makeCloseButton=true;
   if ( item.limit >= counter ) disableAddButton=true;
  } else makeCloseButton = true;
 } else makeCloseButton = true;
 if ( defined(item.minimum) ) {
  if ( counter < item.minimum ) makeCloseButton=false;
  else makeCloseButton=true;
 }
 counter++;
 var inner=outer+"-inner-"+counter;
 if ( makeCloseButton ) {
  var close=(item.close?item.close:faicon("fa-close"));
  var closecss=(item.closecss?item.closecss:"form-extendable-close");
  closebtn=div(hrefbtn(close,"packFormExtendClose('"+outer+"',"+counter+","+(item.closefirst?"true":"false")+")",closecss),null,outer+"-closer");
 }
 var html=div(
  (item.closebefore === true ? closebtn : "")
  +(item.title?item.title.replaceAll("###",counter):"")
  +div( PackForm( item.model, inner, true ),
   null,inner,null,null,[
    {name:"pf-prototype",value:prototype},
    {name:"pf-number",value:counter},
    {name:"pf-outer",value:outer}
   ]
  )
  +(item.closebefore === true ? "" : closebtn),
  (item.inner ? item.inner : ""),inner
 );
 $(wrapper).attr("pf-counter",counter);
 $(wrapper).append(html);
 var addbtn=Get(outer+"-addbtn");
 addbtn.parentNode.removeChild(addbtn);
 var add=(item.add?item.add:faicon("fa-plus"));
 var addcss=(item.addcss?item.addcss:"form-extendable-add");
 $(wrapper).append( hrefbtn(add,"packFormExtendAdd('"+prefix+"','"+outer+"')",addcss,outer+"-addbtn") );
 jQueryForm( item.model, inner );
}

function enableByValue( ele ) {
	var item=ele.formitem;
	var n = (item.name?item.name:index);
	var i = ele.id;
	var p = (item.hint?item.hint:"");
	if ( !( item.type === 'radio'
      || item.type === 'select') ) return;
	if ( item.type === 'radio' ) {
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
	  if ( $(Get(domid)).is(':checked') || isChecked(Get(domid)) ) {
	  	value=i;
	  	value_domid=domid;
 	 	for(var j=0;j<domlist.length;j++){
  		 Get('#'+domlist[j]).prop("disabled",true);
  		 Get('#'+domlist[j]).removeAttr("disabled");
	 		}
		 } else {
		 	for ( var j=0; j<domlist.length; j++ ) Get('#'+domlist[j]).setAttribute("disabled",true);
		 }
	 }
	} else if ( item.type === 'select' ) {
	 var value=ele.selectedIndex;
	 var value_domid=value?(i+'-'+value):null;
	 var opt_list=[];
 	 for ( var i=0; i<item.options.length; i++ ) {
		  var domid=i+'-'+num;
		  opt_list[opt_list.length]=domid;
	   var domlist;
	   if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		  else { domlist=[]; domlist[0]=item.options[i].enable; }
	   for (var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		  if ( value == i ) {
		 	for(var j=0;j<domlist.length;j++){
	 		 Get('#'+domlist[j]).prop("disabled",true);
	 		 Get('#'+domlist[j]).removeAttr("disabled");
 			}
		 } else {
    for ( var j=0; j<domlist.length; j++ ) Get('#'+domlist[j]).setAttribute("disabled",true);
		 }
	 }
	}
}

function revealByValue( ele ) {
	var item=ele.formitem;
	var n = (item.name?item.name:index);
	var id = ele.id;
	var p = (item.hint?item.hint:"");
	if ( !( item.type == 'radio' || item.type == 'select' ) ) return;
	if ( item.type == 'radio' ) {
  var value=null;
	 var value_domid=null;
	 var opt_list=[];
	 for ( var i=0; i<item.options.length; i++ ) {
		 var domid=id+'-'+i;
		 opt_list[opt_list.length]=domid;
 	 var domlist;
 	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
 	 for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( $(Get(domid)).is(':checked') || isChecked(Get(domid)) ) {
 			value=i;
 			value_domid=domid;
 			for(var j=0;j<domlist.length;j++) $('#'+domlist[j]+'-wrapper').show();
		 } else {
 			for ( var j=0; j<domlist.length; j++ ) $('#'+domlist[j]+'-wrapper').hide();
		 }
	 }
	} else if ( item.type == 'select' ) {
	 var value=ele.selectedIndex;
	 var value_domid=value?(i+'-'+value):null;
	 var opt_list=[];
 	for ( var i=0; i<item.options.length; i++ ) {
		 var domid=id+'-'+i;
		 opt_list[opt_list.length]=domid;
	  var domlist;
	  if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	  for(var i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( value == i ) {
 			for(var j=0;j<domlist.length;j++) $('#'+domlist[j]+'-wrapper').show();
		 } else {
 			for (var j=0; j<domlist.length; j++) $('#'+domlist[j]+'-wrapper').hide();
		 }
	 }
	}
}

// call to bind functions in jquery after packing the form and spewing it
function jQueryForm( model, prefix="jsapp-model" ) {
 model.forEach(function(item,index){
   item.prefix=prefix;
	  var n = (item.name?item.name:index);
	  var i = prefix+'-'+slugify(n);
	  var v = (item.value?item.value:"");
	  var p = (item.hint?item.hint:"");
   // extendable
   if ( item.type === 'extend' || item.type === 'extendable' ) {
    if ( defined(item.initial) && item.initial > 0 ) {
     var outer=i;
     for ( var x=0; x<item.initial; x++ ) { packFormExtendAdd(prefix,outer); }
    }
   } else {
    var ele=Get(i);
    if ( !ele ) { console.log("Warning: no valid element found by id "+i+" (index: "+index+")"); console.log(item); }
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
         transform: function (all, separator, id) { return separator + '<a href="/users/' + id + '">@' + id + '</a>'; }
        }]
       });
      },
      parseHTML: function (input) {
       return domador(input, {
        transform: function (el) {if (el.tagName === 'A' && el.innerHTML[0] === '@') { return el.innerHTML; } }
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
//    switcher(ele);
    if ( item.enable ) {
     var domlist;
     if ( is_array(item.enable) ) domlist=item.enable;
     else { domlist=[]; domlist[0]=item.enable; }
     var ele=Get(i);
     for(var k=0;k<domlist.length;k++) domlist[k]=prefix+'-'+slugify(domlist[k]);
     ele.domlist=domlist;
     $(ele).toggle(
      function(e){for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).setAttribute("disabled",true);}},
      function(e){for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).prop("disabled",true);$(this.domlist[i]).removeAttr("disabled");}}
     );
     $(ele).click(function(e){
   	  console.log(this);
   	  if ( ($(this).is(":checked") || isChecked(this)) ) {
   	 	for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).setAttribute("disabled",true);} 
   	 	if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); 
   	  } else {
   	 	for(var i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).prop("disabled",true);$(this.domlist[i]).removeAttr("disabled");}
   	 	if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); 
   	  }			 
   	 });		 
     if ( istrue(item.value) ) {
    	 for(var k=0;k<domlist.length;k++){Get(domlist[k]).setAttribute("disabled",true);}
     } else {
   	  for(var k=0;k<domlist.length;k++){Get(domlist[k]).prop("disabled",true);Get('#'+domlist[k]).removeAttr("disabled");}
     }
    }
    if ( item.reveal ) {
     var domlist;
     if ( is_array(item.reveal) ) domlist=item.reveal;
     else { domlist=[]; domlist[0]=item.reveal; }
     console.log(domlist);
     var ele=Get(i);
     for(var k=0;k<domlist.length;k++) domlist[k]=prefix+'-'+slugify(domlist[k]);
     ele.domlist=domlist;
     $(ele).toggle(
     	function(e){console.log("even");for(var m=0;m<this.domlist.length;m++){$(this.domlist[m]).show();} if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); },
      function(e){console.log("odd"); for(var m=0;m<this.domlist.length;m++){$(this.domlist[m]).hide();} if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); }
     );
     $(ele).click(function(e){
   	  if ( ($(this).is(":checked") || isChecked(this)) ) {
   	 	for(var k=0;k<this.domlist.length;k++){$(Get(this.domlist[k]+'-wrapper')).show();} 
   	 	if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); 
   	  } else {
   	 	for(var k=0;k<this.domlist.length;k++){$(Get(this.domlist[k]+'-wrapper')).hide();}
   	 	if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); 
   	  }			 
     });
     if ( istrue(item.value) ) {
   	  for(var k=0;k<domlist.length;k++){$(Get(domlist[k]+'-wrapper')).show();}
     } else {
   	  for(var k=0;k<domlist.length;k++){$(Get(domlist[k]+'-wrapper')).hide();}
     }
    }
   }
   // enable or reveal appear inside the options list
   // enable,reveal expects [] of { value:"triggervalue", elements: "domid" or ["domid","domid"] }
   if ( item.type == 'radio' ) {
    if ( item.enable ) {
     for ( var k=0; k<item.options.length; k++ ) {
      var opt_i = k+'-'+num;
      var opt_ele=Get(opt_i);
      opt_ele.formitem=item;
      $(opt_ele).change( function(e){ enableByValue(this); } );
      if ( $(opt_ele).is(':checked') ) enableByValue(opt_ele);
   	 }
    }
    if ( item.reveal ) {
     for ( var i=0; k<item.options.length; k++ ) {
      var opt_i = k+'-'+num;
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
    if ( item.enable ) for ( var k=0; k<item.options.length; k++ ) $(ele).change( function(e){ enableByValue(this); } );
    if ( item.reveal ) for ( var k=0; k<item.options.length; k++ ) $(ele).change( function(e){ revealByValue(this); } );
    $(ele).trigger('change');
   }
  }
 });
}

function FormErr(item,model,prefix) {
 if ( item.onrequired ) item.onrequired(item,model,prefix);
 return { error: 'form requirement not met', message: (isString(item.required) ? item.required : (n+' cannot be blank.')) };
}

// Get the data out of a packed form
function UnpackForm( model, prefix="jsapp-model" ) {
 var data={};
 console.log("Unpacking: ");
 console.log(model);
 model.forEach(function(item,index){
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = ( item.type == "toggle" ) ? ($('#'+i).is(':checked')?1:0) :
             ( item.type == "markdown" ) ? (item.live.value()) :
			 $("#"+i).val();
  console.log(n+"("+i+")="+v);
	 if ( item.required ) {
		 if ( item.type == "string" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "color" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "date" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "toggle" && isfalse(v) ) return FormErr(item,model,prefix);
		 else if ( (item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" )
          && (item.range && beyond_range(v,item.range.min,item.range.max)) ) return FormErr(item,model,prefix);
	 }
  if ( item.type == "extend" || item.type == "extendable" ) {
   var unpacked=[];
   var outer=prefix+"-extend-"+index;
   var wrapper=Get(outer);
   var inners=$(wrapper).children("div");
   console.log(inners);
   inners.forEach(function(e){
    var pre=$(e).attr("id");
    unpacked[unpacked.length]=UnpackForm(item.model,pre);
   });
   data[n]=unpacked;
  } else
	 if ( !(item.type == 'h1'      || item.type == 'h2'
	    || item.type == 'h3'	      || item.type == 'h4'
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

function SaveButton( where, model, saveFunction, text="Save Changes", prefix="jsapp" ) {
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
function Modelize( injectpoint, prefix="jsapp-model", model, jqueryIt=true ) {
	$(injectpoint).html(PackForm(model,prefix));
	if ( jqueryIt ) jQueryForm(model, prefix);
}

function defaultUnmapForm(data) { return data; }

function Demodelize( model, unmapFunc=defaultUnmapForm, completionFunc, prefix="jsapp-model" ) {
 console.log(model);
	var data=UnpackForm(model,prefix);
	console.log(data);
	if ( data.error ) Warn(data.error.message);
	else app.api.Modify("Program", data.id, 
		unmapFunc(data),
		completionFunc,
		function(e){ Warn("Unable to save changes!"); }
 );
}

// Responsive tests

function ProbeAreaWidth(domid) {
  var probe=document.createElement("div");
	 var outer=Get(domid);
  outer.appendChild(probe);
	 probe.setAttribute("id","ProbeAreaWidth-probe");
	 probe.setAttribute("style","width:100%;");
	 var totalW=probe.clientWidth;
  outer.removeChild(probe);
  return totalW;
}


// HTML helpers

// One or more non-breaking spaces
function nbsp( count=1 ) {
 var s="";
 for ( var i=0; i<count; i++ ) s+="&nbsp;";
 return s;
}

// Fontawesome Icon
function faicon( css=null, tip=null, inner="", id=null, style=null, click=null ) {
 var s='<i';
 if ( tip ) s+= ' alt="'
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="fa '+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 return s+inner+'</i>';
}

// <I> as an icon tag
function icon( css=null, tip=null, inner="", id=null, style=null, click=null ) {
 var s='<i';
 if ( tip ) s+= ' alt="'
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 return s+inner+'</i>';
}

// Href as a button
function hrefbtn( inner="", click=null, css=null, id=null, style=null, other=null ) {
 var s='<a href="#" ';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</a>';
}

// Form input elements (and datalist)
function input( id=null, type="text", placeholder=null, css=null, style=null, value=null, min=null, max=null, datalist=null, disabled=null, other=null ) {
 var s='<input type="'+type+'"';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( placeholder ) s+=' placeholder="'+placeholder+'"';
 if ( disabled ) s+=' disabled=disabled';
 if ( value ) s+=' value="'+value+'"';
 if ( min ) s+=' min="'+min+'"'; else if ( max ) s+=' min="none"';
 if ( max ) s+=' max="'+max+'"'; else if ( min ) s+=' max="none"';
 var after="";
 if ( datalist && is_array(datalist) && datalist.length > 0 ) {
  s+=' list="'+id+'-datalist"';
  after+='<datalist id="'+id+'-datalist">';
  for ( var i=0; i<datalist.length; i++ ) {
   after+='<option value="'+datalist[i]+'">';
  }
  after+='</datalist>';
 }
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 return s+' />'+after; 
}

// A button
function button( inner="", click=null, css=null, id=null, style=null, other=null ) {
 var s='<button';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</button>';
}

// p
function p( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<p';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</p>';
}

// Heading 6
function h6( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h6';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 return s+inner+'</h6>';
}

// Heading 5
function h5( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h5';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h5>';
}

// Heading 4
function h4( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h4';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h4>';
}

// Heading 3
function h3( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h3';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h3>';
}

// Heading 2
function h2( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h2';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h2>';
}

// Heading 1
function h1( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<h1';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h1>';
}

// small tag
function small( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<small';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</small>';
}

// span tag
function span( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<span';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</span>';
}

// div tag
function div( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<div';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</div>';
}


// table, tr, th, td, td_ (multi-span)

function thead( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<thead';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</thead>'; 
}

function tbody( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<tbody';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tbody>'; 
}

function tfoot( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<tfoot';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tfoot>'; 
}

function table( body="", head="", foot="", css=null, id=null, style=null, other=null ) {
 var s='<table';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+=' cellpadding=0 cellspacing=0>';
 return s+(head && head.length>0?thead(head):"")+(body && body.length >0?tbody(body):"")+(foot && foot.length>0?tfoot(foot):"")+'</table>'; 
}

function th( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<th';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</th>'; 
}

function tr( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<tr';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tr>'; 
}

function td( inner="", width=null, css=null, id=null, style=null, click=null, other=null ) {
 var s='<td';
 if ( width ) s+=' width="'+width+'"';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</td>'; 
}

function td_( columns, inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<td colspan='+columns;
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</td>'; 
}

// canvas tag
function canvas( id=null, style=null, css=null, other=null ) {
 var s='<canvas';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+'</canvas>';
}

// ol tag
function ol( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<ol';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</ol>';
}

// ul tag
function ul( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<ul';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</ul>';
}

// li tag
function li( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<li';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</li>';
}

// center tag
function center( inner="", css=null, id=null, style=null, click=null, other=null ) {
 var s='<center';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( var i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</center>';
}
