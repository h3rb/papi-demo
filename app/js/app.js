var APP_VERSION = "0.5 &alpha;";

var app = null;

var idleSince = Date.now();

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


//********8//


class MicertifyApp {

 constructor( api ) {
  this.version = APP_VERSION;
  this.api=api;
  this.api.app=this;
  this.codes = this.GetUICodes();
  this.focused = null;
  this.focusEvent = null;
  this.blurred = null;
  this.blurEvent = null;
  this.states = {
	  sidebar: this.codes.sidebar.dashboard
  };
  this.inactivityLimit = 20; // 20 minutes, seems like > 26 hard to reach
  app=this;
 }
 
 GetUICodes() {
	 return { 
	  topnav: {
		  messages: 1,
		  notifications: 2,
		  tasks: 3,
		  profile: 4,
		  settings: 5
	  },
	  sidebar: {
		  dashboard: 110,
		  tasks: { drafts:1101, resume:1102 },
		  messages: 111,
		  search: 112,
		  browse: 113,
		  certified: 114,
		  results: 115,
		  download: 116,
		  grading: 117,
		  programs: 118,
		  gettingstarted: 119,
		  reference: 120,
		  support: 121
	  },
	  control: {
		  
	  },
	  actions: {
		  profile: 301
	  },
	  modal: {
		  login: 901
	  }
	 };
 }
 
 Event30() {
   app.CheckSessionState();
 }
 
 Init() {
  app.api.Init();
  
  app.InitInactivityTimeout();
  
  // Establish jQuery Behaviors
  
  // Establish login form
  $("#login-button").click(function(e){
	  app.api.username = GetInputValue("login-username");
	  app.api.password = GetInputValue("login-password");
	  $.modal.close();
	  app.api.Login();
  });
  
  // Establish onfocus tracking
  $("input").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("input").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );
  $("select").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("select").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );
  $("textarea").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("textarea").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );

  // Establish event for enter/return key  
  $(window).keyup(function(e) { if ( e.keyCode == 13 ) { event.preventDefault(); app.OnEnter(e); }}  );
 
  // Setup recurring session check
  setInterval(function(e){ app.Event30(); }, 30000);	 
  console.log(app);	 
  app.CheckSessionState();
 }
 
 InitInactivityTimeout() {
	 
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(function(){
     if ( app.api.SessionValid() ) {
		var idleTime = Date.now();
		var minutes = (idleTime - idleSince) / 1000 / 60;
		console.log("idle for "+minutes+" minutes");
		if (minutes > app.inactivityLimit) { app.api.retries = 3; app.api.Logout(); }
	 }
    }, 60000); // 1 minute intervals

    //Zero the idle timer on mouse movement.
    $(window).mousemove(app.InactivityTimerReset);
	$(window).mousedown(app.InactivityTimerReset);
    $(window).keypress(app.InactivityTimerReset);
	$(window).click(app.InactivityTimerReset);
	$(window).scroll(app.InactivityTimerReset);
 }
 InactivityTimerReset() { if ( isPageVisible() ) idleSince = Date.now(); /*console.log("idleTime reset");*/ } 
 
 CheckSessionState() {
  console.log("CheckSessionState");
  app.api.CheckTokenState();
 }

 // Called when not logged in, session invalid / expired or network issue. 
 NoSessionStateCallback() {
  console.log("NoSessionStateCallback entered");
  ClearSuperGlobals();
  // Show login window
  app.ShowLoginModal();
 }
 
 ShowLoginModal() {
  this.Title("Log in");
  console.log("Show login modal.");
  $("#mcapp-login-box").modal({ escapeClose: false, clickClose: false, showClose: false });
  // $.modal.close();
 }
 
 ShowLogout() {
        window.location.reload();
 }
 
 OnEnter() {
	 if ( ( app.focused && app.focused === Get("mcapp-sidebar-search-input") )
       || ( app.blurred && app.blurred === Get("mcapp-sidebar-search-input") ) ) { console.log("Enter pressed: Search"); $("#mcapp-sidebar-search-button").click(); }
 }
 
 Title( c ) {
	 document.title="MiCertify | "+c;
 }
 
 Control( t ) {
 }
 
 Sidebar( c ) {
	 var tags = [
	 ];
	$( "ul[id=mcapp-sidebar-menu] li" ).each(function( index ) {
		$(this).removeClass("active");
	});	 
	 console.log( "Sidebar = "+c );
	 switch ( c ) {
		 case this.codes.sidebar.dashboard:
		  this.Title("Dashboard");
		 break;
		 case this.codes.sidebar.messages:
		  this.Title("Messages");
		  $("#mcapp-sidebar-messages").addClass("active");
		 break;
		 case this.codes.sidebar.search: // Called when enter pressed on search area, or button pressed.
		  this.Title("Search");
		  $("#mcapp-sidebar-search-form").addClass("active");		  
		 break;
		 case this.codes.sidebar.browse:
		  this.Title("Browse");
		  $("#mcapp-sidebar-take-tests").addClass("active");
		 break;
		 case this.codes.sidebar.certified:
		  this.Title("Certifications");
		  $("#mcapp-sidebar-certifications").addClass("active");
		 break;
		 case this.codes.sidebar.results:
		  this.Title("Results");
		  $("#mcapp-sidebar-results").addClass("active");
		 break;
		 case this.codes.sidebar.download:
		  this.Title("Download");
		  $("#mcapp-sidebar-download").addClass("active");
		 break;
		 case this.codes.sidebar.grading:
		  this.Title("Grading");
		  $("#mcapp-sidebar-needs-grading").addClass("active");
		 break;
		 case this.codes.sidebar.programs:
		  this.Title("Programs");
		  $("#mcapp-sidebar-programs").addClass("active");
		 break;
		 case this.codes.sidebar.gettingstarted:
		  this.Title("Getting Started");
		  $("#mcapp-sidebar-section-gettingstarted").addClass("active");
		 break;
		 case this.codes.sidebar.reference:		 break;
		 case this.codes.sidebar.support:		 break;
	 }
 }
 
 // Gets the number of tests, certs, etc, updates task lists, refresh profile data,
 // activities, etc.
 UpdateMetrics() {
 }

};
