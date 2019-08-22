
var $_COOKIE = Cookies.get();
//console.log($_COOKIE);

var $_GET = getparams(window.location.search);
//console.log($_GET);
//console.log(window.location.search);

var api = null;

// Read a page's GET URL variables and return them as an associative array.
function getparams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) { hash = hashes[i].split('='); vars[hash[0]] = hash[1]; }
    return vars;
}
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
function get_protocol() { return location.protocol; }
function is_ssl() { return (get_protocol() === 'https:'); }
function getLocalTime() { var d=new Date(); return d.getMilliseconds(); }
function Timestamped(data) { return { data: data, time: getLocalTime() }; }
function defined(objele) { try { result= (typeof objele !== 'undefined'); } catch(e) { result=false; } return result; }
function isset(obj,elem) { return defined(obj) && obj.hasOwnProperty(elem); }
function isnull(obj) { return (obj !== null); }

class MicertifyAPI {

	constructor() {
		this.username = "";
		this.password = "";
		this.secure = is_ssl();
		this.response = null;
		this.request = null;
		this.error = null;
		this.data = null;
		this.session = null;
		this.api_url = get_protocol() + "//micertify.com/api";
		this.sessionHistory = [];
		this.requestHistory = [];
		this.messageHistory = [];
		api = this;
    }
	
	Init() {
		this.CheckTokenState();
	}
	
	SetSession( token ) { this.session=token; this.sessionHistory.push(Timestamped(token)); }
		
	ConstructRequestHeaders( r ) {
		r.setRequestHeader("X-Papi-Application-Id", "micertify.com");
		if ( this.session !== null ) r.setRequestHeader( "X-Papi-Session-Token", this.session );
		if ( this.admin !== null ) r.setRequestHeader( "X-Papi-Admin-Token", this.admin );
	}
	
	DefaultSuccess(data) { 
	 console.log("REQUEST: success: ");
	 if ( defined(data.message) ) this.messageHistory.push(Timestamped(data));
	 console.log(data);	 
	}

	DefaultDone(e) { 
	 console.log("REQUEST: done:");
	 if ( defined(data.message) ) this.messageHistory.push(Timestamped(data));
	 console.log(e);
	}

	DefaultError(e) { 
//	 alert("Error!");
	 console.log("REQUEST: error!:");
	 if ( defined(data.message) ) this.messageHistory.push(Timestamped(data));
	 console.log(e);
	}
	
	EmptyFunction(e) {
     console.log("No output.");
	}
	
	Request( post_data, successFunc= this.DefaultSuccess, doneFunc= this.DefaultDone, errorFunc = this.DefaultError ) {
		this.requestHistory.push(Timestamped({ data: post_data }));
		$.ajax({
			type: "POST",
			url: this.api_url,
			data: { data: post_data },
			dataType: "json",
			beforeSend: function(request){api.ConstructRequestHeaders(request)},
			done: doneFunc,
			success: successFunc,
			error: errorFunc
		});
	}
	
	Successful(e) { return ( e.result === "success" ); }
	
	ValidateToken ( t ) {
		this.token=t;
		this.Request( { key: t },
			function(e) { api.SetSession(api.token); },
			function(e){ this.session=null; },
			function(e) { /* We've been logged out? */  this.session=null; setTimeout(function(){api.CheckTokenState()},5000); }
		);
	}
	
	CheckTokenState() {
		if ( defined($_COOKIE["session"]) ) { this.username = atob($_COOKIE["username"]); this.password=false; this.ValidateToken( atob($_COOKIE["session"]) ); }
		else if ( defined($_GET["token"]) ) this.ValidateToken( $_GET["token"] );
		else this.session = null;
	}
	
	Login() {
		this.Request( { "login" : { "username" : this.username, "password" : this.password } },
		 function (e) {
		 if ( Successful(e) ) this.SetSession(e.data.key);
		 else alert(e.message);
		 }, 
		 this.EmptyFunction
		);
	}
	
	
	
}
