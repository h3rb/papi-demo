
var $_COOKIE = Cookies.get();
function BakeCookie( name, value ) { var date = new Date(); var dateString = date.toUTCString();	Cookies.set(name, value, { expires: dateString }); }
//console.log($_COOKIE);

var $_GET = getparams(window.location.search);
//console.log($_GET);
//console.log(window.location.search);

var api = null;

function ClearSuperGlobals() { $_COOKIE = [];  $_GET = []; }

// Read a page's GET URL variables and return them as an associative array.
function getparams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) { hash = hashes[i].split('='); vars[hash[0]] = hash[1]; }
    return vars;
}
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
		this.retries = 1; // Consumed when used during initial sync.
		this.app = null;
		this.errorcode = this.GetErrorCodes();
		api = this;
    }	
	
	Init() {}
	
	GetErrorCodes() { 
 	return {
      ERR_SESSION_INVALID:-88,
      ERR_SESSION_EXPIRED:-89,
      ERR_BAD_HEADERS:-69,
      ERR_INVALID_CREDENTIALS:-1,
      ERR_NO_ACTION:-2,
      ERR_BAD_BOOLEAN:-5,
	  ERR_INVALID_VALUE_KEY:-6,
      ERR_CREATE_SET_EMPTY:-7,
      ERR_MODIFY_SET_EMPTY:-8,
      ERR_REQUIRED_VALUE_OMITTED:-9,
      ERR_WRONG_TYPE_FOR_VALUE:-10,
      ERR_MISSING_ID:-11,
      ERR_NOT_OWNER:-12,
      ERR_NO_DATA:-13,
      ERR_UNKNOWN_REQUEST:-14,
      ERR_UNABLE_TO_CREATE:-15,
      ERR_INVALID_PASSWORD:-121,
      ERR_EXPIRED_PASSWORD:-122,
      ERR_NO_SUCH_USER_FOR_EMAIL:-123,
      ERR_USER_INVALID:-124,
      ERR_SUCCESS:1
 	};
	}
	
	SetSession( token ) { this.session=token; this.sessionHistory.push(Timestamped(token)); }
		
	ConstructRequestHeaders( r ) {
		r.setRequestHeader("X-Papi-Application-Id", "micertify.com");
		if ( api.session !== null ) r.setRequestHeader( "X-Papi-Session-Token", api.session );
		if ( api.admin !== null ) r.setRequestHeader( "X-Papi-Admin-Token", api.admin );
	}
	
	DefaultSuccess(data) { 
	 console.log("REQUEST: success: ");
	 if ( defined(data.message) ) api.messageHistory.push(Timestamped(data));
	 console.log(data);	 
	}

	DefaultDone(data) { 
	 console.log("REQUEST: done:");
	 if ( defined(data.message) ) api.messageHistory.push(Timestamped(data));
	 console.log(data);
	}

	DefaultError(data) { 
//	 alert("Error!");
	 console.log("REQUEST: error!:");
	 if ( defined(data.message) ) api.messageHistory.push(Timestamped(data));
	 console.log(data);
	}
	
	EmptyFunction(data) {
     console.log("No output.");
	}
	
	Request( post_data, successFunc= api.DefaultSuccess, doneFunc= api.DefaultDone, errorFunc = api.DefaultError ) {
		api.requestHistory.push(Timestamped({ data: post_data }));
		$.ajax({
			type: "POST",
			url: api.api_url,
			data: { data: post_data },
			dataType: "json",
			beforeSend: function(request){api.ConstructRequestHeaders(request);},
			done: doneFunc,
			success: successFunc,
			error: errorFunc
		});
	}
	
	Successful(e) { return ( e.result === "success" ); }
	
	ValidateToken ( t, bake=false ) {
		api.token=t;
		api.Request( { key: t },
			bake
			? function(e) { api.SetSession(api.token); BakeCookie("username",btoa(api.username)); BakeCookie("session",btoa(api.token)); $_COOKIE=Cookies.get(); }
			: function(e) { api.SetSession(api.token); },
			function(e){ api.session=null; },
			function(e) {
				e.data = $.parseJSON(e.responseText);
				if ( defined(e.data.error) && e.data.error == api.errorcode.ERR_INVALID_CREDENTIALS ) api.app.NoSessionStateCallback();
    			else if ( api.retries > 0 ) {
					api.retries--; /* We've been logged out? */  api.session=null;
					setTimeout(function(){api.CheckTokenState()},5000); 
				}
			}
		);
	}
	
	CheckTokenState() {
		if ( defined($_COOKIE["session"]) ) {
			console.log("CheckTokenState: by cookie"); //+$_COOKIE["session"]);
			api.username = atob($_COOKIE["username"]);
			api.password=false;
			api.ValidateToken( atob($_COOKIE["session"]) );
		} else if ( defined($_GET["token"]) ) {
			console.log("CheckTokenState: by url");
			api.ValidateToken( $_GET["token"] );
		} else if ( defined(api.session) && api.session ) {
			console.log("CheckTokenState: by stored session");
			api.ValidateToken( api.session );
		} else {
			console.log("CheckTokenState: none found, user must login");
			api.session = null;
			api.app.NoSessionStateCallback();
		}
	}
	
	Login() {
		var data={ "login" : { "username" : api.username, "password" : api.password } }
		api.Request( data,
		 function (e) {
		 if ( api.Successful(e) ) api.SetSession(e.data.key);
			 console.log(api);
		 }, 
		 api.EmptyFunction
		);
	}
	
	
	
}
