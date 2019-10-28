
var $_COOKIE = Cookies.get();
function BakeCookie( name, value ) { var date = new Date(); var dateString = date.toUTCString();	Cookies.set(name, value, { expires: dateString }); }
//console.log($_COOKIE);

var $_GET = getparams(window.location.search);
//console.log($_GET);
//console.log(window.location.search);

var api = null;

function ClearSuperGlobals() { $_COOKIE = [];  $_GET = []; }

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
		this.messages = [];
		this.tasks = [];
		this.notifications = [];
		this.user = null;
		this.errorcode = this.GetErrorCodes();
		this.initializing=true;
		api = this;
    }	
	
	Init() {
     setTimeout(function(){ 
	  api.BasicInfo( api.app.RepopulateFromBasicInfo );
	 },500);
	}
	
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
	
	SetSession( token ) { api.session=token; api.sessionHistory.push(Timestamped(token)); }
	SessionValid() { return api.session && ( typeof api.session === "string" || isString(api.session) ); }
		
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
			wasData : post_data,
			dataType: "json",
			beforeSend: function(request){api.ConstructRequestHeaders(request);},
			done: doneFunc,
			success: successFunc,
			error: errorFunc,
			statusCode: { 400: errorFunc }
		});
	}
	
	Successful(e) { return ( e && e.result === "success" ); }
	
	ValidateToken ( t, bake=false ) {
		api.token=t;
		api.Request( { key: t },
			bake
			? function(e) { api.SetSession(api.token); BakeCookie("username",btoa(api.username)); BakeCookie("session",btoa(api.token)); $_COOKIE=Cookies.get(); }
			: function(e) { api.SetSession(api.token); },
			function(e){ api.session=null; },
			function(e) {
				e.responseData = $.parseJSON(e.responseText);
				api.app.NoSessionStateCallback();
				console.log(e.responseData);
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
			 api.password=true;
			 console.log(api);
		 }, 
		 api.EmptyFunction
		);
	}
	
	Logout() {
		console.log("Logging out..");
		var data={ "action" : "logout" }
		api.Request( data,
         function(e) {
			 console.log("Logged out.");
			 if ( api.Successful(e) ) {
				 this.session = null;
				 api.app.ShowLogout();
				 api.app.InactivityTimerReset();
				 this.username = null;
				 this.password = null;
				 Cookies.remove("session");
				 Cookies.remove("username");
			 }
		 },
		 function(e) { api.app.ShowLogout(); },
		 function(e) {
			 if ( api.retries > 0 ) { api.retries--; api.Logout(); } else api.app.ShowLogout(); 
		 }
		);
	}
	
	Recurring() {
	 this.doGetBasicInfo();
	}
	
	List( t, onSuccess ) {
		var data={ action : "list", subject : t };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			}
		 }
		);	
	}
	
	ListEverything( t, onSuccess ) {
		var data={ action : "list", everything:true, subject : t };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			}
		 }
		);	
	}
	
	BasicInfo( onSuccess, onFailure ) {
		var data={ action: "special", type: "basic" };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			} else onFailure(this.wasData, e, this);
		 }, 
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}	
	
	Create( t, input, onSuccess ) {
		var data={ action : "create", subject : t, data: input };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			}
		 }
		);	
	}
	
	Get( t, id, onSuccess, onFailure=api.DefaultError ) {
		var data={ action: "get", subject: t, for: id };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			}
		 },
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}
	
	Remove( t, id, onSuccess, onFailure=api.DefaultError ) {
		var data={ action: "remove", subject: t, id: id };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			} else onFailure(this.wasData, e, this);
		 }, 
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}
	
	Modify( t, id, input, onSuccess, onFailure=api.DefaultError ) {
		var data={ action: "modify", subject: t, for: id, data:input };
        console.log(data);
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			} else onFailure(this.wasData, e, this);
		 }, 
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}
	
	Myself( onSuccess, onFailure=api.DefaultError ) {
		var data={ action: "profile" };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			} else onFailure(this.wasData, e, this);
		 }, 
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}	
	
	Profile( id, onSuccess, onFailure ) {
		var data={ action: "profile", for: id };
		api.Request( data,
		 function(e) {
			if ( api.Successful(e) ) {
				onSuccess(this.wasData, e, this);
			} else onFailure(this.wasData, e, this);
		 }, 
		 function(e) {
			 onFailure(this.wasData, e, this);
		 }
		);	
	}
}
